const connection = require("./database/database");
const Task = require("./database/Task");
const configuracaoGeral = require("./database/configuracaoGeral");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const { auth, requireScopes } = require("express-oauth2-jwt-bearer");

const EnumStatus = require("./enum/enum");
const Usuarios = require("./database/usuarios");
const { Op } = require('sequelize');
const e = require("cors");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

//inicia base de dados
connection.authenticate().catch((err) => {
  console.log("Erro ao conectar a base de dados. Erro: " + err);
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
  definition:{
    openapi:'3.0.0',
    info: {
      title: 'Tasks Api',
      version: '1.0.0'
    }
  },
  apis:['./app.js']
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const checkJwt = auth({ audience: 'taskApi', issuerBaseURL: "http://localhost:5500" });

//api
app.get("/tasks/online", (req, res) => {
  try {
    res.sendStatus(200);
  } catch (error) {
    res.send("Falha ao tentar recuperar as tasks. Erro: " + error);
  }
});

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

//pega os status
app.get("/tasks/status", async (req, res) => {
  try {
    var retStatus = [
      { "id": "1", "status": "Cadastrada" },
      { "id": "2", "status": "Em execução" },
      { "id": "3", "status": "Finalizada" },
      { "id": "4", "status": "Atrasada" },
      { "id": "5", "status": "Cancelada" }
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
app.post("/task/atualizar", (req, res) => {
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
});

//deleta uma task
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

//deleta uma task
app.post("/task/cancelar/:id", (req, res) => {
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
});

//pegar somente as tarefas pendentes - a fazer
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

//pegar somente as tarefas em execucao - fazendo
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

//pegar somente as tarefas finalizadas - feitas
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

app.get("/usuario", async (req, res) => {
  try {
    var todosUsuarios = await Usuarios.findAll();
    res.send(todosUsuarios);
    res.statusCode = 200;
  } catch (error) {
    res.send(error);
  }
});

//criacao de usuario
app.post("/usuario/criarUsuario", async (req, res) => {
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
});

app.post("/usuario/logon", async (req, res) => {
  try {
    var {
      user,
      password
    } = req.body;

    if (user == undefined || user == '' || user == null ||
      password == undefined || password == '' || password == null) {
      res.send('Preencha todos os campos');
      res.statusCode = 400;
      return
    }
    else {
      Usuarios.findOne({
        where: { user: 'Lucas Castro', password: 'abcd123' }
      }).then((retUsuario) => {
        if (retUsuario != undefined && retUsuario != null && retUsuario != '') {
          Usuarios.update({
            ultimoLogin: new Date().toLocaleString(),
            logado: true
          },
            { where: { id: retUsuario.id } })
            .then(() => {
              res.send(200).json({
                'nomeUsuario': retUsuario.nomeUsuario,
                'idUsuario': retUsuario.id
              });
              return
            }).catch((erro) => {
              res.send(erro);
              return
            })
        }
        else {
          res.send('Usuário ou senha invválido!');
          res.statusCode = 401;
          return
        }
      })
    }
  } catch (error) {
    res.send(error);
    res.statusCode = 400;
  }
});

app.post("/usuario/logout", async (req, res) => {
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
            logado: false
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
});

//rota api teste
app.get("/Settings/ping", async (req, res) => {
  try {
    res.statusCode = 200;
  } catch (erro) {
    res.send(erro);
  }
});

//Api Info
app.get("/Settings/details", async (req, res) => {
  try {
    res.json({
      "Version": "1.0.2",
      "Manager": "Lucas Castro",
      "Contact": {
        "Email": "lukas.castro@live.com",
        "numberPhone": "+55 11 958541024"
      },
      "Descrition": " Api descrição"
    });
    res.statusCode = 200;
  } catch (erro) {
    res.send(erro);
  }
});

app.listen(5500, () => {
  console.log("----Api inicializada em " + new Date(Date.now()).toLocaleString() + " ---");
}); 