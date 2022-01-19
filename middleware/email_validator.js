const emailValidator = require("email-validator");


//pour vérifier la validation du email
module.exports = (req, res, next) => {
  if(emailValidator.validate(req.body.email)){
    next();
  }else{
    return res.status(400).json({error: "la structure de l'e-mail n'est pas correcte ! "})
  }
};