const mongoose = require("mongoose");


const userPokemonSchema = new mongoose.Schema({
    userUidRef: {type: String, default: null},
    pokemons: [Object]

})

module.exports = mongoose.model("userPokemon", userPokemonSchema);
