
const express = require('express');
const router = express.Router();
const commentService = require('./comment.service');

// routes
router.post('/postcomments', sendata);
router.get('/getcomments', getdata);



module.exports = router;

function getdata(req, res, next) {
    commentService.getall()
        .then(users => res.json(users))
        .catch(err => next(err));
}
 
function sendata(req, res, next) {
    // console.log(req.body);
    commentService.create(req.body) 
        .then(() => res.json({}))
        .catch(err => next(err));
}
