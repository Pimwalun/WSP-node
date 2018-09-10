const express = require('express')
const router = express.Router()

// News Model
let New = require('../models/new')

// User Model
let User = require('../models/user')

router.get('/add', ensureAuthenticated, function (req, res) {
  res.render('add_news', {
    title: 'Add News',
  })
})

router.post('/add', function (req, res) {
  req.checkBody('title', 'Title is required').notEmpty()
  // req.checkBody('author', 'Author is required').notEmpty()
  req.checkBody('content', 'Body is required').notEmpty()

  let errors = req.validationErrors()

  if (errors) {
    res.render('add_news', {
      title: 'Add News',
      errors: errors
    })
  } else {
    let news = new New()
    news.title = req.body.title
    news.author = req.user._id
    news.body = req.body.content

    news.save(function (err) {
      if (err) {
        console.log(err)
        return
      } else {
        req.flash('success', 'News Added')
        res.redirect('/')
      }
    })
  }
})

router.get('/edit/:id', ensureAuthenticated, function (req, res) {
  New.findById(req.params.id, function (err, news) {
    if (news.author != req.user._id) {
      req.flash('danger', 'Not Authorized')
      res.redirect('/')
    }
    res.render('edit_news', {
      title: 'Edit News',
      news: news
    })
  })
})

router.post('/edit/:id', function (req, res) {

  let news = {}
  news.title = req.body.title
  news.author = req.user._id
  news.body = req.body.content

  let query = { _id: req.params.id }

  New.update(query, news, function (err) {
    if (err) {
      console.log(err)
    } else {
      req.flash('success', 'Article Update')
      res.redirect('/')
    }
  })
})

router.delete('/:id', function (req, res) {
  if (!req.user._id) {
    res.status(500).send()
  }
  let query = { _id: req.params.id }

  New.findById(req.params.id, function (err, news) {
    if (news.author != req.user._id) {
      res.status(500).send()
    } else {
      New.remove(query, function (err) {
        if (err) {
          console.log(err)
        }
        res.send('Sucess')
      })
    }
  })
})

router.get('/:id', function (req, res) {
  New.findById(req.params.id, function (err, news) {
    User.findById(news.author, function (err, user) {
      res.render('new', {
        news: news,
        author: user.name
      })
    })
  })
})

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please login')
    res.redirect('/users/login')
  }
}

module.exports = router