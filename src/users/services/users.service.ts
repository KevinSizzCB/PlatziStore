import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { ProductsService } from 'src/products/services/products.service';
import { CustomersService } from './customers.service';

@Injectable()
export class UsersService {
  constructor(
    private _productService: ProductsService,
    @InjectRepository(User) private _userRepo: Repository<User>,
    private _customerService: CustomersService,
  ) { }

  findAll() {
    return this._userRepo.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this._userRepo.findOne(id);
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this._userRepo.findOne({ where: { email } });
  }

  async create(data: CreateUserDto) {
    const newUser = await this._userRepo.create(data);
    const hashPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashPassword;
    if (data.customerId) {
      const customer = await this._customerService.findOne(data.customerId);
      newUser.customer = customer;
    }
    return this._userRepo.save(newUser);
  }

  async update(id: number, changes: UpdateUserDto) {
    const user = await this.findOne(id);
    this._userRepo.merge(user, changes);
    return this._userRepo.save(user);
  }

  remove(id: number) {
    return this._userRepo.delete(id);
  }

  async getOrdersByUser(id: number) {
    const user = this.findOne(id);

    return {
      date: new Date(),
      products: await this._productService.findAll(),
      user,
    };
  }
}
