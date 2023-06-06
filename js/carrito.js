//DOM
productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar")
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

function cargarProductosCarrito() {
    // Si hay productos en el carrito, se muestra el contenido y se ocultan otros elementos
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";
        // Iterar sobre los productos en el carrito y crear elementos HTML correspondientes
        productosEnCarrito.forEach(producto => {

            const div = document.createElement("div");
            div.classList.add("carrito-producto")
            div.innerHTML = `
             <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
             <div class="carrito-producto-titulo">
                 <small>Titulo</small>
                 <h3>${producto.titulo}</h3>
             </div>
             <div class="botones-cantidad">
                 <div class="carrito-producto-cantidad">
                     <p>Cantidad</p>
                     <button class="sumar-cantidad" data-id="${producto.id}">+</button>
                     <small>${producto.cantidad}</small>
                     <button class="restar-cantidad" data-id="${producto.id}">-</button>
                 </div>
             </div>
             <div class="carrito-producto-precio">
                 <small>Precio</small>
                 <p>$${producto.precio}</p>
             </div>
             <div class="carrito-producto-subtotal">
                 <small>Subtotal</small>
                 <p>$${(producto.precio * producto.cantidad).toFixed(3)}</p>
             </div>
             <button class="carrito-producto-eliminar" id="${producto.id}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            // Agregar el elemento div al contenedor de productos en el carrito
            contenedorCarritoProductos.append(div);
        });

        // Si no hay productos en el carrito, se muestra un mensaje y se ocultan otros elementos
    } else {

        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    };

    actulizarBotonesEliminar();
    actulizarTotal();

    // Asignar eventos a los botones de sumar y restar cantidad
    const botonesSumar = document.querySelectorAll(".sumar-cantidad");
    botonesSumar.forEach(boton => {
        boton.addEventListener("click", sumarCantidad);
    });

    const botonesRestar = document.querySelectorAll(".restar-cantidad");
    botonesRestar.forEach(boton => {
        boton.addEventListener("click", restarCantidad);
    });
    // Función para aumentar la cantidad de un producto en el carrito
    function sumarCantidad(e) {
        const id = e.currentTarget.dataset.id;
        const producto = productosEnCarrito.find(producto => producto.id === id);
        producto.cantidad++;
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
        cargarProductosCarrito();

    }
    // Función para reducir la cantidad de un producto en el carrito
    function restarCantidad(e) {
        const id = e.currentTarget.dataset.id;
        const producto = productosEnCarrito.find(producto => producto.id === id);
        if (producto.cantidad > 1) {
            producto.cantidad--;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
        }
    }

}

cargarProductosCarrito();
actulizarTotal();

function actulizarBotonesEliminar() {

    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

//Funcion para hacer el calculo total de mis productos
function actulizarTotal() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        Total.innerText = `$${totalCalculado.toFixed(3)}`;
    } else {
        Total.innerText = '$0.000';
    }
}

// Muestra una notificación del producto eliminado del carrito utilizando la biblioteca Toastify
function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto Eliminado Del Carrito",
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

    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    // asegurarse que el index es mayor o igual que 0
    if (index >= 0) {
        productosEnCarrito.splice(index, 1);
        cargarProductosCarrito();
        localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    }
}

//sweet alert para vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
    Swal.fire({
        title: 'Estas seguro?',
        text: "!Se van a eliminar todos tus productos¡",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si!'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito.length = 0;
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
            cargarProductosCarrito();
            Swal.fire({
                title: '¡Tus productos fueron eliminados!',
                html: 'Carrito vacio. <br><img src="./imagenes/imagenes formato SVG/the-simpsons-rata_1.gif" style="width: 300px; margin-top: 10px;">',
                icon: 'success'
            });
        };
    });
};

//sweet alert para procesar una compra
botonComprar.addEventListener("click", procesarCompra);

function procesarCompra() {
    Swal.fire({
        title: 'Ingrese sus datos para finalizar la compra',
        html:
            '<input id="nombre" class="swal2-input" placeholder="Nombre">' +
            '<input id="email" class="swal2-input" placeholder="Correo electrónico">' +
            '<input id="dni" class="swal2-input" placeholder="DNI" maxlength="8">' +
            '<input id="telefono" class="swal2-input" placeholder="Número de teléfono">',
        focusConfirm: false,
        showCancelButton: true,
        preConfirm: () => {
            const nombre = Swal.getPopup().querySelector('#nombre').value;
            const email = Swal.getPopup().querySelector('#email').value;
            const dni = Swal.getPopup().querySelector('#dni').value;
            const telefono = Swal.getPopup().querySelector('#telefono').value;

            // Validar datos
            if (!nombre || !email || !dni || !telefono) {
                Swal.showValidationMessage('Por favor, ingrese todos los datos personales');
                return false;
            }

            if (!validarCorreoElectronico(email)) {
                Swal.showValidationMessage('Ingrese un correo electrónico válido');
                return false;
            }

            const longitudDNI = 8;
            if (!esNumero(dni) || dni.length !== longitudDNI) {
                Swal.showValidationMessage(`El DNI debe ser un número de ${longitudDNI} caracteres`);
                return false;
            }

            if (!esNumero(telefono)) {
                Swal.showValidationMessage('El número de teléfono debe ser un número');
                return false;
            }

            return { nombre, email, dni, telefono };
        }

    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: '¡Compra finalizada con éxito!',
                html: '¡Gracias por su compra! <br><img src="./imagenes/imagenes formato SVG/gato-besando-a-la-camara.gif" style="width: 300px; margin-top: 10px;">',
            });
            // Limpiar el carrito
            productosEnCarrito.length = 0;
            localStorage.removeItem('productos-en-carrito');
            cargarProductosCarrito();
        };
    });
};

// Función para validar el formato de correo electrónico
function validarCorreoElectronico(correo) {
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexCorreo.test(correo);
}

// Función para validar si un valor es un número
function esNumero(valor) {
    return !isNaN(valor);
};