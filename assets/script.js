function carregarCampanhas() {
    fetch("http://localhost:3000/campanhas")
        .then(res => res.json())
        .then(data => {

            data.forEach(c => {

                let valorEl = document.getElementById("valor" + c.id);
                let barraEl = document.getElementById("barra" + c.id);

                if (valorEl && barraEl) {

                    valorEl.innerText = c.arrecadado;

                    let porcentagem = (c.arrecadado / c.meta) * 100;
                    barraEl.style.width = porcentagem + "%";
                }
            });

        })
        .catch(err => console.error("Erro campanhas:", err));
}
let campanhaAtual = null;

function doar(id) {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
        alert("Você precisa estar logado para doar!");
        mostrarTela("login");
        return;
    }

    campanhaAtual = id;
    document.getElementById("modalDoacao").style.display = "flex";
}

function fecharModal() {
    document.getElementById("modalDoacao").style.display = "none";
    document.getElementById("valorDoacao").value = "";
    document.getElementById("msgDoacao").innerText = "";
}

function confirmarDoacao() {
    const valor = parseFloat(document.getElementById("valorDoacao").value);
    const msg = document.getElementById("msgDoacao");

    if (!valor || valor <= 0) {
        msg.innerText = "Digite um valor válido!";
        msg.className = "msg erro";
        return;
    }

    fetch("http://localhost:3000/doar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: campanhaAtual,
                valor,
                usuario: localStorage.getItem("usuario")
            })
        })
        .then(res => res.json())
        .then(campanha => {
            msg.innerText = "Doação realizada com sucesso! 🎉";
            msg.className = "msg sucesso";

            document.getElementById("valor" + campanhaAtual).innerText = campanha.arrecadado;
            const porcentagem = (campanha.arrecadado / campanha.meta) * 100;
            document.getElementById("barra" + campanhaAtual).style.width = porcentagem + "%";

            setTimeout(fecharModal, 1500);
        })
        .catch(() => {
            msg.innerText = "Erro ao doar!";
            msg.className = "msg erro";
        });
}

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.style.display = "none");
    const tela = document.getElementById(id);
    tela.style.display = (id === "login" || id === "cadastro") ? "flex" : "block";
}

function login() {
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
    const msg = document.getElementById("loginMsg");
    const btn = document.getElementById("btnLogin");

    if (!email || !senha) {
        msg.innerText = "Preencha todos os campos!";
        msg.className = "msg erro";
        return;
    }

    btn.innerText = "Entrando...";
    btn.disabled = true;

    fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                msg.innerText = "Login realizado com sucesso!";
                msg.className = "msg sucesso";

                localStorage.setItem("usuario", email);

                setTimeout(() => {
                    mostrarTela('home');
                }, 1000);

            } else {
                msg.innerText = "Email ou senha inválidos";
                msg.className = "msg erro";
            }
        })
        .catch(() => {
            msg.innerText = "Erro no servidor";
            msg.className = "msg erro";
        })
        .finally(() => {
            btn.innerText = "Entrar";
            btn.disabled = false;
        });
}


function cadastrar() {
    const email = document.getElementById("cadEmail").value;
    const senha = document.getElementById("cadSenha").value;
    const msg = document.getElementById("cadMsg");
    const btn = document.getElementById("btnCadastro");

    if (!email || !senha) {
        msg.innerText = "Preencha todos os campos!";
        msg.className = "msg erro";
        return;
    }

    if (senha.length < 4) {
        msg.innerText = "Senha muito curta!";
        msg.className = "msg erro";
        return;
    }

    btn.innerText = "Cadastrando...";
    btn.disabled = true;

    fetch("http://localhost:3000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        })
        .then(res => res.json())
        .then(data => {
            msg.innerText = data.success ? "Conta criada com sucesso!" : "Erro ao cadastrar";
            msg.className = data.success ? "msg sucesso" : "msg erro";

            if (data.success) setTimeout(() => mostrarTela("login"), 1200);
        })
        .catch(() => {
            msg.innerText = "Erro ao cadastrar";
            msg.className = "msg erro";
        })
        .finally(() => {
            btn.innerText = "Cadastrar";
            btn.disabled = false;
        });
}

window.onload = () => {
    mostrarTela("login");
    carregarCampanhas();
};