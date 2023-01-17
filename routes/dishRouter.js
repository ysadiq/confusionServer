const bodyParser = require('body-parser');
const express = require('express');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Types', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the dish: ' 
        + req.body.name 
        + ' with detail: ' 
        + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /dishes');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the dishes!');
    });

dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Types', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send the dish of ' + req.params.dishId + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /dishes/' + req.params.dishId);
    })
    .put((req, res, next) => {
        res.end('Updating the dish: ' + req.params.dishId 
        + '\n will update the dish: ' + req.body.name 
        + ' with detail: ' 
        + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting dish: ' + req.params.dishId);
    });

module.exports = dishRouter;