from django.shortcuts import render
from django.core.paginator import Paginator

from .models import Produto

# Create your views here.

OFFSET = 30

def relatorio(request):
    numero_da_pagina = request.GET.get("page")
    nome_like = request.GET.get("nomeLike", "")

    if not numero_da_pagina:
        numero_da_pagina = 1
    
    paginator_produtos = Paginator(Produto.objects.all(), OFFSET)

    if nome_like:
        paginator_produtos = Paginator(Produto.objects.filter(nome__contains=nome_like), OFFSET)

    paginator_elided = list(paginator_produtos.get_elided_page_range(number=numero_da_pagina, on_each_side=3, on_ends=1))
    pagina = paginator_produtos.get_page(numero_da_pagina)

    return render(request, "produtos/relatorio.html", context={"pagina": pagina, "paginator": paginator_produtos, "elided": paginator_elided, "nome_like": nome_like})
