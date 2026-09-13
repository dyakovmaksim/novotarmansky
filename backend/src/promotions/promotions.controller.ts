import { Controller, Get } from '@nestjs/common';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // Public, read-only endpoint used by the promotions page.
  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }
}
