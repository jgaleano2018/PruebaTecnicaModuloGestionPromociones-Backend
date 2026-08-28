#!/bin/bash
echo "Esperando que SQL Server inicie..."
/opt/mssql-tools18/bin/sqlcmd -S sqlserver -U sa -P "$DB_PASSWORD" -C -i /scripts/init-db.sql
echo "Inicialización de base de datos completada."
