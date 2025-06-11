let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedor = document.getElementById("productos-container");
const carritoLista = document.getElementById("carrito-lista");
const totalCarrito = document.getElementById("total-carrito");
const btnVaciar = document.getElementById("vaciar-carrito");

async function obtenerProductos() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    productos = await res.json();
    renderProductos();
  } catch (error) {
    contenedor.innerHTML = "<p class='text-danger'>Error al cargar los productos.</p>";
    console.error("Error al cargar productos:", error);
  }
}

function renderProductos() {
  contenedor.innerHTML = "";
  productos.forEach(prod => {
    const div = document.createElement("div");
    div.className = "col-md-4";
    div.innerHTML = `
      <div class="card h-100">
        <img src="${prod.image}" class="card-img-top" alt="${prod.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${prod.title}</h5>
          <p class="card-text">$${prod.price}</p>
          <button class="btn btn-primary mt-auto agregar-carrito" data-id="${prod.id}">Agregar al carrito</button>
        </div>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

// 🛒 Delegación de eventos para botones
contenedor.addEventListener("click", e => {
  if (e.target.classList.contains("agregar-carrito")) {
    const id = parseInt(e.target.dataset.id);
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    guardarCarrito();
    renderCarrito();
  }
});

function renderCarrito() {
  carritoLista.innerHTML = "";
  let total = 0;
  carrito.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      ${item.title} - $${item.price.toFixed(2)}
      <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">X</button>
    `;
    carritoLista.appendChild(li);
  });
  totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

btnVaciar.addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  renderCarrito();
});

obtenerProductos();
renderCarrito();

