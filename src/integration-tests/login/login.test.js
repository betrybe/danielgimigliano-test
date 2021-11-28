const app = require("../../api/app");
const { login_successfully } = require('../fixtures/login.mock.json');

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe('Login do usuário', () => {
    it('Será validado que é possível fazer login com sucesso', () => {
        chai.request(app)
            .post('/login')
            .send(login_successfully)
            .end((err, res) => {
                chai.assert.isNull(err);
                chai.assert.isNotEmpty(res);
                res.should.have.status(201);
                done();
            });
    });
});