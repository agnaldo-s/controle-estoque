from django.contrib import admin

from .models import Tamanho, Produto, ProdutoTamanho

# Register your models here.

admin.site.register(Tamanho)
admin.site.register(Produto)
admin.site.register(ProdutoTamanho)
