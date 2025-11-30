import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import moment from 'moment';

import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { Token, TokenType } from './entities/token.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Hash } from '../../common/utils/hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateAuthTokens(user);
    return { user, tokens };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await Hash.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const tokens = await this.generateAuthTokens(user);
    return { user, tokens };
  }

  async logout(refreshToken: string) {
    const tokenDoc = await this.tokenRepository.findOne({
      where: {
        token: refreshToken,
        type: TokenType.REFRESH,
        blacklisted: false,
      },
    });
    if (!tokenDoc) {
      throw new NotFoundException('Not found');
    }
    await this.tokenRepository.remove(tokenDoc);
  }

  async refreshAuth(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('app.jwt.secret'),
      });
      
      const tokenDoc = await this.tokenRepository.findOne({
        where: {
          token: refreshToken,
          type: TokenType.REFRESH,
          userId: payload.sub,
          blacklisted: false,
        },
      });

      if (!tokenDoc) {
        throw new Error('Token not found');
      }

      const user = await this.usersService.findOne(tokenDoc.userId);
      await this.tokenRepository.remove(tokenDoc);
      return this.generateAuthTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Please authenticate');
    }
  }

  async generateAuthTokens(user: User) {
    const accessTokenExpires = moment().add(
      this.configService.get('app.jwt.accessExpirationMinutes'),
      'minutes',
    );
    
    const accessToken = this.jwtService.sign(
      { sub: user.id, role: user.role, type: 'access' },
      { expiresIn: `${this.configService.get('app.jwt.accessExpirationMinutes')}m` },
    );

    const refreshTokenExpires = moment().add(
      this.configService.get('app.jwt.refreshExpirationDays'),
      'days',
    );
    
    const refreshToken = this.jwtService.sign(
      { sub: user.id, role: user.role, type: 'refresh' },
      { expiresIn: `${this.configService.get('app.jwt.refreshExpirationDays')}d` },
    );

    await this.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires.toDate(),
      TokenType.REFRESH,
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  async saveToken(
    token: string,
    userId: string,
    expires: Date,
    type: TokenType,
    blacklisted = false,
  ) {
    const tokenDoc = this.tokenRepository.create({
      token,
      userId,
      expires,
      type,
      blacklisted,
    });
    return this.tokenRepository.save(tokenDoc);
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('No user found with this email');
    }
    
    const expires = moment().add(
      this.configService.get('app.jwt.resetPasswordExpirationMinutes'),
      'minutes',
    );
    
    const resetToken = this.jwtService.sign(
      { sub: user.id, type: TokenType.RESET_PASSWORD },
      { expiresIn: `${this.configService.get('app.jwt.resetPasswordExpirationMinutes')}m` },
    );

    await this.saveToken(resetToken, user.id, expires.toDate(), TokenType.RESET_PASSWORD);
    await this.mailService.sendResetPasswordEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      const tokenDoc = await this.tokenRepository.findOne({
        where: {
          token,
          type: TokenType.RESET_PASSWORD,
          userId: payload.sub,
          blacklisted: false,
        },
      });

      if (!tokenDoc) {
        throw new Error('Token invalid');
      }

      await this.usersService.update(tokenDoc.userId, { password: newPassword });
      await this.tokenRepository.delete({ userId: tokenDoc.userId, type: TokenType.RESET_PASSWORD });
    } catch (error) {
      throw new UnauthorizedException('Password reset failed');
    }
  }

  async sendVerificationEmail(user: User) {
    const expires = moment().add(
        this.configService.get('app.jwt.verifyEmailExpirationMinutes'),
        'minutes',
      );
    
    const verifyToken = this.jwtService.sign(
        { sub: user.id, type: TokenType.VERIFY_EMAIL },
        { expiresIn: `${this.configService.get('app.jwt.verifyEmailExpirationMinutes')}m` },
    );

    await this.saveToken(verifyToken, user.id, expires.toDate(), TokenType.VERIFY_EMAIL);
    await this.mailService.sendVerificationEmail(user.email, verifyToken);
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      
      const tokenDoc = await this.tokenRepository.findOne({
        where: {
          token,
          type: TokenType.VERIFY_EMAIL,
          userId: payload.sub,
          blacklisted: false,
        },
      });

      if (!tokenDoc) {
        throw new Error('Token invalid');
      }

      await this.usersService.update(tokenDoc.userId, { isEmailVerified: true } as any);
      await this.tokenRepository.delete({ userId: tokenDoc.userId, type: TokenType.VERIFY_EMAIL });
    } catch (error) {
      throw new UnauthorizedException('Email verification failed');
    }
  }
}