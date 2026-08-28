#!/bin/bash
set -e

# 1. Iniciar SQL Server en segundo plano
echo "Iniciando SQL Server en segundo plano..."
/opt/mssql/bin/sqlservr &
PID=$!

echo "Esperando a que SQL Server esté disponible..."

# 2. Bucle de espera hasta que el puerto/servicio responda
DB_READY=0
for i in {1..60}; do
    if /opt/mssql-tools18/bin/sqlcmd \
        -S localhost \
        -U sa \
        -P "$MSSQL_SA_PASSWORD" \
        -C \
        -N o \
        -Q "SELECT 1" > /dev/null 2>&1; then
        
        echo "SQL Server está disponible."
        DB_READY=1
        break
    fi

    echo "SQL Server todavía no está disponible... intento $i/60"
    sleep 2
done

if [ $DB_READY -eq 0 ]; then
    echo "ERROR: SQL Server no respondió tras 120 segundos."
    exit 1
fi

# 3. Ejecutar el script de inicialización
echo "Ejecutando init-db.sql..."

if /opt/mssql-tools18/bin/sqlcmd \
    -S localhost \
    -U sa \
    -P "$MSSQL_SA_PASSWORD" \
    -C \
    -N o \
    -i /docker-entrypoint-initdb.d/init-db.sql; then
    
    echo "Base de datos inicializada correctamente."
else
    echo "ERROR: Falló la ejecución de init-db.sql"
    exit 1
fi

# 4. Mantener el proceso principal de SQL Server corriendo
wait $PID