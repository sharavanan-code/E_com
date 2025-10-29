const API = process.env.VITE_API_BASE || 'http://localhost:4000';


export async function fetchProducts() {
const r = await fetch(`${API}/api/products`);
return r.json();
}


export async function fetchCart() {
const r = await fetch(`${API}/api/cart`);
return r.json();
}


export async function addToCart(productId, qty=1) {
const r = await fetch(`${API}/api/cart`, {method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({productId, qty})});
return r.json();
}


export async function removeCartItem(id) {
const r = await fetch(`${API}/api/cart/${id}`, {method: 'DELETE'});
return r.json();
}


export async function updateCartItem(id, qty) {
const r = await fetch(`${API}/api/cart/${id}`, {method: 'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify({qty})});
return r.json();
}


export async function checkout(cartItems, name, email) {
const r = await fetch(`${API}/api/cart/checkout`, {method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({cartItems, name, email})});
return r.json();
}