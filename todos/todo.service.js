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

async function create(todoParam) {
    const todo = new Todo(todoParam);
    await todo.save();
    return todo;
}

async function update(id, todoParam) {
    const todo = await Todo.findById(id);

    if (!todo) throw 'Todo not found';

    todoParam.updatedDate = Date.now();
    Object.assign(todo, todoParam);

    await todo.save();
    return todo;
}

async function _delete(id) {
    await Todo.findByIdAndRemove(id);
}
