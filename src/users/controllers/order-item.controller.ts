import { Body, Controller, Post, Put, Param, Delete, ParseIntPipe, Get } from '@nestjs/common';
import { CreateOrderItemDto, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { OrderItemService } from '../services/order-item.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private _itemsService: OrderItemService) { }

  @Post()
  create(@Body() payload: CreateOrderItemDto) {
    return this._itemsService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderItemDto,
  ) {
    return this._itemsService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this._itemsService.remove(id);
  }

  @Get()
  geAll() {
    return this._itemsService.findAll();
  }
}
