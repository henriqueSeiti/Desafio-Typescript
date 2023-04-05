import { UUID } from "crypto";

export interface IUser {
  id?: UUID;
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  squad?: UUID;
  is_admin?: boolean;
  is_leader?: boolean;
}

export interface ISquad {
  id?: UUID;
  name: string;
  leader?: UUID;
}

export interface IResponse<T> {
  status: number;
  data?: T;
  errors?: T;
}
