const selectTipoDoc = document.getElementById("tipodoc")
const labelndoc = document.getElementById("lblndoc")
const labelrsocial = document.getElementById("lblrsocial")
const lblnombres = document.getElementById("lblnombres")
const lblappat = document.getElementById("lblappat")
const lblapmat = document.getElementById("lblapmat")
const divNombre = document.getElementById("divNombre")
const divApPat = document.getElementById("divApPaterno")
const divApMat = document.getElementById("divApMaterno")

const inputndoc = document.getElementById("ndoc")
const inputrsocial = document.getElementById("rsocial")
const inputnombres = document.getElementById("nombres")
const inputappat = document.getElementById("appat")
const inputapmat = document.getElementById("apmat")

const inputdirec = document.getElementById("direc")
const inputcorreo = document.getElementById("correo")
const inputtelef1 = document.getElementById("telef1")
const inputtelef2 = document.getElementById("telef2")
const inputubigeo = document.getElementById("ubigeo")
const btnConsultar = document.getElementById("consultarSunat")
const btnRegistrar = document.getElementById("crearCliente")


selectTipoDoc.addEventListener("change",()=>{
    if(selectTipoDoc.value=="DNI"){
        labelndoc.innerHTML="DNI"
        labelrsocial.style.display="none"
        inputrsocial.style.display="none"

        lblnombres.style.display="block"
        lblappat.style.display="block"
        lblapmat.style.display="block"
        inputnombres.style.display="block"
        inputappat.style.display="block"
        inputapmat.style.display="block"
        divNombre.style.display = "block"
        divApMat.style.display = "block"
        divApPat.style.display = "block"

        limpiarDatos()

    }else{
        labelndoc.innerHTML="RUC"
        labelrsocial.style.display="block"
        inputrsocial.style.display="block"

        lblnombres.style.display="none"
        lblappat.style.display="none"
        lblapmat.style.display="none"
        inputnombres.style.display="none"
        inputappat.style.display="none"
        inputapmat.style.display="none"
        divNombre.style.display = "none"
        divApMat.style.display = "none"
        divApPat.style.display = "none"

        limpiarDatos()
    }
});

async function consultarRUC(){
    var doc = inputndoc.value
    let consulta = await fetch(`https://dniruc.apisperu.com/api/v1/ruc/${doc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImEuYXphbmVyb0BmZXNlcHNhLnBlIn0.wB0LWeNxyzJnJAzbNCAwXSlmeb_CaljCbVJrEez_658`);
    let res = await consulta.json();
    //console.log(res)
    inputrsocial.value = res.razonSocial
    inputdirec.value = res.direccion
    inputubigeo.value = res.ubigeo
}

async function consultarDNI(){
    var doc = inputndoc.value
    let consulta = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${doc}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImEuYXphbmVyb0BmZXNlcHNhLnBlIn0.wB0LWeNxyzJnJAzbNCAwXSlmeb_CaljCbVJrEez_658`);
    let res = await consulta.json();
    inputnombres.value = res.nombres
    inputappat.value = res.apellidoPaterno
    inputapmat.value = res.apellidoMaterno
}



btnConsultar.addEventListener("click",()=>{
    var doc = inputndoc.value
    if(doc!=""){
        if(selectTipoDoc.value=="RUC"){
            consultarRUC()
        }
        if(selectTipoDoc.value=="DNI"){
            consultarDNI()
        }
    }else{
        alert("Ingrese Numero de Documento para consultar")
    }
    
});

inputndoc.addEventListener("input",()=>{
    limpiarDatos()
});

function limpiarDatos(){
    inputubigeo.value=""
    inputcorreo.value=""
    inputdirec.value=""
    inputtelef1.value=""
    inputtelef2.value=""
    inputrsocial.value=""
}

btnRegistrar.addEventListener("click",()=>{
    var doc = inputndoc.value
    var razonSocial = inputrsocial.value
    var nombres = inputnombres.value
    var appat = inputappat.value
    var apmat = inputapmat.value
    var ubigeo = inputubigeo.value
    var direc = inputdirec.value
    if(doc!=""){
        if(selectTipoDoc.value=="RUC"){
            if(razonSocial!=""){
                if(ubigeo!=""){
                    if(direc!=""){
                        registrar()
                    }else{
                        alert("Ingrese Direccion")
                    }
                }else{
                    alert("Ingrese Ubigeo")
                }
            }else{
                alert("Ingrese Razon Social")
            }
        }
        if(selectTipoDoc.value=="DNI"){
            if(nombres!=""){
                if(appat!=""){
                    if(apmat!=""){
                        registrar()
                    }else{
                        alert("Ingrese Apellido Materno")
                    }
                }else{
                    alert("Ingrese Apellido Paterno")
                }
            }else{
                alert("Ingrese Nombres")
            }
        }
    }else{
        alert("Ingrese Numero de Documento")
    }
});

async function registrar(){
    var doc = inputndoc.value
    var razonSocial = inputrsocial.value
    var nombres = inputnombres.value
    var appat = inputappat.value
    var apmat = inputapmat.value
    var ubigeo = inputubigeo.value
    var direc = inputdirec.value
    var correo = inputcorreo.value
    var tipodoc = selectTipoDoc.value
    var telef1 = inputtelef1.value
    var telef2 = inputtelef2.value
    if(tipodoc=="RUC"){
        tipodoc="06"
    }else{
        tipodoc="01"
    }
    let url = `http://181.177.228.193:8082/api/Cliente?usuario=${localStorage.getItem("usuario")}&tipodoc=${tipodoc}&ndoc=${doc}&rsocial=${razonSocial}&appat=${appat}&apmat=${apmat}&nombres=${nombres}&ubigeo=${ubigeo}&correo=${correo}&direccion=${direc}&telef1=${telef1}&telef2=${telef2}`
    console.log(url)
    var data = await fetch(`${url}`, { method: 'POST' });
    var res = await data.json();
    console.log(res)
    Swal.fire(
        'Cliente Registrado',
        '',
        'success'
      )
    //, { method: 'POST' }

}
scrollear();
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

