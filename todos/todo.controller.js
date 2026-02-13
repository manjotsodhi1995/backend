const express = require('express');
const router = express.Router();
const todoService = require('./todo.service');

// routes
router.post('/', create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    todoService.create(req.body)
        .then(todo => res.json(todo))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    todoService.getAll()
        .then(todos => res.json(todos))
        .catch(err => next(err));
}

function getById(req, res, next) {
    todoService.getById(req.params.id)
        .then(todo => todo ? res.json(todo) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    todoService.update(req.params.id, req.body)
        .then(todo => res.json(todo))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    todoService.delete(req.params.id)
        .then(() => res.json({ message: 'Todo deleted successfully' }))
        .catch(err => next(err));
}
