const mongoose = require("mongoose");

const pokemonsSchema = new mongoose.Schema({
    first_name: { type: String, default: null },

});



module.exports = mongoose.model("pokemons", pokemonsSchema);
