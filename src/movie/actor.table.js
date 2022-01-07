const {DataTypes} = require("sequelize");
const sequelize = require("../db/connection");
const Movie = require("../movie/movie.table");

const Actor= sequelize.define('Actor',{
    name: {
        type: DataTypes.STRING,
        },
    wikipedia: {
        type: DataTypes.STRING,
    }
});

module.exports =  Actor;