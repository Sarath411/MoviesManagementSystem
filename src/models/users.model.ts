import mongoose, { Document } from 'mongoose';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface IUser extends Document {
  name: string;
  mobile: string;
  role: UserRole;
  email: string;
  password: string; // Store hashed passwords only
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  role: { type: String, enum: UserRole, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
