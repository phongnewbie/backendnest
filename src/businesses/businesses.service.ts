import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { IBusinessesRepository } from './businesses.repository.interface';
import type { IUsersRepository } from '../auth/users.repository.interface';
import { PrismaService } from '../common/prisma.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CreateBusinessWithUserDto } from './dto/create-business-with-user.dto';
import { PaginationDto, PaginationMeta } from '../common/dto/pagination.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BusinessesService {
  constructor(
    @Inject('IBUSINESSES_REPOSITORY')
    private readonly businessesRepository: IBusinessesRepository,
    @Inject('IUSERS_REPOSITORY')
    private readonly usersRepository: IUsersRepository,
    private readonly prisma: PrismaService, // Keep for transactions
    private readonly mailService: MailService,
  ) {}

  async createWithUser(dto: CreateBusinessWithUserDto) {
    const existingUser = await this.usersRepository.findByPhone(dto.phone);
    if (existingUser) {
      throw new BadRequestException(
        'Số điện thoại đã được đăng ký cho một tài khoản khác',
      );
    }

    // 1. Generate random password
    const rawPassword = this.generatePassword(10);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 2. Create User and Business in a transaction
    const { user, business } = await this.prisma.$transaction(async (tx) => {
      const user = await this.usersRepository.create(
        {
          phone: dto.phone,
          fullName: dto.fullName,
          password: hashedPassword,
          role: UserRole.BUSINESS,
        },
        tx,
      );

      const business = await this.businessesRepository.create(
        {
          name: dto.businessName,
          description: dto.description,
          email: dto.email,
          phone: dto.phone,
          userId: user.id,
        },
        tx,
      );

      return { user, business };
    });

    // 4. Send Email (Async)
    if (dto.email) {
      void this.mailService.sendBusinessLoginInfo(
        dto.email,
        dto.phone,
        rawPassword,
      );
    }

    return {
      business,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
      },
      message:
        'Business and User created successfully. Login info sent to email.',
    };
  }

  private generatePassword(length: number): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, skip } = paginationDto;

    const [totalItems, businesses] = await this.businessesRepository.findAll(
      skip,
      limit,
    );

    const meta: PaginationMeta = {
      itemCount: businesses.length,
      totalItems,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return { data: businesses, meta };
  }

  async findOne(id: string) {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
    requestUserId: string,
    userRole: UserRole,
  ) {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new NotFoundException('Business not found');

    // Ownership check: Only the owner or an ADMIN can update
    if (userRole !== UserRole.ADMIN && business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa thông tin của doanh nghiệp này',
      );
    }

    return this.businessesRepository.update(id, updateBusinessDto);
  }

  async remove(id: string) {
    const business = await this.businessesRepository.findById(id);
    if (!business) throw new NotFoundException('Business not found');

    return this.businessesRepository.delete(id);
  }

  async findByUserId(userId: string) {
    const business = await this.businessesRepository.findByUserId(userId);
    if (!business)
      throw new NotFoundException('Business not found for this user');
    return business;
  }
}
