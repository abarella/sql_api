@echo off
echo ===========================================
echo COMANDOS RAPIDOS - CONFIGURACAO IIS
echo ===========================================
echo.

echo 1. Configurando permissoes...
icacls "c:\PROJETOS\sql_api" /grant "IIS_IUSRS:(F)" /t

echo.
echo 2. Habilitando recursos IIS basicos...
dism /online /enable-feature /featurename:IIS-WebServerRole /norestart
dism /online /enable-feature /featurename:IIS-WebServer /norestart
dism /online /enable-feature /featurename:IIS-CommonHttpFeatures /norestart

echo.
echo 3. Reiniciando IIS...
iisreset

echo.
echo ===========================================
echo CONFIGURACAO BASICA CONCLUIDA!
echo ===========================================
echo.
echo AGORA FACA MANUALMENTE:
echo.
echo 1. INSTALE IISNODE:
echo    - Baixe: https://github.com/Azure/iisnode/releases/download/v0.2.26/iisnode-full-v0.2.26-x64.msi
echo    - Execute como Administrador
echo.
echo 2. CONFIGURE NO GERENCIADOR IIS:
echo    - Abra: inetmgr
echo    - Crie Application Pool sem .NET Framework
echo    - Crie Site apontando para: c:\PROJETOS\sql_api
echo.
echo 3. TESTE:
echo    - http://localhost
echo    - node iis-test.js
echo.

pause