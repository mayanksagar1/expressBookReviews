const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      res.status(200).json({ message: `User with name ${username} has been successfully registered!! Now you can log in. ` });
    } else return res.status(404).json({ message: "User already exists!" });
  }
  return res.status(403).json({ message: "Please provide complete information" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    let book = books[isbn];
    if (book) {
      res.send(JSON.stringify(book, null, 4));
    }
    else res.status(403).json({ message: "Book not found" });
  }
  res.status(403).json({ message: "Provide a isbn number" });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  if (author) {
    let result = [];
    for (const key in books) {
      const element = books[key];
      if (element["author"] === author) {
        result.push(element);
      }
    }
    if (result.length > 0) {
      res.send(JSON.stringify(result, null, 4));
    } else res.status(403).json({ message: "Author not found" });
  }
  return res.status(403).json({ message: "Please check your request" });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  if (title) {
    let result = [];
    for (const key in books) {
      const element = books[key];
      if (element["title"] === title) {
        result.push(element);
      }
    }
    if (result.length > 0) {
      res.send(JSON.stringify(result, null, 4));
    } else res.status(403).json({ message: "Title not found" });
  }

  return res.status(403).json({ message: "Please check your request" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (isbn) {
    let result = books[isbn]["reviews"];
    if (result) {
      res.send(JSON.stringify(result, null, 4));
    }
    else res.status(403).json({ message: "Provide a correct isbn number" });
  }
  return res.status(403).json({ message: "Please check your request" });
});

module.exports.general = public_users;
