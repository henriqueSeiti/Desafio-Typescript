import { UUID } from "crypto";
import { Request, Response } from "express";
import { IResponse, IUser } from "../interfaces/interfaces";
import SquadRepository from "../repositories/squadRepository";
import UserRepository from "../repositories/userRepository";

export default class UserHandler {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async post(req: Request, res: Response): Promise<void> {
    const user: IUser = req.body;

    if (!user || !user.username || !user.email || !user.password) {
      res.status(400).json({ error: "Dados incompletos" });
      return;
    }

    const response: IResponse<IUser> = await this.repository.createUser(user);

    if (response.status === 201) {
      res.status(201).json(response.data);
    } else {
      res.status(response.status).json({ error: response.errors });
    }
  }

  public async getAll(req: Request, res: Response) {
    const users: IResponse<Array<IUser[]>> =
      await this.repository.getAllUsers();

    if (users.status !== 200)
      return res.status(users.status).json({ errors: users.errors });

    res.status(200).json(users.data);
  }

  public async getById(req: Request, res: Response) {
    const userId = req.params.user_id;

    const user: IResponse<IUser> = await this.repository.getUserById(userId);
    if (user.status !== 200)
      return res.status(user.status).json({ errors: user.errors });

    res.status(200).json(user.data);
  }

  public async addMemberToTeam(req: Request, res: Response) {
    const userId = req.params.user_id;
    const teamId = req.params.team_id;

    const user = await this.repository.getUserById(userId);
    if (user.status !== 200)
      return res.status(user.status).json({ errors: user.errors });

    const squadRepository = new SquadRepository();
    const team = await squadRepository.getSquadById(teamId);
    if (team.status !== 200)
      return res.status(team.status).json({ errors: team.errors });

    const result = await this.repository.updateUserSquad(userId, teamId);
    if (result.status !== 200)
      return res.status(result.status).json({ errors: result.errors });

    res.status(200).json(result.data);
  }
}
