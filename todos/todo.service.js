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

async function getAll(options = {}) {
    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const skip = (page - 1) * limit;

    const [todos, total] = await Promise.all([
        Todo.find().sort({ createdDate: -1 }).skip(skip).limit(limit),
        Todo.countDocuments()
    ]);

    return {
        data: todos,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
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

