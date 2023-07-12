const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js']; // Substitua pelo caminho correto para o arquivo com as rotas da sua API

const doc = {
  info: {
    title: 'Task Api',
    description: 'Minha api teste',
    version: '1.0.0',
  },
  host: '/localhost:5500', // Substitua pelo host correto da sua API
  basePath: '/',
  schemes: ['http'],
};
swaggerAutogen(outputFile, endpointsFiles, doc);
