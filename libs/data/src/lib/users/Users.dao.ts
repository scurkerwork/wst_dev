import { UserDetailsUpdate } from '@whosaidtrue/app-interfaces';
import { Pool, QueryResult } from 'pg';
import Dao from '../base.dao';

class Users extends Dao {
    constructor(pool: Pool) {
        super(pool, 'users');
    }
    /**
     * Insert a new user.
     *
     * WARNING: ENCRYPTION HAPPENS IN THE DATABASE. DO NOT ENCRYPT PASSWORD BEFORE
     * CALLING THIS METHOD. IF YOU DO, THE PASSWORD WILL NOT BE VERIFYABLE.
     *
     * If request successful, results object will have a 'rows' array length 1,
     * containing an object with the id, email and roles of the inserted user.
     *
     * @throws {DatabaseError}
     * Will throw exception if a user already exists with provided email,
     *
     * @example
     * const result = await users.register('test@example.com','password');
     * // result.rows = [{id: 1, email: 'test@example.com', roles: ['user'], notifications: false}]
     *
     * @param {Partial<User>} user
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public register(email: string, password: string): Promise<QueryResult> {
        const query = {
            text: "INSERT INTO users (email, password, roles) VALUES ( $1, crypt($2, gen_salt('bf', 8)), $3) RETURNING id, email, array_to_json(roles) AS roles",
            values: [email, password, ["user"]]
        }
        return this._pool.query(query);
    }

    /**
     * For authenticated users to change their passwords on the 'Change Password' screen.
     *
     * If old password is wrong, returns empty array.
     * @param id
     * @param oldPass
     * @param newPass
     * @returns
     */
    public changePassword(id: number, oldPass: string, newPass: string): Promise<QueryResult> {
        const query = {
            text: `UPDATE users SET password = crypt($1, gen_salt('bf', 8)) WHERE (users.id = $2 AND users.password = crypt($3, password)) RETURNING id`,
            values: [newPass, id, oldPass]
        }
        return this._pool.query(query)
    }

    /**
     * Use this to change account passwords in cases where the old password is unknown
     * (i.e. email reset/adding passwords to guest accounts).
     *
     * The difference this method and the 'changePassword' method is that this method doesn't
     * check the old password, it just changes it.
     *
     * @param id
     * @param password
     * @returns
     */
    public resetPassword(email: string, password: string): Promise<QueryResult> {
        const query = {
            text: `UPDATE users SET password = crypt($1, gen_salt('bf', 8)) WHERE email = $2 RETURNING id, email, array_to_json(roles) AS roles`,
            values: [password, email]
        }
        return this._pool.query(query)
    }

    /**
     * Updates the email.
     *
     * Currently not being used, but this might change. Keeping it around for now
     * just in case.
     *
     * @param {number} id
     * @param {string} email
     * @return {*}  {Promise<QueryResult>}
     * @memberof Users
     */
    public updateEmail(id: number, email: string): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET email = $1 WHERE id = $2 RETURNING email',
            values: [email, id]
        };
        return this._pool.query(query)

    }

    // TODO: add notifications to this when that feature is rolled out.
    public updateDetails(id: number, update: UserDetailsUpdate): Promise<QueryResult> {
        const { email } = update
        const query = {
            text: 'UPDATE users SET email = $1 WHERE id = $2 RETURNING email',
            values: [email, id]
        };
        return this._pool.query(query)

    }

    /**
     * Set user's credits to specified value.
     *
     * @returns {Promise<QueryResult>} result.rows = [{question_deck_credits: NEW_VALUE}]
     */
    public setCredits(userId: number, value: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET question_deck_credits = $2 WHERE id = $1 RETURNING question_deck_credits',
            values: [userId, value]
        };
        return this._pool.query(query)
    }

    /**
     * Increment a user's credits by a specified value.
     *
     * @returns {Promise<QueryResult>} result.rows = [{question_deck_credits: NEW_VALUE}]
     */
    public incrementCredits(userId: number, value: number): Promise<QueryResult> {
        const query = {
            text: 'UPDATE users SET question_deck_credits = question_deck_credits + $2 WHERE id = $1 RETURNING question_deck_credits',
            values: [userId, value]
        };
        return this._pool.query(query)
    }

    /**
     * UPSERT a reset_code for a user
     *
     * Returns the email if successful.
     *
     * If there is already a reset_code for a user, the old code will be replced.
     *
     * Returns an empty array if there was no user with that email.
     * @param email
     * @param code
     * @returns
     */
    public upsertResetCode(email: string, code: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT * FROM upsert_reset_code($1, $2)',
            values: [email, code]
        };
        return this._pool.query(query)
    }

    /**
     * For use in password resetting. If code is correct,
     * will return user_email.
     *
     * If code was incorrect, will return empty array.
     * @param email
     * @param code
     * @returns
     */
    public verifyResetCode(email: string, code: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT user_email FROM reset_codes WHERE user_email = $1 AND code = crypt($2, code)',
            values: [email, code]
        }

        return this._pool.query(query)
    }


    /**
     * User account details for the 'My Account' page.
     *
     * @return {Promise<QueryResult>}
     * @memberof Users
     */
    public getDetails(userId: number): Promise<QueryResult> {
        const query = {
            text: 'SELECT id, email, array_to_json(roles) AS roles, question_deck_credits, notifications FROM users WHERE id = $1',
            values: [userId]
        };
        return this._pool.query(query)
    }

    /**
     * Log user in. Returns empty rows array if password is incorrect.
     *
     * @param {string} email
     * @param {string} password
     * @return  {Promise<QueryResult>} {id, email, roles[], notifications}
     * @memberof Users
     */
    public login(email: string, password: string): Promise<QueryResult> {
        const query = {
            text: 'SELECT id, email, array_to_json(roles) AS roles FROM users WHERE email = $1 AND password = crypt($2, password)',
            values: [email, password]
        }
        return this._pool.query(query)
    }

    /**
     * Create a user with no password.
     *
     * Called from the 'play as guest host' flow.
     *
     * Will throw a unique key error if user already exists with that email.
     *
     * @param email
     * @returns
     */
    public createGuest(email: string): Promise<QueryResult> {
        const query = {
            text: 'INSERT INTO users (email, roles) VALUES ( $1, $2) RETURNING id, email, array_to_json(roles) AS roles',
            values: [email, ['guest']]
        }

        return this._pool.query(query)
    }
}

export default Users;