const Task = require('../database/task');

const TaskController = {
    //obter uma lista com todas as tasks
    tasks: (req, res) => {
        try {
            Task.findAll({ raw: true, order: [["dataCadastro", "desc"]] })
                .then((data) => {
                    res.json(data);
                    res.statusCode = 200;
                })
                .catch((error) => {
                    res.send(error);
                });
        } catch (error) {
            res.send("Falha ao tentar recuperar as tasks. Erro: " + error);
        }
    },
    //obter uma unica task parametro id
    task: async (req, res) => {
        try {
            if (isNaN(req.params.id)) {
                res.sendStatus(400);
            } else {
                var id = parseInt(req.params.id);
                var retTask = await Task.findOne({ where: { id: id } });
                {
                    if (retTask == undefined) {
                        res.sendStatus(404);
                    } else {
                        res.json(retTask);
                        res.statusCode = 200;
                    }
                }
            }
        } catch (error) {
            res.send("Falha ao tentar recuperar os dados da task. Erro: " + error);
        }
    },
    //Criar uma task
    NovaTask: (req, res) => {
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

            Task.create({
                titulo: titulo,
                descricao: descricao,
                status: status,
                dataCadastro: dataCadastro,
                dataFinalizada: dataFinalizada,
                dataMaximaExecutar: dataMaximaExecutar,
                dataUltimaAlteracao: dataUltimaAlteracao,
            })
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((error) => {
                    res.send(error);
                });
        } catch (erro) {
            res.send("Falha ao tentar criar a nova task. Erro: " + erro);
        }
    },
    //Atualiza uma task criada
    atualizar: (req, res) => {
        console.log('atualizar')
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

            Task.update(
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
            )
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((error) => {
                    res.send(error);
                });
        } catch (erro) {
            console.log('catch erro')
            res.send("Falha ao tentar atualizar a nova task. Erro: " + erro);
        }
    },
    //alterar estado de uma tarefa
    // app.post("/task/alterarStatus/:id/:status", async (req, res) => {
    alterarStatus: async (req, res) => {
        try {
            if (!isNaN(req.params.id)) {
                var id = req.params.id;
                var status = req.params.status;
                var objeto = {};

                if (status == EnumStatus.finalizado) {
                    objeto = {
                        status: EnumStatus.finalizado,
                        dataFinalizada: new Date().toLocaleString(),
                        dataUltimaAlteracao: new Date().toLocaleString(),
                    };
                } else {
                    objeto = {
                        status: status,
                        dataUltimaAlteracao: new Date().toLocaleString(),
                    };
                }

                var ret = await Task.update(objeto, {
                    where: { id: id },
                });
                if (ret != undefined) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.sendStatus(400);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //pegar somente as tarefas pendentes - a fazer
    pendentes: async (res) => {
        try {
            var ret = await Task.findAll({
                where: { status: "1" },
                order: [["ID", "DESC"]],
            });

            if (ret != undefined) {
                res.json(ret);
                res.statusCode = 200;
            } else {
                res.sendStatus(404);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //pegar somente as tarefas nao finalizadas
    naofinalizadas: async (req, res) => {
        try {
            var ret = await Task.findAll({
                where: { status: "2" },
                order: [["ID", "DESC"]],
            });

            if (ret != undefined) {
                res.json(ret);
                res.statusCode = 200;
            } else {
                res.sendStatus(404);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //pegar somente as tarefas em execucao - fazendo
    emExecucao: async (req, res) => {
        try {
            var ret = await Task.findAll({
                where: { status: "2" },
                order: [["ID", "DESC"]],
            });

            if (ret != undefined) {
                res.json(ret);
                res.statusCode = 200;
            } else {
                res.sendStatus(404);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //pegar somente as tarefas finalizadas - feitas
    finalizadas: async (req, res) => {
        try {
            var ret = await Task.findAll({
                where: { status: "3" },
                order: [["ID", "DESC"]],
            });

            if (ret != undefined) {
                res.json(ret);
                res.statusCode = 200;
            } else {
                res.sendStatus(404);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //pegas somente as tarefas em atraso
    emAtraso: async (req, res) => {
        try {
            var ret = await Task.findAll({
                where: { status: "4" },
                order: [["ID", "DESC"]],
            });

            if (ret != undefined) {
                res.json(ret);
                res.statusCode = 200;
            } else {
                res.sendStatus(404);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //pegas somente as tarefas em canceladas
    canceladas: async (req, res) => {
        try {
            var ret = await Task.findAll({
                where: { status: "5" },
                order: [["ID", "DESC"]],
            });

            if (ret != undefined) {
                res.json(ret);
                res.statusCode = 200;
            } else {
                res.sendStatus(404);
            }
        } catch (erro) {
            res.send(erro);
        }
    },
    //deleta uma task parametro id
    deletarTask: (req, res) => {
        try {
            if (isNaN(req.params.id)) {
                res.sendStatus(400);
            } else {
                var id = parseInt(req.params.id);
                Task.destroy({ where: { id: id } })
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch((error) => {
                        res.send(error);
                    });
            }
        } catch (error) {
            res.send("Falha ao tentar recuperar as task. Erro: " + error);
        }
    },
    //cancela uma task
    cancelar: (req, res) => {
        try {
            var {
                id,
                status,
                dataFinalizada,
                dataUltimaAlteracao,
            } = req.body;

            Task.update(
                {
                    status: status,
                    dataFinalizada: dataFinalizada,
                    dataUltimaAlteracao: dataUltimaAlteracao,
                },
                { where: { id: id } }
            )
                .then(() => {
                    res.sendStatus(200);
                })
                .catch((error) => {
                    res.send(error);
                });
        } catch (erro) {
            res.send("Falha ao tentar atualizar a nova task. Erro: " + erro);
        }
    }
}

module.exports = TaskController;