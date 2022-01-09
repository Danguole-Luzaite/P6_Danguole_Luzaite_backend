const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');


router.post('api/sauces', saucesCtrl.createSauce);
router.get('/api/sauces/', saucesCtrl.getAllSauces);
router.get('/api/sauces/:id', saucesCtrl.getOneSauce);
router.put('/api/sauces/:id', saucesCtrl.modifySauce);
router.delete('/api/sauces/:id', saucesCtrl.deleteSauce);


module.exports = router;