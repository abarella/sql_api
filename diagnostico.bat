@echo off
echo ================================================
echo DIAGNOSTICO SQL API - IIS
echo ================================================
echo Data/Hora: %date% %time%
echo.

echo 1. Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    goto :error
)
echo.

echo 2. Verificando pacotes npm...
cd /d "c:\PROJETOS\sql_api"
npm list --depth=0
echo.

echo 3. Testando conectividade SQL Server...
node test-connection.js
if errorlevel 1 (
    echo ERRO: Falha na conectividade com SQL Server!
)
echo.

echo 4. Verificando servicos...
echo SQL Server:
sc query "MSSQLSERVER" | findstr "STATE"
echo.
echo IIS:
sc query "W3SVC" | findstr "STATE"
echo.

echo 5. Verificando portas...
netstat -an | findstr ":1433"
netstat -an | findstr ":3000"
echo.

echo 6. Verificando logs do IIS (ultimas 10 linhas)...
if exist "iisnode\*.log" (
    for /f %%i in ('dir /b /od iisnode\*.log') do set newest=%%i
    if defined newest (
        echo Log mais recente: iisnode\%newest%
        tail -10 "iisnode\%newest%"
    )
) else (
    echo Nenhum log encontrado em iisnode\
)
echo.

echo 7. Verificando process do Node.js...
tasklist /fi "imagename eq node.exe" /fo table
echo.

echo ================================================
echo DIAGNOSTICO CONCLUIDO
echo ================================================
pause
goto :end

:error
echo.
echo ERRO CRITICO ENCONTRADO!
pause

:end