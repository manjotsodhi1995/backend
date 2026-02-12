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
        .then(todo => res.status(201).json(todo))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Validate pagination parameters
    if (page < 1) {
        return res.status(400).json({ message: 'Page must be greater than 0' });
    }
    if (limit < 1 || limit > 100) {
        return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    todoService.getAll({ page, limit })
        .then(result => res.json(result))
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
        .then(() => res.json({}))
        .catch(err => next(err));
}

