import { User } from '../user';

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User>;
  findBySignupToken: (token: string) => Promise<User>;
  save: (
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) => Promise<boolean>;
}
