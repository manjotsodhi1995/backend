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
    return await Todo.find().sort({ createdDate: -1 });
}

async function getById(id) {
    return await Todo.findById(id);
}

async function create(todoParam) {
    const todo = new Todo(todoParam);
    
    // Set updatedDate to current date
    todo.updatedDate = Date.now();
    
    // Save todo
    await todo.save();
    
    return todo;
}

async function update(id, todoParam) {
    const todo = await Todo.findById(id);

    // Throw error if todo doesn't exist
    if (!todo) throw 'Todo not found';

    // Update updatedDate
    todoParam.updatedDate = Date.now();

    // Copy todoParam properties to todo
    Object.assign(todo, todoParam);

    await todo.save();
    
    return todo;
}

async function _delete(id) {
    await Todo.findByIdAndRemove(id);
}
