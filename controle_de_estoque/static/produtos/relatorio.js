const myFormCriarProduto = document.querySelector(".myFormCriarProduto");
myFormCriarProduto.reset();

const selectTamanhosProduto = document.querySelector("#tamanhosProduto");

const myModalCriarProduto = document.querySelector("#modalCriarProduto");

const btnCloseFormCriarProduto = document.querySelector(".btn-close-form-criar-produto");
const btnCriarProduto = document.querySelector("#btn-criar-produto");

let tamanhosArr = new Array();

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

function popularTabela(pagina, nomeLike = "") {
  $.get(`listar/?page=${pagina}&nomeLike=${nomeLike}`, function (data, status) {
    const myPagination = $("#myPagination");
    const myTableBody = $("#myTableBody");
    myTableBody.html("");
    myPagination.html("");

    data.dadosPagina.forEach(produto => {
      myTableBody.append(`
        <tr class="myPointer" onClick="visualizar_produto(${produto.pk});">
          <th>${produto.pk}</th>
          <th>${produto.fields.nome}</th>
          <th>${produto.fields.descricao}</th>
          <th class="w-25">${produto.fields.esta_ativo ? "&#9989;" : "&#10060;"}</th>

          <th class="w-25">
            <div class="btn-group" role="group" aria-label="Basic outlined example">
              <button type="button" class="btn btn-warning">Editar</button>
              <button onClick="desativarProduto(${produto.pk});" type="button" class="btn btn-danger">Desativar</button>
            </div>
          </th>
      </tr>
      `);
    });

    if (data.paginaAtual === "1") {
      myPagination.append(`
        <li class="page-item disabled" aria-current="page">
          <span class="page-link">Anterior</span>
        </li>
      `)
    } else {
      myPagination.append(`
        <li class="page-item"><button onClick="popularTabela(${data.paginaAnterior})" class="page-link">Anterior</button></li>
      `)
    }

    data.paginaArray.forEach(p => {
      if (p === "…") {
        myPagination.append(`
          <li class="page-item disabled"><span class="page-link">${p}</span></li>
        `);
      } else {
        if (p.toString() === data.paginaAtual) {
          myPagination.append(`<li class="page-item active"><span class="page-link">${p}</span></li>`)
        } else {
          myPagination.append(`
            <li class="page-item ${p.toString() === data.paginaAtual ? "active" : ""}"><button type="button" onClick="popularTabela(${p})" class="page-link">${p}</button></li>
          `);
        }
      }
    });

    if (data.paginaAtual === data.totalPaginas) {
      myPagination.append(`
        <li class="page-item disabled" aria-current="page">
          <span class="page-link">Próximo</span>
        </li>
      `)
    } else {
      myPagination.append(`
        <li class="page-item"><button onClick="popularTabela(${data.proximaPagina})" class="page-link">Próximo</button></li>
      `);
    }
  })
}popularTabela(1);

function popularSelectTamanhoProduto() {
  $.get(`tamanhos/listar/`, function(data, status) {
    const tamanhos = JSON.parse(data.dadosTamanho);
    const tamanhosProduto = $("#tamanhosProduto");
    tamanhosProduto.html("");

    tamanhosProduto.append("<option selected>Selecione um tamanho:</option>")
    tamanhos.forEach(tamanho => {
      tamanhosProduto.append(`<option value=${tamanho.fields.nome}>${tamanho.fields.nome}</option>`);
    });
  })
}popularSelectTamanhoProduto();

$("#myFormPesquisarProdutoPeloNome").on("submit", function(e) {
  e.preventDefault();
  const nome = $("input[name=nomeLike]").val();

  popularTabela(1, nome);
})


$(document).on("submit", ".myFormCriarProduto", (e) => {

  console.log(
    {
      nome: $("#nomeProduto").val(),
      descricao: $("#descricaoProduto").val(),
      codigo_de_barras: $("#codigoDeBarrasProduto").val(),
      tamanhos: tamanhosArr,
      csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
    }
  );

  e.preventDefault();
  $.ajax({
    type: "POST",
    url: "criar/",
    data: { 
      produto: JSON.stringify({
        nome: $("#nomeProduto").val(),
        descricao: $("#descricaoProduto").val(),
        codigo_de_barras: $("#codigoDeBarrasProduto").val(),
        tamanhos: tamanhosArr,
    }),
      csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
    },
    success: function(data, textStatus, jqXHR) {
      switch (jqXHR.status) {
        case 201:
          tamanhosArr.length = 0;
          tamanhosSelecionados.length = 0;
          $(function () {
            $("#modalCriarProduto").modal("toggle");
          });
    
          $(".myFormCriarProduto")[0].reset();
          $(".tamanhos-selecionados").html("");
          $(".tamanhos-selecionados").removeClass("rounded");
          $(".tamanhos-selecionados").removeClass("border");
          showToast("Adicionar Produto", "Produto criado com sucesso!")
          popularTabela(1);
          break;
      }
    },
  });
});

const desativarProduto = (pk) => {
  $.ajax({
    type: "POST",
    url: `desativar/${pk}`,
    data: {
      csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
    },
    success: function(data, textStatus, jqXHR) {
      console.log(data);
      console.log(jqXHR.status);
    }
  });
}

const visualizar_produto = (pk) => {
  console.log(pk)
  $.ajax({
    type: "GET",
    url: `product_detail/${pk}`,
    
    success: function(data, textStatus, jqXHR) {
      console.log(data);
      console.log(jqXHR.status);
    }
  });
  
}