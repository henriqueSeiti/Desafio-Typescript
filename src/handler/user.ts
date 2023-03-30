import { Request, Response } from "express";
import { IResponseUser, IUser } from "../interfaces/interfaces";
import User from "../models/user"
import UserRepository from "../repositories/userRepository";

export default class UserHandler {
    private repository : UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    // public async post(req: Request, res: Response) {
    //     const { name, email, password } : IUser = req.body;
        
    //     const user = new User({ name, email, password})

        
    // }

    public async get(req: Request, res: Response) {
        const users: IResponseUser<Array<User[]>> =
            await this.repository.getUsers();

        if (users.status !== 200)
            return res.status(users.status).json({ errors: users.errors });

        res.status(200).json(users.data);
    }
}