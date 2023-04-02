import { UUID } from "crypto";
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
      const getUsers: QueryResult<Array<IUser>> = await this.db.pool.query(
        queryText
      );

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

  public async getUserById(userId: string): Promise<IResponse<IUser>> {
    try {
      const queryText = `SELECT * FROM "user" WHERE id = $1`;
      const result = await this.db.pool.query(queryText, [userId]);

      if (result.rowCount === 0) {
        const res: IResponse<any> = {
          status: 404,
          errors: "User not found.",
        };
        return res;
      }

      const squad: IUser = result.rows[0];
      const res: IResponse<IUser> = {
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

  public async createUser(user: IUser): Promise<IResponse<IUser>> {
    try {
      const queryText: string = `INSERT INTO "user" (name, email, password) VALUES ($1, $2, $3) RETURNING *;`;
      const values: Array<string> = [user.username, user.email, user.password];
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
      const queryText = `UPDATE "user" SET squad = $1 WHERE id = $2`;
      await this.db.pool.query(queryText, [teamId, userId]);

      const res: IResponse<any> = {
        status: 200,
        data: "User squad updated successfully.",
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
      const queryText: string = `SELECT id FROM users WHERE email = $1 AND password = $2;`;
      const values: Array<string> = [user.email, user.password];

      const verifyUser: QueryResult<IUser> = await this.db.pool.query(
        queryText,
        values
      );
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

}
