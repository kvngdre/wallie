const router = require('express').Router();
const userController = require('../controllers/user.controller');
const userValidators = require('../validators/user.validator');

router.post('/', async (req, res) => {
    const { error, value: userDTO } = userValidators.validateCreate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const newUser = await userController.createUser(userDTO);
    return res.status(201).send(newUser);
});

module.exports = router;
