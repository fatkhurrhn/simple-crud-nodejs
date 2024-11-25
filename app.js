const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));  // To serve static files (like CSS)

let items = [];  // This will temporarily hold the items

// Route to display the items (Home)
app.get('/', (req, res) => {
    let itemsList = items.map((item, index) => {
        return `<li>${item} <a href="/edit/${index}">Edit</a> | <a href="/delete/${index}">Delete</a></li>`;
    }).join('');
    
    const html = `
        <html>
        <head>
            <title>Simple CRUD</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <h1>CRUD Application</h1>
            <form action="/add" method="POST">
                <input type="text" name="item" placeholder="Enter item" required>
                <button type="submit">Add Item</button>
            </form>
            <ul>${itemsList}</ul>
        </body>
        </html>
    `;
    res.send(html);
});

// Route to add a new item
app.post('/add', (req, res) => {
    const newItem = req.body.item;
    if (newItem) {
        items.push(newItem);
    }
    res.redirect('/');
});

// Route to edit an item
app.get('/edit/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId) || itemId < 0 || itemId >= items.length) {
        return res.status(400).send('Invalid item ID');
    }
    
    const itemToEdit = items[itemId];
    const html = `
        <html>
        <head>
            <title>Edit Item</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <h1>Edit Item</h1>
            <form action="/update/${itemId}" method="POST">
                <input type="text" name="item" value="${itemToEdit}" required>
                <button type="submit">Update Item</button>
            </form>
            <a href="/">Go Back</a>
        </body>
        </html>
    `;
    res.send(html);
});

// Handle the form submission for editing an item
app.post('/update/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const updatedItem = req.body.item;

    if (isNaN(itemId) || itemId < 0 || itemId >= items.length) {
        return res.status(400).send('Invalid item ID');
    }

    if (updatedItem) {
        items[itemId] = updatedItem;
    }
    res.redirect('/');
});

// Route to delete an item
app.get('/delete/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    if (isNaN(itemId) || itemId < 0 || itemId >= items.length) {
        return res.status(400).send('Invalid item ID');
    }
    items.splice(itemId, 1);  // Remove the item by its index
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
