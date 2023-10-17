import json

from django.shortcuts import render
from django.core.paginator import Paginator
from django.core.cache import cache
from django.core import serializers
from django.http import JsonResponse
from django.db import transaction
from django.views.decorators.http import require_POST
from http import HTTPStatus

from .models import Produto, Tamanho, ProdutoTamanho

# Create your views here.

OFFSET = 2

def relatorio(request):
    return render(request, "produtos/relatorio.html")


def listar_produtos(request):
    numero_da_pagina = request.GET.get("page")
    nome_like = request.GET.get("nomeLike", "")

    if not numero_da_pagina:
        numero_da_pagina = 1
    
    cache_key = f"listar_produtos_{numero_da_pagina}_{nome_like}"
    produtos_cacheados = cache.get(cache_key)

    if produtos_cacheados is None:
        paginator_produtos = Paginator(Produto.objects.all(), OFFSET)

        if nome_like:
            paginator_produtos = Paginator(Produto.objects.filter(nome__contains=nome_like), OFFSET)

        paginator_elided = list(paginator_produtos.get_elided_page_range(number=numero_da_pagina, on_each_side=3, on_ends=1))
        pagina = paginator_produtos.get_page(numero_da_pagina)

        payload = {
            "paginaAtual": numero_da_pagina,
            "paginaAnterior": pagina.previous_page_number() if pagina.has_previous() else None,
            "proximaPagina": pagina.next_page_number() if pagina.has_next() else None,
            "totalPaginas": str(paginator_produtos.num_pages),
            "paginaArray": paginator_elided,
            "dadosPagina": serializers.serialize("python", pagina)
        }

        cache.set(cache_key, payload, 1)
    else:
        payload = produtos_cacheados

    return JsonResponse(payload, safe=True, status=HTTPStatus.OK)


def listar_tamanhos(request):
    tamanhos = Tamanho.objects.all()

    return JsonResponse({"dadosTamanho": serializers.serialize("json", tamanhos)}, 
                        status=HTTPStatus.OK)


@require_POST
@transaction.atomic
def criar_produto(request):
    print(request.POST["produto"])
    produto_request = json.loads(request.POST["produto"])
    produto = Produto.objects.create(nome=produto_request["nome"], descricao=produto_request["descricao"])

    for tamanho_selecionado in produto_request["tamanhos"]:
        tamanho = Tamanho.objects.get(nome=tamanho_selecionado)
        ProdutoTamanho.objects.create(produto=produto, tamanho=tamanho, codigo_de_barras=produto_request["codigo_de_barras"])

    return JsonResponse({}, status=HTTPStatus.CREATED)
