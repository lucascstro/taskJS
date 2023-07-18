const express = require('express');
const taskController = require('../controllers/TaskController');
const autenticacao = require('../middlewares/autenticacao');

const router = express.Router();

// Rota para obter uma listar de todas as tasks
router.get('/obterTasks', autenticacao.validacaoToken, taskController.tasks);

// Rota para obter uma única task
router.get('/:id',autenticacao.validacaoToken, taskController.task);

// Rota para obter uma lista de task em execucao
router.get('/',autenticacao.validacaoToken, taskController.emExecucao);

// Rota para obter uma lista de task em atraso
router.get('/',autenticacao.validacaoToken, taskController.emAtraso);

// Rota para obter uma lista de task pendentes
router.get('/', autenticacao.validacaoToken,taskController.pendentes);

// Rota para obter uma lista de task finalizadas
router.get('/',autenticacao.validacaoToken, taskController.finalizadas);

// Rota para obter uma lista de task não finalizadas
router.get('/',autenticacao.validacaoToken, taskController.naoFinalizadas);

// Rota para obter uma lista de task canceladas
router.get('/',autenticacao.validacaoToken, taskController.canceladas);

// Rota para criar uma task
router.post('/',autenticacao.validacaoToken, taskController.novaTask);

// Rota para atualizar uma de task 
router.put('/',autenticacao.validacaoToken, taskController.atualizarTask);

// Rota para alterar o status de uma task
router.put('/:id/:status', autenticacao.validacaoToken,taskController.alterarStatus);

// Rota para deletar uma task
router.delete('/:id',autenticacao.validacaoToken,taskController.deletarTask);

module.exports = router;