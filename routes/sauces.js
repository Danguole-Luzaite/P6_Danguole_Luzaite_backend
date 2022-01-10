const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const saucesCtrl = require('../controllers/sauces');
const multer = require('../middleware/multer-config');

router.post('api/sauces', auth, multer, saucesCtrl.createSauce);
router.get('/api/sauces/', auth, saucesCtrl.getAllSauces);
router.get('/api/sauces/:id', auth, saucesCtrl.getOneSauce);
router.put('/api/sauces/:id', auth, saucesCtrl.modifySauce);
router.delete('/api/sauces/:id', auth, saucesCtrl.deleteSauce);


module.exports = router;