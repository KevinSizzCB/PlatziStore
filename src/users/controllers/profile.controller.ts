import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/models/roles.model';
import { OrdersService } from '../services/orders.service';
import { PayloadToken } from 'src/auth/models/token.model';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private _orderService: OrdersService) { }

  @Roles(Role.CUSTOMER)
  @Get('my-orders')
  getOrders(@Req() req: Request) {
    const user = req.user as PayloadToken;
    return this._orderService.ordersByCustomer(user.sub);
  }
}
