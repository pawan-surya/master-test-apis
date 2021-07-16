const dbConfig = require("./db.config");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect   
})
sequelize.authenticate()
    .then(con => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => console.log('Unable to connect to the database:', err))

module.exports = sequelize;