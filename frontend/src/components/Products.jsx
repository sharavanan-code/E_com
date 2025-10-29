import React from 'react'


export default function Products({products, onAdd}){
return (
<div className="grid">
{products.map(p => (
<div key={p.id} className="card">
<h3>{p.name}</h3>
<p>₹{(p.price).toFixed(2)}</p>
<button onClick={() => onAdd(p.id)}>Add to cart</button>
</div>
))}
</div>
)
}