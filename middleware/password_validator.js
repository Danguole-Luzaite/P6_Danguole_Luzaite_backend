const passwordValidator = require('password-validator');


//Créer un schéma pour le validateur de mot de passe
const passwordvalidatorSchema = new passwordValidator();

//les propriétés du validateur de mot de passe
passwordvalidatorSchema
.is().min(8)                                    // Minimum length 6
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values


//pour vérifier la validation du mot de passe
module.exports = (req, res, next) => {
  if(passwordvalidatorSchema.validate(req.body.password)){
    next();
  }else{
    return res.status(400)
    .json({error: "besoin de créer un mot de passe plus fort : " + (passwordvalidatorSchema.validate('req.body.password', { list: true }))})
  }
};