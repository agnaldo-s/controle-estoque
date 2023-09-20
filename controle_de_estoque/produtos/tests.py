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

    @transaction.atomic
    def test_atualizar_produto_com_sucesso(self):
        tamanho1 = Tamanho.objects.get(id=1)
        tamanho2 = Tamanho.objects.get(id=2)

        produto = Produto.objects.create(nome="Casaco Rosa", descricao="Um lindo casaco")
        tamanhos_produto_antes_de_atualizar = produto.tamanhos.all().count()

        produto_tamanho = ProdutoTamanho.objects.create(produto=produto, tamanho=tamanho1, quantidade=10, 
                                                        codigo_de_barras=12345)

        produto_test = Produto.objects.get(id=produto.id)
        produto_test.nome = "Casaco Rosa Escuro"
        produto_test.descricao = "Um lindo casaco rosa escuro"
        produto_test.save()

        produto_tamanho_test = ProdutoTamanho.objects.get(id=1)
        produto_tamanho_test.codigo_de_barras = 123456
        produto_tamanho_test.save()

        ProdutoTamanho.objects.create(produto=produto_test, tamanho=tamanho2, quantidade=50,
                                      codigo_de_barras=123456)

        self.assertNotEqual([produto.nome, produto.descricao], [produto_test.nome, produto_test.descricao])
        self.assertNotEqual(produto_tamanho.codigo_de_barras, produto_tamanho_test.codigo_de_barras)
        self.assertTrue(produto_test.tamanhos.all().count() > tamanhos_produto_antes_de_atualizar)
