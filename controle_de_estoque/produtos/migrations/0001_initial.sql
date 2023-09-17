BEGIN;
--
-- Create model Categoria
--
CREATE TABLE "categoria" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nome" varchar(80) NOT NULL);
--
-- Create model Produto
--
CREATE TABLE "produto" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "nome" varchar(80) NOT NULL, "tamanho" varchar(3) NOT NULL, "preco_de_compra" decimal NOT NULL, "ativo" bool NOT NULL, "categoria_id" bigint NULL UNIQUE REFERENCES "categoria" ("id") DEFERRABLE INITIALLY DEFERRED);
COMMIT;
