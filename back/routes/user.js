const express = require('express');
const usuariosController = require('../controllers/userController');
const autenticacao = require('../middlewares/autenticacao');

const router = express.Router();

router.get('/obterUsuarios', autenticacao.validacaoToken,usuariosController.usuario);
router.post('/criarUsuario', autenticacao.validacaoToken,usuariosController.criarUsuario);
router.post('/login',usuariosController.logon);
router.post('/logout', autenticacao.validacaoToken,usuariosController.logout);

module.exports = router;