const selectPlazosPagos = document.getElementById("plzPagos");

const selectClienteVendedor = document.getElementById("clVendedor");
const datalist = document.getElementById("clientes");

const selectClienteDireccion = document.getElementById("clVendedorDirecciones");
const selectMoneda = document.getElementById("moneda");
const cuerpoTabla = document.getElementById("bdTabla");
const btnInsertarFila = document.getElementById("insFila");
const selectListaPrecios = document.getElementById("lstPrecios");
const btnCrearCotizacion = document.getElementById('creCoti');
const btnDescartarCotizacion = document.getElementById("dscCoti");
const cajaMontos = document.querySelector(".oculto");

const cajaSubTotal = document.getElementById("subtTotalGlobal");
const cajaIGV = document.getElementById("subtIGV");
const cajaTotal = document.getElementById("TotalGlobal");

const cajaTipoCambio = document.getElementById("tipoCambio");
const radioTCSunat = document.getElementById("tcsunat")
const radioTCManual = document.getElementById("tcmanual")

const cajaNumeroCotizacion = document.getElementById("disabled-input");
const cajaOrdenCompra = document.getElementById("first_name");
const cajaObservacion = document.getElementById("obs");
const smbMoneda = document.querySelectorAll(".lblMoneda")
let productos = [];
let opcionPrecio = "1";
let moneda = "DOLARES";
const SYMBOL_DOLLARS = "$";
const SYMBOL_LOCAL = "S/";
let cliente = ""
let direccionCliente = ""
let usuario = ""
let formaPago = "CONTADO"
let tipoCambio = ""
var nombreListaPrecio = "LISTA DE PRECIOS BASE"
let TotalSinDescuento = 0
let filaFilipina ;
let direccionentrega=""
let todosLosClientes = [];

let cajitaTipoCambio = document.getElementById("cajitaTipoCambio");

const nombreUsuario = localStorage.getItem("usuario");

let nroCotizacionEdicion = localStorage.getItem("nroEdicionCotizacion");

let clienteGanador = ""
let rucGanador = ""
const obtenerTodosLosClientes = async () => {
    if (todosLosClientes.length === 0) { 
        const respuesta = await fetch(`http://181.177.228.193:8082/api/Cliente?usuario=${nombreUsuario}`);
        todosLosClientes = await respuesta.json();
    }
};

const obtenerValidacionTC = async () => {
       
       let bandera = false;
       const respuesta = await fetch(`http://181.177.228.193:8082/api/TCManual?usuario=${nombreUsuario}`);
       let esValido = await respuesta.json();
       
     if(esValido=="1"){
         bandera = true;
      }
    return bandera;
}



const mostrarCoincidencias = (evento) => {
    const textoEntrada = selectClienteVendedor.value.toLowerCase();
    datalist.innerHTML = '';
    todosLosClientes.forEach(cliente => {
        if (cliente.Nombre.toLowerCase().includes(textoEntrada)) {
            let nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = cliente.Nombre;
            datalist.appendChild(nuevaOpcion);
        }
    });

    clienteGanador = evento;
    cliente = evento;
};

selectClienteVendedor.addEventListener('input', (e)=>{
      mostrarCoincidencias(e.target.value);
});
obtenerTodosLosClientes();


