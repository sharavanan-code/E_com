const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'vibe.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // ✅ Create Products Table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT,
      price REAL,
      image TEXT
    )
  `);

  // ✅ Create Cart Table
  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT,
      name TEXT,
      price REAL,
      qty INTEGER
    )
  `);

  // ✅ Seed data
  db.get('SELECT COUNT(*) as c FROM products', (err, row) => {
    if (err) return console.error(err);
    if (row.c === 0) {
      const products = [
        { id: 'p1', name: 'Vibe T-shirt', price: 200, image: '/images/vibe_tshirt.jpg' },
        { id: 'p2', name: 'Vibe Hoodie', price: 500, image: '/images/vibe_hoodie.jpg' },
        { id: 'p3', name: 'Vibe Cap', price: 100, image: '/images/vibe_cap.jpg' },
        { id: 'p4', name: 'Vibe Mug', price: 50, image: '/images/vibe_mug.jpg' },
        { id: 'p5', name: 'Vibe Sticker Pack', price: 30, image: '/images/vibe_sticker_pack.jpg' }
      ];

      const stmt = db.prepare('INSERT INTO products (id, name, price, image) VALUES (?, ?, ?, ?)');
      products.forEach(p => stmt.run(p.id, p.name, p.price, p.image));
      stmt.finalize();
      console.log('✅ Seeded products with images');
    }
  });
});

module.exports = db;
