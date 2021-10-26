import {
  IsString,
  IsUrl,
  IsNotEmpty,
  Matches,
  IsNumber,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/swagger';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @Matches(/^[1-9](0)\\1+$/, {
    message: 'Identificación inválida, no puede culminar únicamente con 0',
  })
  @Matches(/g3/, {
    message: 'Identificación inválida, no puede comenzar por el número 3',
  })
  readonly test: string;
}

export class UpdateBrandDto extends OmitType(CreateBrandDto, ['name']) { }
