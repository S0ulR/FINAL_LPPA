window.onload = function() {
    const form = document.getElementById("formulario-contacto");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const text = document.getElementById("comentario");

    const estadoValidaciones = {
        name: false,
        email: false,
        text: false,
      };

    form.addEventListener("submit", function(e){
        e.preventDefault();
        var regexName = new RegExp ("^[a-zA-Z0-9_]*$");
        let nameValue = name.value;
        let regexValueName = regexName.test(nameValue);

        var regexEmail = new RegExp ("[a-z0-9]+@[a-z]+\.[a-z]{2,3}");
        let emailValue = email.value;
        let regexValueEmail = regexEmail.test(emailValue);

        if(name.value.length < 3 || regexValueName == false || name.value == ""){
            document.getElementById("name-error").style.visibility = "visible";
        }else {
            estadoValidaciones.name = true;
        }

        if(regexValueEmail == false || email.value == ""){
            document.getElementById("email-error").style.visibility = "visible";
        }else {
            estadoValidaciones.email = true;
        }

        if(text.value.length < 5 || text.value == ""){
            document.getElementById("comentario-error").style.visibility = "visible";
        }else {
            estadoValidaciones.text = true;
        }

        if (estadoValidaciones.name && estadoValidaciones.email && estadoValidaciones.text){
            estadoValidaciones.name = false;
            estadoValidaciones.email = false;
            estadoValidaciones.text = false;

            console.log(regexValueName)
            window.open(`mailto:valen1984@gmail.com?subject=Consulta de ${name.value}&body=${text.value}`);
            form.reset();
        }
    })

    name.addEventListener("focus", function(){
        document.getElementById("name-error").style.visibility = "hidden";
    })

    email.addEventListener("focus", function(){
        document.getElementById("email-error").style.visibility = "hidden";
    })

    text.addEventListener("focus", function(){
        document.getElementById("comentario-error").style.visibility = "hidden";
    })
}