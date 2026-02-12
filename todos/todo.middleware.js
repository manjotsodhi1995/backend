module.exports = {
    validateCreate,
    validateUpdate,
    validateId
};

function validateCreate(req, res, next) {
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            message: 'Validation error: title is required and must be a non-empty string'
        });
    }

    if (title.length > 200) {
        return res.status(400).json({
            message: 'Validation error: title must not exceed 200 characters'
        });
    }

    if (req.body.description && typeof req.body.description !== 'string') {
        return res.status(400).json({
            message: 'Validation error: description must be a string'
        });
    }

    if (req.body.description && req.body.description.length > 1000) {
        return res.status(400).json({
            message: 'Validation error: description must not exceed 1000 characters'
        });
    }

    if (req.body.completed !== undefined && typeof req.body.completed !== 'boolean') {
        return res.status(400).json({
            message: 'Validation error: completed must be a boolean'
        });
    }

    next();
}

function validateUpdate(req, res, next) {
    const { title, description, completed } = req.body;

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            message: 'Validation error: at least one field must be provided for update'
        });
    }

    if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).json({
                message: 'Validation error: title must be a non-empty string'
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                message: 'Validation error: title must not exceed 200 characters'
            });
        }
    }

    if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({
            message: 'Validation error: description must be a string'
        });
    }

    if (description !== undefined && description.length > 1000) {
        return res.status(400).json({
            message: 'Validation error: description must not exceed 1000 characters'
        });
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({
            message: 'Validation error: completed must be a boolean'
        });
    }

    next();
}

function validateId(req, res, next) {
    const id = req.params.id;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            message: 'Invalid ID format'
        });
    }

    next();
}
