import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import {
  ApiOkResponse,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';

/**
 * HealthController handles the health check endpoint for the application.
 *
 * @class
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Checks the health status of the application.
   *
   * @returns {any} The health status as determined by the health service.
   */
  @ApiOkResponse({
    description: 'Health check passed',
    status: 200,
  })
  @ApiServiceUnavailableResponse({
    description: 'Some crucial service is unavailable',
    status: 503,
  })
  @Get()
  checkHealth() {
    return this.healthService.checkHealth();
  }
}
