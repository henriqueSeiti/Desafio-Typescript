import { UUID } from "crypto";
import { Request, Response } from "express";
import { IResponse, IUser } from "../interfaces/interfaces";
import SquadRepository from "../repositories/squadRepository";
import UserRepository from "../repositories/userRepository";
import cookieParser from 'cookie-parser';


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

    const cookie = req.cookies['token'];

    if (cookie.is_admin === false) {
      return res.status(400).json({ error: "Somente administradores têm acesso!" });
    }

    const users: IResponse<Array<IUser[]>> = await this.repository.getAllUsers();

    if (users.status !== 200)
      return res.status(users.status).json({ errors: users.errors });

    res.status(200).json(users.data);
  }

  public async getMyData(req: Request, res: Response) {
    const cookie = req.cookies['token'];
    
    const users: IResponse<IUser> = await this.repository.getMyData(cookie.user_id);

    if (users.status !== 200)
      return res.status(users.status).json({ errors: users.errors });

    res.status(200).json(users.data);
  }

  public async getById(req: Request, res: Response) {
    const userId = req.params.user_id;

    const cookie = req.cookies['token'];

    if (cookie.is_admin === true || cookie.is_leader === true) {
      const user: IResponse<IUser> = await this.repository.getUserById(userId);
        if (user.status !== 200) return res.status(user.status).json({ errors: user.errors });
        res.status(200).json(user.data);
    }

    else {
      return res.status(400).json({ errors: "Somente administradores e líderes têm acesso" });
    }
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

  public async login(req:Request, res:Response) {
    const user: IUser = req.body;
    if (!user || !user.email || !user.password) {
      res.status(400).json({ error: "Dados incompletos" });
      return;
    }

    const responseServ: IResponse<IUser> = await this.repository.login(user);

    if (responseServ.status === 201 && responseServ.data !== undefined) {
      
      const sessionId = req.sessionID ;
      res.cookie('token', {token: sessionId, user_id: responseServ.data.id, is_admin: responseServ.data.is_admin, squad: responseServ.data.squad, is_leader: responseServ.data.is_leader}, { 
        maxAge: 900000, 
        httpOnly: true }
      );

      return res.status(201).json({
        token: sessionId
      });

    } else {
      res.status(responseServ.status).json({ error: responseServ.errors });
    }
  }

  public async logout(req:Request, res:Response) {
    res.clearCookie("token");
    return res.status(200).send("LogOut bem sucedido!");
  }

  public async updateUserById(req:Request, res:Response) {
    const cookie = req.cookies['token'];

    const { user_id:id } = req.params;  
    if (!id || id == "") {
      return res.status(400).json({ error: "ID não pode ser vazio ou nulo"})
    }

    if (id != cookie.user_id) {
      return res.status(400).json({ error: "ID fornecido não corresponde ao usuario logado"})
    }

    const { userName, password } = req.body;

    const response = await this.repository.updateUserInfos(userName, password, id);

    res.status(response.status).json({message: response.data});

  }
}
