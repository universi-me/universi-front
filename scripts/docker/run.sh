#!/bin/sh

replace_var() {
    if [[ -z "$1" ]]; then
        echo "A variável $1 não foi encontrada."
        exit 1
    else
        echo "Substituindo a variável de ambiente $1 pelo valor ${!1:-$2}."
        sed -i 's|@'$1'@|'${!1}'|g' $(grep -sRl "@$1@" /usr/share/nginx/html/universime)
    fi
}

# Substitui todas as ocorrências de variáveis de ambiente
replace_var 'UMAMI_URL' ''
replace_var 'UMAMI_ID' ''

# Inicia o servidor nginx
echo "Iniciando o servidor nginx."
nginx -g 'daemon off;'