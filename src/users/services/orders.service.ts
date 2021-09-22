import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { Customer } from '../entities/customer.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private _orderRepo: Repository<Order>,
    @InjectRepository(Customer) private _customerRepo: Repository<Customer>,
  ) { }

  findAll() {
    return this._orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this._orderRepo.findOne({
      relations: ['items', 'items.product'],
      where: { id }
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(data: CreateOrderDto) {
    const newOrder = new Order();
    if (data.customerId) {
      const customer = await this._customerRepo.findOne(data.customerId);
      newOrder.customer = customer;
    }
    return this._orderRepo.save(newOrder);
  }

  async update(id: number, changes: UpdateOrderDto) {
    const order = await this._orderRepo.findOne(id);
    if (changes.customerId) {
      const customer = await this._customerRepo.findOne(changes.customerId);
      order.customer = customer;
    }
    return this._orderRepo.save(order);
  }

  remove(id: number) {
    return this._orderRepo.delete(id);
  }
}
