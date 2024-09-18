import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Service that extends the PrismaClient and implements the OnModuleInit and OnModuleDestroy interfaces.
 * This service handles the initialization and destruction lifecycle hooks to manage the database connection.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Lifecycle hook that is called when the module has been initialized.
   * This method establishes a connection to the database.
   *
   * @returns {Promise<void>} A promise that resolves when the connection is established.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * This method is called when the module is being destroyed.
   * It ensures that the Prisma client disconnects properly.
   *
   * @returns {Promise<void>} A promise that resolves when the disconnection is complete.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
