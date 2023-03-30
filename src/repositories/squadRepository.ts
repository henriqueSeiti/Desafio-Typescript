import dbConnect from '../database/database';
import { QueryResult } from 'pg';
import { ISquad, IResponseSquad } from '../interfaces/interfaces';
import Squad from '../models/squad';

export default class SquadRepository {
    private db: dbConnect;

    constructor() {
        this.db = new dbConnect();
    }

    public async getAllSquads() {
        try {
            const queryText: string = `SELECT * FROM "squad";`;
            const getUsers: QueryResult<Array<ISquad>> =
                await this.db.pool.query(queryText);

            const res: IResponseSquad<Array<ISquad[]>> = {
                status: 200,
                data: getUsers.rows,
            };
            return res;
            
        } catch (err) {
            const res: IResponseSquad<any> = {
                status: 500,
                errors: err,
            };
            return res;
        }
    }
}
