import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { mockDb, UserRole } from '../common/mock-data';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { CreateBusinessWithUserDto } from './dto/create-business-with-user.dto';
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

  findAll() {
    return mockDb.businesses.map((b) => ({
      ...b,
      brands: mockDb.brands.filter((br) => br.businessId === b.id),
    }));
  }

  findOne(id: string) {
    const business = mockDb.businesses.find((b) => b.id === id);
    if (!business) throw new NotFoundException('Business not found');
    return {
      ...business,
      brands: mockDb.brands.filter((br) => br.businessId === business.id),
    };
  }

  update(id: string, updateBusinessDto: UpdateBusinessDto) {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Business not found');

    mockDb.businesses[index] = {
      ...mockDb.businesses[index],
      ...updateBusinessDto,
      updatedAt: new Date(),
    };
    return mockDb.businesses[index];
  }

  remove(id: string) {
    const index = mockDb.businesses.findIndex((b) => b.id === id);
    if (index === -1) throw new NotFoundException('Business not found');

    const deleted = mockDb.businesses.splice(index, 1);
    return deleted[0];
  }
}
