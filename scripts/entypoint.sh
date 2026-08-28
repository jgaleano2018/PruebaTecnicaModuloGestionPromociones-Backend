#!/bin/bash

echo "Esperando a que SQL Server esté disponible..."

for i in {1..60}; do
    /opt/mssql-tools18/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -C \
        -N o \
        -Q "SELECT 1" > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "SQL Server está disponible."
        break
    fi

    echo "SQL Server todavía no está disponible... intento $i/60"
    sleep 2
done

echo "Ejecutando init-db.sql..."

if /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "$MSSQL_SA_PASSWORD" \
    -C \
    -N o \
    -i /docker-entrypoint-initdb.d/init-db.sql
then
    echo "Base de datos inicializada correctamente."
else
    echo "ERROR: Falló la ejecución de init-db.sql"
    exit 1
fi

echo "Iniciando SQL Server..."

exec /opt/mssql/bin/sqlservr