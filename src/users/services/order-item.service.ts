import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private _orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Order) private _orderRepo: Repository<Order>,
    @InjectRepository(Product) private _productRepo: Repository<Product>,
  ) { }

  findAll() {
    return this._orderItemRepo.find();
  }

  async create(data: CreateOrderItemDto) {
    const order = await this._orderRepo.findOne(data.orderId);
    const product = await this._productRepo.findOne(data.productId);
    const item = new OrderItem();
    item.order = order;
    item.product = product;
    item.quantity = data.quantity;
    return this._orderItemRepo.save(item);
  }

  async update(id: number, changes: UpdateOrderItemDto) {
    const item = await this._orderItemRepo.findOne(id);
    if (changes.orderId) {
      const order = await this._orderRepo.findOne(changes.orderId);
      item.order = order;
    }
    if (changes.productId) {
      const product = await this._productRepo.findOne(changes.productId);
      item.product = product;
    }
    this._orderItemRepo.merge(item, changes);
    return this._orderItemRepo.save(item);
  }

  remove(id: number) {
    return this._orderItemRepo.delete(id);
  }


}
