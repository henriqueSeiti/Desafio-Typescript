import { Request, Response } from "express";
import { IResponseSquad, ISquad } from "../interfaces/interfaces";
import Squad from "../models/squad"
import SquadRepository from "../repositories/squadRepository";


export default class SquadHandler {
    private repository : SquadRepository;

    constructor() {
        this.repository = new SquadRepository();
    }

    // public async post(req: Request, res: Response) {
    //     const { name, email, password } : IUser = req.body;
        
    //     const user = new User({ name, email, password})

        
    // }

    public async get(req: Request, res: Response) {
        const squads: IResponseSquad<Array<Squad[]>> =
            await this.repository.getAllSquads();

        if (squads.status !== 200)
            return res.status(squads.status).json({ errors: squads.errors });

        res.status(200).json(squads.data);
    }
}