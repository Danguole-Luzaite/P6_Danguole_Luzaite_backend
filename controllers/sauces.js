const Sauce = require('../models/sauces');
const fs = require('fs');

// Enregistrement des Sauces dans la base de données
exports.createSauce = (req, res, next) => { 
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce ({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  });
  console.log(' mon sauce est..', JSON.stringify(sauce));
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    if(req.file){
      if(JSON.parse(req.body.sauce).userId !== req.auth.userId){
        res.status(400).json({ error: new Error( 'La requête non autorisée' )});
      }
    }else{
      if(req.body.userId !== req.auth.userId){
        res.status(400).json({ error: new Error( 'La requête non autorisée' )});
      }
    }
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(
    (sauce) => {
      if(!sauce){
        res.status(404).json({ error: new Error( "L'objet n'existe pas !" )});
      }
      if(sauce.userId !== req.auth.userId){
        res.status(400).json({ error: new Error( 'La requête non autorisée' )});
      }
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
         .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
         .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

//Pour enregistrer si l’utilisateur aimer ou ne pas aimer une sauce (ou aucun des deux)
exports.likeDislikeSauce = (req, res, next) => {
  
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      switch (req.body.like) {
        // l'utilisateur aime la sauce
        case 1 :
          if(!sauce.usersLiked.includes(req.body.userId)) sauce.usersLiked.push(req.body.userId);
          if(sauce.usersDisliked.includes(req.body.userId)) sauce.usersDisliked = sauce.usersDisliked.filter(value=> value !=req.body.userId);
          break;
        // l'utilisateur veut annuler son "j'aime" ou "je n'aime pas" 
        case 0 :
          if(sauce.usersLiked.includes(req.body.userId)) sauce.usersLiked = sauce.usersLiked.filter(value=> value !=req.body.userId);
          if(sauce.usersDisliked.includes(req.body.userId)) sauce.usersDisliked = sauce.usersDisliked.filter(value=> value !=req.body.userId);
          break;
        //  l'utilisateur n’aime pas la sauce
        case -1 :
          if(!sauce.usersDisliked.includes(req.body.userId)) sauce.usersDisliked.push(req.body.userId);
          if(sauce.usersLiked.includes(req.body.userId)) sauce.usersLiked = sauce.usersLiked.filter(value=> value !=req.body.userId);
          break;

        default: res.status(400).json({ error: 'bad request'});
      }
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
        Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() => res.status(200).json({ message: 'la sauce est bien noté' }))
        .catch((error) => res.status(400).json({ error: error }))
      })
    .catch((error) => res.status(500).json({ error: error }));

};
