import { INestApplication, Module } from '@nestjs/common';
import { AdminOptions } from './admin.interface';

@Module({})
export class AdminBroModule {
  public static async setup(
    app: INestApplication,
    options: AdminOptions,
  ) {
    await options.adapter.setup({ app, options });
  }
}
