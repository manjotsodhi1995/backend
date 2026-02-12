const db = require('_helpers/db');
const Todo = db.Todo;

module.exports = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

async function create(todoParam) {
    const todo = new Todo(todoParam);
    await todo.save();
    return todo.toJSON();
}

async function getAll() {
    return await Todo.find().sort({ createdDate: -1 });
}

async function getById(id) {
    return await Todo.findById(id);
}

async function update(id, todoParam) {
    const todo = await Todo.findById(id);
    if (!todo) throw 'Todo not found';

    Object.assign(todo, todoParam);
    await todo.save();
    return todo.toJSON();
}

async function _delete(id) {
    await Todo.findByIdAndRemove(id);
}

