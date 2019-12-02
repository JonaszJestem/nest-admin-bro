import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const getAdminModel = function(connector, connection) {
  const AdminSchema = new connector.Schema({
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: String,
  });

  return connection.models.Admin || connection.model('Admin', AdminSchema);
};

async function createAdminIfNone({ email, password, Admin }) {
  if (!await Admin.findOne({ email })) {
    await new Admin({ email, password: await bcrypt.hash(password, 10) }).save();
  }
}

export const getAdminAuthenticationConfig = async (options, connection) => {
  const Admin = getAdminModel(options.connector, connection);
  await createAdminIfNone({ ...options, Admin });

  const cookiePassword = crypto.randomBytes(20).toString('hex');
  return {
    authenticate: async (email, password) => {
      const admin = await Admin.findOne({ email });
      const passwordMatch = admin && await bcrypt.compare(password, admin.password);
      return passwordMatch && admin;
    },
    cookiePassword: cookiePassword,
  };
};
