const Sauce = require('../models/sauces');
const fs = require('fs');

// Enregistrement des Sauces dans la base de données
exports.createSauce = (req, res, next) => { 
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce ({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
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

exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  switch (like) {
    // Si like = 1, l'utilisateur aime (= like) la sauce
    case 1 :
      Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId} }, { $inc: { likes: +1 } })
        .then(() => res.status(200).json({ message: " l utilisateur aime la sauce ! " }))
        .catch(error => res.status(400).json({ error }))
      break;

    // Si like = 0, l'utilisateur annule son like ou son dislike.
    case 0 :
      Sauce.findOne({ _id: sauceId})
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId}, { $pull: { usersLiked: userId} }, { $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: " like est annulé ! "}))
              .catch(error => res.status(400).json({ error }))
          }
          if (sauce.usersdisLiked.includes(userId)) {
            Sauce.updateOne({ _id: sauceId}, { $pull: { usersdisLiked: userId} }, { $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: " dislike est annulé ! "}))
              .catch(error => res.status(400).json({ error }))
          }
        })
        .catch((error) => res.status(404).json({ error }))
      break;

    //Si like = -1, l'utilisateur n'aime pas (=dislike) la sauce.
    case -1 :
      Sauce.updateOne({ _id: sauceId}, { $pull: { usersdisLiked: userId} }, { $inc: { dislikes: +1 } })
        .then(() => res.status(200).json({ message: " l'utilisateur n'aime pas la sauce ! "}))
        .catch(error => res.status(400).json({ error }))
      break;
    
    default:
      console.log(" L'action like ou dislike ne peut pas être effectuée! ");
  }
};