async function validar(){
 
    let variable = await   obtenerValidacionTC()
    
    if(variable){
         cajitaTipoCambio.classList.remove("hidden");
    }
    
    if (nroCotizacionEdicion){
        const respuesta = await fetch(`http://181.177.228.193:8082/api/CotizacionDetalle?numcot=${nroCotizacionEdicion}`)
        const datos = await respuesta.json();
        
        let {Observaciones,OC,NombreCliente,DireccionCliente,ListaPrecio,FormaPago,Moneda,DocumentoCliente,SubTotal,IGV,Total,Detalles} = datos[0];
        
        
        // productos = Detalles;
        cajaObservacion.value = Observaciones
        cajaNumeroCotizacion.value = nroCotizacionEdicion
        cajaOrdenCompra.value = OC
        // let indiceCliente = obtenerIndicePorValor(selectClienteVendedor,DocumentoCliente);
        // selectClienteVendedor.options.selectedIndex = indiceCliente
        selectClienteVendedor.value = NombreCliente
        // cliente = selectClienteVendedor.value
        cliente = NombreCliente;
        let ndoc=""
        for (let i = 0; i < todosLosClientes.length; i++) {
            if(todosLosClientes[i].Nombre==NombreCliente){
                ndoc = todosLosClientes[i].RUC;
                rucGanador = todosLosClientes[i].RUC;
            }
        }

        if(ListaPrecio.includes("   ")){
            ListaPrecio = ListaPrecio.substring(0, ListaPrecio.length-3) + '+' + ListaPrecio.substring(ListaPrecio.length-3 + 1);
        }
        
        const respuesta1 = await fetch(`http://181.177.228.193:8082/api/ClienteDirecciones?ndoc=${ndoc}`)
        const datos1 = await respuesta1.json();
        eliminarOpcionesDeSelect(selectClienteDireccion)
        for(var i=0;i<datos1.length;i++){
            agregarOption(selectClienteDireccion,datos1[i]);             
        }

        let indiceDireccion = obtenerIndicePorTexto(selectClienteDireccion,DireccionCliente);
        selectClienteDireccion.options.selectedIndex = indiceDireccion;

        let indiceLP = obtenerIndicePorTexto(selectListaPrecios,ListaPrecio);
        selectListaPrecios.options.selectedIndex = indiceLP;

        let indiceMoneda = obtenerIndicePorValor(selectMoneda,Moneda.toUpperCase());
        selectMoneda.options.selectedIndex = indiceMoneda;

        
        Detalles.forEach(producto=>{

            let precioAPI
            let monedaAPI 
            
            let {Codigo,Cantidad,Descripcion,Marca,PrecioUnitario,ValorUnitario,Importe,Stock} = producto

            fetch(`http://181.177.228.193:8082/api/Precio?codigo=${Codigo}`)
            .then(respuesta => respuesta.json())
            .then( data => {
                 precioAPI=data[0]
                 monedaAPI=data[1]
            }    
            ).finally(()=>{
                const fila = crearElemento("tr", {}, [
                    crearElemento("td", {}, [crearInputConDatalist()]),
                    crearElemento("td",{"textContent":Descripcion,"data-moneda":monedaAPI,"data-precio":precioAPI}),
                    crearElemento("td",{"textContent":Marca,"style":"text-align:center"}),
                    crearElemento("td", {}, [crearElemento("input", { type: "number", min: 0 })]),
                    crearElemento("td",{"textContent":Number(PrecioUnitario).toFixed(4),"style":"text-align:center"}),
                    crearElemento("td",{"textContent":Number(ValorUnitario).toFixed(4),"style":"text-align:center"}),
                    crearElemento("td",{"textContent":Number(Importe).toFixed(4),"style":"text-align:center"}),
                    crearElemento("td", {
                        "textContent": Number(Stock).toFixed(0),
                        "style": `color:${Stock <= 0 ? 'red' : 'green'}; text-align:center; font-weight:bold`
                    }), 
                    crearElemento2("td","🗑️","cursor-pointer text-center",{
                        click: function() {
                            eliminarFila(this);
                            actualizarSubtotalGlobal();
                        }
                    })
                ]);
            
                cajaMontos.classList.add("visible");
                const inpProducto = fila.childNodes[0].firstChild;
                const inpCantidad = fila.childNodes[3].firstChild;
                inpCantidad.value=Number(Cantidad).toFixed(0)
                const tdPrecioUnitario = fila.childNodes[5];
                const tdSubTotal = fila.childNodes[6];
    
                cajaSubTotal.textContent = Number(SubTotal).toFixed(4);
                cajaIGV.textContent = Number(IGV).toFixed(4);
                cajaTotal.textContent = Number(Total).toFixed(4);
                
    
            filaFilipina = fila
    
            inpCantidad.addEventListener('input', () => {
                //console.log("cpp");
                actualizarDetalle();
                actualizarSubtotalGlobal();
                
                });
                inpProducto.value=Codigo
                inpProducto.addEventListener('input', function() {
                    const filtro = this.value.toLowerCase();
                    productos.forEach(producto => {
                        if (`[${producto.Codigo}] ${producto.Descripcion}`.toLowerCase().includes(filtro)) {
                            const elem = crearElemento('div', { textContent: `[${producto.Codigo}] ${producto.Descripcion}`, className: 'opcion' });
                            elem.onclick = () => {
                                seleccionarProducto(producto, fila);
                                actualizarSubtotal(inpCantidad, parseFloat(tdPrecioUnitario.textContent) || 0, tdSubTotal);
                               };}});});
                cuerpoTabla.insertBefore(fila, document.getElementById("nodoExistente"));
                
            })

            
            });
            
            
    }else{
        iniciarEscuchaActiva();
    }
    
}

