import React, { useEffect, useState } from "react";
import axios from "axios";
import CheckoutModal from "./CheckoutModal";
import "./App.css";

export default function App() {
  const [view, setView] = useState("products");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  // 🔹 Load products from backend
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  // 🔹 Load cart from backend
  const loadCart = () => {
    axios
      .get("http://localhost:4000/api/cart")
      .then((res) => setCart(res.data.items || []))
      .catch((err) => console.error("Error loading cart:", err));
  };

  useEffect(() => {
    loadCart();
  }, []);

  // 🔹 Add item to cart
  const addToCart = async (productId) => {
    try {
      await axios.post("http://localhost:4000/api/cart", { productId, qty: 1 });
      loadCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // 🔹 Remove item from cart
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/cart/${id}`);
      loadCart();
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // 🔹 Submit checkout
  const handleCheckout = async (name, email) => {
    try {
      const { data } = await axios.post("http://localhost:4000/api/cart/checkout", {
        cartItems: cart,
        name,
        email,
      });
      alert(`✅ Checkout Successful!\nReceipt ID: ${data.receipt.id}\nTotal: $${data.receipt.total}`);
      loadCart();
      setShowCheckout(false);
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🛍️ Vibe Commerce</h1>
      </header>

      {/* Navigation Tabs */}
      <div className="tabs">
        <button
          className={view === "products" ? "active" : ""}
          onClick={() => setView("products")}
        >
          Products
        </button>
        <button
          className={view === "cart" ? "active" : ""}
          onClick={() => setView("cart")}
        >
          Cart ({cart.length})
        </button>
      </div>

      {/* Products View */}
      {view === "products" && (
        <div className="grid">
          {products.map((p) => (
            <div key={p.id} className="card">
              {/* Product Image */}
              {p.image && (
                <img
                  src={`http://localhost:4000${p.image}`}
                  alt={p.name}
                  className="product-img"
                />
              )}
              <h3>{p.name}</h3>
              <p>${Number(p.price).toFixed(2)}</p>
              <button className="add-btn" onClick={() => addToCart(p.id)}>
                🛒 Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cart View */}
      {view === "cart" && (
        <div className="cart">
          <h2 className="cart-title">🧺 Your Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <p>
                    {item.name} — ${Number(item.price).toFixed(2)} × {item.qty}
                  </p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
              <button className="checkout" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cart}
        onSubmit={handleCheckout}
      />
    </div>
  );
}
