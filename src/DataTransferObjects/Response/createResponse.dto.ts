//@ts-nocheck
import { IsString, IsArray, ValidateNested, IsDateString, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import 'reflect-metadata'

export class Answers {
  @IsString()
  question_id: string;

  @IsString()
  value: string;

}

class CreateResponseDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Answers)
    answers: Answers[];

    @IsArray()
    plugins: string[];

    @IsString()
    form_id: string;

    @IsString()
    time_spent: string;

    @IsDateString()
    submit_date: string;

    @IsNumber()
    auditor_phone_number: number
}

export default CreateResponseDto
