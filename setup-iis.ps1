# 🔧 Script de Configuração Automática IIS + Node.js
# Execute como Administrador

Write-Host "🚀 CONFIGURAÇÃO IIS + NODE.JS + SQL API" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""

$projectPath = "c:\PROJETOS\sql_api"
$siteName = "SqlApi"
$poolName = "NodeJSPool"

# 1. Verificar se está executando como Administrador
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ ERRO: Execute este script como Administrador!" -ForegroundColor Red
    Write-Host "Clique com botão direito no PowerShell e selecione 'Executar como Administrador'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Executando como Administrador" -ForegroundColor Green

# 2. Instalar recursos IIS necessários
Write-Host ""
Write-Host "📦 Instalando recursos do IIS..." -ForegroundColor Yellow

$features = @(
    "IIS-WebServerRole",
    "IIS-WebServer", 
    "IIS-CommonHttpFeatures",
    "IIS-HttpErrors",
    "IIS-HttpLogging",
    "IIS-RequestFiltering",
    "IIS-StaticContent",
    "IIS-DefaultDocument",
    "IIS-DirectoryBrowsing",
    "IIS-ASPNET45"
)

foreach ($feature in $features) {
    Write-Host "  Instalando $feature..." -ForegroundColor Cyan
    Enable-WindowsOptionalFeature -Online -FeatureName $feature -All -NoRestart -ErrorAction SilentlyContinue
}

Write-Host "✅ Recursos IIS instalados" -ForegroundColor Green

# 3. Verificar Node.js
Write-Host ""
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    Write-Host "Instale o Node.js de: https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

# 4. Verificar IISNode
Write-Host ""
Write-Host "🔍 Verificando IISNode..." -ForegroundColor Yellow

$iisModules = Get-IISModule -ErrorAction SilentlyContinue
$iisNodeModule = $iisModules | Where-Object {$_.Name -like "*iisnode*"}

if (-not $iisNodeModule) {
    Write-Host "⚠️ IISNode não encontrado!" -ForegroundColor Yellow
    Write-Host "📥 Instruções para instalar IISNode:" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://github.com/Azure/iisnode/releases" -ForegroundColor White
    Write-Host "2. Baixe: iisnode-full-v0.2.26-x64.msi (ou versão mais recente)" -ForegroundColor White
    Write-Host "3. Execute o instalador como Administrador" -ForegroundColor White
    Write-Host "4. Execute este script novamente após a instalação" -ForegroundColor White
    Write-Host ""
    Write-Host "Pressione qualquer tecla para continuar mesmo sem IISNode..." -ForegroundColor Yellow
    pause
} else {
    Write-Host "✅ IISNode encontrado: $($iisNodeModule.Name)" -ForegroundColor Green
}

# 5. Importar módulo WebAdministration
Write-Host ""
Write-Host "📂 Importando módulo WebAdministration..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction SilentlyContinue
Write-Host "✅ Módulo importado" -ForegroundColor Green

# 6. Criar Application Pool
Write-Host ""
Write-Host "🏊 Configurando Application Pool..." -ForegroundColor Yellow

# Remover pool existente se houver
if (Get-IISAppPool -Name $poolName -ErrorAction SilentlyContinue) {
    Write-Host "  Removendo Application Pool existente..." -ForegroundColor Cyan
    Remove-WebAppPool -Name $poolName -ErrorAction SilentlyContinue
}

# Criar novo pool
Write-Host "  Criando Application Pool: $poolName" -ForegroundColor Cyan
New-WebAppPool -Name $poolName -Force

# Configurar pool
Write-Host "  Configurando Application Pool..." -ForegroundColor Cyan
Set-ItemProperty -Path "IIS:\AppPools\$poolName" -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty -Path "IIS:\AppPools\$poolName" -Name "enable32BitAppOnWin64" -Value $false
Set-ItemProperty -Path "IIS:\AppPools\$poolName" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Set-ItemProperty -Path "IIS:\AppPools\$poolName" -Name "processModel.loadUserProfile" -Value $true
Set-ItemProperty -Path "IIS:\AppPools\$poolName" -Name "processModel.logonType" -Value "LogonService"

