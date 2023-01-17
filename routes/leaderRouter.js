const bodyParser = require('body-parser');
const express = require('express');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Types', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leader: ' 
        + req.body.name 
        + ' with detail: ' 
        + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the leaders!');
    });

leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Types', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send the leader of ' + req.params.leaderId + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /leaders');
    })
    .put((req, res, next) => {
        res.end('Updating the leader: ' + req.params.leaderId 
        + '\n will update the leader: ' + req.body.name 
        + ' with detail: ' 
        + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting leader: ' + req.params.leaderId);
    });

module.exports = leaderRouter;