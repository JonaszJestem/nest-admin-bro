export interface Adapter {
  setup({ app: INestApplication, options: AdminOptions })
}
