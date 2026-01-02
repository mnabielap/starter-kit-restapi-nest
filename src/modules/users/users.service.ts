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
import { Role } from '../../common/constants/roles.constant';

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
      role: Role.USER,
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // --- 1. Search & Scope ---
    if (pageOptionsDto.search) {
      const q = `%${pageOptionsDto.search}%`;
      const scope = pageOptionsDto.scope || 'all';

      if (scope === 'all') {
        // Search across Name, Email, and ID
        queryBuilder.andWhere(
          '(user.name LIKE :q OR user.email LIKE :q OR CAST(user.id AS TEXT) LIKE :q)',
          { q },
        );
      } else if (scope === 'name') {
        queryBuilder.andWhere('user.name LIKE :q', { q });
      } else if (scope === 'email') {
        queryBuilder.andWhere('user.email LIKE :q', { q });
      } else if (scope === 'id') {
        // Cast UUID to text for partial LIKE search
        queryBuilder.andWhere('CAST(user.id AS TEXT) LIKE :q', { q });
      }
    }

    // --- 2. Filter (Role) ---
    if (pageOptionsDto.role) {
      queryBuilder.andWhere('user.role = :role', { role: pageOptionsDto.role });
    }

    // --- 3. Sorting ---
    if (pageOptionsDto.sortBy) {
      // Format: "field:order" -> "created_at:desc"
      const parts = pageOptionsDto.sortBy.split(':');
      const field = parts[0];
      const order = (parts[1] || 'DESC').toUpperCase() as 'ASC' | 'DESC';
      
      // Map external query params (snake_case) to internal Entity properties (camelCase)
      const fieldMap: Record<string, string> = {
        'created_at': 'createdAt',
        'updated_at': 'updatedAt',
        'id': 'id',
        'name': 'name',
        'email': 'email',
        'role': 'role',
      };

      const sortField = fieldMap[field] ? `user.${fieldMap[field]}` : `user.${field}`;
      queryBuilder.addOrderBy(sortField, order);
    } else {
      queryBuilder.orderBy('user.createdAt', 'DESC');
    }

    // --- 4. Pagination ---
    queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = {
      page: pageOptionsDto.page,
      limit: pageOptionsDto.limit,
      itemCount,
      pageCount: Math.ceil(itemCount / pageOptionsDto.limit),
      hasPreviousPage: pageOptionsDto.page > 1,
      hasNextPage: pageOptionsDto.page < Math.ceil(itemCount / pageOptionsDto.limit),
    };

    return {
      results: entities,
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