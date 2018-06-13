const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {catchError} = require('../handlers/errorHandlers');
const todoController = require('../controllers/todoController');

router.post('/:id', authController.isLoggedIn, catchError(todoController.addToDo));
router.post('/:id/update', authController.isLoggedIn, catchError(todoController.updateToDo));
router.get('/:id/edit', authController.isLoggedIn, catchError(todoController.editToDo));
router.get('/:id/delete', authController.isLoggedIn, catchError(todoController.deleteToDo));
router.get('/todos', catchError(todoController.todosPage));
router.get('/todos/prioritized', catchError(todoController.priorityTodosPage));
router.get('/todos/:group', catchError(todoController.getTodoByGroup));
router.get('/todos/user/:id', catchError(todoController.getTodoByUser));


module.exports = router;
