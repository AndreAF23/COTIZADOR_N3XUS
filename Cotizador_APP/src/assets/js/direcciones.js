const cajaClientes = document.getElementById("cliente");
const nombreUsuario = localStorage.getItem("usuario");
const datalist = document.getElementById("clientes");
const btnRegistrar = document.getElementById("RegistrarDireccion")
let todosLosClientes = [];
var rucseleccionado = ""

const obtenerTodosLosClientes = async () => {
    if (todosLosClientes.length === 0) { 
        const respuesta = await fetch(`http://181.177.228.193:8082/api/Cliente?usuario=${nombreUsuario}`);
        todosLosClientes = await respuesta.json();
    }
};

const mostrarCoincidencias = () => {
    const textoEntrada = cajaClientes.value.toLowerCase();
    datalist.innerHTML = '';
    todosLosClientes.forEach(cliente => {
        if (cliente.Nombre.toLowerCase().includes(textoEntrada)) {
            let nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = cliente.Nombre;
            datalist.appendChild(nuevaOpcion);
        }
    });
};

cajaClientes.addEventListener('input', mostrarCoincidencias);

obtenerTodosLosClientes();


function agregarTabla(valor) {
    const cuerpoTabla = document.getElementById("direcciones").getElementsByTagName("tbody")[0];
    const nuevaFila = document.createElement("tr");
    nuevaFila.classList.add("px-6","py-4", "whitespace-no-wrap","border-b", "border-gray-200");
    
    const nuevaCelda = document.createElement("td");
    
    nuevaCelda.textContent = valor;

    nuevaFila.appendChild(nuevaCelda);

    cuerpoTabla.appendChild(nuevaFila);
}

async function llenarTabla(ruc){
    limpiarTabla();
    const respuesta = await fetch(`http://181.177.228.193:8082/api/ClienteDirecciones?ndoc=${ruc}`)
    const datos = await respuesta.json();
    
    for(var i=0;i<datos.length;i++){
        agregarTabla(datos[i]);
    }
}

function limpiarTabla() {
    // Obtener el cuerpo de la tabla por su ID
    const cuerpoTabla = document.getElementById("direcciones").getElementsByTagName("tbody")[0];

    // Eliminar todas las filas del cuerpo de la tabla
    while (cuerpoTabla.firstChild) {
        cuerpoTabla.removeChild(cuerpoTabla.firstChild);
    }
}

cajaClientes.addEventListener("input",()=>{
    
    const nombrecliente = cajaClientes.value
    //console.log(nombrecliente);
    for(var i=0;i<todosLosClientes.length;i++){
        if(nombrecliente==todosLosClientes[i].Nombre){
            //console.log(todosLosClientes[i].RUC)
            rucseleccionado = todosLosClientes[i].RUC;
            llenarTabla(rucseleccionado);
            return;
        }else{
            rucseleccionado="";
            limpiarTabla()
        }
    }
});

btnRegistrar.addEventListener("click",async ()=>{
    if(rucseleccionado!=""){
        const respuesta = await fetch(`http://181.177.228.193:8082/api/Direccion`)
        const distritos = await respuesta.json();
        const ipAPI = "//api.ipify.org?format=json";
        const response = await fetch(ipAPI);
        const data = await response.json();
        const nombredistrito = ""
        const inputValue = data.ip;
        const { value: ipAddress } = await Swal.fire({
        title: "Ingrese Direccion de Entrega",
        input: "text",
        inputLabel: "Direccion",
        showCancelButton: true,

        inputValidator: (value) => {
            if (!value) {
            return "Ingrese una direccion";
            }
        }
        

        });
        if (ipAddress) {
        //crear direccion
        const { value: distrito } = await Swal.fire({
            title: "Seleccione Distrito",
            input: "select",
            inputOptions: {
                distritos
            },
            inputPlaceholder: "Seleccione Distrito",
            showCancelButton: true,
            inputValidator: (value) => {
            return new Promise((resolve) => {
                if (value) {
                resolve();
                
                } else {
                resolve("Selecciona un Distrito");
                }
            });
            }
        });
        if (distrito) {
            //Swal.fire(`You selected: ${distritos[distrito]} - ${ipAddress}`);
            crearDireccion(rucseleccionado,ipAddress,distritos[distrito])
        }
        }
    }else{
        Swal.fire({
            title: "Seleccione Cliente",
            text: "",
            icon: "question"
          });
    }
    
});

async function crearDireccion(ndoc,direccion,nombredistrito){
    var url = `http://181.177.228.193:8082/api/Direccion?ndoc=${ndoc}&direcent=${direccion}&distrito=${nombredistrito}`
    var data = await fetch(`${url}`, { method: 'POST' });
    var respuesta = await data.json();
    //console.log(respuesta)

    Swal.fire({
        title: "Direccion Registrada",
        text: "",
        icon: "success"
      });
    limpiarTabla();
    llenarTabla(ndoc);
}