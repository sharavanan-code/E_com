import React from 'react'


export default function Cart({items, total, onRemove, onChangeQty}){
return (
<div className="cart">
<h2>Cart</h2>
{items.length === 0 && <p>Cart is empty</p>}
<ul>
{items.map(it => (
<li key={it.id} className="cart-item">
<div>
<strong>{it.name}</strong>
<div>₹{(it.price).toFixed(2)}</div>
</div>
<div>
<input type="number" min="1" value={it.qty} onChange={e => onChangeQty(it.id, Number(e.target.value))} />
<button onClick={() => onRemove(it.id)}>Remove</button>
</div>
</li>
))}
</ul>
<div className="total">Total: ₹{total.toFixed(2)}</div>
</div>
)
}