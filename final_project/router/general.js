const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Customer already exists!" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop using async/await with Promise
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve) => {
            resolve(books);
        });
        const bookList = await getBooks;
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});

// Task 2 & Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
        }
    });

    getBookByISBN
        .then((book) => {
            return res.status(200).send(JSON.stringify(book, null, 4));
        })
        .catch((error) => {
            return res.status(error.status || 500).json({ message: error.message });
        });
});

// Task 3 & Task 12: Get book details based on author using async/await with Promise
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            let matchedBooks = {};
            const keys = Object.keys(books);
            keys.forEach((key) => {
                if (books[key].author.toLowerCase() === author.toLowerCase()) {
                    matchedBooks[key] = books[key];
                }
            });
            if (Object.keys(matchedBooks).length > 0) {
                resolve(matchedBooks);
            } else {
                reject({ status: 404, message: `No books found by author ${author}` });
            }
        });

        const booksResult = await getBooksByAuthor;
        return res.status(200).send(JSON.stringify(booksResult, null, 4));
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 4 & Task 13: Get all books based on title using async/await with Promise
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            let matchedBooks = {};
            const keys = Object.keys(books);
            keys.forEach((key) => {
                if (books[key].title.toLowerCase() === title.toLowerCase()) {
                    matchedBooks[key] = books[key];
                }
            });
            if (Object.keys(matchedBooks).length > 0) {
                resolve(matchedBooks);
            } else {
                reject({ status: 404, message: `No books found with title ${title}` });
            }
        });

        const booksResult = await getBooksByTitle;
        return res.status(200).send(JSON.stringify(booksResult, null, 4));
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
    }
});

// =========================================================================
// Functions retrieving books and details using Axios with async/await and Promises
// (Tasks 10-13 implementation using Axios)
// =========================================================================
const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using async/await with Axios
async function getAllBooksAxios() {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all books via Axios:", error.message);
        throw error;
    }
}

// Task 11: Get book details based on ISBN using Promise callbacks with Axios
function getBookByISBNAxios(isbn) {
    return axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error(`Error fetching ISBN ${isbn} via Axios:`, error.message);
            throw error;
        });
}

// Task 12: Get book details based on Author using async/await with Axios
async function getBooksByAuthorAxios(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author} via Axios:`, error.message);
        throw error;
    }
}

// Task 13: Get book details based on Title using async/await with Axios
async function getBooksByTitleAxios(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title ${title} via Axios:`, error.message);
        throw error;
    }
}

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
