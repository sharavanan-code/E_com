const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const db = require("./db");
const path = require("path");  

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

app.get('/', (req, res) => res.json({msg : 'Vibe Commerce Mock API'}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Backend running on', PORT));