import { Controller, Get }  from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('counts') // GET /api/counts
  async getCounts() {
    return await this.appService.getCounts();
  }
}

