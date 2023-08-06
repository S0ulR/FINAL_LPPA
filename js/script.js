//Matríz de colores del tablero 5 columns x 6 rows en 0 = blanco.
var colorTablero = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
]

//Asigno las variables de los colores.
var colores = {
    VERDE: 1,
    AMARILLO: 2,
    GRIS: 3,
    BLANCO: 0
}

//SWITCH La declaración switch evalúa una expresión comparando el valor de esa expresión con una instancia case.
//CASE Declaraciones ejecutadas cuando el resultado de expresión coincide con cada valor case.
//FOR Crea un bucle que consiste en tres expresiones opcionales, encerradas en paréntesis y separadas por puntos y comas, seguidas de una sentencia ejecutada en un bucle.
function pintarTablero(){
    for (let iFila = 0; iFila < 6; iFila++) {
        for (let iCol=0; iCol<5; iCol++){
            let input = document.getElementById(`f${iFila}c${iCol}`)
            switch(colorTablero[iFila][iCol]){
                case colores.VERDE:
                    input.classList.add("verde");
                    break;
                case colores.AMARILLO:
                    input.classList.add("amarillo");
                    break;
                case colores.GRIS:
                    input.classList.add("gris");
                    break;
                case colores.BLANCO:
                    input.classList.add("blanco");
                    break;
            }
        }
    }
}

//Array vacío [], nuevo array (), objeto vacío {} .
var respuestas = [
    [],
    [],
    [],
    [],
    [],
    [],
]

//Declara un objeto "save" y guarda en él los datos necesarios para poder continuar jugando en otro momento.
function GuardarProgreso(){    
    let save = {};

    save.fecha = new Date().toLocaleString("es-AR", {timeZone:"America/Argentina/Buenos_Aires"});
    save.tiempo = document.querySelector("#time").innerHTML;
    save.respuestas = respuestas;
    save.usuario = document.getElementById("nombre-jugador-input").value;
    save.palabraGanadora = palabraGanadora;
    save.colorTablero = colorTablero;

    //Trae del LocalStorage el array "saves". Si no está, le asigna "[]".
    let savesArray = JSON.parse(localStorage.getItem("saves")) || [];
    savesArray.push(save);

    //Convierte el array de saves a json.
    let savesArrayJSON = JSON.stringify(savesArray);

    //Guarda el array de saves en formato JSON en el LocalStorage.
    localStorage.setItem("saves", savesArrayJSON);

    //Console.log(savesArray).
    window.location.href = "index.html";
}

//Trae del LocalStorage el array "saves". Si no está, le asigna "[]".
function ObtenerGuardadas() {
    let savesArray = JSON.parse(localStorage.getItem('saves')) || [];

    //Muestra la lista de saves para el nombre ingresado.
    let body = "";
    let partida = savesArray.length +1;
    for (var i = savesArray.length -1; i >= 0; i--) { //Itera al revés para indexar correctamente.
        partida--;
        body += `<tr class="fila-partidas-guardadas" onclick=loadGame('${i}') role="row">
                    <td class="data-partida-guardadas" data-label="PARTIDA">${partida}</td>
                    <td class="data-partida-guardadas" data-label="NOMBRE">${(savesArray[i].usuario)}</td>
                    <td class="data-partida-guardadas" data-label="FECHA">${(savesArray[i].fecha)}</td>
                </tr>`
    }
    console.log(savesArray.length)
    document.getElementById("puntajes").innerHTML = body;
}

