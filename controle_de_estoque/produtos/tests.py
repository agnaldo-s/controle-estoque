from decimal import Decimal

from django.test import TestCase
from django.db import transaction
from django.core.exceptions import ValidationError

from .models import Categoria, Produto
from .service import ProdutoService

# Create your tests here.

class ProdutoTestCase(TestCase):

    @transaction.atomic
    def test_criar_produto_com_sucesso(self):
        campos_categoria = {
            "nome": "Inverno"
        }

        campos_produto = {
            "nome": "Casaco",
            "tamanho": "PP",
            "preco_de_compra": Decimal("5.10"),
        }

        categoria_test = Categoria(**campos_categoria)
        produto_test = Produto(**campos_produto)

        ProdutoService.salvar_produto(categoria_test, produto_test)

        categoria_salva = Categoria.objects.get(id=categoria_test.id)
        produto_salvo = Produto.objects.get(id=produto_test.id)


        self.assertEqual(categoria_test, categoria_salva)
        self.assertEqual(produto_test, produto_salvo)
        self.assertEqual(categoria_salva.id, produto_salvo.categoria_id)

    def test_criar_produto_com_preco_de_compra_negativo_ou_nulo(self):
        campos_categoria = {
            "nome": "Inverno"
        }
        campos_produto = {
            "nome": "Casaco",
            "tamanho": "PP",
            "preco_de_compra": Decimal("-5.10"),
        }
        
        categoria_test = Categoria(**campos_categoria)
        produto_test = Produto(**campos_produto)

        with self.assertRaises(ValidationError) as test_ex:
            ProdutoService.salvar_produto(categoria_test, produto_test)

        self.assertEqual(str(test_ex.exception.message), f"{produto_test.preco_de_compra} não é um valor válido!")

