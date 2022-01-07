require ("./db/connection");
const yargs = require("yargs");
const {addMovie, deleteMovie, listAllMovies,updateMovie} = require("./movie/movie.functions")

const app = async (args) => {
    try {
        if (args.add) {
            const movieObj = {title: args.title, actor: args.actor, rating: args.rating};
            await addMovie(movieObj);
            // run add movie passing a movie object
        } else if (args.delete){
            // delete
            const movieObj = {title: args.title};
            await deleteMovie(movieObj);
        } else if (args.list){
            // list
            await listAllMovies();
        } else if (args.update){
            //update
            if (args.actor || args.rating){
                //console.log(args);
                const movieObj = {title: args.title, actor: args.actor, rating: args.rating};
                await updateMovie(movieObj);
                } else {
                    console.log ("Missing Parameters for update function");
                }
                
        }
        else
            console.log("Incorrect command");
        }
    catch (error) {
        console.log(error);
    }
};

app(yargs.argv);