// Import Dependencies
const express = require('express')
const Drink = require('../models/drink')
const url = 'https://www.thecocktaildb.com/api/json/v1/1'
const fetch = require('node-fetch')
// const { json } = require('express/lib/response')
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
	fetch(`${url}/random.php`)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		//console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/index', {drinks: drinkArr, username, loggedIn, userId})
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

// alcoholic route
router.get('/alcoholic', (req, res) => {
	let drinkArr
	fetch(`${url}/list.php?a=list`)
	.then((apiResponse) => {
		return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/alcoholic', {drinks: drinkArr, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// category route
router.get('/category', (req, res) => {
	let drinkArr
	fetch(`${url}/list.php?c=list`)
	.then((apiResponse) => {
		return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/category', {drinks: drinkArr, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//glasses route
router.get('/glasses', (req, res) => {
	let drinkArr
	fetch(`${url}/list.php?g=list`)
	.then((apiResponse) => {
		return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/glasses', {drinks: drinkArr, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

//alcoholic show route
router.get('/alcoholic/drink/:filler', (req, res) => {
	let drinkArr
	let filler = req.params.filler
	fetch(`${url}/filter.php?a=${filler}`)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/show', {drinks: drinkArr, filler, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


//glasses show route
router.get('/glasses/drink/:filler', (req, res) => {
	let drinkArr
	let filler = req.params.filler
	fetch(`${url}/filter.php?g=${filler}`)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/show', {drinks: drinkArr, filler, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



//category show route
router.get('/category/drink/:filler', (req, res) => {
	let drinkArr
	let filler = req.params.filler
	fetch(`${url}/filter.php?c=${filler}`)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/show', {drinks: drinkArr, filler, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// // index that shows only the user's drink
// router.get('/mine', (req, res) => {
//     // destructure user info from req.session
//     const { username, userId, loggedIn } = req.session
// 	Drink.find({ owner: userId })
// 		.then(drink => {
// 			const { username, loggedIn, userId } = req.session
// 			res.render('index', { drink, username, loggedIn })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })


//----------------show created drink-----------------
//router.get('/mine/:id', (req, res) => {
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	const drinkId = req.params.id
	Drink.find({owner: req.session.userId})
		.then(drinks => {
			console.log('the drink we made\n', drinks)
            const {username, loggedIn, userId} = req.session
			res.render('index', { drinks: drinks, username, loggedIn, userId })
		})
		.catch((error) => {
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
	req.body.strAlcoholic = req.body.strAlcoholic === 'on' ? true : false

	req.body.owner = req.session.userId
	Drink.create(req.body)
		.then(drink => {
			console.log('this was returned from create', drink)
			res.redirect('/drink/mine')
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
			const { username, loggedIn, userId } = req.session
			res.render('cocktail/edit', { drink, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const drinkId = req.params.id

	Drink.findByIdAndUpdate(drinkId, req.body, { new: true })
		.then(drink => {
			res.redirect(`/drink/${drink.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// individual drink show route
router.get('/view/:filler', (req, res) => {
	
	let drinkArr
	let filler = req.params.filler
	console.log('this is the idDrink', filler)
	fetch(`${url}/lookup.php?i=${filler}`)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
		drinkArr = jsonData.drinks
		console.log(drinkArr)
		const { username, loggedIn, userId } = req.session
		res.render('cocktail/view', {drinks: drinkArr, filler, username, loggedIn, userId})
	})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})

	// const drinkId = req.params.id
	// Drink.findById(drinkId)
	// 	.then(drink => {
    //         const {username, loggedIn, userId} = req.session
	// 		res.render('cocktail/view', { drink, username, loggedIn, userId })
	// 	})
	// 	.catch((error) => {
	// 		res.redirect(`/error?error=${error}`)
	// 	})
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
