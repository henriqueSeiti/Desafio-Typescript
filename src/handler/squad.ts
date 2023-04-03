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

    const cookie = req.cookies['token'];

    if (!cookie) {
      return res.status(400).json({ errors: "Usuário deslogado" });
    }

    if (cookie.is_admin === true || cookie.is_leader === true) {
      const squads: IResponse<Array<ISquad[]>> = await this.repository.getAllSquads();

      if (squads.status !== 200) return res.status(squads.status).json({ errors: squads.errors });
      res.status(200).json(squads.data);
    }

    else {
      return res.status(400).json({ errors: "Somente administradores e líderes têm acesso" });
    }
  }

  public async getById(req: Request, res: Response) {
    const squadId = req.params.team_id;

    const cookie = req.cookies['token'];

    if (!cookie) {
      return res.status(400).json({ errors: "Usuário deslogado" });
    }

    if (cookie.is_admin === true || cookie.is_leader === true || cookie.squad === squadId) {
      const squad: IResponse<ISquad> = await this.repository.getSquadById(squadId);

      if (squad.status !== 200) return res.status(squad.status).json({ errors: squad.errors });
      res.status(200).json(squad.data);
    }

    else {
      return res.status(400).json({ errors: "Somente pessoas autorizadas têm acesso!" });
    }

  }

  public async getAllMembersSquad(req: Request, res: Response) {
    const squadId = req.params.team_id;

    const cookie = req.cookies['token'];

    if (!cookie) {
      return res.status(400).json({ errors: "Usuário deslogado" });
    }

    if (cookie.squad === null && cookie.is_admin === false) {
      return res.status(400).json({ errors: "Usuário autenticado não pode ter acesso!" });
    }

    if (cookie.squad !== squadId && cookie.is_admin === false) {
      return res.status(400).json({ errors: "Você não é membro deste time!" });
    }

    const squad: IResponse<ISquad> = await this.repository.getAllMembersSquad(
      squadId
    );

    if (squad.status !== 200)
      return res.status(squad.status).json({ errors: squad.errors });

    res.status(200).json(squad.data);
  }
  
  public async updateSquadById(req:Request, res:Response) {
    const cookie = req.cookies['token'];
    const squadId = req.params.team_id;
    const { id } = req.params;  


    if (!cookie) {
      return res.status(400).json({ error: "Usuário deslogado" });
    }

    const squad = await this.repository.getSquadById(squadId);
    console.log(squad.data?.leader, cookie.user_id);

    

    if (!cookie.is_admin && squad.data?.leader != cookie.user_id ){
      return res.status(400).json({ error: "Usuario não é admin ou lider desse time"})
    }
    
    const { teamName, leader } = req.body;

    const response = await this.repository.updateTeamsInfos(teamName, leader, id);
 
    res.status(response.status).json({messege: response.data});

  }
}


