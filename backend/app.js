const { json } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

//importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//connexion à la base de donnée mongoDB Atlas
mongoose.connect('mongodb+srv://Galad:j3r3myl3arn@cluster0.sf1z2.mongodb.net/test?retryWrites=true&w=majority',
    {   useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


//middleware qui permet d'accéder à notre API peut importe l'origine
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//middleware permettant d'extraire l'objet JSON de la demande
app.use(bodyParser.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

/*app.use((req, res) => {
    res.json({ message: 'Votre requete a bien été reçue !' });
});*/

module.exports = app;