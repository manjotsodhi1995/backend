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

async function getAll(params = {}) {
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const skip = (page - 1) * limit;

    const totalItems = await Todo.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    
    const data = await Todo.find()
        .sort({ createdDate: -1 })
        .skip(skip)
        .limit(limit);

    return {
        data,
        pagination: {
            page,
            limit,
            totalItems,
            totalPages
        }
    };
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

