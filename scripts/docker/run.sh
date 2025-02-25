#!/bin/bash

replace_var() {
    local var_name=$1
    local value_var=$2
    local default_value_var=$3

    local var_value=${!var_name:-$value_var}
    if [ -z "$var_value" ]; then
        var_value=$default_value_var
    fi

    echo "Substituindo a variável de ambiente '$var_name' pelo valor '$var_value'."
    grep -sRl "@${var_name}@" /usr/share/nginx/html/universime | xargs sed -i -e "s|@${var_name}@|${var_value}|g"
}

# Substitui todas as ocorrências de variáveis de ambiente
replace_var 'UMAMI_URL' '' ''
replace_var 'UMAMI_ID' '' ''
replace_var 'UNIVERSIME_API' $VITE_UNIVERSIME_API 'http://localhost:8080/api'
replace_var 'BUILD_HASH' $VITE_BUILD_HASH 'development'

# Inicia o servidor nginx
echo "Iniciando o servidor nginx."
nginx -g 'daemon off;'