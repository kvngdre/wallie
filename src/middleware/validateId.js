const ServerResponse = require('../utils/APIResponse');

module.exports = (req, res, next) => {
    const { id } = req.params;
    try {
        if (isNaN(id)) throw new Error('Invalid Id');

        next();
    } catch (exception) {
        return res.status(400).json(new ServerResponse(exception.message));
    }
};
