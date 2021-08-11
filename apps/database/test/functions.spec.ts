import { Client } from 'pg';

describe('database custom functions', () => {
    let client: Client;
    beforeAll(async () => {
        client = new Client({
            host: 'localhost',
            port: 5432,
            user: 'postgres',
            password: 'password'
        });
        await client.connect();
        return await client.query('SET search_path TO public')
    })

    describe('number_true_answers', () => {

        it('should return the expected number', async () => {
            // insert
            await client.query(`INSERT INTO game_answers ("gameQuestionId", "gameId", "gamePlayerId", "value", "numberTrueGuess") VALUES (1, 1, 1, 'true', 1)`);
            await client.query(`INSERT INTO game_answers ("gameQuestionId", "gameId", "gamePlayerId", "value", "numberTrueGuess") VALUES (1, 1, 2, 'true', 1)`);
            // result
            const result = await client.query(`SELECT number_true_answers(1)`)
            return expect(result.rows[0]).toEqual(2);
        })

    })

})