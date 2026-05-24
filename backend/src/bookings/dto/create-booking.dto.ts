import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @Length(2, 100, { message: 'Имя должно быть от 2 до 100 символов' })
  customerName: string;

  // Russian phone: accepts +7 (999) 000-00-00, +79990000000, 89990000000 etc.
  // We don't lock to a single format — UI sends with mask, but admin can also
  // edit via PATCH. At minimum 10 digits anywhere in the string.
  @IsString()
  @Matches(/(?:\D*\d){10,}/, {
    message: 'Телефон должен содержать не менее 10 цифр',
  })
  phone: string;

  @IsDateString({}, { message: 'startDate должна быть ISO-датой' })
  startDate: string;

  @IsDateString({}, { message: 'endDate должна быть ISO-датой' })
  endDate: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Минимум 1 взрослый' })
  @Max(20, { message: 'Слишком много взрослых' })
  adults?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  children?: number;

  // Опциональная доп.услуга — заказ бани к заезду. UI на /booking выводит её
  // как чекбокс; пересылка на бэк нужна, чтобы админ видел заказ в TG.
  @IsOptional()
  @IsBoolean()
  hasSauna?: boolean;
}
