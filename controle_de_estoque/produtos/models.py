from decimal import Decimal

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator

# Create your models here.

class Categoria(models.Model):
    nome = models.CharField(max_length=80)

    class Meta:
        db_table = "categoria"

    def __str__(self):
        return self.nome


class Produto(models.Model):
    nome = models.CharField(max_length=80, null=False)
    tamanho = models.CharField(max_length=3, null=False)
    preco_de_compra = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(Decimal("0.1"))])
    ativo = models.BooleanField(default=True, null=False)

    categoria = models.OneToOneField(Categoria, null=True, on_delete=models.SET_NULL);

    class Meta:
        db_table = "produto"

    def __str__(self):
        return self.nome

