const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');


router.post('api/sauces', auth, saucesCtrl.createSauce);
router.get('/api/sauces/', auth, saucesCtrl.getAllSauces);
router.get('/api/sauces/:id', auth, saucesCtrl.getOneSauce);
router.put('/api/sauces/:id', auth, saucesCtrl.modifySauce);
router.delete('/api/sauces/:id', auth, saucesCtrl.deleteSauce);


module.exports = router;