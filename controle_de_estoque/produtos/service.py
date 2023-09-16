from django.db import transaction
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class CategoriaService:

    @staticmethod
    @transaction.atomic
    def salvar_categoria(categoria):
        categoria.save()


class ProdutoService:
    
    @staticmethod
    @transaction.atomic
    def salvar_produto(categoria, produto):
        if produto.preco_de_compra <= 0:
            raise ValidationError(
                _(f"{produto.preco_de_compra} não é um valor válido!")
            )

        CategoriaService.salvar_categoria(categoria)

        produto.categoria_id = categoria.id
        produto.save()

