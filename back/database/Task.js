const Sequelize = require("sequelize");
const connection = require("./database");

const Taks = connection.define("tasks", {

    titulo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dataCadastro: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dataFinalizada: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    dataMaximaExecutar: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dataUltimaAlteracao: {
        type: Sequelize.TEXT,
        allowNull: false
    },
});

Taks.sync({ force: false })
    .then(() => {
        console.log("Sincronização realizada - Task");
    })
    .catch(() => {

        console.log("Falha ao realizar sincronização.");
    })

module.exports = Taks;