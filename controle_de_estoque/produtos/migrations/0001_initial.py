# Generated by Django 4.2.5 on 2023-09-19 01:52

from django.db import migrations, models
import django.db.models.deletion


def default_rows_tamanho(apps, schema_editor):
    Tamanho = apps.get_model("produtos", "Tamanho")

    Tamanho.objects.create(nome="PP")
    Tamanho.objects.create(nome="P")
    Tamanho.objects.create(nome="M")
    Tamanho.objects.create(nome="G")
    Tamanho.objects.create(nome="GG")
    Tamanho.objects.create(nome="G1")
    Tamanho.objects.create(nome="G2")


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Produto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=127)),
                ('descricao', models.TextField()),
                ('esta_ativo', models.BooleanField(default=True)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'tb_produto',
            },
        ),
        migrations.CreateModel(
            name='Tamanho',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=8)),
            ],
            options={
                'db_table': 'tb_tamanho',
            },
        ),
        migrations.CreateModel(
            name='ProdutoTamanho',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('codigo_de_barras', models.CharField(max_length=127, null=True)),
                ('quantidade', models.PositiveIntegerField()),
                ('produto', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='produtos.produto')),
                ('tamanho', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='produtos.tamanho')),
            ],
            options={
                'db_table': 'tb_produto_tamanho',
            },
        ),
        migrations.AddField(
            model_name='produto',
            name='tamanhos',
            field=models.ManyToManyField(through='produtos.ProdutoTamanho', to='produtos.tamanho'),
        ),

        migrations.RunPython(default_rows_tamanho),
    ]
