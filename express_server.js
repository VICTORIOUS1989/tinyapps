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

 

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls", (req, res) => {

  let templateVars = { 
    username: req.cookies["username"],
    urls: urlDatabase 
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
  };
  res.render("urls_new" , templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
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

  res.cookie('username', req.body.username)
  res.redirect(`/urls`);

});

app.post("/logout", (req, res) => {
  res.clearCookie('username')
  res.redirect(`/urls`);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


