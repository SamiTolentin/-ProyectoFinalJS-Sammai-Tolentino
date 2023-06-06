
let productos = [];
//DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector(".titulo-principal");
const inputBuscar = document.querySelector("#input-buscar");
const numerito = document.querySelector("#numerito");
let botonesAgregar;

// Función asincrónica para cargar los datos de productos desde un archivo JSON
async function cargarDatos() {
    try {
        const response = await fetch('./js/productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        const data = await response.json();

        // Mapea los datos en objetos de la clase Productos y los guarda en la variable 'productos'
        const productos = data.map(productoData => new Productos(
            productoData.id,
            productoData.titulo,
            productoData.imagen,
            productoData.categoria,
            productoData.precio
        ));

        return productos;
    } catch (error) {
        throw error;
    }
}

// Función principal que carga los datos y muestra los productos en la página
async function miFuncion() {
    try {
        const data = await cargarDatos();
        // Crea objetos de la clase Productos a partir de los datos y los guarda en la variable 'productos'
        productos = data.map(productoData => new Productos(
            productoData.id,
            productoData.titulo,
            productoData.imagen,
            productoData.categoria,
            productoData.precio
        ));
        cargarProductos(productos);
        
    } catch (error) {
        console.error(error);
    }
    
}

miFuncion()
// Función para cargar y mostrar los productos seleccionados
function cargarProductos(productosElegidos, filtro = '') {
    contenedorProductos.innerHTML = "";
  
    productosElegidos.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="producto-detalles">
          <h3 class="producto-titulo">${producto.titulo}</h3>
          <p class="producto-precio">$${producto.precio}</p>
          <button class="producto-agregar" id="${producto.id}">Agregar</button>
        </div>           
      `;
  
      contenedorProductos.append(div);
    });
  
    actualizarBotonesAgregar();
  }
  
  function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
  
    botonesAgregar.forEach(boton => {
      boton.addEventListener("click", agregarAlCarrito);
    });
  }
  // Agrega eventos de clic a los botones de categoría
  botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
      botonesCategorias.forEach(boton => boton.classList.remove("active"));
      e.currentTarget.classList.add("active");
  
      if (e.currentTarget.id !== "todos") {
        const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
        tituloPrincipal.innerText = productoCategoria.categoria.nombre;
        const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
        cargarProductos(productosBoton);
      } else {
        tituloPrincipal.innerText = "Todos los Productos";
        cargarProductos(productos);
      }
    });
  });
  //Buscador de productos
  if (inputBuscar) {
    inputBuscar.addEventListener("input", () => {
      const filtro = inputBuscar.value.toLowerCase();
      const productosFiltrados = productos.filter(producto => producto.titulo.toLowerCase().includes(filtro));
      cargarProductos(productosFiltrados, filtro);
    });
  }
  // Verifica si hay productos en el carrito almacenados en el almacenamiento local
  let productosEnCarrito = [];
  const productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
  
  if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
  }
  // Agrega una animación de vibración al icono del carrito
  function vibrarIconoCarrito() {
    const iconoCarrito = document.querySelector("#icono-carrito");
    iconoCarrito.classList.add("vibrar");
  
    setTimeout(() => {
      iconoCarrito.classList.remove("vibrar");
    }, 1000);
  }
  // Elimina la animación de vibración del icono del carrito cuando se carga el contenido
  document.addEventListener("DOMContentLoaded", () => {
    const iconoCarrito = document.querySelector("#icono-carrito");
    if (iconoCarrito) {
      iconoCarrito.classList.remove("vibrar");
    }
  });
  // Muestra una notificación de producto agregado al carrito utilizando la biblioteca Toastify
  function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);
  
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
      const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
      productosEnCarrito[index].cantidad++;
    } else {
      productoAgregado.cantidad = 1;
      productosEnCarrito.push(productoAgregado);
    }
  
    actualizarNumerito();
    vibrarIconoCarrito();
  
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
      // Mostrar el mensaje de Toastify con el nombre del producto
    Toastify({
      text: `Agregaste ${productoAgregado.titulo} al carrito`,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#f33232",
        borderRadius: "1rem",
        textTransform: "uppercase",
        fontSize: ".85rem"
      },
      onClick: function () { },
      offset: {
        x: '1rem',
        y: '1rem'
      },
    }).showToast();
  }
  // Actualiza el número de productos en el carrito
  function actualizarNumerito() {
    const numerito = document.getElementById("numerito");
  
    if (numerito) {
      const nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
      numerito.innerText = nuevoNumerito;
    }
  }