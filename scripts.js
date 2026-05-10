// Configure a URL do seu backend aqui
const API_URL = " https://controle-gastos-backend-1-ahol.onrender.com";

async function carregarGastos() {
  const container = document.getElementById("gastos");
  const mensagem = document.getElementById("mensagem");

  container.innerHTML = '<div class="loading">⏳ Carregando gastos...</div>';
  mensagem.innerHTML = "";

  try {
    const response = await fetch(`${API_URL}/gastos`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();

    if (dados.gastos.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #999;">Nenhum gasto encontrado</p>';
      return;
    }

    container.innerHTML = dados.gastos.map(gasto => `
      <div class="gasto ${gasto.pago ? "pago" : "pendente"}">
        <h3>${gasto.descricao}</h3>
        <p><strong>Valor:</strong> R$ ${gasto.valor.toFixed(2)}</p>
        <p><strong>Categoria:</strong> ${gasto.categoria}</p>
        <p><strong>Status:</strong> ${gasto.pago ? "Pago" : "Pendente"}</p>
        <p><strong>Data:</strong> ${gasto.data}</p>

        ${!gasto.pago ? `
          <button onclick="marcarComoPago(${gasto.id})">
            Marcar como pago
          </button>
        ` : ""}

        <button onclick="deletarGasto(${gasto.id})">
          Excluir
        </button>
      </div>
    `).join("");

  } catch (erro) {
    console.error("Erro ao carregar gastos:", erro);

    mensagem.innerHTML = `
      <div class="error">
        ❌ Erro ao conectar ao backend: ${erro.message}
        <br/><small>Verifique se a URL está correta: ${API_URL}</small>
      </div>
    `;

    container.innerHTML = "";
  }
}

async function carregarResumo() {
  try {
    const response = await fetch(`${API_URL}/gastos/resumo`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const resumo = await response.json();

    document.getElementById("totalGasto").innerText = resumo.total_gasto.toFixed(2);
    document.getElementById("totalPago").innerText = resumo.total_pago.toFixed(2);
    document.getElementById("totalPendente").innerText = resumo.total_pendente.toFixed(2);

  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}

async function criarGasto() {
  const descricao = document.getElementById("descricao").value.trim();
  const valor = document.getElementById("valor").value.trim();
  const categoria = document.getElementById("categoria").value.trim();
  const mensagem = document.getElementById("mensagem");

  if (!descricao || !valor || !categoria) {
    mensagem.innerHTML = '<div class="error">❌ Descrição, valor e categoria são obrigatórios!</div>';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/gastos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        descricao,
        valor,
        categoria
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    mensagem.innerHTML = '<div class="success">✅ Gasto cadastrado com sucesso!</div>';

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("categoria").value = "";

    setTimeout(() => {
      carregarGastos();
      carregarResumo();
      mensagem.innerHTML = "";
    }, 1000);

  } catch (erro) {
    console.error("Erro ao cadastrar gasto:", erro);
    mensagem.innerHTML = `<div class="error">❌ Erro ao cadastrar gasto: ${erro.message}</div>`;
  }
}

async function marcarComoPago(id) {
  try {
    await fetch(`${API_URL}/gastos/${id}/pagar`, {
      method: "PUT"
    });

    carregarGastos();
    carregarResumo();

  } catch (erro) {
    console.error("Erro ao marcar como pago:", erro);
  }
}

async function deletarGasto(id) {
  try {
    await fetch(`${API_URL}/gastos/${id}`, {
      method: "DELETE"
    });

    carregarGastos();
    carregarResumo();

  } catch (erro) {
    console.error("Erro ao deletar gasto:", erro);
  }
}

// Carregar gastos ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
  carregarGastos();
  carregarResumo();
});