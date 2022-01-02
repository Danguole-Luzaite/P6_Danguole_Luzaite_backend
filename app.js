const express = require('express');

const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://DanguoleLu:rcyX3NFCR76R9MV@cluster0.aopzj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

 
app.use((req, res) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});

module.exports = app;