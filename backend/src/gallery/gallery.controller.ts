import { Controller, Get } from '@nestjs/common';
import { GalleryService } from './gallery.service';

@Controller('gallery-images')
export class GalleryController {
  constructor(private readonly gallery: GalleryService) {}

  @Get()
  findAll() {
    return this.gallery.findAll();
  }
}