const loadGame = function(indice){
    gameOver = false;
    let modal = document.getElementById("modalPartidas");
    modal.style.display = "none";

    for (let indice = 0; indice < 6; indice++){
        let fieldset = document.getElementById(`fila${indice}`);
        fieldset.disabled=false;
    }

    //Trae del LocalStorage el array "saves".
    let savesArray = JSON.parse(localStorage.getItem('saves'));

    let actualArray = savesArray[indice].respuestas;
    let actualPalabra = savesArray[indice].palabraGanadora;
    let actualTiempo = savesArray[indice].tiempo
    let actualUsuario = savesArray[indice].usuario;
    let actualColorTablero = savesArray[indice].colorTablero;

    colorTablero = actualColorTablero;

    //GuardarRespuestaPartidaCargada(índice).
    pintarTablero();

    palabraGanadora = actualPalabra;
    document.querySelector("#time").innerHTML = actualTiempo;
    document.getElementById("nombre-jugador-input").value = actualUsuario;


    //Escribe los valores obtenidos en input.
    for (let iFila = 0; iFila < 6; iFila++) {
        for (let iCol=0; iCol<5; iCol++){
            let input = document.getElementById(`f${iFila}c${iCol}`);
            if(actualArray[iFila][iCol] !== undefined){
            input.value = actualArray[iFila][iCol];
            }
        }
    }

    console.log(actualPalabra);
    console.log(actualTiempo);
    console.log(actualUsuario);

    hideBtn();
    mensajeDeErrorValor();

    //Calcula tiempo.
    let sec = actualTiempo.slice(3);
    let min = actualTiempo.slice(0, 2);
    let secTransform = Math.round((sec/60) * 100);
    let calculoTiempo = Math.round(((min + secTransform) /100) * 60);
    var timer = calculoTiempo;
    display = document.querySelector("#time");
    startTimer(timer, display);


    //Misma función pero al cargar partidas (con la palabra actual).
    function guardarRespuestaPartidaCargada(indice){
        for (let iCol = 0; iCol < 5; iCol++){
            let input = document.getElementById(`f${indice}c${iCol}`).value;
            respuestas[indice].push(input);
        }
        revisarResultadoPartidaCargada(respuestas[indice], indice);
    }

    //== en JavaScript se usa para comparar 2 variables, pero ignora el datatype de las mismas. === se usa para comparar 2 variables, pero éste operador no ignora los tipo de datos. 
    function revisarResultadoPartidaCargada(respuesta, indice){
        respuesta.forEach(function(elemento, index){
            if(elemento === arrayActualPalabra[index]){
                colorTablero[indice][index] = colores.VERDE;
            }
            else if(arrayActualPalabra.includes(elemento)){
                colorTablero[indice][index] = colores.AMARILLO;
            }
            else if(!arrayActualPalabra.includes(elemento)){
                colorTablero[indice][index] = colores.GRIS;
            }
        })
        pintarTablero();
    }

    //El método split() divide un objeto de tipo String en un array (vector) de cadenas mediante la separación de la cadena en subcadenas.
    arrayActualPalabra = actualPalabra.split("");


    //Guardar la respuesta de la partida solo de las filas guardadas.
    for (let indice = 0; indice < 6; indice++){
        let fieldset = document.getElementById(`fila${indice}`);
        let validarCaracter = document.querySelectorAll(`#fila${indice} input`);

        let valor0 = validarCaracter[0].value;
        let valor1 = validarCaracter[1].value;
        let valor2 = validarCaracter[2].value;
        let valor3 = validarCaracter[3].value;
        let valor4 = validarCaracter[4].value;

        //Condicional para que no impacte guardarRespuestaPartidaCargada en espacios vacíos.
        if (valor0 !== "" && valor1 !== "" && valor2 !== "" && valor3 !== ""&& valor4 !== ""){
            guardarRespuestaPartidaCargada(indice);
            fieldset.disabled=true;
        }
        //Posiciona en la primer fila vacía.
        if (valor0 == ""){
            validarCaracter[0].focus();
            break 
        }
    }

    //Función inicio() modificada para partida guardada.
    for (let indice = 0; indice < 6; indice++){
        let fieldset = document.getElementById(`fila${indice}`);
        //El resto del juego guardarRespuesta precionando "Enter".
        fieldset.onkeydown = function (event){
            if(event.key === `Enter`){
                let validarCaracter = document.querySelectorAll(`#fila${indice} input`);
                var regex = new RegExp ("[A-Z]");
                let valor0 = validarCaracter[0].value;
                let valor1 = validarCaracter[1].value;
                let valor2 = validarCaracter[2].value;
                let valor3 = validarCaracter[3].value;
                let valor4 = validarCaracter[4].value;

                let input0 = regex.test(valor0);
                let input1 = regex.test(valor1);
                let input2 = regex.test(valor2);
                let input3 = regex.test(valor3);
                let input4 = regex.test(valor4);

                if (valor0 == "" || valor1 == "" || valor2 == "" || valor3 == "" || valor4 == ""){
                    mensajeDeErrorEnter();
                }
                else if (input0 == false || input1 == false || input2 == false || input3 == false || input4 == false){
                    mensajeDeErrorValor();
                }
                else if (valor0.length > 1 || valor1.length  > 1 || valor2.length > 1 || valor3.length > 1 || valor4.length > 1 ){
                    mensajeDeErrorUnaLetra();
                }
                else{
                guardarRespuestaPartidaCargada(indice);
                eliminarMensajeDeError();

                let respuestaUsuario = respuestas[indice];
                let respuestaUsuarioString = respuestaUsuario.join("");

                if (respuestaUsuarioString == palabraGanadora){
                    gameOver = true;
                    showBtn();
                    document.getElementById("mensaje-resultado").style.color = "rgb(21, 211, 21)";
                    document.getElementById("mensaje-resultado").innerHTML = "Felicitaciones Ganaste!";
                    scorePartidaGanada(indice); //Guarda los datos de la partida con el score.
                    bloqueoFieldsetGanarOPerder();
                }

                if (indice == 0 && respuestaUsuarioString != palabraGanadora){
                    document.getElementById("fila1").disabled=false;
                    document.getElementById("fila0").disabled=true;
                    document.getElementById("f1c0").focus();
                }
                if (indice == 1 && respuestaUsuarioString != palabraGanadora){
                    document.getElementById("fila2").disabled=false;
                    document.getElementById("fila1").disabled=true;
                    document.getElementById("f2c0").focus();
                }
                if (indice == 2 && respuestaUsuarioString != palabraGanadora){
                    document.getElementById("fila3").disabled=false;
                    document.getElementById("fila2").disabled=true;
                    document.getElementById("f3c0").focus();
                }
                if (indice == 3 && respuestaUsuarioString != palabraGanadora){
                    document.getElementById("fila4").disabled=false;
                    document.getElementById("fila3").disabled=true;
                    document.getElementById("f4c0").focus();
                }
                if (indice == 4 && respuestaUsuarioString != palabraGanadora){
                    document.getElementById("fila5").disabled=false;
                    document.getElementById("fila4").disabled=true;
                    document.getElementById("f5c0").focus();
                }
                if (indice == 5  && respuestaUsuarioString != palabraGanadora){
                    gameOver = true;
                    showBtn();
                    document.getElementById("mensaje-resultado").innerHTML = `Game Over! No te quedan intentos. La palabra es: "${palabraGanadora}"`;
                    bloqueoFieldsetGanarOPerder();
                    }
                }
            }
        }
    }
}

