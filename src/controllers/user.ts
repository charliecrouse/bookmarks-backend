import * as c from '@utils/crypto';
import * as e from '@utils/error';
import { User } from '@models/user';
import { userCreationSchema } from '@validators/user';

export const createUser = async (props: UserCreationProps): Promise<User> => {
  const { error } = userCreationSchema.validate(props);

  if (error) {
    const message = `Failed to create User, ${error.message}`;
    return Promise.reject(new e.ValidationError(message));
  }

  const existing = await User.findByPk(props.email, { raw: true });

  if (existing) {
    const message = `User with email, "${props.email}", already exists`;
    return Promise.reject(new e.ClientError(message));
  }

  const encrypted = await c.encrypt(props.password);
  const payload = Object.assign({}, props, { password: encrypted });

  return new User(payload).save();
};

export const findUserByEmail = async (email: string): Promise<User> => {
  const user = await User.findByPk(email, { raw: true });

  if (!user) {
    const message = `Failed to find User with email, \"${email}\"`;
    return Promise.reject(new e.ClientError(message, 401));
  }

  return user;
};

export const findUserByCredentials = async (email: string, password: string): Promise<User> => {
  const user = await findUserByEmail(email);

  const hasValidCredentials = await c.verify(password, user.password);
  if (!hasValidCredentials) {
    const message = `Password is incorrect for the given User email, "${email}"`;
    return Promise.reject(new e.ClientError(message));
  }

  return user;
};
