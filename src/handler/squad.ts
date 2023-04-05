
import { Request, Response } from "express";
import { IResponse, ISquad } from "../interfaces/interfaces";
import SquadRepository from "../repositories/squadRepository";
import { SquadValidator, Validator } from "../validators/validator";

export default class SquadHandler {
  private repository: SquadRepository;

  constructor() {
    this.repository = new SquadRepository();
  }

  public async post(req: Request, res: Response) {
    const squad: ISquad = req.body;
    const cookie = req.cookies['token'];

    if (!cookie.is_admin) {
      return res.status(400).json({ errors: "Somente administradores têm acesso" });
    }

    if (!squad || !squad.name || squad.name == undefined ) {
      return res.status(400).json({ error: "Verifique os Dados!" });
    }

    if(!squad.leader){
      const validate: SquadValidator = new SquadValidator (squad.name);
      if (validate.fail)
      return res.status(400).json({ error: validate.message });
    }

    if(squad.leader){
      const validate: SquadValidator = new SquadValidator (squad.name, squad.leader);
      if (validate.fail)
      return res.status(400).json({ error: validate.message });
    }

    const response: IResponse<ISquad> = await this.repository.createSquad(squad);

    if (response.status === 201) {
      res.status(201).json(response.data);
    } else {
      res.status(response.status).json({ error: response.errors });
    }
  }

  public async getAll(req: Request, res: Response) {
    const cookie = req.cookies['token'];

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

    if(!cookie.is_admin || (cookie.is_leader && cookie.squad !== squadId) || cookie.squad !== squadId){
      return res.status(400).json({ errors: "Você não possui autorização para isso!" });
    }

    const squad: IResponse<ISquad> = await this.repository.getAllMembersSquad(squadId);

    if (squad.status !== 200){
      return res.status(squad.status).json({ errors: squad.errors });
    }
      
    res.status(200).json(squad.data);
  }
  
  public async updateSquadById(req:Request, res:Response) {
    const cookie = req.cookies['token'];
    const squadId = req.params.team_id;
    
    if ((!cookie.is_admin && !cookie.is_leader) || (cookie.is_leader && cookie.squad !== squadId) ){
      return res.status(400).json({ error: "Vôce não possui permissão para isso!"})
    }
    
    const { name, leader }: ISquad = req.body;

    if (!name || name == undefined || leader == undefined || !leader) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const validate: SquadValidator = new SquadValidator (name, leader);

    if (validate.fail)
    return res.status(400).json({ error: validate.message });

    const response: IResponse<ISquad> = await this.repository.updateTeamsInfos(name, leader, squadId);
 
    res.status(response.status).json({messege: response.data});

  }
  
  public async delSquadById (req: Request, res: Response) {
    const teamId = req.params.squadId;
    const cookie = req.cookies['token'];

    if(!cookie) {
        return res.status(400).json({ errors: 'Usuário deslogado.' })
    }
    if (cookie.is_admin === false) {
        return res.status(400).json({ errors: "Somente administradores têm acesso!" });
    }
    if (cookie.is_admin === true) {
        const squad: IResponse<ISquad> = await this.repository.delSquadById(teamId);

      if (squad.status !== 200) {
        return res.status(squad.status).json({ errors: squad.errors });
      }
      res.status(200).json(squad.data);
    }
  }
}


