import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controller for handling user-related operations.
 *
 * @class
 */
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
