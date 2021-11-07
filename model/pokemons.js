const mongoose = require("mongoose");

const PokemonsSchema = new mongoose.Schema({
    name: { type: String, default: null },
    types: [Object],
    srcImg: {type: String, default: null},
    pokemonId: {type: String},
    abilities: [Object],
    stats: [Object]

});



module.exports = mongoose.model("pokemons", PokemonsSchema);
