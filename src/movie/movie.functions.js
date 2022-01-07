const Movie = require("../movie/movie.table");
const Actor = require("../movie/actor.table");
const ActorMovie = require("../movie/actormovie.table");
const sequelize = require("../db/connection");

exports.addMovie = async (movieObj) => {
    try {
        await Movie.sync();
        await Actor.sync();
        await ActorMovie.sync();
        // creates table if not created
        // console.log(movieObj.actor);
        let t = await sequelize.transaction();
        let newMovie = await Movie.create(movieObj,{t});
        // console.log(movieObj.actor);
        let newActor = await Actor.create(
            {name: movieObj.actor},{t});
        // console.log(newActor);
        let newActorMovie = await ActorMovie.create(
            {MovieId: newMovie.id,
            ActorId: newActor.id
            },{t});
        // console.log(newActorMovie);
        await t.commit();
        // console.log(myResults);
        console.log(`Succesfully added ${movieObj.title} and ${movieObj.actor} to the database`);
    } catch (error) {
        // if (error.errors[0].message) {
        //     console.log(`Unsuccesfull add. The error is message is: ${error.errors[0].message}`)
        //     // above code catches SQL error codes all other error codes get caught below
        //     } else {
            console.log(error);
            }
       
    };

exports.deleteMovie = async (movieObj) => {
    try {
        let t = await sequelize.transaction();
        const findMovieId = await Movie.findOne({where:{title: movieObj.title}});
        // console.log(findMovieId);
        const myCheck     = await ActorMovie.destroy({where:{MovieId: findMovieId.id}},{t});
        // console.log(myCheck);
        const returnValue = await Movie.destroy({where:{title: movieObj.title}},{t});
        await t.commit();
        //console.log(returnValue);
        if (returnValue === 1) {
            console.log(`Successfully deleted ${movieObj.title} `);
        } else {
            console.log(`${movieObj.title} not found in db`)
        }
    } catch (error) {
        console.log(`Unsuccesfull delete. The error is message is: ${error.errors[0].message}`)
    }
  };

    
exports.listAllMovies =  async () => {
    try{
        // const returnValue = await Movie.findAll();
        // const returnValue = await Movie.findAll({include: [{model:Actor}]});
        const returnValue = await Movie.findAll();
        let items = [];
        returnValue.forEach(function(doc){
          items.push(doc);
        });
        console.log('This is the list of your favourite films');
        for (let index = 0; index < items.length; index++) {
            let tempActorId = await ActorMovie.findAll({where:{MovieId: items[index].id}});
            // console.log(tempActorId);
            for (let index2 = 0; index2 < tempActorId.length; index2++) {
                let tempActor = tempActorId[index2].ActorId;
                let tempActorName = await Actor.findOne({where:{id: tempActor}})
                console.log(`Title= ${items[index].title}  Actor= ${tempActorName.name} Rating= ${items[index].rating}`);
                }
            };
    } catch(error) {
        console.log(error);
        // console.log(`Unsuccesfull attempt to list. The error is message is: ${error.errors[0].message}`);
        }
};

exports.updateMovie =  async (movieObj) => {
    try{
        if (!movieObj.rating) {
            const myTestIfActorExists = await Actor.findOne({where:{name: movieObj.actor}});
            if (!myTestIfActorExists) {
                // if not add entry to Actor Table
                await Actor.create({name: movieObj.actor})
            };
            const tempActor = await Actor.findOne({where:{name: movieObj.actor}});
            const tempMovie = await Movie.findOne({where:{title: movieObj.title}});
            console.log(tempMovie.id);
            console.log(tempActor.id);
            const myTemp2 = await ActorMovie.create(
                {MovieId: tempMovie.id,
                ActorId: tempActor.id},
                              );
            //  console.log(myTemp2);
            // if (myTemp2 == 0) {
            //     console.log("Film title not found in document");
            // } else {
            //     console.log(`Successfully updated ${movieObj.title}  with actor ${movieObj.actor}`)                
            // } 
        } else if (!movieObj.actor){
            const myTemp2 = await Movie.update(
                {rating: movieObj.rating},
                {where:{title: movieObj.title}}
              )
            if (myTemp2 == 0) {
                console.log("Film title not found in document");
            } else {
                console.log(`Successfully updated ${movieObj.title}  with rating ${movieObj.rating}`)                
            }
        } else {
            // This section is for updating BOTH actor and rating
            const myTestIfActorExists = await Actor.findOne({where:{name: movieObj.actor}});
            if (!myTestIfActorExists) {
                // if not add entry to Actor Table
                await Actor.create({name: movieObj.actor})
            };
            const tempActor = await Actor.findOne({where:{name: movieObj.actor}});
            const tempMovie = await Movie.findOne({where:{title: movieObj.title}});
            const myTemp3 = await ActorMovie.create(
                {ActorId: tempActor.id,
                MovieId: tempMovie.id},
              );
            const myTemp4 = await Movie.update(
                {rating: movieObj.rating},
                {where:{title: movieObj.title}}
              )
            if (myTemp4 == 0) {
                console.log("Film title not found in document");
            } else {
                console.log(`Successfully updated ${movieObj.title}  with actor ${movieObj.actor} and rating ${movieObj.rating}`)                
            }
        }
    } catch(error) {
        // if (error.errors[0].message) {
        // console.log(`Unsuccesfull update. The error is message is: ${error.errors[0].message}`)
        // above code catches SQL error codes all other error codes get caught below
        // } else {
        console.log(error);
        }
}
