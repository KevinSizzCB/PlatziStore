import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, FindConditions, Repository } from 'typeorm';

import { Product } from './../entities/product.entity';
import {
  CreateProductDto,
  FilterProductsDto,
  UpdateProductDto,
} from './../dtos/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private _productRepo: Repository<Product>,
    @InjectRepository(Brand) private _brandRepo: Repository<Brand>,
    @InjectRepository(Category) private _categoryRepo: Repository<Category>,
  ) { }

  findAll(params?: FilterProductsDto) {
    if (params) {
      const { limit, offset, maxPrice, minPrice } = params;
      const where: FindConditions<Product> = {};
      if (minPrice && maxPrice) {
        where.price = Between(minPrice, maxPrice);
      }
      return this._productRepo.find({
        relations: ['brand'],
        take: limit,
        skip: offset,
        where,
      });
    }
    return this._productRepo.find({
      relations: ['brand'],
    });
  }

  async findOne(id: number) {
    const product = await this._productRepo.findOne({
      relations: ['brand', 'categories'],
      where: { id },
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    // const newProduct = new Product()
    // newProduct.name = data.name;
    // newProduct.description = data.description;
    // newProduct.price = data.price;
    // newProduct.image = data.image;
    // newProduct.stock= data.stock;
    const newProduct = await this._productRepo.create(data);
    if (data.brandId) {
      const brand = await this._brandRepo.findOne(data.brandId);
      newProduct.brand = brand;
    }
    if (data.categoriesIds) {
      const categories = await this._categoryRepo.findByIds(data.categoriesIds);
      newProduct.categories = categories;
    }
    return this._productRepo.save(newProduct);
  }

  async update(id: number, changes: UpdateProductDto) {
    const product = await this._productRepo.findOne(id);
    if (changes.brandId) {
      const brand = await this._brandRepo.findOne(changes.brandId);
      product.brand = brand;
    }
    if (changes.categoriesIds) {
      const categories = await this._categoryRepo.findByIds(
        changes.categoriesIds,
      );
      product.categories = categories;
    }
    this._productRepo.merge(product, changes);
    return this._productRepo.save(product);
  }

  async removeCategory(id: number, categoryId: number) {
    const product = await this._productRepo.findOne({
      relations: ['categories'],
      where: { id },
    });
    product.categories = product.categories.filter(
      (category) => category.id !== categoryId,
    );
    return this._productRepo.save(product);
  }

  async addCategory(id: number, categoryId: number) {
    const product = await this._productRepo.findOne({
      relations: ['categories'],
      where: { id },
    });
    const category = await this._categoryRepo.findOne(categoryId);
    product.categories.push(category);
    return this._productRepo.save(product);
  }

  async remove(id: number) {
    const existProduct = await this.findOne(id);
    if (!existProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return this._productRepo.delete(id);
  }
}
