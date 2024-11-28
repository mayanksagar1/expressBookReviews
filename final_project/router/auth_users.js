const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return false if any user with the same username is found, otherwise true
  if (userswithsamename.length > 0) {
    return false;
  } else {
    return true;
  }
};

const authenticatedUser = (username, password) => { //returns boolean
  let validUser = users.filter((user) => user["username"] === username && user["password"] === password);
  if (validUser.length > 0) return true;
  else return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, "access", { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken, username
      };

      return res.status(200).send(`User with the name ${username} has been logged in`);
    } else return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

  return res.status(404).json({ message: "Error logging in" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.query.review;
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  if (review) {
    let reviews = books[isbn]["reviews"];
    reviews[username] = review;
    res.status(200).send(JSON.stringify(reviews, null, 4));
  } else res.status(403).json({ message: "please add a review" });
  return res.status(404).json({ message: "Error not responding" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization.username;
  let isbn = req.params.isbn;
  if (isbn) {
    delete books[isbn]["reviews"][username];
    res.status(200).json({ message: `Review on the book having isbn ${isbn} , by the user ${username} has been deleted` });
  } else res.status(403).json({ message: "Please provide a isbn number" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
