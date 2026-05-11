
  const API_URL = "https://controle-gastos-backend-1-ahol.onrender.com";

  async function carregarGastos() {

    const container = document.getElementById("gastos");
    const mensagem = document.getElementById("mensagem");

    container.innerHTML =
    '<div class="loading">⏳ Carregando gastos...</div>';

    mensagem.innerHTML = "";

    try {

      const response =
      await fetch(`${API_URL}/gastos`);

      if(!response.ok){
        throw new Error("Erro ao buscar gastos");
      }

      const dados =
      await response.json();

      if(dados.gastos.length === 0){

        container.innerHTML =
        '<p style="text-align:center;">Nenhum gasto encontrado</p>';

        return;
      }

      container.innerHTML = dados.gastos.map(gasto => `

        <div class="gasto ${gasto.pago ? "pago" : "pendente"}">

          <h3>${gasto.descricao}</h3>

          <p><strong>Valor:</strong>
          R$ ${Number(gasto.valor).toFixed(2)}
          </p>

          <p><strong>Categoria:</strong>
          ${gasto.categoria}
          </p>

          <p><strong>Status:</strong>
          ${gasto.pago ? "Pago" : "Pendente"}
          </p>

          <p><strong>Data:</strong>
          ${gasto.data}
          </p>

          ${!gasto.pago ? `
            <button onclick="marcarComoPago(${gasto.id})">
              ✅ Marcar como pago
            </button>
          ` : ""}

          <button onclick="deletarGasto(${gasto.id})">
            🗑️ Excluir
          </button>

        </div>

      `).join("");

    } catch(erro){

      console.error(erro);

      mensagem.innerHTML = `
        <div class="error">
          ❌ Erro ao conectar no backend
        </div>
      `;

      container.innerHTML = "";

    }

  }

  async function carregarResumo(){

    try{

      const response =
      await fetch(`${API_URL}/gastos/resumo`);

      if(!response.ok){
        throw new Error("Erro ao carregar resumo");
      }

      const resumo =
      await response.json();

      document.getElementById("totalGasto").innerText =
      Number(resumo.total_gasto).toFixed(2);

      document.getElementById("totalPago").innerText =
      Number(resumo.total_pago).toFixed(2);

      document.getElementById("totalPendente").innerText =
      Number(resumo.total_pendente).toFixed(2);

    }catch(erro){

      console.error(erro);

    }

  }

  async function criarGasto(){

    const descricao =
    document.getElementById("descricao").value.trim();

    const valor =
    document.getElementById("valor").value.trim();

    const categoria =
    document.getElementById("categoria").value.trim();

    const mensagem =
    document.getElementById("mensagem");

    if(!descricao || !valor || !categoria){

      mensagem.innerHTML = `
        <div class="error">
          ❌ Preencha todos os campos
        </div>
      `;

      return;
    }

    try{

      const response =
      await fetch(`${API_URL}/gastos`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          descricao,
          valor:Number(valor),
          categoria
        })

      });

      if(!response.ok){
        throw new Error("Erro ao cadastrar gasto");
      }

      mensagem.innerHTML = `
        <div class="success">
          ✅ Gasto cadastrado com sucesso
        </div>
      `;

      document.getElementById("descricao").value = "";
      document.getElementById("valor").value = "";
      document.getElementById("categoria").value = "";

      carregarGastos();
      carregarResumo();

      setTimeout(() => {
        mensagem.innerHTML = "";
      },2000);

    }catch(erro){

      console.error(erro);

      mensagem.innerHTML = `
        <div class="error">
          ❌ Erro ao cadastrar gasto
        </div>
      `;

    }

  }

  async function marcarComoPago(id){

    try{

      await fetch(`${API_URL}/gastos/${id}/pagar`,{
        method:"PUT"
      });

      carregarGastos();
      carregarResumo();

    }catch(erro){

      console.error(erro);

    }

  }

  async function deletarGasto(id){

    try{

      await fetch(`${API_URL}/gastos/${id}`,{
        method:"DELETE"
      });

      carregarGastos();
      carregarResumo();

    }catch(erro){

      console.error(erro);

    }

  }

  document.addEventListener("DOMContentLoaded", () => {

    carregarGastos();
    carregarResumo();

  });