//Función para asignar la puntuación, se ejecuta cuando el jugador gana.
function scorePartidaGanada(fila){

    let puntaje = {};

    puntaje.fecha = new Date().toLocaleString("es-AR", { timeZone:"America/Argentina/Buenos_Aires"});
    puntaje.nombre = document.getElementById("nombre-jugador-input").value;

    //Calcula el puntaje.
    switch (fila) {

        case 0:
            puntaje.puntaje = 1500
            break;

        case 1:
            puntaje.puntaje = 1000
            break;

        case 2:
            puntaje.puntaje = 800
            break;

        case 3:
            puntaje.puntaje = 600
            break;

        case 4:
            puntaje.puntaje = 400
            break;

        case 5:
            puntaje.puntaje = 200
            break;

        default:
            break;
    }

    //Trae del LocalStorage el array "puntajes". Si no está, le asigna "[]".
    let puntajesArray = JSON.parse(localStorage.getItem("puntajes")) || [];
    puntajesArray.push(puntaje);

    //Convierte el array de puntajes a json.
    let puntajeArrayJSON = JSON.stringify(puntajesArray);

    //Guarda el array de puntajes en formato JSON en el LocalStorage.
    localStorage.setItem("puntajes", puntajeArrayJSON);

}

//Función para obtener puntajes. Ordena por fecha. Se ejecuta con el botón "Ranking".
function ObtenerScore() { 

    //Trae del LocalStorage el array "puntajes". Si no está, le asigna "[]".
    let puntajesArray = JSON.parse(localStorage.getItem("puntajes")) || [];

    //Muestra la lista de puntajes ordenado desde la fecha de más reciente a la más antigua.
    let body = "";
    for (var i = 0; i < puntajesArray.length; i++) {
            body += `<tr role="row">
                        <td data-label="NOMBRE">${(puntajesArray[puntajesArray.length-1-i].nombre)}</td>
                        <td data-label="FECHA">${(puntajesArray[puntajesArray.length-1-i].fecha)}</td>
                        <td data-label="PUNTAJE">${(puntajesArray[puntajesArray.length-1-i].puntaje)}</td>
                    </tr>`
        }
    document.getElementById("puntajes").innerHTML = body;
}

