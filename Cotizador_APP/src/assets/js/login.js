document.addEventListener("DOMContentLoaded", function() {
    
    const btnLogin = document.getElementById("btnLogin");
    const usuarioInput = document.getElementById("usuario");
    const passwordInput = document.getElementById("password");

    // Función para manejar el inicio de sesión
    async function handleLogin() {
        const usuario = usuarioInput.value;
        const password = passwordInput.value;
        const respuesta = await fetch(`http://181.177.228.193:8082/api/Usuario?usuario=${usuario}&contrasena=${password}`);
        const bypass = await respuesta.json()
        if (!usuario || !password) {
            return;
        }
        if(bypass==true){
            try {
                const params = new URLSearchParams({ usuario });
                const respuesta = await fetch(`http://181.177.228.193:8082/api/Vendedor?${params.toString()}`);
    
                if (!respuesta.ok) {
                    throw new Error('Error en la solicitud');
                }
    
                const nombreUsuario = await respuesta.json();
    
                localStorage.setItem("usuario", usuario);
                localStorage.setItem("nombreUsuario", nombreUsuario);
                localStorage.removeItem("nroEdicionCotizacion");
                window.location.href = "/src/public/views/panel.html";
            } catch (error) {
                console.error('Error en la autenticación', error);
                // Manejo adicional del error
            }
        }else{
            Swal.fire({
                icon: "error",
                title: "Usuario o Constraseña Incorrecta",
                text: "",
                footer: 'Intente denuevo'
              });
              passwordInput.value="";
        }
        
    }

    // Evento clic en el botón de login
    btnLogin.onclick = handleLogin;

    // Evento para detectar la tecla Enter
    function checkEnterKey(event) {
        if (event.key === "Enter") {
            handleLogin();
        }
    }

    usuarioInput.addEventListener("keypress", checkEnterKey);
    passwordInput.addEventListener("keypress", checkEnterKey);
});
