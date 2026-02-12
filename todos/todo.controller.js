const express = require('express');
const router = express.Router();
const todoService = require('./todo.service');

// routes
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

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

function create(req, res, next) {
    todoService.create(req.body)
        .then(() => res.json({ message: 'Todo created' }))
        .catch(err => next(err));
}

function update(req, res, next) {
    todoService.update(req.params.id, req.body)
        .then(() => res.json({ message: 'Todo updated' }))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    todoService.delete(req.params.id)
        .then(() => res.json({ message: 'Todo deleted' }))
        .catch(err => next(err));
}
