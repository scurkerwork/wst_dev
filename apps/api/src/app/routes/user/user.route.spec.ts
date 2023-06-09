import supertest from 'supertest';
import { QueryResult, DatabaseError } from 'pg';
import { Application } from 'express';
import { mocked } from 'ts-jest/utils';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import Redis from 'ioredis-mock/jest';

// local
import App from '../../App';
import { creditSignup, users } from '../../db';
import { emailService } from '../../services';
import { signUserPayload } from '@whosaidtrue/middleware';
import { ClientResponse } from '@sendgrid/mail';

const mockedUsers = mocked(users, true)
const mockedSendgrid = mocked(emailService, true);
const mockedCreditSignups = mocked(creditSignup, true);

jest.mock('../../db');
jest.mock('../../services');

jest.mock('ioredis', () => {
    const redisMock = new Redis({
        data: {
            "resetRequests:overCapped@test.com": '10'
        }
    })
    return function () {
        return redisMock
    }
});



describe('user routes', () => {
    let app: Application;

    beforeAll(() => {
        app = new App().app;
    })

    beforeEach(() => {
        jest.clearAllMocks();
    })

    describe('[POST] /login', () => {

        it('should return 201 and a token if login call has result in rows', async () => {
            // set mock value
            mockedUsers.login.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com', roles: ["user"] }] } as QueryResult);

            const response = await supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)


            // response should be a valid JWT token
            expect(validator.isJWT(response.body.token)).toEqual(true)

            // JWT token payload has expected attributes
            const { user } = jwt.decode(response.body.token, { json: true })
            expect(user.id).toEqual(1)
            expect(user.email).toEqual('email@email.com')
            expect(user.roles).toEqual(["user"])
        })

        it('should return 401 if result is empty array', (done) => {
            // set mock value
            mockedUsers.login.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(401, done)

        })

        it('should return 500 if login request rejects due to unknown error (e.g. cannot connect to db)', (done) => {
            // set mock value
            mockedUsers.login.mockRejectedValue('error')

            supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(500, done)
        })

        it('should return 422 if email invalid', async () => {
            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password less than 8 characters', async () => {
            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'pad123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password has no numbers', async () => {
            const { body } = await supertest(app)
                .post('/user/login')
                .send({ email: 'email@test.com', password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })
    })

    describe('[POST] /register', () => {

        it('should return 201 and a token payload if db response has content - new user path', async () => {
            // set mock value
            mockedUsers.attemptConvertGuestToUser.mockResolvedValue({ rows: [] } as QueryResult);
            mockedUsers.register.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com', roles: ["user"], notifications: false }] } as QueryResult)

            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)

            // response should be a valid JWT token
            expect(validator.isJWT(body.token)).toEqual(true)

            // JWT token payload has expected attributes
            const { user } = jwt.decode(body.token, { json: true })
            expect(user.id).toEqual(1)
            expect(user.email).toEqual('email@email.com')
            expect(user.roles).toEqual(["user"])
        })

        it('should return 201 and a token payload if db response has content - guest path', async () => {
            // set mock value
            mockedUsers.attemptConvertGuestToUser.mockResolvedValue({ rows: [{ id: 1, email: 'guest@example.com', roles: ["user"] }] } as QueryResult);

            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)

            expect(mockedUsers.register).not.toHaveBeenCalled()

            // response should be a valid JWT token
            expect(validator.isJWT(body.token)).toEqual(true)

            // JWT token payload has expected attributes
            const { user } = jwt.decode(body.token, { json: true })
            expect(user.id).toEqual(1)
            expect(user.email).toEqual('guest@example.com')
            expect(user.roles).toEqual(["user"])
        })

        it('should return 422 if an account already exists for that email', (done) => {
            // set mock value
            mockedUsers.attemptConvertGuestToUser.mockResolvedValue({ rows: [] } as QueryResult);
            mockedUsers.register.mockRejectedValue(new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, "error"))

            supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(422, done)
        })


        it('should return 500 if login request rejects due to unknown error (e.g. cannot connect to db)', (done) => {
            // set mock value
            mockedUsers.attemptConvertGuestToUser.mockResolvedValue({ rows: [] } as QueryResult);
            mockedUsers.register.mockRejectedValue('error')

            supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password123' })
                .set('Accept', 'application/json')
                .expect(500, done)
        })

        it('should return 422 if email invalid', async () => {
            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email', password: 'password123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password less than 8 characters', async () => {
            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'pad123' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should return 422 if password has no numbers', async () => {
            const { body } = await supertest(app)
                .post('/user/register')
                .send({ email: 'email@test.com', password: 'password' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('password');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })
    })

    describe('[POST] /send-reset', () => {


        it('should return 422 if email is not valid', async () => {
            const { body } = await supertest(app)
                .post('/user/send-reset')
                .send({ email: 'email' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(422)

            expect(body[0].param).toEqual('email');
            expect(body[0].msg).toEqual('Invalid value')
            expect(body.length).toEqual(1);
        })

        it('should respond with 202 if sendgrid responds with 202', (done) => {

            mockedUsers.upsertResetCode.mockResolvedValue({ rows: [1] } as QueryResult)
            mockedSendgrid.sendResetCode.mockResolvedValue([{ statusCode: 202 } as ClientResponse, {}])

            supertest(app)
                .post('/user/send-reset')
                .send({ email: 'email@test.com' })
                .expect(202, done)
        })

        it('should respond with 500 if sendgrid responds with something other than 202', (done) => {
            mockedUsers.upsertResetCode.mockResolvedValue({ rows: [1] } as QueryResult)
            mockedSendgrid.sendResetCode.mockResolvedValue([{ statusCode: 400 } as ClientResponse, {}])
            supertest(app)
                .post('/user/send-reset')
                .send({ email: 'email@test.com' })
                .expect(500, done)
        })

        it('should respond with 500 if DB request fails', (done) => {
            mockedUsers.upsertResetCode.mockRejectedValue(new DatabaseError('error', 1, 'error'))
            supertest(app)
                .post('/user/send-reset')
                .send({ email: 'email@test.com' })
                .expect(500, done)
        })


        it('should respond with 404 if no records returned', (done) => {
            mockedUsers.upsertResetCode.mockResolvedValue({ rows: [] } as QueryResult);

            supertest(app)
                .post('/user/send-reset')
                .send({ email: 'email@test.com' })
                .expect(404, done)
        })

        it('should respond with 403 if reset count > 10', async () => {

            const response = await supertest(app)
                .post('/user/send-reset')
                .send({ email: 'overCapped@test.com' })
                .expect(403)

            expect(response.text).toEqual('Reset limit reached')

        })
    })


    describe('[GET] /details', () => {

        it('should return 200 if successful', async () => {
            mockedUsers.getDetails.mockResolvedValue({
                rows: [
                    {
                        id: 1,
                        email: 'email@email.com',
                        notifications: false,
                        question_deck_credits: 1,
                        roles: ['user']
                    }
                ]
            } as QueryResult)
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            const response = await supertest(app)
                .get('/user/details')
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200)

            const { id, email, notifications, question_deck_credits, roles } = response.body;

            expect(id).toBeDefined();
            expect(email).toEqual(email);
            expect(notifications).toBeDefined();
            expect(roles.length).toBeGreaterThan(0);
            expect(question_deck_credits).toBeDefined();

        })
    })

    describe('[PATCH] /change-password', () => {
        it('should return 204 if successful', (done) => {
            mockedUsers.changePassword.mockResolvedValue({ rows: [1] } as QueryResult)
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .patch('/user/change-password')
                .send({ oldPass: 'password123', newPass: 'password1234' })
                .set('Authorization', `Bearer ${token}`)
                .expect(204, done)
        })

        it('should return 401 if db result empty', (done) => {
            mockedUsers.changePassword.mockResolvedValue({ rows: [] } as QueryResult)
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .patch('/user/change-password')
                .send({ oldPass: 'password123', newPass: 'password1234' })
                .set('Authorization', `Bearer ${token}`)
                .expect(401, done)
        })

        it('should return 422 if oldPass missing', (done) => {
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .patch('/user/change-password')
                .send({ newPass: 'password1234' })
                .set('Authorization', `Bearer ${token}`)
                .expect(422, done)
        })

        it('should return 422 if newPass missing', (done) => {
            const token = signUserPayload({ id: 1, email: 'email@email.com', roles: ["user"] })
            supertest(app)
                .patch('/user/change-password')
                .send({ oldPass: 'password1234' })
                .set('Authorization', `Bearer ${token}`)
                .expect(422, done)
        })

        it('should return 401 if no valid token', (done) => {

            mockedUsers.changePassword.mockResolvedValue({ rows: [] } as QueryResult)
            supertest(app)
                .patch('/user/change-password')
                .send({ oldPass: 'password123', newPass: 'password1234' })
                .expect(401, done)
        })
    })




    describe('[POST] /validate-reset', () => {

        it('should respond with 422 if no email', (done) => {
            supertest(app)
                .post('/user/validate-reset')
                .send({ code: '1234' })
                .expect(422, done)
        })

        it('should respond with 422 if email invalid', (done) => {
            supertest(app)
                .post('/user/validate-reset')
                .send({ code: '1234', email: 'wrong' })
                .expect(422, done)
        })

        it('should respond with 422 if code invalid', (done) => {
            supertest(app)
                .post('/user/validate-reset')
                .send({ code: '12a4', email: 'wrong' })
                .expect(422, done)
        })

        it('should respond with 422 if code missing', (done) => {
            supertest(app)
                .post('/user/validate-reset')
                .send({ email: 'email@email.com' })
                .expect(422, done)
        })

        it('should respond with 401 if no records found. This means code was wrong.', done => {
            mockedUsers.verifyResetCode.mockResolvedValue({ rows: [] } as QueryResult);

            supertest(app)
                .post('/user/validate-reset')
                .send({ code: '1234', email: 'email@test.com' })
                .expect(401, done)
        })

        it('should respond with 500 if DB request fails.', done => {
            mockedUsers.verifyResetCode.mockRejectedValue(new DatabaseError('error', 1, 'error'))
            supertest(app)
                .post('/user/validate-reset')
                .send({ code: '1234', email: 'email@test.com' })
                .expect(500, done)
        })

        it('should respond with 202 with a json token in body if working.', async () => {
            mockedUsers.verifyResetCode.mockResolvedValue({ rows: [{ user_email: 'email@test.com' }] } as QueryResult)
            const result = await supertest(app)
                .post('/user/validate-reset')
                .send({ code: '1234', email: 'email@test.com' })
                .expect(202)

            expect(validator.isJWT(result.body.resetToken)).toEqual(true)
        })

    })

    describe('[PATCH] /reset-password', () => {
        const email = 'email@email.com'
        const newPassword = 'password123'
        const resetToken = signUserPayload({ id: 1, email, roles: ["user"] })
        it('should respond with 422 if password missing', (done) => {
            supertest(app)
                .patch('/user/reset-password')
                .send({ resetToken })
                .expect(422, done)

        })

        it('should respond with 422 if reset token missing', (done) => {
            supertest(app)
                .patch('/user/reset-password')
                .send({ newPassword })
                .expect(422, done)

        })
        it("should respond with 422 if reset token isn't JWT", (done) => {
            supertest(app)
                .patch('/user/reset-password')
                .send({ resetToken: 'abc', newPassword })
                .expect(422, done)

        })

        it("should respond with 401 if token invalid", (done) => {

            const token = jwt.sign('xyz', 'abc');
            supertest(app)
                .patch('/user/reset-password')
                .send({ resetToken: token, newPassword })
                .expect(401, done)

        })

        it("should return 202 and a token on success", async () => {
            mockedUsers.resetPassword.mockResolvedValue({ id: 1, email, roles: ['user'] });
            const result = await supertest(app)
                .patch('/user/reset-password')
                .send({ resetToken, newPassword })
                .expect(202)

            expect(validator.isJWT(result.body.token)).toEqual(true);
        })
    })

    describe('[POST] /guest', () => {
        it('should respond with 422 if no email', done => {
            supertest(app)
                .post('/user/guest')
                .expect(422, done)
        })

        it('should respond with 422 if email invalid', done => {
            supertest(app)
                .post('/user/guest')
                .send({ email: 'wrong' })
                .expect(422, done)
        })

        it('should respond with 422 if db threw email key error', done => {
            mockedUsers.createGuest.mockRejectedValue(new DatabaseError("duplicate key value violates unique constraint \"users_email_key\"", 1, 'error'))
            supertest(app)
                .post('/user/guest')
                .send({ email: 'email@email.com' })
                .expect(422, done)
        })

        it('should respond with 500 if db threw other error', done => {
            mockedUsers.createGuest.mockRejectedValue(new Error(''))
            supertest(app)
                .post('/user/guest')
                .send({ email: 'email@email.com' })
                .expect(500, done)
        })

        it('should respond with 201 if db success', async () => {
            // set mock value
            mockedUsers.createGuest.mockResolvedValue({ rows: [{ id: 1, email: 'email@email.com', roles: ["guest"], notifications: false }] } as QueryResult)

            const { body } = await supertest(app)
                .post('/user/guest')
                .send({ email: 'email@test.com' })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)

            // response should be a valid JWT token
            expect(validator.isJWT(body.token)).toEqual(true)

            // JWT token payload has expected attributes
            const { user } = jwt.decode(body.token, { json: true })
            expect(user.id).toEqual(1)
            expect(user.email).toEqual('email@email.com')
            expect(user.roles).toEqual(["guest"])
        })
    })

    describe('[POST] free credit signup', () => {
        it('should respond with 422 if not valid email', (done) => {
            supertest(app)
                .post('/user/free-credit-signup')
                .send({ email: 'ffffff' })
                .expect(422, done)
        })

        it('should respond with 201 if success.', (done) => {
            mockedCreditSignups.insertOne.mockResolvedValue({ rowCount: 1 } as QueryResult);
            supertest(app)
                .post('/user/free-credit-signup')
                .send({ email: 'email@test.com' })
                .expect(201, done)
        })

        it('should respond with 422 if db rejects with duplicate key error.', (done) => {
            mockedCreditSignups.insertOne.mockRejectedValue(new DatabaseError("duplicate key value violates unique constraint \"free_credit_signups_email_key\"", 1, "error"));
            supertest(app)
                .post('/user/free-credit-signup')
                .send({ email: 'email@test.com' })
                .expect(422, done)
        })
    })
})
