const { User } = require('../models');

const { verifyToken } = require('../helpers/jwt');

const authentication = async (req, res, next) => {
    try {
        let token = req.get("token");
        let userDecoded = verifyToken(token);
        let myUser = await User.findOne({
            where: {
                id: userDecoded.id,
                email: userDecoded.email
            }
        });

        if(!myUser) {
            return res.status(401).json({
                name: "Authentication Error",
                message: "Error Authentication"
            })
        }

        res.locals.user = myUser;
        return next();

    } catch(err) {
        return res.status(401).json(err);
    }
}

module.exports = authentication;