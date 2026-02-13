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

    if (todoParam.title !== undefined) todo.title = todoParam.title;
    if (todoParam.description !== undefined) todo.description = todoParam.description;
    if (todoParam.completed !== undefined) todo.completed = todoParam.completed;

    todo.updatedDate = Date.now();

    await todo.save();
    return todo;
}

async function _delete(id) {
    await Todo.findByIdAndRemove(id);
}
