import { Injectable } from '@nestjs/common';

/**
 * Service that provides application-wide functionalities.
 */
@Injectable()
export class AppService {
  /**
   * Returns a greeting message.
   *
   * @returns {string} A greeting message.
   */
  getHello(): string {
    return 'API is up and running 🔥!';
  }
}
