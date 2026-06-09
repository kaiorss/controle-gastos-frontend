# define a imagem base que será usada para criar o container
# neste caso, usamos a imagem oficial do nginx
# a versão alpine é uma versão mais leve, comum em containers
from nginx:alpine

# copia os arquivos da pasta public para a pasta padrão do nginx
# essa pasta é o local onde o nginx procura os arquivos que serão entregues ao navegador
copy public /usr/share/nginx/html

# informa que o container utiliza a porta 80 internamente
# atenção: expose não publica a porta automaticamente
# ele apenas documenta a porta usada pelo nginx dentro do container
expose 80