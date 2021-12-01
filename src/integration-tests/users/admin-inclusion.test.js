const app = require("../../api/app");
const { roles } = require("../../api/enums");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const {
    admin_user,
    valid_user,
    new_admin,
} = require('../fixtures/user.mock.json');

const { login_successfully } = require('../fixtures/login.mock.json');

const { FORBIDDEN_ACCESS_STATUS } = require('../../api/helpers');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Cadastro de admin - POST /users/admin', () => {
    let connect;
    let login;
    
    before(async () =>  {
        connect = await connection();
        sinon.stub(MongoClient, 'connect').resolves(connect);

        await connect.collection('users').insertOne(admin_user);
        login = await chai.request(app)
            .post('/login')
            .send({
                email: admin_user.email,
                password: admin_user.password
            });
    });

    after(async () => {
        await connect.collection('users').deleteMany({});
        MongoClient.connect.restore();
    });
    
    describe('Será validado que é possível cadastrar um usuário admin', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .post('/users/admin')
                .set({ authorization: login.body.token })
                .send(new_admin);
        });
    
        it('Retorno esperado - 201', () => {
            expect(response).to.have.status(201);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Object esperado - user ', () => {
            expect(response.body).to.have.property('user');
        });

        it('Conteúdo do user esperado - name, email, role, _id', () => {
            expect(response.body.user).to.have.all.keys('name', 'email', 'role', '_id');
        });

        it('Conteúdo do name e email esperados', () => {
            expect(response.body.user.name).to.be.equal(new_admin.name);
            expect(response.body.user.email).to.be.equal(new_admin.email);
        });

        it('Conteúdo do role esperado - admin', () => {
            expect(response.body.user.role).to.be.equal(roles.user.admin);
        });
    });

    describe('Será validado que não é possível cadastrar um usuário admin, sem estar autenticado como um usuário admin', () => {
        let response;
        let new_login;

        before(async () =>  {
            await connect.collection('users').insertOne(valid_user);
            new_login = await chai.request(app)
                .post('/login')
                .send(login_successfully);

            response = await chai.request(app)
                .post('/users/admin')
                .set({ authorization: new_login.body.token })
                .send({
                    name: new_admin.name,
                    email: `${new_admin.email}${'m'}`,
                    password: new_admin.password
                });
        });
    
        it('Retorno esperado - 403', () => {
            expect(response).to.have.status(403);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals(FORBIDDEN_ACCESS_STATUS.err.message);
        });
    });
});