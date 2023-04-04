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
      const queryText: string = `INSERT INTO teams (name, leader) VALUES ($1, $2) RETURNING *;`;
      const values: Array<string> = [squad.name, squad.leader];
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
      const queryText = `SELECT * FROM users WHERE squad = $1`;
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
      const query = `DELETE FROM "teams" WHERE id = $1`;
      const result = await this.db.pool.query(query, [teamId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Squad not found or already deleted.",
        };
        return res;
      }

      const squad: any = result.rows;
      const res: IResponse<ISquad> = {
        status: 200,
        data: squad,
      };
      return res;

    }
    catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      } 
      return res;
    }
  }

  public async updateTeamsInfos(
    leader: string,
    teamName: string,
    teamId: string
  ){
    try{
      const queryText = `UPDATE "teams" SET leader = $1, name = $2 WHERE id = $3`;
      await this.db.pool.query(queryText, [leader, teamName, teamId]);

      const res: IResponse<any> = {
        status: 200,
        data: "Squad updated successfully.",
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
