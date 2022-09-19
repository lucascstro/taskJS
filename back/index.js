const connection = require("./database/database");
const Task = require("./database/Task");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const Op = require("sequelize").Op;
const EnumStatus = require("./enum/enum");

//inicia base de dados
connection.authenticate().catch((err) => {
  console.log("Erro ao conectar a base de dados. Erro: " + err);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//api
//lista todas as tasks existentes
app.get("/tasks", (req, res) => {
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
});

//pega uma unica task
app.get("/task/:id", async (req, res) => {
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
});

//pega os stats
app.get("/tasks/status", async (req, res) => {
  try {
    var retStatus = [
      { "id": "1", "status": "cadastro" },
      { "id": "2", "status": "emExecucao" },
      { "id": "3", "status": "finalizado" },
      { "id": "4", "status": "emAtraso" },
      { "id": "5", "status": "cancelado" }
    ];
    res.json(retStatus);
    res.statusCode = 200;

  } catch (error) {
    res.send("Falha ao tentar recuperar os dados da task. Erro: " + error);
  }
});

//Criar uma task
app.post("/task", (req, res) => {
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
});

//Atualiza uma task criada
app.put("/task", (req, res) => {
  try {
    var {
      id: id,
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
    res.send("Falha ao tentar atualizar a nova task. Erro: " + erro);
  }
});

//deleta uma tabela
app.delete("/task/:id", (req, res) => {
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
});

//pegar somente as tarefas pendentes
app.get("/tasks/pendentes", async (req, res) => {
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
});

//pegar somente as tarefas nao finalizadas
app.get("/tasks/naofinalizadas", async (req, res) => {
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
});

//pegar somente as tarefas em execucao
app.get("/tasks/emExecucao", async (req, res) => {
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
});

//pegar somente as tarefas finalizadas
app.get("/tasks/finalizadas", async (req, res) => {
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
});

//pegas somente as tarefas em atraso
app.get("/tasks/emAtraso", async (req, res) => {
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
});

//pegas somente as tarefas em canceladas
app.get("/tasks/canceladas", async (req, res) => {
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
});

//alterar estado de uma tarefa
app.post("/task/alterarStatus/:id/:status", async (req, res) => {
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
      console.log(ret);
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
});

//rota api teste
app.get("/tasks/ping", async (req, res) => {
  try {
    res.statusCode = 200;
  } catch (erro) {
    res.send(erro);
  }
});

app.listen(5500, () => {
  console.log("----Api inicializada---");
});
