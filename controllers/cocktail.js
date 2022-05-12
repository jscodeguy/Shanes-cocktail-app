// Import Dependencies
const express = require("express");
const Drink = require("../models/drink");
const url = "https://www.thecocktaildb.com/api/json/v1/1";
const fetch = require("node-fetch");
// Create router
const router = express.Router();

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted.
router.use((req, res, next) => {
  // checking the loggedIn boolean of our session
  if (req.session.loggedIn) {
    // if they're logged in, go to the next thing(thats the controller)
    next();
  } else {
    // if they're not logged in, send them to the login page
    res.redirect("/auth/login");
  }
});

router.get("/drop", (req, res) => {
  res.render("dropdown");
});

////////////////////////////////////////////////////////////
//    the home page/where the random drink is displayed  //
///////////////////////////////////////////////////////////
router.get("/", (req, res) => {
  let drinkArr;
  fetch(`${url}/random.php`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      console.log(drinkArr)
      const { username, loggedIn, userId } = req.session;
      res.render("homepage", {
        drinks: drinkArr,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});


/////////////////////////////////
//    the drink search Route  //
////////////////////////////////
router.get("/search", (req, res) => {
    let drinkArr;
    const searchResult = req.body.searchRes
    fetch(`${url}/search.php?s=${searchResult}`)
      .then((apiResponse) => {
     return apiResponse.json();
      })
      .then((jsonData) => {
     drinkArr = jsonData.drinks;
        console.log(drinkArr);
        const { username, loggedIn, userId } = req.session;
        res.render("cocktail/search", {
          drinks: drinkArr,
          username,
          loggedIn,
          userId,
        });
      })
      .catch((error) => {
     res.redirect(`/error?error=${error}`);
      });
  });


/////////////////////////////////
//    the drink search Route  //
////////////////////////////////
router.post("/search", (req, res) => {
    let drinkArr;
    const searchResult = req.body.searchRes
    fetch(`${url}/search.php?s=${searchResult}`)
      .then((apiResponse) => {
        return apiResponse.json();
      })
      .then((jsonData) => {
        drinkArr = jsonData.drinks;
        //console.log(drinkArr);
        const { username, loggedIn, userId } = req.session;
        res.redirect("cocktail/apiDrinkView", {
          drinks: drinkArr,
          jsonData,
          username,
          loggedIn,
          userId,
        });
      })
      .catch((error) => {
        res.redirect(`/error?error=${error}`);
      });
  });


/////////////////////////////////
//    the alcoholic list Route  //
////////////////////////////////
router.get("/alcoholic", (req, res) => {
  let drinkArr;
  fetch(`${url}/list.php?a=list`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      console.log(drinkArr);
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/alcoholic", {
        drinks: drinkArr,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the categories list Route  //
////////////////////////////////
router.get("/category", (req, res) => {
  let drinkArr;
  fetch(`${url}/list.php?c=list`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/category", {
        drinks: drinkArr,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the glasses list Route  //
////////////////////////////////
router.get("/glasses", (req, res) => {
  let drinkArr;
  fetch(`${url}/list.php?g=list`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/glasses", {
        drinks: drinkArr,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the alcoholic show Route  //
////////////////////////////////
router.get("/alcoholic/drink/:filler", (req, res) => {
  let drinkArr;
  let filler = req.params.filler;
  fetch(`${url}/filter.php?a=${filler}`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/filteredShow", {
        drinks: drinkArr,
        filler,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the glasses show Route  //
////////////////////////////////
router.get("/glasses/drink/:filler", (req, res) => {
  let drinkArr;
  let filler = req.params.filler;
  fetch(`${url}/filter.php?g=${filler}`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/filteredShow", {
        drinks: drinkArr,
        filler,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the category show Route  //
////////////////////////////////
router.get("/category/drink/:filler", (req, res) => {
  let drinkArr;
  let filler = req.params.filler;
  fetch(`${url}/filter.php?c=${filler}`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/filteredShow", {
        drinks: drinkArr,
        filler,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

///////////////////////////////////////////////
//    show Route for all user favorited drinks //
///////////////////////////////////////////////
router.get("/fave", (req, res) => {
  //const drinkId = req.params.id;
  Drink.find({ owner: req.session.userId })
    .then((drinks) => {
     const { username, loggedIn, userId } = req.session;
     res.render("cocktail/fave", { drinks: drinks, username, loggedIn, userId });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

////////////////////
//    create Route  //
////////////////////
router.post("/favedrink", (req, res) => {
  req.body.strAlcoholic = req.body.strAlcoholic === "on" ? true : false;
  req.body.owner = req.session.userId;
  req.body.idDrink = req.body.idDrinkDrink
  console.log('this is body', req.body)
  Drink.create(req.body)
    .then((drink) => {
      console.log('inside promise log', drink)
      console.log('the drink id', drink.idDrink)
      res.redirect("/drink/fave");
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

///////////////////////////////////////////////
//    show Route for all user created drinks //
///////////////////////////////////////////////
router.get("/mine", (req, res) => {
  const drinkId = req.params.id;
  Drink.find({ owner: req.session.userId })
    .then((drinks) => {
      const { username, loggedIn, userId } = req.session;
      res.render("userCreatedDrinks", { drinks: drinks, username, loggedIn, userId });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

//////////////////////////////////////////////////////
//    new Route - the form for creating a new route //
/////////////////////////////////////////////////////
router.get("/new", (req, res) => {
  const { username, userId, loggedIn } = req.session;
  res.render("cocktail/new", { username, loggedIn });
});

////////////////////
//    create Route  //
////////////////////
router.post("/", (req, res) => {
  req.body.strAlcoholic = req.body.strAlcoholic === "on" ? true : false;
  req.body.owner = req.session.userId;
  Drink.create(req.body)
    .then((drink) => {
      res.redirect("/drink/mine");
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

////////////////////
//    edit Route  //
////////////////////
router.get("/:id/edit", (req, res) => {
  const drinkId = req.params.id;
  Drink.findById(drinkId)
    .then((drink) => {
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/edit", { drink, username, loggedIn, userId });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

////////////////////
//    update Route  //
////////////////////
router.put("/:id/edit", (req, res) => {
  const drinkId = req.params.id;
  req.body.strAlcoholic = req.body.strAlcoholic === "on" ? true : false;
  Drink.findByIdAndUpdate(drinkId, req.body, { new: true })
    .then((drink) => {
      const { username, loggedIn, userId } = req.session;
      res.redirect(`/drink/mine`);
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the drink show page  //
////////////////////////////////
router.get("/view/:filler", (req, res) => {
  let drinkArr;
  let filler = req.params.filler;
  fetch(`${url}/lookup.php?i=${filler}`)
    .then((apiResponse) => {
      return apiResponse.json();
    })
    .then((jsonData) => {
      drinkArr = jsonData.drinks;
      const { username, loggedIn, userId } = req.session;
      res.render("cocktail/apiDrinkView", {
        drinks: drinkArr,
        filler,
        username,
        loggedIn,
        userId,
      });
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

/////////////////////////////////
//    the delete Route  //
////////////////////////////////
router.delete("/:id", (req, res) => {
  const drinkId = req.params.id;
  Drink.findByIdAndRemove(drinkId)
    .then((drink) => {
      res.redirect("/drink");
    })
    .catch((error) => {
      res.redirect(`/error?error=${error}`);
    });
});

// Export the Router
module.exports = router;
