require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const axios = require('axios')

const app = express();
app.use(cors())

app.use(express.json());
// importing user context
const User = require("./model/user");
const Pokemon = require('./model/pokemons')
const auth = require("./middleware/auth");

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

app.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const {first_name, last_name, email, password} = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({email});

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

app.post("/login", async (req, res) => {
    debugger

    // Our login logic starts here
    try {
        // Get user input
        const {email, password} = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({email});

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).json("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
})

app.post("/getPlayersTable", async (req, res) => {

    try {
        const userObj = req.body;
        const email = userObj.email
        const userValid = await User.findOne({email});
        if(userValid != null){
            const users = await User.find()
            res.status(200).json(users)
        }

         } catch (err) {
        console.log(err);
     }
});

app.post('/setPokemon', async (req, res) => {
    console.log(req.body)
    const mid = req.body.mid
    const pokeMaster = await User.findById(mid)
    if (pokeMaster == null) {
        return res.status(404).json({ message: 'Cannot find subscriber' })
    } else {

    }

})

app.post("/testPokemons", async (req, res) => {


 const data = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151')
    data.data.results.forEach(  (pokemonUrl) => {
         axios.get(pokemonUrl.url).then(pokemon => {
             // const pokemonObj = {}
             // pokemonObj.name = pokemon.data.name
             // pokemonObj.types = pokemon.data.types
             // pokemonObj.srcImg = pokemon.data.sprites.front_default
             // pokemonObj.id = pokemon.data.id
             // pokemonObj.abilities = pokemon.data.abilities
             // pokemonObj.stats = pokemon.data.stats

             const pokemonDB =  Pokemon.create({
                     name:  pokemon.data.name,
                     types: pokemon.data.types,
                     srcImg: pokemon.data.sprites.front_default,
                     pokemonId: pokemon.data.id,
                     abilities: pokemon.data.abilities,
                     stats: pokemon.data.stats
                 }).then(() => {
                 console.log('works')
             })

         })
    })

})


module.exports = app;



