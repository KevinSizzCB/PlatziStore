import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: string;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[]

  @Expose()
  get products() {
    if (this.items) {
      return this.items.filter(item => !!item)
        .map(item => ({
          ...item.product,
          quantity: item.quantity,
          itemId: item.id
        }));
    }
    return [];
  }

  @Expose()
  get total() {
    if (this.items) {
      return this.items.filter(item => !!item)
        .reduce((total, item) => {
          const totalItem = item.product.price * item.quantity;
          return totalItem + total;
        }, 0)
    }
    return 0;
  }
}
