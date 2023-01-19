module.exports = (req, res, next) => {
    const { id } = req.params;
    try {
        const isInvalidId = typeof id !== 'number' || id <= 0;
        if (isInvalidId) throw new Error('Invalid id');

        next();
    } catch (exception) {
        return res.status(400).json(new ServerResponse(exception.message));
    }
};
