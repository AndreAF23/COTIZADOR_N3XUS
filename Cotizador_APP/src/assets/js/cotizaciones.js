let cajaCotizaciones = document.getElementById("filaCotizaciones")
const buscadorCotizaciones = document.getElementById("buscador");
const paginador = document.getElementById("paginador");
let data = [];
let currentPage = 1;
const itemsPerPage = 10;
let dataFiltrada = [];
let estadoCotizacion = "";

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
buscadorCotizaciones.addEventListener("input", debounce(() => {
    const searchTerm = buscadorCotizaciones.value.toLowerCase();
    dataFiltrada = data.filter(dat => dat.Cliente.toLowerCase().includes(searchTerm));
    currentPage = 1; // Restablecer a la primera página
    pintarCotizaciones(dataFiltrada);
}, 300));


(async () => {
    await pintarCotizaciones()
})();



//Funcion generica para mostrar las cotizaciones
async function pintarCotizaciones(cotizaciones = data){

    if (!cotizaciones.length) {
        try {
            let respuesta = await fetch(`http://181.177.228.193:8082/api/Cotizacion?usuario=${localStorage.getItem("usuario")}`);
            cotizaciones = await respuesta.json();
             data = cotizaciones
        } catch (error) {
            console.error("Error al cargar cotizaciones:", error);
            // Manejo adecuado del error
        }
    }

   limpiarTabla(cajaCotizaciones); 
   const paginatedData = obtenerDatosPaginados(cotizaciones, currentPage, itemsPerPage);
   const docFragment = document.createDocumentFragment();

   
   paginatedData.forEach(({Cliente,FechaEmision,NroCot})=> {
       
       let parts = FechaEmision.split(" ");  // Separa la cadena en dos partes usando el espacio
       
       let fecha = parts[0];  // La fecha
       let hora = parts[1] + " " + parts[2];  // La hora, incluyendo a.m. o p.m.
       let estado = "";
       const trCotizacion = document.createElement("tr");
          
          fetch(`http://181.177.228.193:8082/api/CotizacionEstado?nrocot=${NroCot}`)
          .then(respuesta => respuesta.json())
          .then((data)=>{
              estado = data;

              trCotizacion.append(
                crearElemento("td",NroCot,"px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
                crearElemento("td",estado,
                `px-6 py-4 whitespace-no-wrap border-b border-gray-200 ${
                    estado === "COTIZACION" ? "font-bold text-red-700  " :
                    estado === "PEDIDO" ? "font-bold text-yellow-700" :
                    estado === "FACTURADO" ? "font-bold text-green-700" : ""
                }`
                ),
                crearElemento("td", Cliente,"px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
                crearElemento("td", fecha,"px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
                crearElemento("td", hora,"px-6 py-4 whitespace-no-wrap border-b border-gray-200"),
                crearElemento("td","📄","px-6 py-4 whitespace-no-wrap border-b border-gray-200 cursor-pointer",{
                    click: function() {
                         localStorage.setItem("nroCotizacion",NroCot);
                         location.href = "../views/modeloCotizacion.html"
                    }
                }),
                crearElemento("td","✏️","px-6 py-4 whitespace-no-wrap border-b border-gray-200 cursor-pointer",{
                    click: async function(){
                        let consulta = await fetch(`http://181.177.228.193:8082/api/CotizacionEstado?nrocot=${NroCot}`);
                        respuesta = await consulta.json();
                        if(respuesta=="COTIZACION"){
                            localStorage.setItem("nroEdicionCotizacion",NroCot);
                            location.href = "../views/crearCotizacion.html"
                        }else{
                            Swal.fire({
                                icon: "error",
                                title: "No se puede editar Cotizacion",
                                text: "Cotizacion ya está aprobada",
                                footer: ''
                              });
                        }
                         
                    }
                 })
    
              );

            })
           
        //   estado =  consulta.json();

          docFragment.appendChild(trCotizacion);
    });
    
     cajaCotizaciones.appendChild(docFragment);
     crearBotonesPaginador(cotizaciones.length);
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
            pintarCotizaciones(dataFiltrada.length ? dataFiltrada : data);
        }, "prev"));
    }

    // Botones de página
    for (let i = startPage; i <= endPage; i++) {
        paginador.appendChild(crearBotonPaginador(i, () => {
            currentPage = i;
            pintarCotizaciones(dataFiltrada.length ? dataFiltrada : data);
        }, "page", i === currentPage));
    }

    // Botón "Siguiente"
    if (currentPage < totalPages) {
        paginador.appendChild(crearBotonPaginador("Siguiente", () => {
            currentPage++;
            pintarCotizaciones(dataFiltrada.length ? dataFiltrada : data);
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
function crearElemento(tagName, textContent, classNames, eventHandler) {
    const elemento = document.createElement(tagName);

    if (textContent) {
        elemento.textContent = textContent;
    }

    if (classNames) {
        if (Array.isArray(classNames)) {
            classNames.forEach(className => elemento.classList.add(className));
        } else {
            classNames.split(' ').forEach(className => {
                if (className) elemento.classList.add(className);
            });
        }
    }

    if (eventHandler && typeof eventHandler === 'object') {
        Object.keys(eventHandler).forEach(key => {
            elemento.addEventListener(key, eventHandler[key]);
        });
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
    //alert(detectarDispositivo());
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

