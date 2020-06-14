
const bcrypt = require("bcrypt");

//returns true if email  exists in database
function getUserByEmail(email, database) {
  for (let user in database) {
    if (database[user].email == email) {
      return database[user].id;
    }
  }
}

const urlsForUser = function(userID, database) {
  let listURL = {};
  for (let key in database) {
    if (database[key].userID === userID) {
      listURL[key] = database[key];
    }
  }
  return listURL;
};

const searchEmail = function (email, users) {
  for (let key in users) {
    if (users[key]["email"] === email) {
      return key;
    }
  }
  return false;
};


module.exports = {searchEmail, urlsForUser};