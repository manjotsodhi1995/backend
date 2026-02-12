const db = require('_helpers/db');
const Todo = db.Todo;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    getByUserId,
    toggleComplete
};

async function getAll() {
    return await Todo.find().populate('userId', 'username firstName lastName');
}

async function getById(id) {
    return await Todo.findById(id).populate('userId', 'username firstName lastName');
}

async function getByUserId(userId) {
    return await Todo.find({ userId: userId }).populate('userId', 'username firstName lastName');
}

async function create(todoParam) {
    const todo = new Todo(todoParam);
    await todo.save();
    return todo;
}

async function update(id, todoParam) {
    const todo = await Todo.findById(id);

    if (!todo) throw 'Todo not found';

    // Update the updatedDate
    todoParam.updatedDate = Date.now();

    // Copy todoParam properties to todo
    Object.assign(todo, todoParam);

    await todo.save();
    return todo;
}

async function toggleComplete(id) {
    const todo = await Todo.findById(id);

    if (!todo) throw 'Todo not found';

    todo.completed = !todo.completed;
    todo.updatedDate = Date.now();

    await todo.save();
    return todo;
}

async function _delete(id) {
    await Todo.findByIdAndRemove(id);
}