function obtenerIndicePorValor(elemento, valor) {
    for (var i = 0; i < elemento.options.length; i++) {
      if (elemento.options[i].value === valor) {
        return i;
      }
    }
    return -1; // Retorna -1 si no se encuentra el valor
  }

  function obtenerIndicePorTexto(elemento, valor) {
    for (var i = 0; i < elemento.options.length; i++) {
      if (elemento.options[i].textContent === valor) {
        return i;
      }
    }
    return -1; // Retorna -1 si no se encuentra el valor
  }
  

// Variables globales
 
let subTotalGlobal = 0;
let IGV = 0;
let total = 0;

btnDescartarCotizacion.onclick = () => location.reload();
selectMoneda.onchange = (e) =>  moneda = e.target.value;


selectMoneda.addEventListener('change',()=>{
    actualizarDetalle();
    actualizarSubtotalGlobal();
});

selectClienteVendedor.onchange = (e) => {
    cliente = e.target.value;
    actualizarDetalle();
    actualizarSubtotalGlobal();
}
selectPlazosPagos.onchange = (e) => {
    formaPago = e.target.value;
    actualizarDetalle();
    actualizarSubtotalGlobal();
}

selectListaPrecios.addEventListener("change",()=>{
    opcionPrecio = selectListaPrecios.value
    // Obtener el índice de la opción seleccionada
    let indiceSeleccionado =  selectListaPrecios.value;
    // Obtener el objeto option seleccionado
     let opcionSeleccionada = selectListaPrecios.options[indiceSeleccionado-1];
     
    // Obtener el texto de la opción seleccionada
   nombreListaPrecio =  opcionSeleccionada.text;
   
   actualizarDetalle();
   actualizarSubtotalGlobal();
});

selectClienteVendedor.addEventListener("input",async ()=>{
    eliminarOpcionesDeSelect(selectClienteDireccion)
    var ndoc = ""
    //console.log(todosLosClientes);
    //busco el ruc por el nombre del cliente
    for(let i=0;i<todosLosClientes.length;i++){
        if(todosLosClientes[i].Nombre==clienteGanador){
            ndoc=todosLosClientes[i].RUC;
            rucGanador = ndoc;
        }
    }
    if(ndoc==""){
        selectClienteDireccion.innerHTML='';

        var nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = '--Seleccionar--'; // Establece el valor que necesitas
        nuevaOpcion.text = '--Seleccionar--'; // Establece el texto que se mostrará
        selectClienteDireccion.appendChild(nuevaOpcion);
    }
    //console.log("RUC: " + ndoc);
    
    const respuesta = await fetch(`http://181.177.228.193:8082/api/ClienteDirecciones?ndoc=${ndoc}`)
    const datos = await respuesta.json();

    for(var i=0;i<datos.length;i++){
        agregarOption(selectClienteDireccion,datos[i]);
    }

});

