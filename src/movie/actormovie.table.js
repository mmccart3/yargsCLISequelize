const {DataTypes} = require("sequelize");
const sequelize = require("../db/connection");
const Movie = require("../movie/movie.table");
const Actor = require("../movie/actor.table");

const ActorMovie = sequelize.define('ActorMovie', {
    MovieId: {
      type: DataTypes.INTEGER,
      references: {
        model: Movie, 
        key: 'id'
      }
    },
    ActorId: {
      type: DataTypes.INTEGER,
      references: {
        model: Actor, 
        key: 'id'
      }
    }
  });

Movie.belongsToMany(Actor, { through: ActorMovie });
Actor.belongsToMany(Movie, { through: ActorMovie });

module.exports =  ActorMovie;