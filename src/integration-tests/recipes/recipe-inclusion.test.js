const app = require("../../api/app");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const { valid_user } = require('../fixtures/user.mock.json');
const { login_successfully } = require('../fixtures/login.mock.json');
const { 
    valid_recipe,
    invalid_name,
    invalid_ingredients,
    invalid_preparation,
} = require('../fixtures/recipe.mock.json');

const { 
    REQUEST_INVALID_ENTRIES,
    MALFORMED_TOKEN_JWT,
} = require('../../api/helpers');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Inclusão de receita - POST /recipes', () => {
    let connect;
    let login;
    let token;
    
    before(async () =>  {
        connect = await connection();
        sinon.stub(MongoClient, 'connect').resolves(connect);

        await connect.collection('users').insertOne(valid_user);
        login = await chai.request(app)
            .post('/login')
            .send(login_successfully);
        token = login.body.token;
    });

    after(async () => {
        await connect.collection('users').deleteMany({});
        await connect.collection('recipes').deleteMany({});
        MongoClient.connect.restore();
    });


    describe('Será validado que é possível cadastrar uma receita com sucesso', () => {
        let response;

        before(async () =>  {          
            response = await chai.request(app)
                .post('/recipes')
                .set({ authorization: token })
                .send(valid_recipe);
        });
    
        it('Retorno esperado - 201', () => {
            expect(response).to.have.status(201);
        });

        it('Retorno esperado - object', () => {
            expect(response).to.be.an('object');
        });

        it('Object esperado - recipe', () => {
            expect(response.body).to.have.property('recipe');
        });

        it('Recipe deve conter - name, ingredients, preparation, userId, _id', () => {
            expect(response.body.recipe).to.have.all
                .keys('name', 'ingredients', 'preparation', 'userId', '_id');
        });
    });

    describe('Será validado que não é possível cadastrar receita sem o campo "name"', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/recipes')
                .set({ authorization: token })
                .send(invalid_name);
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

    describe('Será validado que não é possível cadastrar receita sem o campo "ingredients"', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/recipes')
                .set({ authorization: token })
                .send(invalid_ingredients);
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

    describe('Será validado que não é possível cadastrar receita sem o campo "preparation"', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/recipes')
                .set({ authorization: token })
                .send(invalid_preparation);
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

    describe('Será validado que não é possível cadastrar uma receita com token invalido', () => {
        let response;

        before(async () =>  {            
            response = await chai.request(app)
                .post('/recipes')
                .set({ authorization: login.body })
                .send(valid_recipe);
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
            expect(response.body.message).to.be.equals(MALFORMED_TOKEN_JWT.err.message);
        });
    });
});