//Función para ordenar los puntajes.
function ordenalTablaPuntaje() { 
    //Trae del LocalStorage el array "puntajes". Si no está, le asigna "[]".
    let puntajesArray = JSON.parse(localStorage.getItem('puntajes')) || [];

    //Ordena el array puntajes de mayor a menor.
    puntajesArray.sort(function (a, b){
        if (a.puntaje > b.puntaje) {
            return 1;
          }
        if (a.puntaje < b.puntaje) {
            return -1;
        }
        return 0;
    });

    //Ordena el scoreboard por puntajes, de mayor a menor.
    let body = '';
    for (var i = 0; i < puntajesArray.length; i++) {
            body += `<tr role="row">
                        <td data-label="NOMBRE">${(puntajesArray[puntajesArray.length-1-i].nombre)}</td>
                        <td data-label="FECHA">${(puntajesArray[puntajesArray.length-1-i].fecha)}</td>
                        <td data-label="PUNTAJE">${(puntajesArray[puntajesArray.length-1-i].puntaje)}</td>
                    </tr>`
        }
    document.getElementById('puntajes').innerHTML = body;
}


var gameOver = false;

function bloqueoFieldsetGanarOPerder() {
    for (let indice = 0; indice < 6; indice++){
        let fieldset = document.getElementById(`fila${indice}`);
        if (gameOver);
        fieldset.disabled=true;
    }
}

function mensajeDeErrorEnter() {
    errorCampoVacio = document.getElementById("mensaje-error");
    errorCampoVacio.innerHTML = "Complete todos los campos de la fila";
    errorCampoVacio.style.visibility = "visible";
}

function mensajeDeErrorValor() {
    errorCampoValor = document.getElementById("mensaje-error");
    errorCampoValor.innerHTML = "Introduzca solo letras mayusculas";
    errorCampoValor.style.visibility = "visible";
}

function mensajeDeErrorUnaLetra() {
    errorCampoValor = document.getElementById("mensaje-error");
    errorCampoValor.innerHTML = "Introduzca solo una letra por campo";
    errorCampoValor.style.visibility = "visible";
}

function eliminarMensajeDeError() {
    errorCampoValor = document.getElementById("mensaje-error");
    errorCampoValor.style.visibility = "hidden";
}


function inicio () {
    for (let indice = 0; indice < 6; indice++){
        let fieldset = document.getElementById(`fila${indice}`);
        fieldset.onkeydown = function (event){
            if(event.key === `Enter`){
                let validarCaracter = document.querySelectorAll(`#fila${indice} input`);
                var regex = new RegExp ("[A-Z]");
                let valor0 = validarCaracter[0].value;
                let valor1 = validarCaracter[1].value;
                let valor2 = validarCaracter[2].value;
                let valor3 = validarCaracter[3].value;
                let valor4 = validarCaracter[4].value;

                let input0 = regex.test(valor0);
                let input1 = regex.test(valor1);
                let input2 = regex.test(valor2);
                let input3 = regex.test(valor3);
                let input4 = regex.test(valor4);

                if (valor0 == "" || valor1 == "" || valor2 == "" || valor3 == "" || valor4 == ""){
                    mensajeDeErrorEnter();

                }else if (input0 == false || input1 == false || input2 == false || input3 == false || input4 == false){
                    mensajeDeErrorValor();

                }else if (valor0.length > 1 || valor1.length  > 1 || valor2.length > 1 || valor3.length > 1 || valor4.length > 1 ){
                    mensajeDeErrorUnaLetra();
                }

                else {
                    guardarRespuesta(indice);
                    eliminarMensajeDeError();

                    let respuestaUsuario = respuestas[indice];
                    let respuestaUsuarioString = respuestaUsuario.join("");

                    if (respuestaUsuarioString == palabraGanadora){
                        gameOver = true;
                        showBtn();
                        document.getElementById("mensaje-resultado").style.color = "rgb(21, 211, 21)";
                        document.getElementById("mensaje-resultado").innerHTML = "GANASTE!";

                        //Guarda los datos de la partida con el puntaje.
                        scorePartidaGanada(indice); 
                        bloqueoFieldsetGanarOPerder();
                    }

                    if (indice == 0 && respuestaUsuarioString != palabraGanadora){
                        document.getElementById("fila1").disabled=false;
                        document.getElementById("fila0").disabled=true;
                        document.getElementById("f1c0").focus();
                    }
                    if (indice == 1 && respuestaUsuarioString != palabraGanadora){
                        document.getElementById("fila2").disabled=false;
                        document.getElementById("fila1").disabled=true;
                        document.getElementById("f2c0").focus();
                    }
                    if (indice == 2 && respuestaUsuarioString != palabraGanadora){
                        document.getElementById("fila3").disabled=false;
                        document.getElementById("fila2").disabled=true;
                        document.getElementById("f3c0").focus();
                    }
                    if (indice == 3 && respuestaUsuarioString != palabraGanadora){
                        document.getElementById("fila4").disabled=false;
                        document.getElementById("fila3").disabled=true;
                        document.getElementById("f4c0").focus();
                    }
                    if (indice == 4 && respuestaUsuarioString != palabraGanadora){
                        document.getElementById("fila5").disabled=false;
                        document.getElementById("fila4").disabled=true;
                        document.getElementById("f5c0").focus();
                    }
                    if (indice == 5  && respuestaUsuarioString != palabraGanadora){
                        gameOver = true;
                        showBtn();
                        document.getElementById("mensaje-resultado").innerHTML = `Perdiste! No te quedan intentos. La palabra es: "${palabraGanadora}"`;
                        bloqueoFieldsetGanarOPerder();
                    }
                }
            }
        }
    }
}


