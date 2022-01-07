const {Sequelize} = new require("sequelize");
require ("dotenv").config();

const sequelize = new Sequelize(process.env.MYSQL_URI);

sequelize.drop();