const API_URL = "https://controle-gastos-backend-2.onrender.com";

// ===============================
// TESTAR API V1
// ===============================
async function chamarAPI() {
  const resposta = await fetch(`${API_URL}/v1`);
  const dados = await resposta.json();

  document.getElementById("resposta").textContent =
    `${dados.message} chamada em ${dados.chamada_em}`;
}

// ===============================
// CARREGAR LISTA DE GASTOS
// ===============================
async function carregarGastos() {
  const container = document.getElementById("listaGastos");

  container.innerHTML = "⏳ Carregando gastos...";

  try {
    const response = await fetch(`${API_URL}/gastos`);
    const dados = await response.json();

    container.innerHTML = dados.gastos.map(gasto => `
      <div class="gasto ${gasto.pago ? "pago" : "pendente"}">
        <h3>${gasto.descricao}</h3>

        <p><strong>Valor:</strong> R$ ${Number(gasto.valor).toFixed(2)}</p>
        <p><strong>Categoria:</strong> ${gasto.categoria}</p>
        <p><strong>Status:</strong> ${gasto.pago ? "Pago" : "Pendente"}</p>
        <p><strong>Data:</strong> ${gasto.data}</p>

        ${!gasto.pago ? `
          <button class="btn-pagar" onclick="marcarComoPago(${gasto.id})">
            Marcar como Pago
          </button>
        ` : ""}
      </div>
    `).join("");

  } catch (erro) {
    container.innerHTML = "❌ Erro ao carregar gastos.";
    console.error(erro);
  }
}

// ===============================
// CARREGAR RESUMO
// ===============================
async function carregarResumo() {
  try {
    const response = await fetch(`${API_URL}/gastos/resumo`);

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const resumo = await response.json();

    document.getElementById("totalGasto").innerText =
      Number(resumo.total_gasto || 0).toFixed(2);

    document.getElementById("totalPago").innerText =
      Number(resumo.total_pago || 0).toFixed(2);

    document.getElementById("totalPendente").innerText =
      Number(resumo.total_pendente || 0).toFixed(2);

  } catch (erro) {
    console.error("Erro ao carregar resumo:", erro);
  }
}

// ===============================
// CADASTRAR GASTO
// ===============================
window.cadastrarGasto = async function cadastrarGasto() {
  const descricao = document.getElementById("descricao").value.trim();
  const valor = document.getElementById("valor").value.trim();
  const categoria = document.getElementById("categoria").value.trim();

  if (!descricao || !valor || !categoria) {
    alert("Preencha todos os campos!");
    return;
  }

  await fetch(`${API_URL}/gastos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      descricao,
      valor: Number(valor),
      categoria
    })
  });

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("categoria").value = "";

  carregarGastos();
  carregarResumo();
};

// ===============================
// MARCAR COMO PAGO
// ===============================
window.marcarComoPago = async function marcarComoPago(id) {
  await fetch(`${API_URL}/gastos/${id}/pagar`, {
    method: "PUT"
  });

  carregarGastos();
  carregarResumo();
};

// ===============================
// INICIAR SISTEMA
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  carregarGastos();
  carregarResumo();
});