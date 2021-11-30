const app = require("../../api/app");

const { MongoClient } = require('mongodb');
const connection = require("../../api/models/connection");

const { valid_user } = require('../fixtures/user.mock.json');
const { login_successfully } = require('../fixtures/login.mock.json');
const { valid_recipe, update_recipe } = require('../fixtures/recipe.mock.json');

const { 
    MISSING_AUTH_TOKEN,
    MALFORMED_TOKEN_JWT,
} = require('../../api/helpers');

const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiHttp);

describe('Edição de uma receita - PUT /recipes', () => {
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

    describe('Será validado que é possível editar receita estando autenticado', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .put(`/recipes/${recipe.body.recipe._id}`)
                .set({ authorization: login.body.token })
                .send(update_recipe);
        });
    
        it('Retorno esperado - 200', () => {
            expect(response).to.have.status(200);
        });

        it('Retorno esperado - object', () => {
            expect(response.body).to.be.an('object');
        });

        it('Object esperado - name, ingredients, preparation, userId, _id', () => {
            expect(response.body).to.have.all
                .keys('name', 'ingredients', 'preparation', 'userId', '_id');
        });
    });

    describe('Será validado que não é possível editar receita sem estar autenticado', () => {
        let response;

        before(async () =>  {
            response = await chai.request(app)
                .put(`/recipes/${recipe.body.recipe._id}`)
                .send(update_recipe);
        });
    
        it('Retorno esperado - 401', () => {
            expect(response).to.have.status(401);
        });

        it('Retorno esperado - object', () => {
            expect(response.body).to.be.an('object');
        });

        it('Object esperado - message', () => {
            expect(response.body).to.be.property('message');
        });

        it('Message esperada', () => {
            expect(response.body.message).to.be.equal(MISSING_AUTH_TOKEN.err.message);
        });
    });

    describe('Será validado que não é possível editar receita com token inválido', () => {
        let response;
        let login_new;

        before(async () =>  {
            await connect.collection('users')
                .insertOne({
                    name: valid_user.name,
                    email: `${valid_user.email}${'m'}`,
                    password: valid_user.password
                });

            login_new = await chai.request(app)
                .post('/login')
                .send({ 
                    email: `${valid_user.email}${'m'}`,
                    password: valid_user.password
                });

            recipe = await chai.request(app)
                .post('/recipes')
                .set({ authorization: login.body.token })
                .send(valid_recipe);

            response = await chai.request(app)
                .put(`/recipes/${recipe.body.recipe._id}`)
                .set({ authorization: login_new.body.token })
                .send();
        });
    
        it('Retorno esperado - 401', () => {
            expect(response).to.have.status(401);
        });

        it('Retorno esperado - object', () => {
            expect(response.body).to.be.an('object');
        });

        it('Object esperado - message', () => {
            expect(response.body).to.be.property('message');
        });

        it('Message esperada', () => {
            expect(response.body.message).to.be.equal(MALFORMED_TOKEN_JWT.err.message);
        });
    });
});