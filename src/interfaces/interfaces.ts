import { UUID } from "crypto";
import v4 from 'uuid';

export interface IUser {
    id: UUID;
    name: string;
    email: string;
    password: string;
}

export interface IResponseUser<T> {
    status: number;
    data?: T;
    errors?: T;
}

export interface ISquad {
    id: UUID;
    name: string;
    leader: string;
}

export interface IResponseSquad<T> {
    status: number;
    data?: T;
    errors?: T;
}
