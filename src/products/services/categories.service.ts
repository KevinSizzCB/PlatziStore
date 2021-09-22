import { Injectable, NotFoundException } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private _categoryRepository: Repository<Category>,
  ) { }

  findAll() {
    return this._categoryRepository.find();
  }

  async findOne(id: number) {
    const category = this._categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newCategory = this._categoryRepository.create(data);
    return this._categoryRepository.save(newCategory);
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const category = await this.findOne(id);
    this._categoryRepository.merge(category, changes);
    return this._categoryRepository.save(category);
  }

  async remove(id: number) {
    return this._categoryRepository.delete(id);
  }
}
