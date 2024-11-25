const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Menyajikan file statis dari folder 'public'
app.use(express.static('public'));  // Menggunakan middleware untuk file statis

app.use(bodyParser.urlencoded({ extended: true }));

let items = [];  // Menyimpan item sementara

// Route untuk tampilan utama (daftar item)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Route untuk menambahkan item baru
app.post('/add', (req, res) => {
    const newItem = req.body.item;
    if (newItem) {
        items.push(newItem);
    }
    res.redirect('/');
});

// Route untuk mengedit item
app.get('/edit/:id', (req, res) => {
    const itemId = req.params.id;
    const itemToEdit = items[itemId];
    res.sendFile(__dirname + '/views/edit.html');
});

// Route untuk memperbarui item
app.post('/update/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body.item;
    if (updatedItem) {
        items[itemId] = updatedItem;
    }
    res.redirect('/');
});

// Route untuk menghapus item
app.get('/delete/:id', (req, res) => {
    const itemId = req.params.id;
    items.splice(itemId, 1);  // Menghapus item berdasarkan index
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
