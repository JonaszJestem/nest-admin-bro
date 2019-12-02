import AdminBroMongoose from 'admin-bro-mongoose';
import AdminBro from 'admin-bro';
import { getRouterFor } from './mongoose.router';
import { AdminOptions } from '../../admin.interface';
import { INestApplication } from '@nestjs/common';

export class MongooseAdapter {
  public static async setup({ app, options }: { app: INestApplication, options: AdminOptions }) {
    AdminBro.registerAdapter(AdminBroMongoose);

    const expressApp = app.getHttpAdapter().getInstance();
    const [connection] = options.connector.connections.filter(connection => connection.readyState === 1);
    if (!connection) {
      throw new Error('Mongoose connection is not configured');
    }
    const resources = Object.values(connection.models);
    const adminBro = new AdminBro({ resources, ...options });
    const router = await getRouterFor(adminBro, options, connection);
    expressApp.use(adminBro.options.rootPath, router);
  }
}
