import { v4 as uuid } from "uuid";
import dbConnect from "../database/database";
import { QueryResult } from "pg";
import { ISquad, IResponse } from "../interfaces/interfaces";

export default class SquadRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  public async getAllSquads(): Promise<IResponse<Array<ISquad[]>>> {
    try {
      const queryText: string = `SELECT * FROM teams;`;
      const getUsers: QueryResult<Array<ISquad>> = await this.db.pool.query(
        queryText
      );

      const res: IResponse<Array<ISquad[]>> = {
        status: 200,
        data: getUsers.rows,
      };
      return res;

    } catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }

  public async getSquadById(teamId: string): Promise<IResponse<ISquad>> {
    try {
      const queryText = `SELECT * FROM teams WHERE id = $1`;
      const result = await this.db.pool.query(queryText, [teamId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Squad not found.",
        };
        return res;
      }

      const squad: ISquad = result.rows[0];
      const res: IResponse<ISquad> = {
        status: 200,
        data: squad,
      };
      return res;

    } catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }

  public async createSquad(squad: ISquad): Promise<IResponse<ISquad>> {
    try {
      const queryText: string = `INSERT INTO "teams" (id, name, leader) VALUES ($1, $2, $3) RETURNING id, name, leader;`;
      const values: Array<any> = [uuid(), squad.name, squad.leader];

      const newSquad: QueryResult<ISquad> = await this.db.pool.query(
        queryText,
        values
      );

      const res: IResponse<ISquad> = {
        status: 201,
        data: newSquad.rows[0],
      };
      return res;
      
    } catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }

  public async getAllMembersSquad(teamId: string): Promise<IResponse<ISquad>> {
    try {
      const queryText = `SELECT id, username, email, first_name, last_name, is_admin, squad 
      FROM users 
      WHERE squad = $1`;
      const result = await this.db.pool.query(queryText, [teamId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Squad not found.",
        };
        return res;
      }

      const squad: any= result.rows;
      const res: IResponse<ISquad> = {
        status: 200,
        data: squad,
      };
      return res;
    } catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }
  	
  public async delSquadById(teamId: string): Promise<IResponse<ISquad>> {
    try {
      const verifyTeam = `SELECT * FROM users WHERE squad = $1`
      const resultVerifyTeam = await this.db.pool.query(verifyTeam, [teamId]);

      console.log(resultVerifyTeam.rowCount)

      if (resultVerifyTeam.rowCount < 2) {
        const updateQuery = `UPDATE teams SET leader = $2 WHERE id = $1`;
        await this.db.pool.query(updateQuery, [teamId, null]);
        
        const query = `DELETE FROM teams WHERE id = $1 RETURNING *`;
        const result = await this.db.pool.query(query, [teamId]);

        const squad: any = result.rows;
        const res: IResponse<ISquad> = {
          status: 200,
          data: squad,
        }
        return res;
      } 

      const res: IResponse<any> = {
        status: 404,
        errors: "Não foi encontrado o time ou ainda há membros.",
      };
      return res;
        
    } catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      } 
      return res;
    }
  }

  public async updateTeamsInfos(
    teamName: string,
    leader: string,
    teamId: string
  ){
    try{
      const queryText = `UPDATE "teams" SET name = $2, leader = $1 WHERE id = $3 RETURNING *;`;
      const result = await this.db.pool.query(queryText, [leader, teamName, teamId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Time não encontrado.",
        };
        return res;
      }

      const user: ISquad = result.rows[0];
      const res: IResponse<ISquad> = {
        status: 200,
        data: user,
      };
      return res;
    
    } catch (err) {

      const res: IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }


}
