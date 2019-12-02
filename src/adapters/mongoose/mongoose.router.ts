import AdminBroExpress from 'admin-bro-expressjs';
import session from 'express-session';
import connectMongo from 'connect-mongo';

import { getAdminAuthenticationConfig } from './mongoose.authentication';
import { Environment } from '../../utils/environments';

const EXPIRED_SESSIONS_REMOVE_INTERVAL = 24 * 60; // 1 day

export const getRouterFor = async (adminBro, options, connection) => {
  if (process.env.NODE_ENV === Environment.DEVELOPMENT || !options.email || !options.password) {
    return AdminBroExpress.buildRouter(adminBro);
  }

  const MongoStoreFactory = connectMongo(session);
  const adminAuthenticationConfig = await getAdminAuthenticationConfig(options, connection);
  return AdminBroExpress.buildAuthenticatedRouter(adminBro, adminAuthenticationConfig, null, {
    httpOnly: false,
    resave: true,
    saveUninitialized: true,
    store: new MongoStoreFactory({
      mongooseConnection: connection,
      autoRemove: 'interval',
      autoRemoveInterval: EXPIRED_SESSIONS_REMOVE_INTERVAL,
    }),
  });
};
