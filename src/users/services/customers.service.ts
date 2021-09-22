import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private _customerRepo: Repository<Customer>,
  ) { }

  findAll() {
    return this._customerRepo.find();
  }

  async findOne(id: number) {
    const customer = await this._customerRepo.findOne(id);
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async create(data: CreateCustomerDto) {
    const newCustomer = await this._customerRepo.create(data);
    return this._customerRepo.save(newCustomer);
  }

  async update(id: number, changes: UpdateCustomerDto) {
    const customer = await this.findOne(id);
    this._customerRepo.merge(customer, changes);
    return this._customerRepo.save(customer);
  }

  async remove(id: number) {
    return this._customerRepo.delete(id);
  }
}
