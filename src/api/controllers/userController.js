const {comparePassword} = require('../helpers/bcrypt');
require('dotenv').config();
const {generateToken} = require('../helpers/jwt');
const { User, Sequelize, Op } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { getPagination, getPagingData } = require('../helpers/paginate');

class UserController {

    /**
     * Get All Users
     * 
     * @param {Object} req 
     * @param {Object} res 
     */
    static async getAll(req,res) {
        const { page, size, search } = req.query; // query params
        var condition = search ? { [Op.or]: [{username: {[Op.like]: `%${search}%`}}, {firstName: {[Op.like]: `%${search}%`}}, {lastName: {[Op.like]: `%${search}%`}}] } : null; // get condition
        const { limit, offset } = getPagination(page, size); // set limit and offset pagination

        User.scope('withoutPassword','withoutId').findAndCountAll({
            where: condition,
            offset,
            limit
        }).then(result => {
                    const response = getPagingData(result, page, limit);
                    res.status(200).json(response);
                })
                .catch(err => {
                    res.status(500).json({
                        message: err.message || "Some error occurred while retrieving data.",
                      });
                })
    }

    /**
     * Get User By UUID
     * @param {Object} req Request Data
     * @param {Object} res Response Data
     */
    static async getByUuid(req, res) {
        let uuid = req.params.id;
        User.scope('withoutPassword').findOne({
            where: {
                uuid: uuid
            }
        }).then(result => {
            const response = {data: result};
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving data.",
              });
        });
    }

    static async deleteUser(req, res) {
        let uuid = req.params.id;

        User.destroy({
            where: {
                uuid: uuid
            }
        })
        .then(result => {
            const response = { name:"UserDelete", message: "User Successfully Deleted!" };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving data.",
              });
        })
    }

    /**
     * Register User
     * 
     * @param {Object} req Request Data
     * @param {Object} res Response Data
     */
    static async register(req,res) {
        try {
            let {firstName,lastName, email, username, password } = req.body; // taking out variables on request body

            let query = await User.create({
                firstName,
                lastName,
                email,
                username,
                password
            });
            
            let response = {
                id: query.uuid,
                firstName: query.firstName,
                lastName: query.lastName,
                username: query.username,
                email: query.email,
            };

            res.status(201).json(response);
        } catch(err) {
            let messages = {};
            if(err instanceof Sequelize.ValidationError) {
                err.errors.forEach((error) => {
                    messages[error.path] = error.message;
                });
                res.status(500).json({name:"Error", messages: messages});
            } else {

                res.status(500).json(err);
            }
        }
    }

    /**
     * Login User
     * 
     * @param {Object} req Request Data
     * @param {Object} res Response Data
     * @returns 
     */
    static async login(req, res) {
        try {
            let {email, password} = req.body;
            let myUser = await User.findOne({
                where: {
                    email,
                }
            });

            if(!myUser) {
                throw {
                    name: 'User Login Error',
                    message: `User with email ${email} not found!`,
                };
            }
            let isCorrect = comparePassword(password, myUser.password);

            if(!isCorrect) {
                throw {
                    name: 'User Login Error',
                    message: `User password with email ${email}  doesn't match!`,
                };
            }

            let payload = {
                id: myUser.id,
                email: myUser.email
            };

            let token = generateToken(payload);

            return res.status(200).json({token});

        }catch(err) {
            return res.status(401).json({
                message:err.message || "Some error occurred while retrieving data.",
              });
        }
    }
}

module.exports = UserController;