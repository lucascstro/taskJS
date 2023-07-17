const Usuarios = require('../database/usuarios');
const jwt = require('jsonwebtoken');
const jwtSecret = 'segredo';


const UsuarioControllers =
{
    //busca todos usuarios
    usuario: async (res) => {
        try {
            var todosUsuarios = await Usuarios.findAll();
            res.send(todosUsuarios);
            res.statusCode = 200;
        } catch (error) {
            res.send(error);
        }
    },
    //criacao de usuario
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
                res.statusCode = 400;
                res.send("Todos os campos precisam ser preenchidos!");
                return;
            }

            Usuarios.findAll({
                where: {
                    [Op.or]: [
                        { user: user },
                        { email: email },
                        { nomeUsuario: nomeUsuario }
                    ]
                }
            }).then((value) => {
                console.log('aaa' + value)
                if (value.length >= 1) {
                    res.statusCode = 200;
                    res.send("Usuário já cadastrado!");
                    return;
                }
                else {
                    Usuarios.create({
                        user: user,
                        nomeUsuario, nomeUsuario,
                        email: email,
                        password: password,
                        ultimoLogin: null,
                        logado: false,
                    }).then(() => {
                        res.statusCode = 200;
                        res.send("Cadastro Realizado!");
                        return;
                    }).catch((error) => {
                        res.statusCode = 400;
                        res.send("Erro ao cadastrar usuário!");
                        return;
                    });
                }
            }).catch((error) => {
                res.statusCode = 400;
                res.send("Erro ao consultar Usuário!");
                return;
            });
        } catch (error) {
            res.statusCode = 400;
            res.send(error);
            return;
        }
    },
    //login
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
                    console.log('-----> Token gerado:' + retJwt);
                    console.log('-----> Update - Logar usuário');

                    var retLogin = await Usuarios.update({
                        ultimoLogin: new Date().toLocaleString(),
                        logado: true,
                        tokenLogin: retJwt,
                    }, { where: { id: retUsuario.id } });

                    console.log('-----> update ok');

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
    //logout
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
                Usuarios.findOne({
                    where: { user: user }
                }).then((retUsuario) => {
                    console.log(retUsuario);
                    if (retUsuario !== null) {

                        Usuarios.update({
                            ultimoLogin: new Date().toLocaleString(),
                            logado: false,
                            tokenLogin: retToken
                        },
                            { where: { id: retUsuario.id } })
                            .then(() => {
                                res.send('Logout feito');
                                res.statusCode = 200;
                                return;
                            })
                    } else {
                        res.send('Usuário não localizado');
                        res.statusCode = 200;
                        return;
                    }
                })
            }
        } catch (error) {
            res.send(error);
            res.statusCode = 400;

        }
    }
}

module.exports = UsuarioControllers;

