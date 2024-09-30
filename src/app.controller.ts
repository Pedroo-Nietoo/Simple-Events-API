import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

/**
 * Controller for handling user-related operations.
 *
 * @class
 */
@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Retrieves a greeting message.
   *
   * @returns {string} A greeting message.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
