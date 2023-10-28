from django.db import models
from django.db.models import F

# Create your models here.


class Tamanho(models.Model):
    class Meta:
        db_table = "tb_tamanho"
        ordering = [F("id").asc()]

    nome = models.CharField(max_length=8)

    def __str__(self) -> str:
        return self.nome


class Produto(models.Model):
    class Meta:
        db_table = "tb_produto"
        ordering = [F("id").asc()]

    nome = models.CharField(max_length=127, null=False)
    descricao = models.TextField(null=False)
    esta_ativo = models.BooleanField(default=True, null=False)
    criado_em = models.DateTimeField(auto_now_add=True)

    tamanhos = models.ManyToManyField(Tamanho, through="ProdutoTamanho")

    def __str__(self) -> str:
        return self.nome


class ProdutoTamanho(models.Model):
    class Meta:
        db_table = "tb_produto_tamanho"
        ordering = [F("id").asc()]

    produto = models.ForeignKey(Produto, on_delete=models.SET_NULL, null=True)
    tamanho = models.ForeignKey(Tamanho, on_delete=models.SET_NULL, null=True)
    codigo_de_barras = models.CharField(max_length=127, null=True)
    quantidade = models.PositiveIntegerField(null=True, default=0)

    def __str__(self) -> str:
        return f"{self.produto.nome} {self.tamanho.nome} {self.quantidade} {self.codigo_de_barras}"
