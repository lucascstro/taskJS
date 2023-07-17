const jwtSecret = 'segredo';
const jwt = require('jsonwebtoken');

const autenticacao = {
    validacaoToken: async (req, res, next) => {
        const authToken = req.headers['authorization'];
        console.log('-----> Token completo:' + authToken);

        var bearer = authToken.split(' ');
        var token = bearer[1];
        console.log('-----> Token bearer:' + token);

        jwt.verify(token, jwtSecret, (err, data) => {

            console.log(err);

            if (err) {
                console.log('-----> erro'+ err );
                res.json({ token: authToken, erro: 'Erro na verificação do token: ' + err }).status(401);
                return;
            } else {
                console.log('-----> tudo certo');
                console.log(data);
                req.token = token;
                req.loggedUser = { id: data.id, nomeUsuario: data.nomeUsuario };
                next();
            }
        });
    },
}

module.exports = autenticacao;