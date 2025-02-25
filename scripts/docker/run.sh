#!/bin/bash

replace_var() {
    local var_name=$1
    local default_value=$2
    local var_value=${!var_name:-$default_value}

    if [[ -z "$var_name" ]]; then
        echo "Erro: A variável '$var_name' não foi encontrada ou está vazia."
        exit 1
    else
        echo "Substituindo a variável de ambiente '$var_name' pelo valor '$var_value'."
        grep -sRl "@${var_name}@" /usr/share/nginx/html/universime | xargs sed -i -e "s|@${var_name}@|${var_value}|g"
    fi
}

# Substitui todas as ocorrências de variáveis de ambiente
replace_var 'UMAMI_URL' ''
replace_var 'UMAMI_ID' ''
replace_var 'UNIVERSIME_API' $VITE_UNIVERSIME_API
replace_var 'BUILD_HASH' $VITE_BUILD_HASH

# Inicia o servidor nginx
echo "Iniciando o servidor nginx."
nginx -g 'daemon off;'