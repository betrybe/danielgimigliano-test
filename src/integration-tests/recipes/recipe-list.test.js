const app = require("../../api/app");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const { valid_user } = require('../fixtures/user.mock.json');
const { login_successfully } = require('../fixtures/login.mock.json');
const { valid_recipe } = require('../fixtures/recipe.mock.json');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Listagem de receita - GET /recipes', () => {
    let connect;
    let login;
    
    before(async () =>  {
        connect = await connection();
        sinon.stub(MongoClient, 'connect').resolves(connect);

        await connect.collection('users').insertOne(valid_user);
        login = await chai.request(app)
            .post('/login')
            .send(login_successfully);
        
        await chai.request(app)
            .post('/recipes')
            .set({ authorization: login.body.token })
            .send(valid_recipe);
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
                .get('/recipes')
                .send();
        });
    
        it('Retorno esperado - 200', () => {
            expect(response).to.have.status(200);
        });

        it('Retorno esperado - array', () => {
            expect(response.body).to.be.an('array');
        });

        it('Array deve conter - name, ingredients, preparation, userId, _id', () => {
            expect(response.body[0]).to.have.all
                .keys('name', 'ingredients', 'preparation', 'userId', '_id');
        });

        it('Conteúdo esperado', () => {
            expect(response.body[0].name).to.be.equal(valid_recipe.name);
            expect(response.body[0].ingredients).to.be.equal(valid_recipe.ingredients);
            expect(response.body[0].preparation).to.be.equal(valid_recipe.preparation);
        });
    });

    describe('Será validado que é possível buscar uma lista de receitas vazia e com token', () => {
        let response;

        before(async () =>  {
            await connect.collection('recipes').deleteMany({});
            response = await chai.request(app)
                .get('/recipes')
                .set({ authorization: login.body.token })
                .send();
        });
    
        it('Retorno esperado - 200', () => {
            expect(response).to.have.status(200);
        });

        it('Retorno esperado - array', () => {
            expect(response.body).to.be.an('array');
        });

        it('Array deve estar vazia', () => {
            expect(response.body).to.be.empty;
        });
    });
});