function guardarRespuesta(indice){
    for (let iCol = 0; iCol < 5; iCol++){
        let input = document.getElementById(`f${indice}c${iCol}`).value;
        respuestas[indice].push(input);
    }
    revisarResultado(respuestas[indice], indice);
}

function revisarResultado(respuesta, indice){
    respuesta.forEach(function(elemento, index){
        if(elemento === arrayPalabraGanadora[index]){
            colorTablero[indice][index] = colores.VERDE;
        }
        else if(arrayPalabraGanadora.includes(elemento)){
            colorTablero[indice][index] = colores.AMARILLO;
        }
        else if(!arrayPalabraGanadora.includes(elemento)){
            colorTablero[indice][index] = colores.GRIS;
        }
    })
    pintarTablero();
}

//Función para generar palabras aleatorias.
const palabrasDisponibles = ["CIELO", "OREJA", "RESTA", "NARIZ", "CREMA", "DUELO", "HUEVO", "PITOS", "PALTA", "PASTA",
                             "HACER", "HIATO", "LLAVE", "REMAR", "HIELO", "FUMAR", "TOLVA", "CORRE", "TABLA", "MACHO",
                             "PERRO", "ARENA", "CLAVO", "PIZZA", "HABLA", "ARROZ", "GRITO", "FLACO", "BRISA", "CROTO",
                             "GORRO", "LABIO", "BROMA", "PLATO", "PESOS", "NOGAL", "CINCO", "TIESO", "TALLO", "MAYOR",
                             "MENOR", "MUERTO", "BRAZO", "PISTA", "BARCO", "PALMA", "TECHO", "NORTE", "MOSCA", "RIEGO",
                             "GRASA", "DUELO", "BOLSA", "MEDIA", "BUENO", "RADIO", "TRUCO", "MAGIA", "SUELO", "LECHE"]

function elegirPalabraAlAzar(palabrasDisponibles) {
    return palabrasDisponibles[Math.floor(Math.random() * palabrasDisponibles.length)]
}

var palabraGanadora = elegirPalabraAlAzar(palabrasDisponibles);

//El método split() divide un objeto de tipo String en un array (vector) de cadenas mediante la separación de la cadena en sub-cadenas.
var arrayPalabraGanadora = palabraGanadora.split("");


//Nueva partida, ocultar botones.
function hideBtn() {
    document.getElementById("nueva-partida").style.display="none";
    document.getElementById("cargar-partida").style.display="none";
    document.getElementById("guardar-partida").style.display="inline-block";
    document.getElementById("timer").style.display="block";
    document.getElementById("time").style.display="inline";
    }

function showBtn() {
    document.getElementById("volver-a-jugar-partida").style.display="inline-block";
    document.getElementById("guardar-partida").style.display="none";
    document.getElementById("mensaje-resultado").style.display="inline-block";
    document.getElementById("time").style.display="none";
    document.getElementById("timer").style.display="none";
}

