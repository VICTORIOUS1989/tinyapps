const express = require("express");
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {
  let randomString = Math.random().toString(36).slice(-6);
  return randomString;
}
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const addNewUser = (email, password) => {
  const userId = generateRandomString();

  // Create a new user object
  const newUser = {
    id: userId,
    email,
    password,
  };

  users[userId] = newUser;

  return userId;
};


const findUserByEmail = (email) => {

  for (let userId in users) {
    if (users[userId].email === email) {
      return users[userId].id;
    }
  }

  return false;
};

const authenticateUser = (email, password) => {

  const user = findUserByEmail(email);
  if (user && user.password === password) {
    return user.id;
  }

  return false;

}

//check password
function checkPassword(email, password, users) {
  for (let user in users) {
    if (users[user].email === email) {
      return password === users[user].password;
    }
  }
  return false;
}

app.get("/urls", (req, res) => {
  const userID = req.body.user_id;
  const user = users[userID];

  let templateVars = { 
    user: user,
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    user: req.cookies["user_id"],
  };
  res.render("urls_new" , templateVars);
});

app.get("/urls/register", (req, res) => {

  res.render("register" );
});

app.get("/urls/login", (req, res) => {

  res.render("urls_login");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    user: req.cookies["user_id"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]  };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});




app.post("/urls", (req, res) => {
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = req.body.longURL;
    //console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL] ;
    //console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  shortUrl = req.params.shortURL;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL", (req, res) => {
  //console.log (urlDatabase[req.params.shortURL].longURL);
  //console.log(req.params)
  //console.log('Body parsed ', req.body);
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});

app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

 const user = findUserByEmail("user@example.com");
 let passwordCheck = checkPassword(userEmail, userPassword, users);
 console.log("the use id :" + user);

 if (user && passwordCheck) {
   res.cookie(`user_id`, user);
    res.redirect("/urls");

 } else {
   res.render("error", {ErrorStatus: 403, ErrorMessage: "Email/ Password entered is not valid!"});
 }

 /*
 //console.log(user);
 if (userEmail === '' || userPassword === '') {
  res.status(400).send('Sorry, incomplete login informaiton.\n<a class="navbar-brand" href="/urls">TinyApp</a>');
}
if (!user) {
  res.status(403).send('That email address does not exist.\n<a class="navbar-brand" href="/urls">TinyApp</a>');
}  else {
  res.cookie('user', user);
}

res.redirect("/urls");
*/


});

app.post("/logout", (req, res) => {
  res.clearCookie('user_id')
  res.redirect(`/urls`);

});

app.post("/register", (req, res) => {

  const password = req.body.password;
  const email = req.body.email;
  const user = findUserByEmail(email);

  if (email === '' || password === '') {
    res.status(400).send('Sorry, incomplete login informaiton.\n<a class="navbar-brand" href="/urls">TinyApp</a>');
  }
 if (user) {
    res.status(400).send('That email address already exists as a user.\n<a class="navbar-brand" href="/urls">TinyApp</a>');
  }

  if (!user) {
    const userId = addNewUser(email,password);
    res.cookie('user_id', userId);
    res.redirect(`/urls`); 
  }
 else {
    res.status(400).send ("user exist");
  }

});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


