import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.userModel.create(dto);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findByChatId(chatId: number): Promise<User> {
    return this.userModel.findOne({ chatId }).exec();
  }

  async findById(userId: number): Promise<User> {
    return this.userModel.findOne({ userId }).exec();
  }

  async exists({
    chatId,
    userId,
  }: {
    chatId: number;
    userId: number;
  }): Promise<boolean> {
    const res = await this.userModel
      .findOne({ $or: [{ chatId }, { userId }] })
      .exec();
    return !!res;
  }
}
