const mongoose = require('mongoose');
const Todo = mongoose.model('Todo');
const TodoHistory = mongoose.model('TodoHistory');

exports.addToDo = async (req, res) => {
    req.body.author = req.user._id;
    req.body.site = req.params.id;
    if (!req.body.priority) {
        req.body.priority = '0';
    }
    console.log(req.body);
    const newTodo = new Todo(req.body);
    req.body._id = newTodo._id;
    const newTodoHistory = new TodoHistory(req.body);
    await newTodo.save();
    await newTodoHistory.save();
    req.flash('saved', 'Задача сохранена');
    res.redirect('back');
};

exports.deleteToDo = async (req, res) => {
    await Todo.findByIdAndRemove(req.params.id);
    let date = Date.now();
    await TodoHistory.findByIdAndUpdate(req.params.id, {status: req.query.status, closedBy: req.query.closedBy, closedDate: date});
    req.flash('saved', `Задача сохранена в архиве со статусом "${req.query.status}"`);
    res.redirect('back');
};

exports.todosPage = async (req, res, next) => {
    const todos = await Todo.find({}).populate('author site');
    const groups = await Todo.getGroupList();
    if (!todos) return next();
    res.render('todos', {title: 'Задачи', todos, groups});
};

exports.priorityTodosPage = async (req, res, next) => {
    const todos = await Todo.find({priority: 1}).populate('author site');
    const groups = await Todo.getGroupList();
    if (!todos) return next();
    res.render('todos', {title: 'Задачи', todos, groups});
};

exports.getTodoByGroup = async (req, res) => {
    const group = req.params.group;
    const groups = await Todo.getGroupList();
    const todos = await Todo.find({groups: group}).populate('author site');
    if (!todos) return next();
    res.render('todos', {title: `Задачи ${group}`, todos, groups});
};

exports.getTodoByUser = async (req, res) => {
    const user = req.params.id;
    const groups = await Todo.getGroupList();
    const todos = await Todo.find({author: user}).populate('author site');
    if (!todos) return next();
    res.render('todos', {title: `Задачи - ${todos[0].author.name}`, todos, groups});
};

const confirmOwner = (todo, user) => {
    if (!todo.author.equals(user._id) && todo.author.level < 20) {
        throw Error('Не ты создавал, не тебе и редактировать.');
    }
};

exports.editToDo = async (req, res, next) => {
    const todo = await Todo.findOne({_id: req.params.id}).populate('site');
    confirmOwner(todo, req.user);
    res.render('editTodo', {title: `Редактирование задачи на ${todo.site.name}`, todo});
};

exports.updateToDo = async (req, res, next) => {
    if (!req.body.priority) {
        req.body.priority = 0;
    }
    const todo = await Todo.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true,
        runValidators: true,
    }).populate('site').exec();
    req.flash('saved', `Изменения задачи на <strong>${todo.site.name}</strong> успешно сохранены`);
    res.redirect(`/todo/todos`);
};
