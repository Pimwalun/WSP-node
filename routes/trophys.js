const express = require('express');
const router = express.Router();

let Trophy = require('../models/trophy');
let User = require('../models/user');

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_trophy', {
        title: 'Add Trophy'
    });
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Trophy.findById(req.params.id, (err, trophy) => {
        res.render('edit_trophy', {
            title: 'Edit Trophy',
            trophy: trophy
        });
    });
});

router.post('/add', (req, res) => {
    req.checkBody('trophy', 'Trophy is required').notEmpty();
    req.checkBody('name', 'Athlete name is required').notEmpty();
    req.checkBody('description', 'Description is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('add_trophy', {
            title: 'Add Trophy',
            errors: errors
        });
    } else {
        let trophy = new Trophy();
        trophy.trophy = req.body.trophy;
        trophy.name = req.body.name;
        trophy.description = req.body.description;

        trophy.save((err) => {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Trophy Added');
                res.redirect('/');
            }
        });
    }
});

router.post('/edit/:id', (req, res) => {
    let trophy = {};
    trophy.trophy = req.body.trophy;
    trophy.name = req.body.name;
    trophy.description = req.body.description;

    let query = {
        _id: req.params.id
    }

    Trophy.update(query, trophy, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Trophy Update');
            res.redirect('/');
        }
    });
});

router.delete('/:id', (req, res) => {
    if (!req.user._id) {
        res.status(500).send();
    }
    let query = {
        _id: req.params.id
    }
    Trophy.findById(req.params.id, (err, trophy) => {
        Trophy.remove(query, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send('Success');
            }
        });
    })

});

router.get('/:id', (req, res) => {
    Trophy.findById(req.params.id, (err, trophy) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('trophy', {
                trophy: trophy
            })
        }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
};

module.exports = router;