const myFormCriarProduto = document.querySelector(".myFormCriarProduto");
myFormCriarProduto.reset();

const selectTamanhosProduto = document.querySelector("#tamanhosProduto");

const myModalCriarProduto = document.querySelector("#modalCriarProduto");

const btnCloseFormCriarProduto = document.querySelector(".btn-close-form-criar-produto");
const btnCriarProduto = document.querySelector("#btn-criar-produto");

let tamanhosArr = new Array();
let quantidadeTamanhoArr = new Array();

const tamanhosSelecionados = document.querySelector(".tamanhos-selecionados");


btnCloseFormCriarProduto.addEventListener("click", () => {
  tamanhosSelecionados.innerHTML = '';
  tamanhosArr.length = 0;
  tamanhosSelecionados.classList.remove("border", "rounded");
  myFormCriarProduto.reset()
});

selectTamanhosProduto.addEventListener("change", () => {
  if (selectTamanhosProduto.selectedIndex > 0) {

    if (tamanhosArr.includes(selectTamanhosProduto.value)) return;

    tamanhosSelecionados.classList.add("border", "rounded");

    tamanhosArr.push(selectTamanhosProduto.value);

    tamanhosSelecionados.innerHTML += `
      <li class="page-item active d-flex" style="max-width: 205px;">
        <div class="input-group mb-1">
          <span class="input-group-text" id="basic-addon1">${selectTamanhosProduto.value}</span>
          <input type="hidden" name="valorTamanho" value="${selectTamanhosProduto.value}">
          <input type="text" name="quantidadeTamanho" class="form-control inputQuantidadeTamanho" placeholder="Quantidade" aria-label="Username" aria-describedby="basic-addon1">
        </div>
        <button type="button" class="btn-close btn-remover-tamanho"></button>
      </li>
    `;

    const inputQuantidadeTamanho = document.querySelectorAll(".inputQuantidadeTamanho");

    inputQuantidadeTamanho.forEach(element => {
      element.addEventListener("input", () => {
        element.setAttribute("value", element.value);
      });
    });

    quantidadeTamanhoArr.length = 0;

    inputQuantidadeTamanho.forEach(element => {
      quantidadeTamanhoArr.push(element.value);
    });

    const btnRemoverTamanho = document.querySelectorAll(".btn-remover-tamanho");

    btnRemoverTamanho.forEach(e => {
      e.addEventListener("click", (e) => {
        const tamanho = e.target.parentNode.textContent.trim();
        if (tamanhosArr.includes(tamanho)) {
          e.target.parentNode.remove();
          tamanhosArr = tamanhosArr.filter(t => t != tamanho);

          if (tamanhosArr.length == 0) {
            tamanhosSelecionados.classList.remove("border", "rounded");
          }
        }
      });
    });
  }
});

const showToast = (title, text) => {
  $("#myToast").html(`
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${text}</div>
    </div>
</div>
  `);

  const toastElement = document.querySelector("#liveToast");
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
  toast.show();
}

$(document).on("submit", ".myFormCriarProduto", (e) => {
  let tamanhosSelecionados = new Array();
  let quantidadeTamanhoSelecionados = new Array();

  $("input[name=valorTamanho]").each(function() {
    tamanhosSelecionados.push($(this).val());
  });
  
  $(".inputQuantidadeTamanho").each(function() {
    quantidadeTamanhoSelecionados.push($(this).val());
  });

  const tamanhos = quantidadeTamanhoSelecionados.map((q, i) => ({
    tamanho: tamanhosSelecionados[i],
    quantidade: q
  }));

  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "me/",
    data: { 
      produto: JSON.stringify({
        nome: $("#nomeProduto").val(),
        descricao: $("#descricaoProduto").val(),
        codigo_de_barras: $("#codigoDeBarrasProduto").val(),
        tamanhos: tamanhos,
    }),
      csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
    },
    success: function(data, textStatus, jqXHR) {
      switch (jqXHR.status) {
        case 201:
          $(function () {
            $("#modalCriarProduto").modal("toggle");
          });
    
          $(".myFormCriarProduto")[0].reset();
          $(".tamanhos-selecionados").html("");
          $(".tamanhos-selecionados").removeClass("rounded");
          $(".tamanhos-selecionados").removeClass("border");
          showToast("Adicionar Produto", "Produto criado com sucesso!")
          break;
      }
    },
  });
});
