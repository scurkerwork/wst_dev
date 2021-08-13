import Dao from './base.dao';
import { updateQueryBuilder, UpdateObject, InsertCreator } from '@whosaidtrue/util';
import { User } from '../interfaces';

class Users extends Dao {
    getById = async (id: string) => {
        const { rows } = await this.pool.query(`SELECT * FROM users WHERE id = ${id}`);
        return rows[0];
    }

    updateById = async (id: string, updateObject: UpdateObject) => {
        const updateString = updateQueryBuilder(updateObject);
        const { rows } = await this.pool.query(`UPDATE users ${updateString} WHERE id = ${id}`);
        return rows[0];
    }

    create = async (user: InsertCreator<User>) => {
        return
    }
}

export default Users;