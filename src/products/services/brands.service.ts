import { Injectable, NotFoundException } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private _brandRepo: Repository<Brand>) { }

  findAll() {
    return this._brandRepo.find();
  }

  async findOne(id: number) {
    const brand = await this._brandRepo.findOne({
      relations: ['products'],
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async create(data: CreateBrandDto) {
    const newBrand = await this._brandRepo.create(data);
    return this._brandRepo.save(newBrand);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    this._brandRepo.merge(brand, changes);
    return this._brandRepo.save(brand);
  }

  remove(id: number) {
    return this._brandRepo.delete(id);
  }
}
