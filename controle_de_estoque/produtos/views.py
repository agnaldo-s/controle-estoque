import json

from django.shortcuts import render
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.db import transaction
from http import HTTPStatus

from .models import Produto, Tamanho, ProdutoTamanho

# Create your views here.

OFFSET = 30

def relatorio(request):
    numero_da_pagina = request.GET.get("page")
    nome_like = request.GET.get("nomeLike", "")

    if not numero_da_pagina:
        numero_da_pagina = 1
    
    paginator_produtos = Paginator(Produto.objects.all(), OFFSET)
    tamanhos = Tamanho.objects.all()

    if nome_like:
        paginator_produtos = Paginator(Produto.objects.filter(nome__contains=nome_like), OFFSET)

    paginator_elided = list(paginator_produtos.get_elided_page_range(number=numero_da_pagina, on_each_side=3, on_ends=1))
    pagina = paginator_produtos.get_page(numero_da_pagina)

    return render(request, "produtos/relatorio.html", 
                  context={
                      "pagina": pagina, 
                      "paginator": paginator_produtos, 
                      "elided": paginator_elided, 
                      "nome_like": nome_like, 
                      "tamanhos": tamanhos
                    }
                  )


@transaction.atomic
def me(request):
    produto_request = json.loads(request.POST["produto"])
    produto = Produto.objects.create(nome=produto_request["nome"], descricao=produto_request["descricao"])

    for tamanho_selecionado in produto_request["tamanhos"]:
        tamanho = Tamanho.objects.get(nome=tamanho_selecionado["tamanho"])
        ProdutoTamanho.objects.create(produto=produto, tamanho=tamanho, quantidade=tamanho_selecionado["quantidade"],
                                        codigo_de_barras=produto_request["codigo_de_barras"])

    return JsonResponse({}, status=HTTPStatus.CREATED)
