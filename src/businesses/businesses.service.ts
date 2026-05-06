import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { mockDb, UserRole } from '../common/mock-data';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CreateBusinessWithUserDto } from './dto/create-business-with-user.dto';
import { PaginationDto, PaginationMeta } from '../common/dto/pagination.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BusinessesService {
  constructor(private readonly mailService: MailService) {}

  async createWithUser(dto: CreateBusinessWithUserDto) {
    const existingUser = mockDb.users.find((u) => u.phone === dto.phone);
    if (existingUser) {
      throw new BadRequestException(
        'Số điện thoại đã được đăng ký cho một tài khoản khác',
      );
    }

    // 1. Generate random password
    const rawPassword = this.generatePassword(10);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 2. Create User
    const userId = mockDb.generateId();
    const newUser = {
      id: userId,
      phone: dto.phone,
      fullName: dto.fullName,
      password: hashedPassword,
      role: UserRole.BUSINESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.users.push(newUser);

    // 3. Create Business
    const business = {
      id: mockDb.generateId(),
      name: dto.businessName,
      description: dto.description,
      email: dto.email,
      phone: dto.phone,
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDb.businesses.push(business);

    // 4. Send Email (Async)
    void this.mailService.sendBusinessLoginInfo(
      dto.email,
      dto.phone,
      rawPassword,
    );

    return {
      business,
      user: {
        id: newUser.id,
        phone: newUser.phone,
        fullName: newUser.fullName,
        role: newUser.role,
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

    const totalItems = mockDb.businesses.length;
    const businesses = mockDb.businesses.slice(skip, skip + limit);

    const data = businesses.map((b) => ({
      ...b,
      brands: mockDb.brands.filter((br) => br.businessId === b.id),
    }));

    const meta: PaginationMeta = {
      itemCount: data.length,
      totalItems,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    };

    return { data, meta };
  }

  async findOne(id: string) {
    const business = mockDb.businesses.find((b) => b.id === id);
    if (!business) throw new NotFoundException('Business not found');
    return {
      ...business,
      brands: mockDb.brands.filter((br) => br.businessId === business.id),
    };
  }

  async update(
    id: string,
    updateBusinessDto: UpdateBusinessDto,
    requestUserId: string,
    userRole: UserRole,
  ) {
    const business = mockDb.businesses.find((b) => b.id === id);
    if (!business) throw new NotFoundException('Business not found');

    // Ownership check: Only the owner or an ADMIN can update
    if (userRole !== UserRole.ADMIN && business.userId !== requestUserId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa thông tin của doanh nghiệp này',
      );
    }

    const index = mockDb.businesses.findIndex((b) => b.id === id);
    mockDb.businesses[index] = {
      ...mockDb.businesses[index],
      ...updateBusinessDto,
      updatedAt: new Date(),
    };
    return mockDb.businesses[index];
  }

  async remove(id: string) {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Business not found');

    const deleted = mockDb.businesses.splice(index, 1);
    return deleted[0];
  }

  async findByUserId(userId: string) {
    const business = mockDb.businesses.find((b) => b.userId === userId);
    if (!business)
      throw new NotFoundException('Business not found for this user');
    return {
      ...business,
      brands: mockDb.brands.filter((br) => br.businessId === business.id),
    };
  }
}
