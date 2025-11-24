@echo off
echo ========================================
echo CONFIGURACAO IIS + NODE.JS + SQL API
echo Versao .BAT (nao requer politica PowerShell)
echo ========================================
echo.

echo Verificando se esta executando como Administrador...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Executando como Administrador
) else (
    echo [ERRO] Este script deve ser executado como Administrador!
    echo.
    echo Para executar como Administrador:
    echo 1. Abra o Prompt de Comando como Administrador
    echo 2. Navegue ate: cd c:\PROJETOS\sql_api
    echo 3. Execute: setup-iis.bat
    echo.
    pause
    exit /b 1
)

echo.
echo Instalando recursos do IIS...
echo Isso pode levar alguns minutos...

dism /online /enable-feature /featurename:IIS-WebServerRole /all /norestart
dism /online /enable-feature /featurename:IIS-WebServer /all /norestart
dism /online /enable-feature /featurename:IIS-CommonHttpFeatures /all /norestart
dism /online /enable-feature /featurename:IIS-HttpErrors /all /norestart
dism /online /enable-feature /featurename:IIS-HttpLogging /all /norestart
dism /online /enable-feature /featurename:IIS-RequestFiltering /all /norestart
dism /online /enable-feature /featurename:IIS-StaticContent /all /norestart
dism /online /enable-feature /featurename:IIS-DefaultDocument /all /norestart
dism /online /enable-feature /featurename:IIS-DirectoryBrowsing /all /norestart

echo.
echo [OK] Recursos IIS instalados

echo.
echo Verificando Node.js...
node --version >nul 2>&1
if %errorLevel% == 0 (
    for /f %%i in ('node --version') do set NODEVERSION=%%i
    echo [OK] Node.js encontrado: %NODEVERSION%
) else (
    echo [ERRO] Node.js nao encontrado!
    echo Instale o Node.js de: https://nodejs.org/
    pause
    exit /b 1
)

echo.
echo Configurando permissoes no diretorio...
icacls "c:\PROJETOS\sql_api" /grant "IIS_IUSRS:(F)" /t
icacls "c:\PROJETOS\sql_api" /grant "IIS AppPool\DefaultAppPool:(F)" /t

echo.
echo Verificando arquivos necessarios...
set PROJECT_DIR=c:\PROJETOS\sql_api

if exist "%PROJECT_DIR%\index.js" (
    echo [OK] index.js encontrado
) else (
    echo [ERRO] index.js NAO encontrado
)

if exist "%PROJECT_DIR%\package.json" (
    echo [OK] package.json encontrado
) else (
    echo [ERRO] package.json NAO encontrado
)

if exist "%PROJECT_DIR%\web.config" (
    echo [OK] web.config encontrado
) else (
    echo [ERRO] web.config NAO encontrado
)

if exist "%PROJECT_DIR%\node_modules" (
    echo [OK] node_modules encontrado
) else (
    echo [AVISO] node_modules NAO encontrado
    echo Execute: cd %PROJECT_DIR% ^&^& npm install
)

echo.
echo ========================================
echo CONFIGURACAO BASICA CONCLUIDA!
echo ========================================
echo.
echo PROXIMOS PASSOS MANUAIS:
echo.
echo 1. INSTALAR IISNODE (OBRIGATORIO):
echo    - Baixe de: https://github.com/Azure/iisnode/releases
echo    - Instale: iisnode-full-v0.2.26-x64.msi
echo    - Execute como Administrador
echo.
echo 2. CONFIGURAR IIS (Apos instalar IISNode):
echo    - Abra o Gerenciador do IIS
echo    - Crie um novo site apontando para: c:\PROJETOS\sql_api
echo    - Configure Application Pool sem .NET Framework
echo    - Defina permissoes para IIS_IUSRS
echo.
echo 3. TESTAR:
echo    - Execute: node iis-test.js
echo    - Acesse: http://localhost
echo.
echo 4. INSTALAR DEPENDENCIAS (se necessario):
echo    - cd c:\PROJETOS\sql_api
echo    - npm install
echo.
echo COMANDOS UTEIS:
echo - Testar conectividade: node iis-test.js
echo - Reiniciar IIS: iisreset
echo.

pause