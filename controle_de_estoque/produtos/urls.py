from django.urls import path

from . import views


app_name = "produtos"
urlpatterns = [
    path("", views.relatorio, name="relatorio"),
    path("criar/", views.criar_produto, name="criar"),
    path("listar/", views.listar_produtos, name="listar_produtos"),
    path("tamanhos/listar/", views.listar_tamanhos, name="listar_tamanhos")
    path('api/obter_detalhes_produto/<int:produto_id>/', views.obter_detalhes_produto, name='obter_detalhes_produto'),

]
