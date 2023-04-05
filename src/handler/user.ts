
import { Request, Response } from "express";
import { IResponse, IUser } from "../interfaces/interfaces";
import SquadRepository from "../repositories/squadRepository";
import UserRepository from "../repositories/userRepository";
import { Validator } from "../validators/validator";


export default class UserHandler {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  public async post(req: Request, res: Response) {
    const user: IUser = req.body;

    if (user.username === undefined || user.email === undefined || user.password === undefined || user.first_name === undefined || user.last_name === undefined) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    if (!user || !user.username || !user.email || !user.password || !user.first_name || !user.last_name) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    const validate: Validator = new Validator (user.username, user.first_name, user.last_name, user.password, user.email );
    if (validate.fail)
    return res.status(400).json({ error: validate.message });

    const response: IResponse<IUser> = await this.repository.createUser(user);

    if (response.status === 201) {
      res.status(201).json(response.data);
    } else {
      res.status(response.status).json({ error: response.errors });
    }
  }

  public async getAll(req: Request, res: Response) {
    const cookie = req.cookies['token'];

    if (!cookie.is_admin) {
      return res.status(400).json({ error: "Somente administradores têm acesso!" });
    }

    const users: IResponse<Array<IUser[]>> = await this.repository.getAllUsers();

    if (users.status !== 200){
      return res.status(users.status).json({ errors: users.errors });
    }
    
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

    if (userId == undefined || userId == "") {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    if (cookie.is_admin === true ) {
      const user: IResponse<IUser> = await this.repository.getUserById(userId);
        if (user.status !== 200) return res.status(user.status).json({ errors: user.errors });
        res.status(200).json(user.data);
    } 

    if (cookie.is_leader === true ) {
      const user: IResponse<IUser> = await this.repository.getUserByIdLeader(userId, cookie.squad);
        if (user.status !== 200) return res.status(user.status).json({ errors: user.errors });
        res.status(200).json(user.data);
    }

    else {
      return res.status(400).json({ errors: "Somente administradores e líderes têm acesso" });
    }
  }

  public async addMemberToTeam(req: Request, res: Response) {
    const cookie = req.cookies['token']
    const userId = req.params.user_id;
    const teamId = req.params.team_id;

    const squadRepository = new SquadRepository();

    if((!cookie.is_admin || !cookie.is_leader) || (cookie.is_leader && cookie.squad !== teamId)) {
      return res.status(400).json({ errors: 'Usuário sem premissão.' })
    }

    const user = await this.repository.getUserById(userId);
    if (user.status !== 200){
      return res.status(user.status).json({ errors: user.errors });
    }
      
    const team = await squadRepository.getSquadById(teamId);
    if (team.status !== 200){
      return res.status(team.status).json({ errors: team.errors });
    }
      
    const result = await this.repository.updateUserSquad(userId, teamId);
    if (result.status !== 200){
      return res.status(result.status).json({ errors: result.errors });
    }

    res.status(200).json(result.data);
  }

  public async login(req:Request, res:Response) {
    const user: IUser = req.body;
    if (!user || !user.email || !user.password) {
      return res.status(400).json({ error: "Dados incompletos" });;
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
  
  public async delUserById( req: Request, res: Response) {
    const cookie = req.cookies["token"];
    const userId = req.params.userId;

    if (cookie.is_admin === false) {
      return res.status(400).json({ errors: "Somente administradores têm acesso!" });
    }
    
    const user : IResponse<IUser> = await this.repository.delUserById(userId);

    if (user.status !== 200) {
      return res.status(user.status).json({ errors: user.errors });
    }
    res.status(200).json(user.data);
  }

  public async removeUserFromSquad( req: Request, res : Response ) {
    const cookie = req.cookies['token']
    const userId = req.params.user_id;
    const squadId = req.params.team_id;
    
    if ((!cookie.is_admin || !cookie.is_leader) || (cookie.is_leader && cookie.squad !== squadId)){
      return res.status(400).json({ error: "Você não possui permissão para isso!"})
    }

    const user: IResponse<IUser> = await this.repository.removeUserFromSquad(userId);
    if (user.status !== 200) {
      return res.status(user.status).json({ errors: user.errors });
    }
    res.status(200).json(user.data);
  }
  
  public async updateUserById(req:Request, res:Response) {
    const cookie = req.cookies['token'];
    const user: IUser = req.body;

    const { user_id:id } = req.params;  
    if (!id || id === "") {
      return res.status(400).json({ error: "ID não pode ser vazio ou nulo"})
    }

    if (user.username == undefined || user.email == undefined || user.password == undefined || user.first_name == undefined || user.last_name == undefined) {
      return res.status(400).json({ error: "Dados inválidos" });
    }

    if (id !== cookie.user_id) {
      return res.status(400).json({ error: "Você não possui permissão para isso!"})
    }

    const validate: Validator = new Validator (user.username, user.first_name, user.last_name, user.password, user.email);
    if (validate.fail)
    return res.status(400).json({ error: validate.message });

    const response = await this.repository.updateUserInfos(user.username, user.password, id, user.email,user.first_name, user.last_name);

    res.status(response.status).json({message: response.data});
  }
}
