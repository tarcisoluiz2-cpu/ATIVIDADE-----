// ========================================
// PERDEU ACHOU
// Sistema de Achados e Perdidos
// ========================================


// Dados iniciais
let itens = [
    {
        id: 1,
        tipo: "perdido",
        nome: "Carteira preta",
        descricao: "Carteira de couro preta com documentos e cartões.",
        local: "Biblioteca",
        contato: "(11) 99999-1111",
        imagem: "",
        resolvido: false
    },

    {
        id: 2,
        tipo: "encontrado",
        nome: "Chave de carro",
        descricao: "Chave de carro encontrada próxima ao estacionamento.",
        local: "Estacionamento",
        contato: "(11) 98888-2222",
        imagem: "",
        resolvido: false
    },

    {
        id: 3,
        tipo: "perdido",
        nome: "Fone Bluetooth",
        descricao: "Fone de ouvido branco dentro de uma pequena caixa.",
        local: "Sala 04",
        contato: "contato@email.com",
        imagem: "",
        resolvido: false
    }
];


let filtroAtual = "todos";


// ========================================
// MODAL
// ========================================

function abrirModal() {

    document
        .getElementById("modal")
        .classList.add("aberto");
}


function fecharModal() {

    document
        .getElementById("modal")
        .classList.remove("aberto");
}


// Fechar modal clicando fora
document.getElementById("modal").addEventListener("click", function(event) {

    if (event.target === this) {
        fecharModal();
    }

});


// ========================================
// CADASTRAR ITEM
// ========================================

document
    .getElementById("formItem")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const tipo = document.querySelector(
            'input[name="tipo"]:checked'
        ).value;


        const nome = document
            .getElementById("nome")
            .value
            .trim();


        const descricao = document
            .getElementById("descricao")
            .value
            .trim();


        const local = document
            .getElementById("local")
            .value
            .trim();


        const contato = document
            .getElementById("contato")
            .value
            .trim();


        const imagem = document
            .getElementById("imagem")
            .value
            .trim();


        const novoItem = {

            id: Date.now(),

            tipo: tipo,

            nome: nome,

            descricao: descricao,

            local: local,

            contato: contato,

            imagem: imagem,

            resolvido: false

        };


        itens.unshift(novoItem);


        this.reset();


        fecharModal();


        filtroAtual = "todos";


        document
            .querySelectorAll(".filtro")
            .forEach(botao => {
                botao.classList.remove("ativo");
            });


        document
            .querySelector('[data-filtro="todos"]')
            .classList.add("ativo");


        renderizarItens();


        mostrarNotificacao(
            "Item publicado com sucesso! 🎉"
        );

    });


// ========================================
// FILTROS
// ========================================

function filtrar(tipo, botao) {

    filtroAtual = tipo;


    document
        .querySelectorAll(".filtro")
        .forEach(item => {
            item.classList.remove("ativo");
        });


    botao.classList.add("ativo");


    renderizarItens();

}


// ========================================
// RENDERIZAR CARDS
// ========================================

function renderizarItens() {

    const container =
        document.getElementById("listaItens");


    const busca =
        document
            .getElementById("campoBusca")
            .value
            .toLowerCase()
            .trim();


    let itensFiltrados = itens.filter(item => {

        // Filtro por categoria

        let passouFiltro = true;


        if (filtroAtual === "perdido") {

            passouFiltro =
                item.tipo === "perdido" &&
                !item.resolvido;

        }


        if (filtroAtual === "encontrado") {

            passouFiltro =
                item.tipo === "encontrado" &&
                !item.resolvido;

        }


        if (filtroAtual === "resolvido") {

            passouFiltro = item.resolvido;

        }


        // Busca por palavra-chave

        const textoBusca = (

            item.nome +
            " " +
            item.descricao +
            " " +
            item.local

        ).toLowerCase();


        const passouBusca =
            textoBusca.includes(busca);


        return passouFiltro && passouBusca;

    });


    document.getElementById("contador").textContent =
        `${itensFiltrados.length} ${
            itensFiltrados.length === 1
                ? "item"
                : "itens"
        }`;


    if (itensFiltrados.length === 0) {

        container.innerHTML = `

            <div class="sem-resultados">

                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                ">

                    <div style="
                        font-size: 60px;
                        margin-bottom: 15px;
                    ">
                        🔎
                    </div>

                    <h3>
                        Nenhum item encontrado
                    </h3>

                    <p style="
                        color: #777;
                        margin-top: 8px;
                    ">
                        Tente outra busca ou cadastre
                        um novo anúncio.
                    </p>

                </div>

            </div>

        `;

        return;
    }


    container.innerHTML = itensFiltrados
        .map(item => criarCard(item))
        .join("");

}


// ========================================
// CRIAR CARD
// ========================================

function criarCard(item) {

    let badge = "";

    let classeBadge = "";


    if (item.resolvido) {

        badge = "✓ RESOLVIDO";

        classeBadge = "badge-resolvido";

    }

    else if (item.tipo === "perdido") {

        badge = "🔴 PERDI";

        classeBadge = "badge-perdido";

    }

    else {

        badge = "🟢 ENCONTREI";

        classeBadge = "badge-encontrado";

    }


    let imagemHTML = "";


    if (item.imagem) {

        imagemHTML = `
            <img
                src="${escapeHTML(item.imagem)}"
                alt="${escapeHTML(item.nome)}"
                onerror="this.parentElement.innerHTML='📦'"
            >
        `;

    }

    else {

        let emoji = item.tipo === "perdido"
            ? "🔎"
            : "📦";


        imagemHTML = emoji;

    }


    return `

        <article class="card">

            <div class="card-imagem">

                ${imagemHTML}

            </div>


            <div class="card-conteudo">

                <span class="badge ${classeBadge}">
                    ${badge}
                </span>


                <h3>
                    ${escapeHTML(item.nome)}
                </h3>


                <p class="descricao">
                    ${escapeHTML(item.descricao)}
                </p>


                <div class="info">
                    📍
                    <span>
                        ${escapeHTML(item.local)}
                    </span>
                </div>


                <div class="card-footer">

                    <span class="contato">
                        📞 ${escapeHTML(item.contato)}
                    </span>


                    ${
                        item.resolvido
                        ? `
                            <span style="
                                color: #00a83b;
                                font-size: 11px;
                                font-weight: 700;
                            ">
                                ✓ Devolvido
                            </span>
                        `
                        : `
                            <button
                                class="btn-resolver"
                                onclick="resolverItem(${item.id})">
                                Marcar resolvido
                            </button>
                        `
                    }

                </div>

            </div>

        </article>

    `;

}


// ========================================
// MARCAR COMO RESOLVIDO
// ========================================

function resolverItem(id) {

    const item = itens.find(
        item => item.id === id
    );


    if (!item) {
        return;
    }


    item.resolvido = true;


    renderizarItens();


    mostrarNotificacao(
        "Item marcado como resolvido! ✅"
    );

}


// ========================================
// NOTIFICAÇÃO
// ========================================

function mostrarNotificacao(mensagem) {

    const notificacao =
        document.getElementById("notificacao");


    notificacao.querySelector("p")
        .textContent = mensagem;


    notificacao.classList.add("mostrar");


    setTimeout(() => {

        notificacao.classList.remove("mostrar");

    }, 3000);

}


// ========================================
// SEGURANÇA
// Evita inserir HTML digitado pelo usuário
// ========================================

function escapeHTML(texto) {

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// INICIALIZAÇÃO
// ========================================

renderizarItens();
