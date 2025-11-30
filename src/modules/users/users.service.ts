import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from '../../common/dtos/page-options.dto';
import { Hash } from '../../common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already taken');
    }

    const hashedPassword = await Hash.make(createUserDto.password);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    if (pageOptionsDto.q) {
      queryBuilder.where('user.name LIKE :q OR user.email LIKE :q', {
        q: `%${pageOptionsDto.q}%`,
      });
    }

    queryBuilder
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = {
      page: pageOptionsDto.page,
      take: pageOptionsDto.take,
      itemCount,
      pageCount: Math.ceil(itemCount / pageOptionsDto.take),
      hasPreviousPage: pageOptionsDto.page > 1,
      hasNextPage: pageOptionsDto.page < Math.ceil(itemCount / pageOptionsDto.take),
    };

    return {
      data: entities,
      meta: pageMetaDto,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already taken');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await Hash.make(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}