function agregarOption(selectElement, valor) {
    
    var nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = valor;
    nuevaOpcion.text = valor;

    selectElement.add(nuevaOpcion);
}

function eliminarOpcionesDeSelect(selectElement) {
    
    while (selectElement.options.length > 0) {
        selectElement.remove(0);
    }
}
selectClienteDireccion.onchange = (e) => {
    direccionentrega = selectClienteDireccion.value
}



selectListaPrecios.addEventListener('change',()=>{
    var subTotalGlobalCD = 0;
    // Assuming tablaDetalle is already defined and is the table you're iterating over
    for (var i = 0; i < tablaDetalle.rows.length-1; i++) {
        // Get the current row
        var filaActual = tablaDetalle.rows[i];
        // Now get the 6th cell's value (assuming the cells start at index 0)
        var importe = parseFloat(filaActual.cells[6].innerHTML); // cells are 0-indexed so the 6th cell is at index 5
        subTotalGlobalCD += importe;
    }
    // Update the content of the cajas
    if(moneda=="SOLES"){
         subTotalGlobal = subTotalGlobal * tipoCambio;
    }else{
        subTotalGlobal = subTotalGlobal;
    }

    cajaSubTotal.textContent = subTotalGlobalCD.toFixed(4);
    cajaIGV.textContent = (subTotalGlobalCD * 0.18).toFixed(4);
    cajaTotal.textContent = (subTotalGlobalCD * 1.18).toFixed(4);
})


var revisarDato
var pasar=true
const tablaDetalle = document.getElementById("bdTabla")
btnCrearCotizacion.onclick = async () => {
    if(cliente==""){
        alert("Seleccione Cliente");
    }else{
        
        var filas = tablaDetalle.rows.length;
        if(filas<2){
            alert("Ingrese Detalle");
        }else{
            // Recorrer las filas
            for (var i = 0; i < tablaDetalle.rows.length-1; i++) {
                // Obtener las celdas de la fila actual
                var filaActual = tablaDetalle.rows[i].cells;

                // Recorrer las celdas
                for (var j = 0; j < filaActual.length; j++) {
                    if(j==0){
                        var input = filaActual[j].getElementsByTagName('input')[0];
                        revisarDato = input.value
                    }else{
                        if(j==3){
                            var input = filaActual[j].getElementsByTagName('input')[0];
                            revisarDato = input.value;
                        }else{
                            revisarDato = filaActual[j].innerHTML;
                        }
                    }
                    if(j==7){
                        revisarDato="1";
                    }
                    //console.log(revisarDato);
                    if(revisarDato=="" || revisarDato=="0" || revisarDato<=0){
                        pasar=false;
                    }
                }
            }
            if(pasar==true){
                if(nroCotizacionEdicion){
                  await eliminarCotizacion(nroCotizacionEdicion)
                }
                
                await crearCabecera();
                await crearDetalle();
                Swal.fire(
                    'Cotizacion Creada',
                    '',
                    'success'
                )
                
                setTimeout(function() {
                window.location.href = "/src/public/views/cotizaciones.html";
                }, 2000);
                
            }else{
                pasar=true;
    }}}}

