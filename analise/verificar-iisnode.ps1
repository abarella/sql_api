# Script para verificar se o iisnode esta instalado
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificacao do iisnode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se esta executando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "ERRO: Execute este script como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botao direito e selecione 'Executar como administrador'" -ForegroundColor Yellow
    pause
    exit
}

# 1. Verificar modulo registrado
Write-Host "1. Verificando modulo registrado no IIS..." -ForegroundColor Yellow
$module = Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}
if ($module) {
    Write-Host "   [OK] Modulo iisnode esta registrado" -ForegroundColor Green
    Write-Host "   Nome: $($module.Name)" -ForegroundColor Gray
    Write-Host "   Caminho: $($module.Image)" -ForegroundColor Gray
} else {
    Write-Host "   [ERRO] Modulo iisnode NAO esta registrado" -ForegroundColor Red
    Write-Host "   Solucao: Instale o iisnode (Instalacao\iisnode-full-v0.2.26-x64.msi)" -ForegroundColor Yellow
}
Write-Host ""

# 2. Verificar arquivo fisico
Write-Host "2. Verificando arquivo fisico..." -ForegroundColor Yellow
$dllPath = "C:\Program Files\iisnode\iisnode.dll"
if (Test-Path $dllPath) {
    Write-Host "   [OK] Arquivo existe: $dllPath" -ForegroundColor Green
    $fileInfo = Get-Item $dllPath
    Write-Host "   Tamanho: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
    Write-Host "   Data: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
} else {
    Write-Host "   [ERRO] Arquivo NAO existe: $dllPath" -ForegroundColor Red
    Write-Host "   Solucao: Instale o iisnode (Instalacao\iisnode-full-v0.2.26-x64.msi)" -ForegroundColor Yellow
}
Write-Host ""

# 3. Verificar Node.js
Write-Host "3. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   [OK] Node.js instalado: $nodeVersion" -ForegroundColor Green
    $nodePath = (Get-Command node).Source
    Write-Host "   Caminho: $nodePath" -ForegroundColor Gray
} catch {
    Write-Host "   [ERRO] Node.js NAO encontrado" -ForegroundColor Red
    Write-Host "   Solucao: Instale o Node.js de https://nodejs.org" -ForegroundColor Yellow
}
Write-Host ""

# 4. Verificar URL Rewrite Module
Write-Host "4. Verificando URL Rewrite Module..." -ForegroundColor Yellow
$rewriteModule = Get-WebGlobalModule | Where-Object {$_.Name -eq "RewriteModule"}
if ($rewriteModule) {
    Write-Host "   [OK] URL Rewrite Module esta instalado" -ForegroundColor Green
} else {
    Write-Host "   [AVISO] URL Rewrite Module pode nao estar instalado" -ForegroundColor Yellow
    Write-Host "   Solucao: Baixe de https://www.iis.net/downloads/microsoft/url-rewrite" -ForegroundColor Yellow
}
Write-Host ""

# 5. Resumo
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resumo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$allOk = $true
if (-not $module) { $allOk = $false }
if (-not (Test-Path $dllPath)) { $allOk = $false }

if ($allOk) {
    Write-Host "[SUCESSO] iisnode esta instalado e configurado corretamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. Descomente o handler no web.config" -ForegroundColor White
    Write-Host "2. Reinicie o IIS: iisreset" -ForegroundColor White
    Write-Host "3. Teste: http://localhost:84/api/status" -ForegroundColor White
} else {
    Write-Host "[ATENCAO] iisnode precisa ser instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. Execute: Instalacao\iisnode-full-v0.2.26-x64.msi" -ForegroundColor White
    Write-Host "2. Execute como Administrador" -ForegroundColor White
    Write-Host "3. Apos instalar, execute: iisreset" -ForegroundColor White
    Write-Host "4. Execute este script novamente para verificar" -ForegroundColor White
}

Write-Host ""
pause



