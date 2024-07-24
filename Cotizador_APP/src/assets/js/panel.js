
    
   const labelNombre = document.getElementById("nombreLogeado");
   const btnCrearCoti = document.getElementById("rmvCod");


   let valorNombre = localStorage.getItem("nombreUsuario")
   labelNombre.textContent = valorNombre;

    document.getElementById("salir").addEventListener("click", () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("nroEdicionCotizacion");
    localStorage.removeItem("nombreUsuario");
    location.href = "../../../index.html";
});
  

btnCrearCoti.addEventListener("click",()=>{
    localStorage.removeItem("nroEdicionCotizacion");
    location.href = "../crearCotizacion.html"
});