async function eliminarCotizacion(NumeroCotizacionEdicion){
    const datos = await obtenerDatosAPI(`http://181.177.228.193:8082/api/CotizacionEliminar?NroCot=${NumeroCotizacionEdicion}`);
    
}
async function ejecutarCotizacion(NumeroCotizacionEdicion){
    if(NumeroCotizacionEdicion){
        await eliminarCotizacion(NumeroCotizacionEdicion)
    }
    await crearCabecera()
    await crearDetalle()
}
async function crearCabecera(){
    var listaprecio = document.getElementById("lstPrecios").value-1
    var nombreL = document.getElementById("lstPrecios").options[listaprecio].text
    var numeroCotizacion = cajaNumeroCotizacion.value
    var ordenCompra = cajaOrdenCompra.value
    var mon = selectMoneda.value
    var tc = cajaTipoCambio.innerHTML
    if(mon=="DOLARES"){
        tc=1
    }

    for (var i = 0; i < tablaDetalle.rows.length-1; i++) {
        // Obtener las celdas de la fila actual
        var filaActual = tablaDetalle.rows[i].cells;
        var cantidad = filaActual[3].getElementsByTagName('input')[0].value
        //var precio = filaActual[4].innerHTML * tc
        var precio = filaActual[4].innerHTML
        TotalSinDescuento = TotalSinDescuento + cantidad * precio
    }
    //console.log(TotalSinDescuento)
    var direccion = selectClienteDireccion.value
    var observacion = cajaObservacion.value


    var url = `http://181.177.228.193:8082/api/Cotizacion?usuario=${localStorage.getItem("usuario")}&numcot=${numeroCotizacion}&formapago=${formaPago}&ruc=${rucGanador}&total=${TotalSinDescuento}&listaprecios=${nombreL}&moneda=${moneda}&tipocambio=${tipoCambio}&oc=${ordenCompra}&direcent=${direccion}&obs=${observacion}`
    var data = await fetch(`${url}`, { method: 'POST' });
    var respuesta = await data.json();
}

async function crearDetalle() {
    try {
        var listaprecio = document.getElementById("lstPrecios").value - 1
        var nombreL = document.getElementById("lstPrecios").options[listaprecio].text
        var numeroCotizacion = cajaNumeroCotizacion.value
        var tc = cajaTipoCambio.innerHTML
        var mon = selectMoneda.value
        if(mon=="DOLARES"){
            tc=1;
        }
        for (var i = 0; i < tablaDetalle.rows.length - 1; i++) {
            var filaActual = tablaDetalle.rows[i].cells;
            var codigo = filaActual[0].getElementsByTagName('input')[0].value
            var cantidad = filaActual[3].getElementsByTagName('input')[0].value
            // var precio = filaActual[4].innerHTML * tc
            var precio = filaActual[4].innerHTML

            var url = `http://181.177.228.193:8082/api/Cotizacion?numcot=${numeroCotizacion}&codigo=${codigo}&cantidad=${cantidad}&precio=${precio}&listaprecios=${nombreL}&obs=`


            // Aquí se pueden agregar los headers si la API los requiere
            var requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // otros headers si son necesarios
                },
                // body: JSON.stringify({ ...datos del cuerpo si es necesario... }),
            };

            var response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            var respuesta = await response.json();
    
        }
    } catch (error) {
        console.error('Hubo un problema con la operación fetch: ' + error.message);
    }
}




function actualizarPreciosUnitarios(fila) {
    const tdPrecioLista = fila.cells[4];
    const tdPrecioUnitario = fila.cells[5];
    const inputCantidadCell = fila.cells[3];
    
    // Verificar si la celda en la posición 3 contiene un input
    if (inputCantidadCell && inputCantidadCell.getElementsByTagName) {
        const inpCantidad = inputCantidadCell.getElementsByTagName('input')[0];
        const precioLista = parseFloat(tdPrecioLista.textContent) || 0;
        const precioUnitario = calcularPrecioUnitario(precioLista, opcionPrecio);
        tdPrecioUnitario.textContent = precioUnitario.toFixed(4);
        actualizarSubtotal(inpCantidad, precioUnitario, fila.cells[6]);
    }
}

function calcularPrecioUnitario(precioLista, opcionPrecio) {
    switch (opcionPrecio) {
        case "1":
            return precioLista;
        case "2":
            return precioLista * 0.75;
        case "3":
            return precioLista * 0.75 * 0.97;
        case "4":
            return precioLista * 0.75 * 0.94;    
        case "5":
            return precioLista * 0.78;
        case "6":
            return precioLista * 0.78 * 0.97;
        case "7":
            return precioLista * 0.78 * 0.94;
        case "8":
            return precioLista * 0.85;             
        default:
            return precioLista;
    }
}

