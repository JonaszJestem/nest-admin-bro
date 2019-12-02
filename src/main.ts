import { NestFactory } from '@nestjs/core';
import { AdminBroModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminBroModule);
  await app.listen(3001);
}

bootstrap();
