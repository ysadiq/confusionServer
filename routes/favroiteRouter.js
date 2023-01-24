const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../auhenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Types', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
        console.log('here the fetched favorite', favorite);
        if(!Array.isArray(req.body)) {
            err = new Error('Body should contain an array of dish ids');
            err.status = 500;
            return next(err);
        } 
        
        if (favorite && favorite.dishes) {
            var newDishes = req.body.filter((item) => !favorite.dishes.includes(item._id));
            favorite.dishes.push(...newDishes);
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Updated: ' + favorite);
                res.statusCode = 200    
                res.setHeader('Content-Types', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            Favorites.create({
                dishes: req.body, 
                user: req.user.id
            })
            .then((favorite) => {
                console.log('Favorite Created: ' + favorite);
                res.statusCode = 200    
                res.setHeader('Content-Types', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Types', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite && favorite.dishes && !favorite.dishes.includes(req.params.dishId)) {
            favorite.dishes.push(req.params.dishId);
            favorite.save()
            .then((favorite) => {
                console.log('Favorite Updated: ' + favorite);
                res.statusCode = 200    
                res.setHeader('Content-Types', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else if (!favorite) {
            Favorites.create({
                dishes: [req.params.dishId], 
                user: req.user.id
            })
            .then((favorite) => {
                console.log('Favorite Created: ' + favorite);
                res.statusCode = 200    
                res.setHeader('Content-Types', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        } else {
            err = new Error('This dish is already on your favorite list');
            err.status = 500;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite && favorite.dishes && favorite.dishes.includes(req.params.dishId)) {
            favorite.dishes.splice(favorite.dishes.indexOf(req.params.dishId));
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Types', 'application/json');
                res.json(favorite);  
            }, (err) => next(err))
            .catch((err) => next(err))
        } else {
            err = new Error('Can not find dish: ' + req.params.dishId + ' in your favorite list');
            err.status = 500;
            return next(err);
        }
    }, (err) => next(err))
})

module.exports = favoriteRouter;