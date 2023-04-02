import { Request, Response } from "express";
import { IResponse, ISquad } from "../interfaces/interfaces";
import SquadRepository from "../repositories/squadRepository";
import UserRepository from "../repositories/userRepository";

export default class SquadHandler {
  private repository: SquadRepository;

  constructor() {
    this.repository = new SquadRepository();
  }

  public async post(req: Request, res: Response) {
    const squad: ISquad = req.body;

    if (!squad || !squad.name || !squad.leader) {
      res.status(400).json({ error: "Dados incompletos" });
      return;
    }

    const userRepository = new UserRepository();
    const leader = await userRepository.getUserById(squad.leader);
    if (leader.status !== 200 || !leader?.data?.is_admin)
      return res.status(400).json({ error: "Usuário não é um administrador" });

    const response: IResponse<ISquad> = await this.repository.createSquad(
      squad
    );

    if (response.status === 201) {
      res.status(201).json(response.data);
    } else {
      res.status(response.status).json({ error: response.errors });
    }
  }

  public async getAll(req: Request, res: Response) {
    const squads: IResponse<Array<ISquad[]>> =
      await this.repository.getAllSquads();

    if (squads.status !== 200)
      return res.status(squads.status).json({ errors: squads.errors });

    res.status(200).json(squads.data);
  }

  public async getById(req: Request, res: Response) {
    const squadId = req.params.team_id;

    const squad: IResponse<ISquad> = await this.repository.getSquadById(
      squadId
    );
    if (squad.status !== 200)
      return res.status(squad.status).json({ errors: squad.errors });

    res.status(200).json(squad.data);
  }
}
