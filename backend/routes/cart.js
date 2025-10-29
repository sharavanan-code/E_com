const express = require('express');
const router = express.Router();
const db = require('../db');


//GET API
router.get('/', (req, res) => {
db.all('SELECT * FROM cart', (err, rows) => {
if (err) return res.status(500).json({error: err.message});
const total = rows.reduce((s, r) => s + r.price * r.qty, 0);
res.json({items: rows, total});
});
});

//POST API
router.post('/', (req, res) => {
const {productId, qty} = req.body;
if (!productId || !qty) return res.status(400).json({error: 'productId and qty required'});



db.get('SELECT id,name,price FROM products WHERE id = ?', [productId], (err, p) => {
if (err) return res.status(500).json({error: err.message});
if (!p) return res.status(404).json({error: 'Product not found'});



db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, existing) => {
if (err) return res.status(500).json({error: err.message});
if (existing) {
const newQty = existing.qty + Number(qty);
db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, existing.id], function(err) {
if (err) return res.status(500).json({error: err.message});
res.json({message: 'Cart updated'});
});
} else {
db.run('INSERT INTO cart (productId,name,price,qty) VALUES (?,?,?,?)', [p.id, p.name, p.price, qty], function(err) {
if (err) return res.status(500).json({error: err.message});
res.json({message: 'Added to cart', id: this.lastID});
});
}
});
});
});

//DELETE API
router.delete('/:id', (req, res) => {
const id = req.params.id;
db.run('DELETE FROM cart WHERE id = ?', [id], function(err) {
if (err) return res.status(500).json({error: err.message});
if (this.changes === 0) return res.status(404).json({error: 'Cart item not found'});
res.json({message: 'Removed'});
});
});

// PUT API
router.put('/:id', (req, res) => {
const id = req.params.id;
const {qty} = req.body;
if (qty == null) return res.status(400).json({error: 'qty required'});
db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, id], function(err) {
if (err) return res.status(500).json({error: err.message});
if (this.changes === 0) return res.status(404).json({error: 'Cart item not found'});
res.json({message: 'Updated'});
});
});

// POST APi
router.post('/checkout', (req, res) => {
const {cartItems, name, email} = req.body;
if (!cartItems || !Array.isArray(cartItems) || !name || !email) {
return res.status(400).json({error: 'cartItems, name, email required'});
}
const total = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
const receipt = {
id: 'r_' + Date.now(),
name,
email,
total,
timestamp: new Date().toISOString(),
items: cartItems
};


db.run('DELETE FROM cart', [], function(err) {
if (err) return res.status(500).json({error: err.message});
res.json({receipt});
});
});

module.exports = router;