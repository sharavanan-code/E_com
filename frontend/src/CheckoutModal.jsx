import React, { useState } from "react";

export default function CheckoutModal({ open, onClose, cartItems, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Checkout</h3>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="actions">
          <button onClick={() => onSubmit(name, email)}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