function tabular(e) {
    let obj = e.target
    let frm = obj.form;
    let largo = obj.value.length;
    let tam = obj.maxLength;
        if (largo == tam) {
            for(i=0;i<frm.elements.length;i++) {
                if(frm.elements[i]==obj) {
                if (i==frm.elements.length-1) { i=-1; }
            break;
        }
    }
    frm.elements[i+1].focus();
    return false;
    }
}

function timer() {
    var threeMinutes = 60 * 3,
    display = document.querySelector("#time");
    startTimer(threeMinutes, display);
}

//SETINTERVAL es un método que llama a una función o ejecuta un fragmento de código de forma reiterada, con un retardo de tiempo fijo entre cada llamada.
//Este método devuelve un ID de intervalo que lo identifica de forma única, de ese modo, el intervalo puede ser eliminado más tarde llamando la función clearInterval().
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var reloj = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (gameOver){
            clearInterval(reloj);
        }

        if (--timer < 0) {
            gameOver = true;
            timer = duration;
            showBtn();
            document.getElementById("mensaje-resultado").innerHTML = `Perdiste`;
            bloqueoFieldsetGanarOPerder();
        }
    }, 1000);
}


window.onload = function(){
    console.log(palabraGanadora)

    let inputsForm = document.getElementById("grilla").querySelectorAll("input");

    inputsForm.forEach(function (x){
        x.addEventListener("keyup", tabular);
    })

    //Función para ingresar nombre.
    const nuevaPartida = document.getElementById("nueva-partida");
    const volverAJugar = document.getElementById("volver-a-jugar-partida");
    const gurdarPartida = document.getElementById("guardar-partida");
    const rankingPartida = document.getElementById("ranking-partida");
    const cargarPartida = document.getElementById("cargar-partida");

    const form = document.getElementById("formulario-usuario");
    const name = document.getElementById("nombre-jugador-input");

    const ordenFecha = document.getElementById("orden-por-fecha");
    const ordenPuntaje = document.getElementById("orden-por-puntaje");
    const numeroPartida = document.getElementById("numero-partida");

    //El método addEventlistener, escuchada e indica al navegador que esté atento a la interacción del usuario.
    form.addEventListener("submit", function(e){
        e.preventDefault();

        //Las expresiones regulares son patrones que se utilizan para hacer coincidir combinaciones de caracteres en cadenas. En JavaScript, las expresiones regulares también son objetos.
        var regexName = new RegExp ("^[A-Za-z]+$");
        let nameValue = name.value;
        let regexValue = regexName.test(nameValue);

        if (name.value.length < 3 || regexValue == false || name.value == "") {
            errorNombre.innerHTML = "Ingrese un nombre mayor a 2 digitos. Solo letras sin espacios."
            return false; //Se utiliza para abortar la funcion
        } else {
            document.getElementById("nombre-jugador").style.display="none";
            gameOver = false;
            inicio();
            timer();
            hideBtn();
            document.getElementById("fila0").disabled=false;
            document.getElementById("f0c0").focus();
            mensajeDeErrorValor();
        }
    })

    nuevaPartida.addEventListener("click", function(){
        document.getElementById("nombre-jugador").style.display="flex";
        name.focus();
    })

    volverAJugar.addEventListener("click", function(){
        gameOver = false;
        location.reload();
    })

    gurdarPartida.addEventListener("click", function(){
        GuardarProgreso();
    })

    rankingPartida.addEventListener("click", function(){
        ordenPuntaje.style.display="table-cell"
        numeroPartida.style.display="none"
        ObtenerScore();
        mostrarModal();

        ordenFecha.addEventListener("click", function(){
            ObtenerScore();
        })

        ordenPuntaje.addEventListener("click", function(){
            ordenalTablaPuntaje();
        })
    })

    cargarPartida.addEventListener("click", function(){
        document.getElementById("nombre-jugador").style.display="none";
        ordenPuntaje.style.display="none"
        numeroPartida.style.display="table-cell"
        ObtenerGuardadas();
        mostrarModal();

        ordenFecha.addEventListener("click", function(){
            ObtenerGuardadas();
        })
    })

    //MODAL FUNCTIONS
    function mostrarModal() {
    let modal = document.getElementById("modalPartidas");
    let span = document.getElementById("close");
    modal.style.display = "block";
    //Si clickea el "botón" CERRAR se oculta el modal.
    span.onclick = function () {
      modal.style.display = "none";
    };
    //Si clickea fuera del modal, se oculta.
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
}