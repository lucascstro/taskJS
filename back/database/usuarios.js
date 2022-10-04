const Sequelize = require("sequelize");
const connection = require("./database");
const Usuarios = connection.define("usuarios", {
    user: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    ultimoLogin: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    logado: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

Usuarios.sync({ force: false })
    .then(() => {
        console.log("Sincronização realizada - Usuarios");
    })
    .catch(() => {

        console.log("Falha ao realizar sincronização.");
    })
module.exports = Usuarios;