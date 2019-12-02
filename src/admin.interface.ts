import AdminBroOptions from 'admin-bro/types/src/admin-bro-options.interface';
import mongoose from 'mongoose';
import { Adapter } from './adapters/adapter.interface';

export interface AdminOptions extends AdminBroOptions {
  email: string,
  password: string
  connector: typeof mongoose,
  adapter: Adapter
}
