const router = require('express').Router();
const authentication = require('../middlewares/authentication');

const TodoController = require('../controllers/todoController');
const UserController = require('../controllers/userController');
// const authorization = require('../middlewares/authorization');

router.post('/register', UserController.register);
router.post('/auth/login', UserController.login);

router.use(authentication);

router.get('/users', UserController.getAll);
router.get('/user/:id', UserController.getByUuid);
router.delete('/user/:id', UserController.deleteUser);

router.get('/todos', TodoController.getAllTaskGroup);
router.post('/todos', TodoController.createTaskGroup);
router.get('/todos/:id', TodoController.viewTaskGroup);
router.put('/todos/:id', TodoController.updateTaskGroup);
router.delete('/todos/:id', TodoController.deleteTaskGroup);

router.get('/todos/:groupId/items', TodoController.getAllTask);
router.post('/todos/:groupId/items', TodoController.createTask);

router.get('/todos/:groupId/items/:id', TodoController.viewTask);
router.put('/todos/:groupId/items/:id', TodoController.updateTask);
router.delete('/todos/:groupId/items/:id', TodoController.deleteTask);



module.exports = router;