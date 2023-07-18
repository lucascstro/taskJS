const Task = require('../database/task');
const EnumStatus = require('../enum/enum');

const taskController = {
    //obter uma lista com todas as tasks
    tasks: (res) => {
        try {
            var retNovaTask = Task.findAll({ raw: true, order: [["dataCadastro", "desc"]] });
            if (retNovaTask)
                res.status(200).json(data);
            else
                res.status(500).json({ Mensagem: 'Falha ao tentar obter as tarefa' });

        } catch (error) {
            res.status(500).send({ Mensagem: "Falha ao tentar recuperar as tasks. Erro: " + error });
        }
    },
    //obter uma unica task parametro id
    task: async (req, res) => {
        try {
            if (isNaN(req.params.id))
                res.status(500).json({ Mensagem: 'É necessário informar o id da tarefa selecionada.' });
            else {
                var id = parseInt(req.params.id);
                var retTask = await Task.findOne({ where: { id: id } });

                if (retTask === undefined)
                    res.status(500).json({ Mensagem: 'Não foi localizada nenhuma tarefa.' });
                else
                    res.status(200).json(retTask);

            }
        } catch (error) {
            res.status(500).json({ Mensagem: "Falha ao tentar recuperar os dados da task. Erro: " + error });
        }
    },
    novaTask: async (req, res) => {
        try {
            var {
                titulo,
                descricao,
                status,
                dataCadastro,
                dataFinalizada,
                dataMaximaExecutar,
                dataUltimaAlteracao,
            } = req.body;

            var retTask = await Task.create({
                titulo: titulo,
                descricao: descricao,
                status: status,
                dataCadastro: dataCadastro,
                dataFinalizada: dataFinalizada,
                dataMaximaExecutar: dataMaximaExecutar,
                dataUltimaAlteracao: dataUltimaAlteracao,
            });

            if (retTask)
                res.status(200).json({ Mensagem: 'Tarefa criada.' });
            else
                res.status(500).json({ Mensagem: 'Erro ao criar tarefa.' });

        } catch (erro) {
            res.status(500).json({ Mensagem: 'Erro ao criar tarefa. Erro: ' + erro });
        }
    },
    //atualiza uma task criada
    atualizarTask: (req, res) => {
        try {
            var {
                id,
                titulo,
                descricao,
                status,
                dataCadastro,
                dataFinalizada,
                dataMaximaExecutar,
                dataUltimaAlteracao,
            } = req.body;

            var retTaskUpdate = Task.update(
                {
                    titulo: titulo,
                    descricao: descricao,
                    status: status,
                    dataCadastro: dataCadastro,
                    dataFinalizada: dataFinalizada,
                    dataMaximaExecutar: dataMaximaExecutar,
                    dataUltimaAlteracao: dataUltimaAlteracao,
                },
                { where: { id: id } }
            );
            if (retTaskUpdate)
                res.status(200).json(retTaskUpdate);
            else
                res.status(500).send(error);

        } catch (erro) {
            res.status(500).send("Falha ao tentar atualizar a nova task. Erro: " + erro);
        }
    },
    //alterar estado de uma tarefa
    alterarStatus: async (req, res) => {
        try {
            if (!isNaN(req.params.id)) {
                var id = req.params.id;
                var status = req.params.status;
                var task = {};

                if (status == EnumStatus.finalizado) {
                    task = {
                        status: EnumStatus.finalizado,
                        dataFinalizada: new Date().toLocaleString(),
                        dataUltimaAlteracao: new Date().toLocaleString(),
                    };
                } else {
                    task = {
                        status: status,
                        dataUltimaAlteracao: new Date().toLocaleString(),
                    };
                }

                var retUpdate = await Task.update(task, {
                    where: { id: id },
                });

                if (retUpdate !== undefined)
                    res.status(200).json(retUpdate);
                else
                    res.status(400).json({ Mensagem: 'Falha ao tentar fazer upload' });

            } else
                res.status(400).json({ Mensagem: 'É necessário informar todos os parametros' });

        } catch (erro) {
            res.status(500);
        }
    },
    //pegar somente as tarefas pendentes
    pendentes: async (res) => {
        try {
            var retPendentes = await Task.findAll({
                where: { status: "1" },
                order: [["ID", "DESC"]],
            });

            if (retPendentes !== undefined)
                res.status(200).json(retPendentes);
            else
                res.status(500);

        } catch (erro) {
            res.status(400).json({ Mensagem: erro });
        }
    },
    //pegar somente as tarefas nao finalizadas
    naoFinalizadas: async (res) => {
        try {
            var retNaoFinalizadas = await Task.findAll({
                where: { status: "2" },
                order: [["ID", "DESC"]],
            });

            if (retNaoFinalizadas !== undefined)
                res.status(200).json(retNaoFinalizadas);
            else
                res.status(500).json({ Mensagem: 'Falha ao buscar tarefas não finalizadas' });

        } catch (erro) {
            res.status(400).send(erro);
        }
    },
    //pegar somente as tarefas em execucao - fazendo
    emExecucao: async (req, res) => {
        try {
            var retTaskEmExecucao = await Task.findAll({
                where: { status: "2" },
                order: [["ID", "DESC"]],
            });

            if (retTaskEmExecucao !== undefined)
                res.status(200).json(retTaskEmExecucao);
            else
                res.Status(404).json({ Mensagem: 'Falha ao buscar tarefas em execução' });

        } catch (erro) {
            res.status(4000).json(erro);
        }
    },
    //pegar somente as tarefas finalizadas - feitas
    finalizadas: async (req, res) => {
        try {
            var retNaoFinalizadas = await Task.findAll({
                where: { status: "3" },
                order: [["ID", "DESC"]],
            });

            if (retNaoFinalizadas !== undefined)
                res.status(200).json(retNaoFinalizadas);
            else
                res.status(500).json({ Mensagem: 'Falha ao buscar tarefas não finalizadas' });

        } catch (erro) {
            res.status(400).json(erro);
        }
    },
    //pegas somente as tarefas em atraso
    emAtraso: async (req, res) => {
        try {
            var retTasksEmAtraso = await Task.findAll({
                where: { status: "4" },
                order: [["ID", "DESC"]],
            });

            if (retTasksEmAtraso !== undefined)
                res.status(200).json(retTasksEmAtraso);
            else
                res.status(500).json({ Mensagem: 'Falha ao buscar tarefas em atraso' });

        } catch (erro) {
            res.status(400).json(erro);
        }
    },
    //pegas somente as tarefas em canceladas
    canceladas: async (req, res) => {
        try {
            var retTasksCanceladas = await Task.findAll({
                where: { status: "5" },
                order: [["ID", "DESC"]],
            });

            if (retTasksCanceladas !== undefined)
                res.status(200).json(retTasksCanceladas);
            else
                res.status(500).json({ Mensagem: 'Falha ao buscar tarefas canceladas' });

        } catch (erro) {
            res.status(400).send(erro);
        }
    },
    //deleta uma task parametro id
    deletarTask: async (req, res) => {
        try {
            if (isNaN(req.params.id))
                res.status(400).json({ Mensagem: 'É necessário informar o paramêtro' });
            else {
                var id = parseInt(req.params.id);
                var retTaskDeletada = await Task.destroy({ where: { id: id } });
                if (retTaskDeletada !== undefined)
                    res.status(200).json(retTaskDeletada);
                else
                    res.status(500).json({ Mensagem: 'Falha ao buscar tarefas deletadas' });
            }
        } catch (error) {
            res.status(400).json(error);
        }
    },
    //cancela uma task
    cancelar: async (req, res) => {
        try {
            var {
                id,
                dataUltimaAlteracao,
            } = req.body;

            var retUpdate = await Task.update(
                {
                    status: EnumStatus.Cancelada,
                    dataFinalizada: dataFinalizada,
                    dataUltimaAlteracao: dataUltimaAlteracao,
                },
                { where: { id: id } }
            );
            if (retUpdate !== undefined) {
                res.status(200).json(retUpdate);
            }
            else {
                res.status(500).json({ Mensagem: 'Falha ao buscar tarefas canceladas' });
            };
        } catch (erro) {
            res.status(400).json(erro);
        }
    }
}

module.exports = taskController;