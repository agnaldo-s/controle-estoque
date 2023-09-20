from django.test import TestCase
from django.db import transaction

from .models import Tamanho, Produto, ProdutoTamanho

# Create your tests here.


class ProdutoTamanhoTestCase(TestCase):
    @transaction.atomic
    def test_criar_produto_com_tamanho_com_sucesso(self):
        tamanho = Tamanho.objects.get(id=1)
        produto = Produto.objects.create(nome="Casaco Rosa", descricao="Um lindo casaco")
        produto_tamanho = ProdutoTamanho.objects.create(produto=produto, tamanho=tamanho, quantidade=10, codigo_de_barras=9537238)
        produto_tamanho_test = ProdutoTamanho.objects.get(id=produto_tamanho.id)

        self.assertEqual(tamanho.id, produto_tamanho_test.tamanho.id)
        self.assertEqual(produto.id, produto_tamanho_test.produto.id)
        