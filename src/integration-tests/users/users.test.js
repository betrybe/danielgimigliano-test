const app = require("../../api/app");
const { valid_user } = require('../fixtures/user.mock.json');

const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe('Cadastro de usuário', () => {
    it('Será validado que é possível cadastrar usuário com sucesso', () => {
        chai.request(app)
            .post('/users')
            .send(valid_user)
            .end((err, res) => {
                chai.assert.isNull(err);
                chai.assert.isNotEmpty(res);
                res.should.have.status(200);
                done();
            });
    });
});