# Script para verificar e guiar a instalacao do iisnode
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Verificacao e Instalacao do iisnode" -ForegroundColor Cyan
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
    $moduleInstalled = $true
} else {
    Write-Host "   [ERRO] Modulo iisnode NAO esta registrado" -ForegroundColor Red
    $moduleInstalled = $false
}
Write-Host ""

# 2. Verificar arquivo fisico
Write-Host "2. Verificando arquivo fisico..." -ForegroundColor Yellow
$dllPath = "C:\Program Files\iisnode\iisnode.dll"
$installerPath = "C:\PROJETOS\sql_api\Instalacao\iisnode-full-v0.2.26-x64.msi"

if (Test-Path $dllPath) {
    Write-Host "   [OK] Arquivo existe: $dllPath" -ForegroundColor Green
    $fileInfo = Get-Item $dllPath
    Write-Host "   Tamanho: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
    Write-Host "   Data: $($fileInfo.LastWriteTime)" -ForegroundColor Gray
    $fileExists = $true
} else {
    Write-Host "   [ERRO] Arquivo NAO existe: $dllPath" -ForegroundColor Red
    $fileExists = $false
}
Write-Host ""

# 3. Verificar instalador
Write-Host "3. Verificando instalador..." -ForegroundColor Yellow
if (Test-Path $installerPath) {
    Write-Host "   [OK] Instalador encontrado: $installerPath" -ForegroundColor Green
    $installerExists = $true
} else {
    Write-Host "   [AVISO] Instalador nao encontrado: $installerPath" -ForegroundColor Yellow
    $installerExists = $false
}
Write-Host ""

# 4. Resumo e acoes
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resumo e Acoes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($moduleInstalled -and $fileExists) {
    Write-Host "[SUCESSO] iisnode esta instalado e registrado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Yellow
    Write-Host "1. Descomente a linha 7 do web.config (remova <!-- e -->)" -ForegroundColor White
    Write-Host "2. Reinicie o IIS: iisreset" -ForegroundColor White
    Write-Host "3. Teste: http://localhost:84/api/status" -ForegroundColor White
} elseif ($fileExists -and -not $moduleInstalled) {
    Write-Host "[ATENCAO] Arquivo existe mas modulo nao esta registrado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Tentando registrar o modulo..." -ForegroundColor Yellow
    
    try {
        Import-Module WebAdministration -ErrorAction Stop
        New-WebGlobalModule -Name "iisnode" -Image $dllPath -ErrorAction Stop
        Write-Host "[OK] Modulo registrado com sucesso!" -ForegroundColor Green
        Write-Host "Reinicie o IIS: iisreset" -ForegroundColor Yellow
    } catch {
        Write-Host "[ERRO] Nao foi possivel registrar o modulo automaticamente" -ForegroundColor Red
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Tente registrar manualmente:" -ForegroundColor Yellow
        Write-Host "  Import-Module WebAdministration" -ForegroundColor White
        Write-Host "  New-WebGlobalModule -Name 'iisnode' -Image '$dllPath'" -ForegroundColor White
    }
} else {
    Write-Host "[ERRO] iisnode precisa ser instalado" -ForegroundColor Red
    Write-Host ""
    
    if ($installerExists) {
        Write-Host "Instalador encontrado. Deseja instalar agora? (S/N)" -ForegroundColor Yellow
        $response = Read-Host
        
        if ($response -eq "S" -or $response -eq "s") {
            Write-Host "Iniciando instalacao..." -ForegroundColor Yellow
            Write-Host "Siga as instrucoes do instalador." -ForegroundColor Yellow
            Write-Host ""
            
            try {
                Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -Verb RunAs
                Write-Host "[OK] Instalacao concluida!" -ForegroundColor Green
                Write-Host "Reinicie o IIS: iisreset" -ForegroundColor Yellow
                Write-Host "Execute este script novamente para verificar" -ForegroundColor Yellow
            } catch {
                Write-Host "[ERRO] Erro ao executar instalador" -ForegroundColor Red
                Write-Host "Tente executar manualmente: $installerPath" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Instalacao cancelada." -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Para instalar manualmente:" -ForegroundColor Yellow
            Write-Host "1. Execute: $installerPath" -ForegroundColor White
            Write-Host "2. Execute como Administrador" -ForegroundColor White
            Write-Host "3. Siga o assistente de instalacao" -ForegroundColor White
            Write-Host "4. Reinicie o IIS: iisreset" -ForegroundColor White
        }
    } else {
        Write-Host "Instalador nao encontrado." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Para instalar:" -ForegroundColor Yellow
        Write-Host "1. Baixe: https://github.com/Azure/iisnode/releases" -ForegroundColor White
        Write-Host "2. Baixe: iisnode-full-v0.2.26-x64.msi" -ForegroundColor White
        Write-Host "3. Execute como Administrador" -ForegroundColor White
        Write-Host "4. Reinicie o IIS: iisreset" -ForegroundColor White
    }
}

Write-Host ""
pause



