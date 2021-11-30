const app = require("../../api/app");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const { valid_user } = require('../fixtures/user.mock.json');
const { 
    login_successfully, 
    missing_email, 
    missing_password,
    invalid_email,
    invalid_password,
} = require('../fixtures/login.mock.json');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Login do usuário - POST /login', () => {
    let connect;
    
    before(async () =>  {
        connect = await connection();
        sinon.stub(MongoClient, 'connect').resolves(connect);

        await connect.collection('users').insertOne(valid_user);
    });

    after(async () => {
        await connect.collection('users').deleteMany({});
        MongoClient.connect.restore();
    });
    
    describe('Será validado que é possível fazer login com sucesso', () => {
        let response;

        before(async () =>  {              
            response = await chai.request(app)
                .post('/login')
                .send(login_successfully);
        });
    
        it('Retorno esperado - 200', () => {
            expect(response).to.have.status(200);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - token', () => {
            expect(response.body).to.have.property('token');
        });
    });

    describe('Será validado que o campo "email" é obrigatório', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/login')
                .send(missing_email);
        });
    
        it('Retorno esperado - 401', () => {
            expect(response).to.have.status(401);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals('All fields must be filled');
        });
    });

    describe('Será validado que o campo "password" é obrigatório', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/login')
                .send(missing_password);
        });
    
        it('Retorno esperado - 401', () => {
            expect(response).to.have.status(401);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals('All fields must be filled');
        });
    });

    describe('Será validado que não é possível fazer login com um email inválido', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/login')
                .send(invalid_email);
        });
    
        it('Retorno esperado - 401', () => {
            expect(response).to.have.status(401);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals('Incorrect username or password');
        });
    });

    describe('Será validado que não é possível fazer login com uma senha inválida', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/login')
                .send(invalid_password);
        });
    
        it('Retorno esperado - 401', () => {
            expect(response).to.have.status(401);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Retorno esperado - message', () => {
            expect(response.body).to.have.property('message');
        });

        it('Retorno esperando a seguinte message', () => {
            expect(response.body.message).to.be.equals('Incorrect username or password');
        });
    });
});