// Import Dependencies
const express = require('express')
const Drink = require('../models/drink')
const url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita'
const fetch = require('node-fetch')
const { json } = require('express/lib/response')
// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	let drinkArr
	fetch(url)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
		//console.log(jsonData)
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		res.render('cocktail/index', {drinks: drinkArr})
	})
		
	// Drink.find({})
	// 	.then(drink => {
	// 		const username = req.session.username
	// 		const loggedIn = req.session.loggedIn
	// 		res.render('cocktail/index', { drink: drinkArr, drinkArr, username, loggedIn })
	// 	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's drink
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Drink.find({ owner: userId })
		.then(drink => {
			res.render('cocktail/index', { drink, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('cocktail/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Drink.create(req.body)
		.then(drink => {
			console.log('this was returned from create', drink)
			res.redirect('/drink')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const drinkId = req.params.id
	Drink.findById(drinkId)
		.then(drink => {
			res.render('cocktail/edit', { drink })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const drinkId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Drink.findByIdAndUpdate(drinkId, req.body, { new: true })
		.then(drink => {
			res.redirect(`/drink/${drink.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const drinkId = req.params.id
	Drink.findById(drinkId)
		.then(drink => {
            const {username, loggedIn, userId} = req.session
			res.render('cocktail/show', { drink, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const drinkId = req.params.id
	Drink.findByIdAndRemove(drinkId)
		.then(drink => {
			res.redirect('/drink')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
