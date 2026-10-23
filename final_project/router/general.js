const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User registered successfully"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const matchingBooks = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  return res.status(200).json(matchingBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const matchingBooks = Object.values(books).filter(
    book => book.title.toLowerCase() === title
  );

  return res.status(200).json(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});
// Task 10: Get all books using Promise and Axios
public_users.get('/async/books', function (req, res) {
  axios.get('http://localhost:5000/')
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error retrieving books" });
    });
});

// Task 11: Get a book by ISBN using async/await and Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(
      `http://localhost:5000/isbn/${encodeURIComponent(req.params.isbn)}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Error retrieving book"
    });
  }
});

// Task 12: Get books by author using async/await and Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = encodeURIComponent(req.params.author);
    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Error retrieving books"
    });
  }
});

// Task 13: Get books by title using async/await and Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const title = encodeURIComponent(req.params.title);
    const response = await axios.get(
      `http://localhost:5000/title/${title}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Error retrieving books"
    });
  }
});
module.exports.general = public_users;
