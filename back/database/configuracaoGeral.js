const Sequelize = require("sequelize");
const connection = require("../config/database");
const configuracaoGeral = connection.define("configuracaoGeral", {
    ultimoACesso: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

configuracaoGeral.sync({ force: false })
    .then(() => {
        console.log("Sincronização realizada - Configuracão Geral");
    })
    .catch(() => {
        console.log("Falha ao realizar sincronização.");
    })

module.exports = configuracaoGeral;