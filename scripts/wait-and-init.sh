#!/bin/bash

set -e

echo "========================================"
echo "Esperando disponibilidad de SQL Server..."
echo "========================================"

for i in {1..30}; do
    echo "Intento $i/30..."

    if /opt/mssql-tools18/bin/sqlcmd \
        -S sqlserver \
        -U sa \
        -P "$DB_PASSWORD" \
        -C \
        -N o \
        -Q "SELECT 1" > /dev/null 2>&1
    then
        echo "SQL Server disponible."
        break
    fi

    if [ "$i" -eq 30 ]; then
        echo "ERROR: SQL Server no estuvo disponible después de 60 segundos."
        exit 1
    fi

    sleep 2
done

echo "========================================"
echo "Ejecutando init-db.sql..."
echo "========================================"

/opt/mssql-tools18/bin/sqlcmd \
    -S sqlserver \
    -U sa \
    -P "$DB_PASSWORD" \
    -C \
    -N o \
    -i /scripts/init-db.sql

echo "========================================"
echo "Base de datos inicializada correctamente."
echo "========================================"