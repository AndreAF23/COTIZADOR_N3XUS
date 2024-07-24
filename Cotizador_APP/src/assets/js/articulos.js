const buscadorProductos = document.getElementById("buscador");
const cajaProductos = document.getElementById("filaProductos");
const paginador = document.getElementById("paginador");
let data = [];
let currentPage = 1;
const itemsPerPage = 10;
let dataFiltrada = [];
const usuarioLS = localStorage.getItem("usuario");

// Redirigir si no hay usuario
if (!usuarioLS) {
    localStorage.removeItem("usuario");
    location.href = "../../../index.html";
}

// Debounce para la función de búsqueda
const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
};

// Evento de búsqueda con Debounce
buscadorProductos.addEventListener("input", debounce(() => {
    const searchTerm = buscadorProductos.value.toLowerCase();
    dataFiltrada = data.filter(dat => dat.Descripcion.toLowerCase().includes(searchTerm));
    currentPage = 1; // Restablecer a la primera página
    mostrarProductos(dataFiltrada);
}, 300));

// Inicializar la carga de productos
(async () => {
    await mostrarProductos();
})();

// Función genérica para mostrar productos
async function mostrarProductos(productos = data) {
    if (!productos.length) {
        try {
            const url = 'http://181.177.228.193:8082/api/Articulo';
            const respuesta = await fetch(url);
            productos = await respuesta.json();
            data = productos; // Guardar los datos originales
        } catch (error) {
            console.error("Error al cargar productos:", error);
            // Manejo adecuado del error
        }
    }

    limpiarTabla(cajaProductos);
    const paginatedData = obtenerDatosPaginados(productos, currentPage, itemsPerPage);
    const docFragment = document.createDocumentFragment();

    paginatedData.forEach(({ Codigo, Descripcion, Marca, PrecioDol, Stock }) => {
        const trProducto = document.createElement("tr");
        trProducto.append(
            crearElemento("td", Codigo,"px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
            crearElemento("td", Descripcion, "px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
            crearElemento("td", Marca, "px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
            crearElemento("td", Stock,"px-6 py-4 whitespace-no-wrap border-b border-gray-200")
        );
        docFragment.appendChild(trProducto);
    });

    cajaProductos.appendChild(docFragment);
    crearBotonesPaginador(productos.length);
    scrollear();
}

// Función para obtener datos paginados
function obtenerDatosPaginados(datos, pagina, itemsPorPagina) {
    const start = (pagina - 1) * itemsPorPagina;
    const end = start + itemsPorPagina;
    return datos.slice(start, end);
}


// Función para crear botones del paginador
function crearBotonesPaginador(totalDatos) {
    const totalPages = Math.ceil(totalDatos / itemsPerPage);
    paginador.innerHTML = "";

    const visibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + visibleButtons - 1);

    // Botón "Anterior"
    if (currentPage > 1) {
        paginador.appendChild(crearBotonPaginador("Anterior", () => {
            currentPage--;
            mostrarProductos(dataFiltrada.length ? dataFiltrada : data);
        }, "prev"));
    }

    // Botones de página
    for (let i = startPage; i <= endPage; i++) {
        paginador.appendChild(crearBotonPaginador(i, () => {
            currentPage = i;
            mostrarProductos(dataFiltrada.length ? dataFiltrada : data);
        }, "page", i === currentPage));
    }

    // Botón "Siguiente"
    if (currentPage < totalPages) {
        paginador.appendChild(crearBotonPaginador("Siguiente", () => {
            currentPage++;
            mostrarProductos(dataFiltrada.length ? dataFiltrada : data);
        }, "next"));
    }
}


// Función para crear un botón del paginador
function crearBotonPaginador(texto, evento, clase, activo = false) {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.classList.add("button-paginator", `button-paginator-${clase}`);
    if (activo) {
        btn.classList.add("active");
    }
    btn.addEventListener("click", evento);
    return btn;
}

// Función para crear un elemento con texto y clase opcional
function crearElemento(tagName, textContent, classNames) {
    const elemento = document.createElement(tagName);
    if (textContent) elemento.textContent = textContent;
    if (classNames) {
        if (Array.isArray(classNames)) {
            // Si classNames es un array, añade cada clase del array
            classNames.forEach(className => {
                elemento.classList.add(className);
            });
        } else {
            // Si classNames es una cadena, divide y añade cada clase
            classNames.split(' ').forEach(className => {
                if (className) elemento.classList.add(className);
            });
        }
    }
    return elemento;
}

// Función para limpiar un elemento
function limpiarTabla(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function scrollear(){
    //console.log(detectarDispositivo());
    if(detectarDispositivo()=="Celular"){
        window.scrollBy(0, 950);
    }
}

function detectarDispositivo() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Detectar dispositivos móviles
    if (/windows phone/i.test(userAgent)) {
        return "Celular";
    }

    if (/android/i.test(userAgent)) {
        return "Celular";
    }

    // Detectar iPhone, iPod, iPad
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "Celular";
    }

    // Si no es ninguno de los anteriores, asumimos que es una PC
    return "PC";
}

