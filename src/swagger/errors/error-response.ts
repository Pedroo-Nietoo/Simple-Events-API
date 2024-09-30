/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents the structure of a Swagger response for a exception.
 */
export class SwaggerErrorResponse {
  /**
   * The message indicating that the requested resource was not found.
   * @type {string}
   */
  @ApiProperty()
  message: string;

  /**
   * The HTTP status code indicating the exception.
   * @type {number}
   */
  @ApiProperty()
  statusCode: number;
}
