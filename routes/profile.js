const { Router } = require('express');
const profileControllers = require('../controllers/profileControllers');
const router = Router();

router.get('/user', profileControllers.get_user);
router.post('/user',profileControllers.post_user);
router.put('/user/:id',profileControllers.update_user);
//router.delete('/user/:id',profileControllers.delete_user);

module.exports = router;