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

const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

