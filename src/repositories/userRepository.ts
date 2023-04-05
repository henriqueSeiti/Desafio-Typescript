import { v4 as uuid } from "uuid";
import dbConnect from "../database/database";
import { QueryResult } from "pg";
import { IUser, IResponse } from "../interfaces/interfaces";

export default class UserRepository {
  private db: dbConnect;

  constructor() {
    this.db = new dbConnect();
  }

  public async getAllUsers(): Promise<IResponse<Array<IUser[]>>> {
    try {
      const queryText: string = `SELECT * FROM users`;
      const getUsers: QueryResult<Array<IUser>> = await this.db.pool.query(queryText);

      const res: IResponse<Array<IUser[]>> = {
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
  
  public async getMyData(userId: string): Promise<IResponse<IUser>> {
    try {
      const queryText = `SELECT * FROM users WHERE id = $1`;
      const result = await this.db.pool.query(queryText, [userId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Usuario não encontrado.",
        };
        return res;
      }

      const res: IResponse<IUser> = {
        status: 200,
        data: result.rows[0],
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

  public async getUserById(userId: string): Promise<IResponse<IUser>> {
    try {
      const queryText = `SELECT * FROM users WHERE id = $1`;
      const result = await this.db.pool.query(queryText, [userId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Usuario não encontrado.",
        };
        return res;
      }

      const user: IUser = result.rows[0];
      const res: IResponse<IUser> = {
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

  public async getUserByIdLeader(userId: string, squadId: string): Promise<IResponse<IUser>> {
    try {
      const queryTextOne = `SELECT u.id, u.username, u.email, u.first_name, u.last_name, u.is_admin, u.squad
      FROM users u
      JOIN teams t ON u.id = t.leader
      WHERE u.id = $1;`;
      const resultqueryOne = await this.db.pool.query(queryTextOne, [userId]);

      if (resultqueryOne.rowCount === 0) { // Verificou que não é lider
        const queryTextTwo = `SELECT id, username, email, first_name, last_name, is_admin, squad
        FROM users
        WHERE squad = $1 AND id = $2;`;
        const resultqueryTwo = await this.db.pool.query(queryTextTwo, [userId, squadId]); 
        
        if (resultqueryTwo.rowCount === 0) {
          const res: IResponse<any> = {
            status: 404,
            errors: "Usuario não encontrado.",
          };
          return res;
        }

        const res: IResponse<IUser> = {
          status: 200,
          data: resultqueryTwo.rows[0],
        }
        return res;
      } 
      else {
        /* Verificou que é lider*/
        const res: IResponse<IUser> = {
          status: 200,
          data: resultqueryOne.rows[0],
        };
        return res;
      }

    } catch (err) {
      const res: IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }

  public async createUser(user: IUser): Promise<IResponse<IUser>> {
    try {
      const queryText: string = `INSERT INTO users (id, username, email, first_name, last_name, password, is_admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`;
      const values: Array<any> = [uuid(), user.username, user.email, user.first_name, user.last_name, user.password, false];
      const newUser: QueryResult<IUser> = await this.db.pool.query(
        queryText,
        values
      );

      const res: IResponse<IUser> = {
        status: 201,
        data: newUser.rows[0],
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

  public async updateUserSquad(
    userId: string,
    teamId: string
  ): Promise<IResponse<any>> {
    try {
      const queryText = `UPDATE "users" SET squad = $1 WHERE id = $2 RETURNING id, username, email, first_name, last_name, is_admin, squad`;
      const result : QueryResult<IUser> = await this.db.pool.query(queryText, [teamId, userId]);

      const res: IResponse<any> = {
        status: 200,
        data: result.rows[0],
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


  public async updateUserInfos(
    userName: string,
    password: string,
    userId: string,
    email: string,
    first_name: string,
    last_name: string){

    try {

      const queryText = `UPDATE "users" SET username = $1, password = $2, email = $3, first_name = $4, last_name = $5 WHERE id = $6 RETURNING *`;
      const result : QueryResult<IUser> =await this.db.pool.query(queryText, [userName, password, email, first_name, last_name, userId]);
    
      const res: IResponse<any> = {
        status: 200,
        data: result.rows[0],
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

  public async login(user: IUser): Promise<IResponse<IUser>> {
    try {
      const queryText: string = `
      SELECT
        id,
        is_admin,
        squad,
        EXISTS (
          SELECT 1
          FROM teams
          WHERE leader = users.id
        ) AS is_leader
      FROM users
      WHERE email = $1 AND password = $2;
      `;
      const values: Array<string> = [user.email, user.password];

      const verifyUser: QueryResult<IUser> = await this.db.pool.query(
        queryText,
        values
      );

      if (verifyUser.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Usuário ou senha incorreto.",
        };
        return res;
      }

      const res: IResponse<IUser> = {
        status: 201,
        data: verifyUser.rows[0],
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
    
  public async delUserById(userId: string) : Promise<IResponse<IUser>> {
    try {
      const query = `DELETE FROM "users" WHERE id = $1 RETURNING *`;
      const result = await this.db.pool.query(query, [userId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "Usuario não encontrado ou já deletado",
        };
        return res;
      }

      const res: IResponse<IUser> = {
        status: 201,
        data: result.rows[0]
      };
      return res

    } catch (err) {
      const res : IResponse<any> = {
        status: 500,
        errors: err,
      };
      return res;
    }
  }

  public async removeUserFromSquad(userId: string) : Promise<IResponse<IUser>> {
    try {
      const query = `UPDATE "users" SET "squad" = null WHERE "id" = $1 RETURNING id, username, email, first_name, last_name, is_admin, squad`;
      const result = await this.db.pool.query(query, [userId]);

      if (result.rowCount === 0) {
        const res : IResponse<any> = {
          status: 404,
          errors: `Usuário não encontrado ou não está designado a este time`
        } 
        return res;
      }

      const res : IResponse<any> = {
        status: 200,
        data: result.rows[0]
      }
      return res;

      } catch (err) {
        const res : IResponse<any> = {
          status: 500,
          errors: err,
        }
        return res;
    }      
  }
}