function actualizarSubtotal(inputCantidad, precioUnitario, celdaSubTotal) {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    celdaSubTotal.textContent = (cantidad * precioUnitario).toFixed(4);
}

const crearElemento = (tipo, propiedades, hijos) => {
    const elemento = document.createElement(tipo);
    for (const propiedad in propiedades) {
        if (propiedad.startsWith("data-")) {
            // Para atributos data-*, utiliza setAttribute
            elemento.setAttribute(propiedad, propiedades[propiedad]);
        } else {
            // Para otras propiedades, asigna directamente
            elemento[propiedad] = propiedades[propiedad];
        }
    }
    (hijos || []).forEach(hijo => {
        if (typeof hijo === "string") {
            elemento.appendChild(document.createTextNode(hijo));
        } else {
            elemento.appendChild(hijo);
        }
    });
    return elemento;
};


// Función para crear un elemento con texto y clase opcional
function crearElemento2(tagName, textContent, classNames, eventHandler) {
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


//FUNCION PARA OBTENER DATOS DE LA API
const obtenerDatosAPI = async (url) => {
    const respuesta = await fetch(url);
    return respuesta.json();
};

async function actualizarCotizacion() {
    try {
      const datos = await obtenerDatosAPI("http://181.177.228.193:8082/api/Cotizacion");
      cajaNumeroCotizacion.value = datos; // Suponiendo que 'datos' ya es el valor que necesitas
    } catch (error) {
      console.error("Hubo un error al actualizar la cotización:", error);
    }
  }
  
  // Esta función inicia la escucha activa
  function iniciarEscuchaActiva() {
    actualizarCotizacion(); // Actualizamos inmediatamente al iniciar
    setInterval(actualizarCotizacion, 3000); // Y luego cada 5 segundos
  }

  // Llamamos a la función para iniciar la escucha


const inicializar = async () => {

    const nombreUsuario = localStorage.getItem("usuario");
    // cajaNumeroCotizacion.value = await obtenerDatosAPI("http://181.177.228.193:8082/api/Cotizacion");
    //LLENANDO SELECT CLIENTES
    const clientes = await obtenerDatosAPI(`http://181.177.228.193:8082/api/Cliente?usuario=${nombreUsuario}`);
    clientes.forEach(({ Nombre, RUC }) =>
        selectClienteVendedor.appendChild(crearElemento("option", { value: RUC, textContent: Nombre }))
    );
    //LLENANDO SELECT PLAZOS DE PAGO
    const plazos = await obtenerDatosAPI("http://181.177.228.193:8082/api/FormaPago");
    plazos.forEach(plazo =>
        selectPlazosPagos.appendChild(crearElemento("option", { value: plazo, textContent: plazo }))
    );




    productos = await obtenerDatosAPI("http://181.177.228.193:8082/api/Articulo");
    tipoCambio = await obtenerDatosAPI("http://181.177.228.193:8082/api/TipoCambio")
    cajaTipoCambio.textContent = tipoCambio;
};
btnInsertarFila.onclick = () => {
    const fila = crearElemento("tr", {}, [
        crearElemento("td", {}, [crearInputConDatalist()]),
        crearElemento("td"),
        crearElemento("td",{"style":"text-align:center"}),
        crearElemento("td", {}, [crearElemento("input", { type: "number", min: 0 })]),
        crearElemento("td",{"style":"text-align:center"}),
        crearElemento("td",{"style":"text-align:center"}),
        crearElemento("td",{"style":"text-align:center"}),
        crearElemento("td"),
        crearElemento2("td","🗑️","cursor-pointer text-center",{
            click: function() {
                eliminarFila(this);
                actualizarSubtotalGlobal();

            }
        })
    ]);

    cajaMontos.classList.add("visible");
    const inpProducto = fila.childNodes[0].firstChild;
    const inpCantidad = fila.childNodes[3].firstChild;
    const tdPrecioUnitario = fila.childNodes[5];
    const tdSubTotal = fila.childNodes[6];
filaFilipina = fila
inpCantidad.addEventListener('input', () => {
        actualizarDetalle();
        actualizarSubtotalGlobal();
    });

    inpProducto.addEventListener('input', function() {
        const filtro = this.value.toLowerCase();
        productos.forEach(producto => {
            if (`[${producto.Codigo}] ${producto.Descripcion}`.toLowerCase().includes(filtro)) {
                const elem = crearElemento('div', { textContent: `[${producto.Codigo}] ${producto.Descripcion}`, className: 'opcion' });
                elem.onclick = () => {
                    seleccionarProducto(producto, fila);
                    actualizarSubtotal(inpCantidad, parseFloat(tdPrecioUnitario.textContent) || 0, tdSubTotal);
                   };}});});
    cuerpoTabla.insertBefore(fila, document.getElementById("nodoExistente"));
};

const seleccionarProducto = (producto, fila) => {
    fila.childNodes[0].firstChild.value = producto.Codigo;
    fila.childNodes[1].textContent = producto.Descripcion;
    fila.childNodes[1].setAttribute("data-moneda",producto.Moneda);
    fila.childNodes[1].setAttribute("data-precio",producto.Precio);
    fila.childNodes[2].textContent = producto.Marca;
    const precioLista = Number.parseFloat(producto.Precio);
    //calcula el precio dependiendo de la moneda base y de la cotizacion
    if(producto.Moneda=="S"){
        if(moneda=="SOLES"){
            fila.childNodes[4].textContent = precioLista.toFixed(4)
        }else{
            fila.childNodes[4].textContent = (precioLista / tipoCambio).toFixed(4)
        }
    }else{
        if(moneda=="SOLES"){
            fila.childNodes[4].textContent = (precioLista * tipoCambio).toFixed(4)
        }else{
            fila.childNodes[4].textContent = precioLista.toFixed(4)
        }
    }
    
    // fila.childNodes[4].textContent = precioLista;
    const precioUnitario = calcularPrecioUnitario(precioLista, opcionPrecio);
    fila.childNodes[5].textContent = precioUnitario.toFixed(4);   
    fila.childNodes[7].textContent = Number(producto.Stock).toFixed(0);
    if(producto.Stock<=0){
         fila.childNodes[7].style.color = "red"
         fila.childNodes[7].style.fontWeight = "bold";
         fila.childNodes[7].style.textAlign = "center";
    }else{
        fila.childNodes[7].style.color = "green"
        fila.childNodes[7].style.fontWeight = "bold";
        fila.childNodes[7].style.textAlign = "center";
    }
};

async function comenzarFilipino(){
    
    await inicializar();
    await validar();

} 

comenzarFilipino();

scrollear();
function crearInputConDatalist() {
    const inputProducto = crearElemento("input");
    inputProducto.setAttribute("list","listaProductos");
    const datalistProductos = crearElemento("datalist", { id: "listaProductos" });
    // Llenar el datalist con productos
    productos.forEach(producto => {
        datalistProductos.appendChild(crearElemento("option", {
            value: `[${producto.Codigo}] ${producto.Descripcion}` }));});
    // Agregar el datalist al DOM, pero no como hijo del input
    document.body.appendChild(datalistProductos); // o elige un elemento específico del DOM para añadirlo
    inputProducto.oninput = function(event) {
        const valor = event.target.value;
        const productoEncontrado = productos.find(p => `[${p.Codigo}] ${p.Descripcion}` === valor);
        if (productoEncontrado) {
            seleccionarProducto(productoEncontrado, filaFilipina);
        }
    };
    return inputProducto;
}

// Función para actualizar el subtotal global
function actualizarSubtotalGlobal() {
    
    subTotalGlobal = 0;
    let subTotalGlobalCD = 0;
    let currencySymbol 

    for (let i = 0; i < tablaDetalle.rows.length - 1; i++) {
        let filaActual = tablaDetalle.rows[i].cells;
        let cantidad = filaActual[3].getElementsByTagName('input')[0].value;
        let precio = filaActual[4].innerHTML;

        subTotalGlobal += cantidad * precio;
        subTotalGlobalCD += cantidad * calcularPrecioUnitario(precio, opcionPrecio);
    }

    // Aquí actualizas los campos de subtotal, IGV y total
    
    cajaSubTotal.textContent = subTotalGlobalCD.toFixed(4);
    cajaIGV.textContent = (subTotalGlobalCD * 0.18).toFixed(4);
    cajaTotal.textContent = (subTotalGlobalCD * 1.18).toFixed(4);

    if(moneda=="DOLARES"){
        currencySymbol = SYMBOL_DOLLARS;
    }else{
        currencySymbol = SYMBOL_LOCAL;
    }
    
    smbMoneda.forEach(lbl => lbl.textContent = currencySymbol);
    
}


function actualizarDetalle(){
    let tc=1
    subTotalGlobal=0
    if(moneda=="SOLES"){
        tc=cajaTipoCambio.innerHTML;
    }

    for (let i = 0; i < tablaDetalle.rows.length - 1; i++) {
        
        let filaActual = tablaDetalle.rows[i].cells;
        let cantidad = filaActual[3].getElementsByTagName('input')[0].value;
        let precio

        if(filaActual[1].getAttribute("data-moneda")=="S"){

            if(moneda=="SOLES"){
                filaActual[4].innerHTML = filaActual[1].getAttribute("data-precio");
            }else{
                filaActual[4].innerHTML = filaActual[1].getAttribute("data-precio") / tipoCambio;
            }

        }else{
            if(moneda=="SOLES"){
                filaActual[4].innerHTML = filaActual[1].getAttribute("data-precio") * tipoCambio;
            }else{
                filaActual[4].innerHTML = filaActual[1].getAttribute("data-precio");
            }
        }
        filaActual[4].innerHTML = Number(filaActual[4].innerHTML).toFixed(4);
        filaActual[5].innerHTML = (calcularPrecioUnitario(Number(filaActual[4].innerHTML), opcionPrecio)).toFixed(4);
        
        //console.log(precio);
        //console.log(opcionPrecio);

        
        filaActual[6].innerHTML = (Number(filaActual[5].innerHTML) * cantidad).toFixed(4);
        subTotalGlobal = subTotalGlobal + cantidad * precio
        //console.log(precio);
    }
    //console.log(subTotalGlobal);
}


function scrollear(){
    //console.log(detectarDispositivo());
    if(detectarDispositivo()=="Celular"){
        window.scrollBy(0, 850);
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

function eliminarFila(btn) {
    var fila = btn.closest('tr');
    fila.parentNode.removeChild(fila);
  }




  radioTCSunat.addEventListener("click",async ()=>{
    tipoCambio = await obtenerDatosAPI("http://181.177.228.193:8082/api/TipoCambio")
    cajaTipoCambio.innerHTML=tipoCambio
    actualizarDetalle();
    actualizarSubtotalGlobal();
  });

  radioTCManual.addEventListener("click",async ()=>{
    tipoCambio=""
    cajaTipoCambio.innerHTML=tipoCambio

    const { value: tc } = await Swal.fire({
        title: "Ingrese Tipo de Cambio",
        input: "text",
        inputLabel: "Tipo de Cambio",
        inputPlaceholder: "Tipo de Cambio"
      });
      if (tc) {
        tipoCambio = tc
        cajaTipoCambio.innerHTML=tipoCambio      
      }else{
        tipoCambio = await obtenerDatosAPI("http://181.177.228.193:8082/api/TipoCambio")
        cajaTipoCambio.innerHTML=tipoCambio
        radioTCSunat.checked=true
      }
      actualizarDetalle();  
      actualizarSubtotalGlobal(); 
       
      
  });