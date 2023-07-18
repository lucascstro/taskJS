const Usuarios = require('../database/usuarios');
const jwt = require('jsonwebtoken');
const jwtSecret = 'segredo';


const UsuarioControllers =
{
    usuarios: async (res) => {
        try {
            var retUsuarios = await Usuarios.findAll();
            console.log(retUsuarios);
            if (retUsuarios.length > 0)
                res.status(200).send(todosUsuarios);

        } catch (error) {
            res.status(400).json({ Mensagem: error });
        }
    },
    criarUsuario: async (req, res) => {
        try {
            var {
                user,
                nomeUsuario,
                email,
                password
            } = req.body;

            if (user == '' || user == undefined || user == null ||
                nomeUsuario == '' || nomeUsuario == undefined || nomeUsuario == null ||
                email == '' || email == undefined || email == null ||
                password == '' || password == undefined || password == null
            ) {
                res.status(400).json({ Mensagem: "Todos os campos precisam ser preenchidos!" });
                return;
            }

            var retUsuario = await Usuarios.findAll({
                where: {
                    [Op.or]: [
                        { user: user },
                        { email: email },
                        { nomeUsuario: nomeUsuario }
                    ]
                }
            });

            if (retUsuario) {
                console.log(retUsuario);
                if (retUsuario.length >= 1) {
                    res.status(200).json({ Mensagem: "Usuário já cadastrado!" });
                    return;
                }
                else {
                    var retUsuarioCriado = await Usuarios.create({
                        user: user,
                        nomeUsuario, nomeUsuario,
                        email: email,
                        password: password,
                        ultimoLogin: null,
                        logado: false,
                    });

                    if (retUsuarioCriado) {
                        res.status(200).json({ Mensagem: "Cadastro Realizado." });
                        return;
                    }
                }
            };
        } catch (error) {
            res.status(400).json({ Mensagem: 'Erro ao tentar realizar cadastro do usuário. Erro:' + error });
            return;
        }
    },
    logon: async (req, res) => {
        try {
            var {
                user,
                password
            } = req.body;

            if (user == undefined || user == '' || user == null ||
                password == undefined || password == '' || password == null) {
                res.status(400).send('Preencha todos os campos');
                return
            }
            else {
                var retUsuario = await Usuarios.findOne({
                    where: { user: 'Lucas Castro', password: 'abcd123' }
                });

                if (retUsuario != undefined && retUsuario != null) {
                    var retJwt = jwt.sign({ id: retUsuario.id, email: retUsuario.email }, jwtSecret, { expiresIn: '2d' });

                    var retLogin = await Usuarios.update({
                        ultimoLogin: new Date().toLocaleString(),
                        logado: true,
                        tokenLogin: retJwt,
                    }, { where: { id: retUsuario.id } });


                    if (retLogin !== undefined && retLogin !== null) {
                        res.status(200).json({
                            nomeUsuario: retUsuario.nomeUsuario,
                            idUsuario: retUsuario.id,
                            token: retJwt
                        });
                        return;
                    }
                }
            };
        } catch (error) {
            res.statusCode(400).send({ Error: 'Erro ao tentar realizar o login.' + error });
            return;
        }
    },
    logout: async (req, res) => {
        try {
            var {
                user
            } = req.body;

            if (user == undefined || user == '' || user == null) {
                res.send('Preencha todos os campos');
                res.statusCode = 400;
                return;
            }
            else {
                var retUsuario = Usuarios.findOne({
                    where: { user: user }
                });

                if (retUsuario) {
                    if (retUsuario !== null) {

                        var retUpdate = Usuarios.update({
                            ultimoLogin: new Date().toLocaleString(),
                            logado: false,
                            tokenLogin: retToken
                        },
                            { where: { id: retUsuario.id } });
                        if (retUpdate) {
                            res.send({ Mensagem: 'Logout realizado' }).statusCode = 200;
                            return;
                        };
                    } else {
                        res.json({ Mensagem: 'Usuário não localizado' }).statusCode = 200;
                        return;
                    }
                }
            }
        } catch (error) {
            res.Json({ err: error }).statusCode = 400;

        }
    }
}

module.exports = UsuarioControllers;

