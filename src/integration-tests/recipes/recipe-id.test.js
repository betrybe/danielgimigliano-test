const app = require("../../api/app");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const { valid_user } = require('../fixtures/user.mock.json');
const { login_successfully } = require('../fixtures/login.mock.json');
const { valid_recipe } = require('../fixtures/recipe.mock.json');

const { 
    RECIPE_NOT_FOUND,
} = require('../../api/helpers');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Buscar uma receita - GET /recipes', () => {
    let connect;
    let login;
    let recipe;
    
    before(async () =>  {
        connect = await connection();
        sinon.stub(MongoClient, 'connect').resolves(connect);

        await connect.collection('users').insertOne(valid_user);
        login = await chai.request(app)
            .post('/login')
            .send(login_successfully);
        
        recipe = await chai.request(app)
            .post('/recipes')
            .set({ authorization: login.body.token })
            .send(valid_recipe);
    });

    after(async () => {
        await connect.collection('users').deleteMany({});
        await connect.collection('recipes').deleteMany({});
        MongoClient.connect.restore();
    });

    describe('Será validado que é possível listar uma receita específica', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .get(`/recipes/${recipe.body.recipe._id}`)
                .send();
        });
    
        it('Retorno esperado - 200', () => {
            expect(response).to.have.status(200);
        });

        it('Retorno esperado - object', () => {
            expect(response.body).to.be.an('object');
        });

        it('Object deve conter - name, ingredients, preparation, userId, _id', () => {
            expect(response.body).to.have.all
                .keys('name', 'ingredients', 'preparation', 'userId', '_id');
        });
    });

    describe('Será validado que não é possível listar uma receita que não existe', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .get(`/recipes/${recipe.body.recipe._id}${'test'}`)
                .send();
        });
    
        it('Retorno esperado - 404', () => {
            expect(response).to.have.status(404);
        });

        it('Retorno esperado - object', () => {
            expect(response.body).to.be.an('object');
        });

        it('Object esperado - message', () => {
            expect(response.body).to.be.property('message');
        });

        it('Message esperada', () => {
            expect(response.body.message).to.be.equal(RECIPE_NOT_FOUND.err.message);
        });
    });
});