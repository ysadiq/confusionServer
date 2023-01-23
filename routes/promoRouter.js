const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../auhenticate');

const Promos = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promos
        .find({})
        .then((promos) => {
            res.statusCode = 200;
            res.setHeader('Content-Types', 'application/json');
            res.json(promos);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos
        .create(req.body)
        .then((promotion) => {
            console.log('Promotion Created: ' + promotion);
            res.statusCode = 200    
            res.setHeader('Content-Types', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /promotions');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos
        .remove({})
        .then((resp) => {
            res.statusCode = 200    
            res.setHeader('Content-Types', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err))
    });

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promos
        .findById(req.params.promoId)
        .then((promotion) => {
            res.statusCode = 200    
            res.setHeader('Content-Types', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /promotions/' + req.params.promoId);
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos
        .findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, {
            new: true
        })
        .then((promotion) => {
            res.statusCode = 200    
            res.setHeader('Content-Types', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promos
        .findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200    
            res.setHeader('Content-Types', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err))
    });

module.exports = promoRouter;