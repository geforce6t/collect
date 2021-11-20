//@ts-nocheck
import { IsString, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import 'reflect-metadata'

export class Questions {
  @IsNumber()
  max_characters: number;

  @IsString()
  type: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  required: boolean;
}


class CreateFormDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Questions)
    questions: Questions[];

    @IsBoolean()
    is_open: boolean;

    @IsString()
    title: string;

    @IsString()
    description: string;
}

export default CreateFormDto
