const { Task, TaskGroup, User, Sequelize, Op } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { getPagination, getPagingData } = require('../helpers/paginate');

class TodoController {
    static async getAllTask(req,res) {

        try {
            let groupId = req.params.groupId;

            const taskGroup = await TaskGroup.findOne({
                where: {
                    uuid: groupId
                }
            });

            if(!taskGroup) {
                
                res.status(404).json({ name:"ErrorNotFound", statusCode:404, message: "Data Not Found" });
            } else {
                const { page, size, search } = req.query; // query params
                var condition = search ? { description: {[Op.like]: `%${search}%`} } : null; // get condition
                var group = {TaskGroupId: taskGroup.id};
                const { limit, offset } = getPagination(page, size); // set limit and offset pagination
        
                Task.scope('withoutId').findAndCountAll({
                    where: condition ? condition : group,
                    offset,
                    limit,
                    include: TaskGroup
                })
                    .then(result => {
                        const response = getPagingData(result, page, limit);
                        res.status(200).json(response);
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err.message || "Some error occurred while retrieving data.",
                        });
                    })
            }
        } catch(err) {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving data.",
            });
        }

        
    }

    static async createTask(req, res) {
        try {
            let groupId = req.params.groupId;

            const taskGroup = await TaskGroup.findOne({
                where: {
                    uuid: groupId
                }
            });

            if(!taskGroup) {
                throw {
                    name: 'DataNotFound',
                    message: `Task not found!`,
                };
            } else {
                const { description } = req.body;
                const usr = res.locals.user;

                Task.create({
                    description, TaskGroupId: taskGroup.id
                })
                .then(result => {
                    let response = {name:"CreateTodo", message: "Todo Successfully Created!", data: result};
                    res.status(200).json(response);
                })
                .catch(err => {
                    let messages = {};
                    if(err instanceof Sequelize.ValidationError) {
                        err.errors.forEach((error) => {
                            messages[error.path] = error.message;
                        });
                        res.status(500).json({name:"ErrorCreateTodoGroup", messages: messages || "Some error occurred while retrieving data."});
                    } else {
                        res.status(500).json(err);
                    }
                })
            }
        } catch(err) {
            let messages = {};
            if(err instanceof Sequelize.ValidationError) {
                err.errors.forEach((error) => {
                    messages[error.path] = error.message;
                });
                res.status(500).json({name:"ErrorCreateTodo", messages: messages || "Some error occurred while retrieving data."});
            } else {
                res.status(500).json(err);
            }
        }
    }

    static async viewTask(req,res) {
        try {
            let uuid = req.params.id;
            let usr = res.locals.user;

            Task.findOne({
                where: {
                    uuid: uuid
                },
                include: TaskGroup
            })
            .then(result => {
                if(!result) {
                    res.status(404).json({ name:"ErrorNotFound", statusCode:404, message: "Data Not Found" });
                } else {
                    const response = { name:"TaskView", data: result };
                res.status(200).json(response);
                }
                
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred while retrieving data.",
                })
            })
        } catch(err) {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving data.",
              });
        }
    }

    static async deleteTask(req, res) {
        let uuid = req.params.id;
        
        Task.destroy({
            where: {
                uuid: uuid
            }
        })
        .then(result => {
            
            const response = { name:"TaskDelete", message: "Task Successfully Deleted!" };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving data.",
                });
        });
    }

    static async getAllTaskGroup(req,res) {

        const { page, size, search } = req.query; // query params
        var condition = search ? { title: {[Op.like]: `%${search}%`} } : null; // get condition
        const { limit, offset } = getPagination(page, size); // set limit and offset pagination
        const usr = res.locals.user;

        TaskGroup.findAndCountAll({
            where: condition ? condition : {UserId: usr.id},
            offset,
            limit,
            include: [{model: User.scope('withoutPassword')},{model: Task}]
        })
            .then(result => {
                const response = getPagingData(result, page, limit);
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred while retrieving data.",
                  });
            })
    }

    static async createTaskGroup(req, res) {
        const { title } = req.body;
        const usr = res.locals.user;

        TaskGroup.create({
            title, UserId: usr.id
        })
        .then(result => {
            let response = {name:"CreateTodoGroup", message: "Todo Group Successfully Created!", data: result};
            res.status(200).json(response);
        })
        .catch(err => {
            let messages = {};
            if(err instanceof Sequelize.ValidationError) {
                err.errors.forEach((error) => {
                    messages[error.path] = error.message;
                });
                res.status(500).json({name:"ErrorCreateTodoGroup", messages: messages || "Some error occurred while retrieving data."});
            } else {
                res.status(500).json(err);
            }
        })

    }

    static async viewTaskGroup(req,res) {
        try {
            let uuid = req.params.id;
            let usr = res.locals.user;

            TaskGroup.findOne({
                where: {
                    uuid: uuid,
                    UserId: usr.id
                },
                include: Task
            })
            .then(result => {
                if(!result) {
                    res.status(404).json({ name:"ErrorNotFound", statusCode:404, message: "Data Not Found" });
                } else {
                    const response = { name:"TaskGroupView", data: result };
                res.status(200).json(response);
                }
                
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred while retrieving data.",
                })
            })
        } catch(err) {
            res.status(500).json({
                message: err.message || "Some error occurred while retrieving data.",
              });
        }
    }

    static async deleteTaskGroup(req, res) {
        let uuid = req.params.id;
        let usr = res.locals.user;

        let taskGroup = await TaskGroup.findOne({
            where: {
                uuid: uuid,
                UserId: usr.id
            }
        });

        if(!taskGroup) {
            res.status(404).json({name:"ErrorNotFound", statusCode: 404, messages: "Data Not Found"});
        } else {
            TaskGroup.destroy({
                where: {
                    uuid: uuid,
                    UserId: usr.id
                }
            })
            .then(result => {
                if(result) {
                    Task.destroy({
                        where: {
                            TaskGroupId: taskGroup.id
                        }
                    });
                }
                const response = { name:"TaskGroupDelete", message: "Task Group Successfully Deleted!" };
                res.status(200).json(response);
            })
            .catch(err => {
                res.status(500).json({
                    message: err.message || "Some error occurred while retrieving data.",
                  });
            })
        }

        
    }
}

module.exports = TodoController;