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

function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBooks().then((bks) => res.send(JSON.stringify(bks, null, 4)));
});

// public_users.get('/', function (req, res) {
//   res.send(JSON.stringify(books, null, 4));
// });


function getByISBN(isbn) {
  return new Promise((resolve, reject) => {
    let isbnNum = parseInt(isbn);
    if (books[isbnNum]) {
      resolve(books[isbnNum]);
    } else {
      reject({ status: 404, message: `ISBN ${isbn} not found` });
    }
  });
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  getByISBN(req.params.isbn)
    .then(
      result => res.send(JSON.stringify(result, null, 4)),
      error => res.status(error.status).json({ message: error.message })
    );
});

// public_users.get('/isbn/:isbn', function (req, res) {
//   let isbn = req.params.isbn;
//   if (isbn) {
//     let book = books[isbn];
//     if (book) {
//       res.send(JSON.stringify(book, null, 4));
//     }
//     else res.status(403).json({ message: "Book not found" });
//   }
//   res.status(403).json({ message: "Provide a isbn number" });
// });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => {
      if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
      } else res.status(403).json({ message: "Author not found" });
    });
});

// public_users.get('/author/:author', function (req, res) {
//   let author = req.params.author;
//   if (author) {
//     let result = [];
//     for (const key in books) {
//       const element = books[key];
//       if (element["author"] === author) {
//         result.push(element);
//       }
//     }
//     if (result.length > 0) {
//       res.send(JSON.stringify(result, null, 4));
//     } else res.status(403).json({ message: "Author not found" });
//   }
//   return res.status(403).json({ message: "Please check your request" });
// });


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => {
      if (filteredBooks.length > 0) {
        res.send(JSON.stringify(filteredBooks, null, 4));
      } else res.status(403).json({ message: "Title not found" });
    });
});



// public_users.get('/title/:title', function (req, res) {
//   let title = req.params.title;
//   if (title) {
//     let result = [];
//     for (const key in books) {
//       const element = books[key];
//       if (element["title"] === title) {
//         result.push(element);
//       }
//     }
//     if (result.length > 0) {
//       res.send(JSON.stringify(result, null, 4));
//     } else res.status(403).json({ message: "Title not found" });
//   }

//   return res.status(403).json({ message: "Please check your request" });
// });

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
