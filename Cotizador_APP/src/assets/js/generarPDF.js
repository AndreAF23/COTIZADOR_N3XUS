
const panelNroCotizacion = document.getElementById("nro-cotizacion");
const panelRucCliente = document.getElementById("ruc-cliente");
const panelNombreCliente = document.getElementById("nombre-cliente"); 
const panelDireccionCliente = document.getElementById("direccion-cliente");
const panelTelefonoCliente = document.getElementById("telefono-cliente");
const panelCorreoCliente = document.getElementById("correo-cliente");
const panelFechaEmision = document.getElementById("fec-emision");

const panelOC = document.getElementById("panelOC");
const panelMonedaCotizacion = document.getElementById("moneda-cotizacion");
const panelNombreVendedor = document.getElementById("nombre-vendedor");
const panelTelefonoVendedor = document.getElementById("telefono-vendedor");
const panelCorreoVendedor = document.getElementById("correo-vendedor");
const panelFechaVencimiento  = document.getElementById("fec-vencimiento");

const cajaDetalleProductos = document.getElementById("tbodyDetalle");
const panelFormaPago = document.getElementById("formaPago");
const panelValidezOferta = document.getElementById("validezOferta");
const panelObservaciones = document.getElementById("observaciones");
const panelSubTotal = document.getElementById("subTotal");
const panelIGV = document.getElementById("igv");
const panelTotal = document.getElementById("total");

async function pintarModeloPDF(){

       const respuesta = await fetch(`http://181.177.228.193:8082/api/CotizacionDetalle?numcot=${localStorage.getItem("nroCotizacion")}`)
       const datos = await respuesta.json();
       
       panelNroCotizacion.textContent = localStorage.getItem("nroCotizacion");
       

       const {DocumentoCliente,
        DireccionCliente,
        TelefonoCliente,
        CorreoCliente,
        Moneda,
        NombreVendedor,
        TelefonoVendedor,
        Detalles,
        FormaPago,
        ListaPrecio,
        OC,
        NombreCliente,
        FechaEmision,
        FechaVencimiento,
        FechaCaducidad,
        CorreoVendedor,
        Observaciones,
        SubTotal,
        IGV,
        Total
        } = datos[0]


        let parts = FechaEmision.split(" ");  // Separa la cadena en dos partes usando el espacio

        let fecha = parts[0];  // La fecha

        var simboloMoneda //$ o S/.

        let parts2 = FechaVencimiento.split(" ");  // Separa la cadena en dos partes usando el espacio
        let fecha2 = parts2[0];  // La fecha

        panelRucCliente.textContent = DocumentoCliente;
        panelNombreCliente.textContent = NombreCliente;
        panelDireccionCliente.textContent = DireccionCliente;
        panelTelefonoCliente.textContent = TelefonoCliente;
        panelCorreoCliente.textContent = CorreoCliente;
        panelFechaEmision.textContent = fecha

        panelOC.textContent = OC;
        panelMonedaCotizacion.textContent = Moneda;
        panelNombreVendedor.textContent = NombreVendedor;
        panelTelefonoVendedor.textContent = TelefonoVendedor;
        panelCorreoVendedor.textContent = CorreoVendedor;
        panelFechaVencimiento.textContent =  fecha2;



        Detalles.forEach(detalle => {
               
            const {Item,Codigo,Descripcion,Cantidad,ValorUnitario,Importe} = detalle;

            let trProducto = document.createElement("tr");
    
            let tdItem = document.createElement("td");
            tdItem.classList.add("border","border-gray-700");
            tdItem.textContent = Item;

            let tdCodigo = document.createElement("td");
            tdCodigo.classList.add("border","border-gray-700");
            tdCodigo.textContent = Codigo;

            let tdDescripcion = document.createElement("td");
            tdDescripcion.classList.add("border","border-gray-700");
            tdDescripcion.textContent = Descripcion;

            let tdCantidad = document.createElement("td");
            tdCantidad.classList.add("border","border-gray-700");
            tdCantidad.textContent = Number(Cantidad).toFixed(2);

            let tdPrecioUnitario = document.createElement("td");
            tdPrecioUnitario.classList.add("border","border-gray-700");
            tdPrecioUnitario.textContent = Number(ValorUnitario).toFixed(2);

            let tdPrecioSubTotal = document.createElement("td");
            tdPrecioSubTotal.classList.add("border","border-gray-700");
            tdPrecioSubTotal.textContent = Number(Importe).toFixed(2);

            trProducto.appendChild(tdItem);
            trProducto.appendChild(tdCodigo);
            trProducto.appendChild(tdDescripcion);
            trProducto.appendChild(tdCantidad);
            trProducto.appendChild(tdPrecioUnitario);
            trProducto.appendChild(tdPrecioSubTotal);

            cajaDetalleProductos.appendChild(trProducto);
        })

        if(Moneda=="Soles"){
            simboloMoneda="S/. "
        }else{
            simboloMoneda="$ "
        }

        panelFormaPago.textContent =  FormaPago;
        panelValidezOferta.textContent = FechaCaducidad.substr(0,10);
        panelObservaciones.textContent = Observaciones
        panelSubTotal.textContent = simboloMoneda + Number(SubTotal).toFixed(2)
        panelIGV.textContent = simboloMoneda + Number(IGV).toFixed(2)
        panelTotal.textContent = simboloMoneda + Number(Total).toFixed(2)

        document.dispatchEvent(new CustomEvent('datosCargados'));
}

pintarModeloPDF();

