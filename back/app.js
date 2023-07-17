const connection = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

const taskRouter = require('./routes/task.js');
const usersRouter = require('./routes/user.js');

//const { auth } = require('express-oauth2-jwt-bearer');

//inicia base de dados
connection
  .authenticate()
  .catch((err) => {
    console.log("Erro ao conectar e autenticar a base de dados. Erro: " + err);
  });

const app = express();
app.use(cors());
//app.use(auth());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/tasks", taskRouter);
app.use("/users", usersRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.listen(5500, () => {
  console.log("----Api inicializada em " + new Date(Date.now()).toLocaleString() + " ---");
});