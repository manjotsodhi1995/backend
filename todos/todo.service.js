const db = require('_helpers/db');
const Todo = db.Todo;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Todo.find();
}

async function getById(id) {
    return await Todo.findById(id);
}

async function create(param) {
    const todo = new Todo(param);
    await todo.save();
    return todo;
}

async function update(id, param) {
    const todo = await Todo.findById(id);
    if (!todo) throw 'Todo not found';
    Object.assign(todo, param);
    await todo.save();
    return todo;
}

async function _delete(id) {
    await Todo.findByIdAndRemove(id);
}