Write-Host "✅ Application Pool configurado" -ForegroundColor Green

# 7. Configurar permissões no diretório
Write-Host ""
Write-Host "🔐 Configurando permissões no diretório..." -ForegroundColor Yellow

if (Test-Path $projectPath) {
    Write-Host "  Definindo permissões para IIS_IUSRS..." -ForegroundColor Cyan
    $acl = Get-Acl $projectPath
    $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule("IIS_IUSRS","FullControl","ContainerInherit,ObjectInherit","None","Allow")
    $acl.SetAccessRule($accessRule)
    Set-Acl $projectPath $acl
    
    Write-Host "  Definindo permissões para Application Pool..." -ForegroundColor Cyan
    $poolSid = (New-Object System.Security.Principal.SecurityIdentifier("S-1-5-82")).Translate([System.Security.Principal.NTAccount])
    $accessRule2 = New-Object System.Security.AccessControl.FileSystemAccessRule("IIS AppPool\$poolName","FullControl","ContainerInherit,ObjectInherit","None","Allow")
    $acl.SetAccessRule($accessRule2)
    Set-Acl $projectPath $acl
    
    Write-Host "✅ Permissões configuradas" -ForegroundColor Green
} else {
    Write-Host "❌ Diretório do projeto não encontrado: $projectPath" -ForegroundColor Red
}

# 8. Criar/Configurar Site
Write-Host ""
Write-Host "🌐 Configurando Site IIS..." -ForegroundColor Yellow

# Remover site existente se houver
if (Get-WebSite -Name $siteName -ErrorAction SilentlyContinue) {
    Write-Host "  Removendo site existente..." -ForegroundColor Cyan
    Remove-WebSite -Name $siteName -ErrorAction SilentlyContinue
}

# Parar site padrão
Write-Host "  Parando site padrão..." -ForegroundColor Cyan
Stop-WebSite -Name "Default Web Site" -ErrorAction SilentlyContinue

# Criar novo site
Write-Host "  Criando site: $siteName" -ForegroundColor Cyan
New-WebSite -Name $siteName -Port 80 -PhysicalPath $projectPath -ApplicationPool $poolName -Force

Write-Host "✅ Site configurado" -ForegroundColor Green

# 9. Testar configuração
Write-Host ""
Write-Host "🧪 Testando configuração..." -ForegroundColor Yellow

# Verificar se os arquivos necessários existem
$requiredFiles = @("index.js", "package.json", "web.config")
foreach ($file in $requiredFiles) {
    $filePath = Join-Path $projectPath $file
    if (Test-Path $filePath) {
        Write-Host "  ✅ $file encontrado" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NÃO encontrado" -ForegroundColor Red
    }
}

# Verificar node_modules
$nodeModulesPath = Join-Path $projectPath "node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "  ✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ node_modules NÃO encontrado" -ForegroundColor Yellow
    Write-Host "    Execute: cd $projectPath && npm install" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host "1. Instale o IISNode se não estiver instalado" -ForegroundColor White
Write-Host "2. Execute: cd $projectPath && npm install" -ForegroundColor White
Write-Host "3. Reinicie o IIS: iisreset" -ForegroundColor White
Write-Host "4. Configure o SQL Server para aceitar a conta IIS_IUSRS" -ForegroundColor White
Write-Host "5. Teste: http://localhost" -ForegroundColor White
Write-Host ""
Write-Host "📊 COMANDOS ÚTEIS:" -ForegroundColor Yellow
Write-Host "- Testar conectividade: node iis-test.js" -ForegroundColor White
Write-Host "- Ver logs IIS: Get-Content C:\inetpub\logs\LogFiles\W3SVC1\*.log | Select-Object -Last 10" -ForegroundColor White
Write-Host "- Reiniciar site: Restart-WebSite -Name '$siteName'" -ForegroundColor White
Write-Host ""

pause