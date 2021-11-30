const app = require("../../api/app");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const {
    new_user,
    invalid_user,
} = require('../fixtures/user.mock.json');

const { 
    REQUEST_INVALID_ENTRIES,
    CONFLICT_EMAIL,
} = require('../../api/helpers');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Cadastro de usuário - POST /users', () => {
    let connect;
    
    before(async () =>  {
        connect = await connection();
        sinon.stub(MongoClient, 'connect').resolves(connect);
    });

    after(async () => {
        await connect.collection('users').deleteMany({});
        MongoClient.connect.restore();
    });
    
    describe('Será validado que é possível cadastrar usuário com sucesso', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .post('/users')
                .send(new_user);
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
            expect(response.body.user.name).to.be.equal(new_user.name);
            expect(response.body.user.email).to.be.equal(new_user.email);
        });

        it('Conteúdo do role esperado - user', () => {
            expect(response.body.user.role).to.be.equal('user');
        });
    });

    describe('Será validado quando algum campo não for preenchido - name, email, password', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .post('/users')
                .send(invalid_user);
        });
    
        it('Retorno esperado - 400', () => {
            expect(response).to.have.status(400);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals(REQUEST_INVALID_ENTRIES.err.message);
        });
    });

    describe('Será validado que o campo "email" é único', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .post('/users')
                .send(new_user);
        });
    
        it('Retorno esperado - 409', () => {
            expect(response).to.have.status(409);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals(CONFLICT_EMAIL.err.message);
        });
    });
});