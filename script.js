function mostrarTela(id) {

    let telas = document.querySelectorAll(".tela")

    telas.forEach(t => {
        t.style.display = "none"
    })

    let tela = document.getElementById(id)

    if (id === "login") {
        tela.style.display = "flex"
    } else {
        tela.style.display = "block"
    }

}

function login() {

    alert("Login realizado com sucesso!")

}

function doar() {
    alert("Doação realizada com sucesso!")
}

function buscarCampanhas() {

    let input = document.getElementById("buscarCampanha").value.toLowerCase()

    let campanhas = document.querySelectorAll(".campanha")

    campanhas.forEach(c => {

        let texto = c.innerText.toLowerCase()

        if (texto.includes(input)) {

            c.style.display = "block"

        } else {

            c.style.display = "none"

        }

    })

}

mostrarTela("home")