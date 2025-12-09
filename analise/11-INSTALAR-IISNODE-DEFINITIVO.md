# ?? Instalar iisnode DEFINITIVO - Solucao Completa

## Problema

O erro na linha 7 do `web.config` persiste porque o **modulo iisnode nao esta instalado ou registrado** no IIS.

## Solucao Definitiva

### Passo 1: Executar Script de Verificacao

Execute o script PowerShell como **Administrador**:

```powershell
cd C:\PROJETOS\sql_api\analise
.\verificar-e-instalar-iisnode.ps1
```

O script vai:
- Verificar se o modulo esta registrado
- Verificar se o arquivo existe
- Tentar registrar automaticamente (se o arquivo existir)
- Oferecer para instalar (se o instalador existir)

### Passo 2: Instalacao Manual (se o script nao funcionar)

#### Opcao A: Usar o Instalador do Projeto

1. Localize o instalador:
   ```
   C:\PROJETOS\sql_api\Instalacao\iisnode-full-v0.2.26-x64.msi
   ```

2. Clique com botao direito ? **"Executar como administrador"**

3. Siga o assistente de instalacao

4. Reinicie o IIS:
   ```powershell
   iisreset
   ```

#### Opcao B: Download Oficial

1. Acesse: https://github.com/Azure/iisnode/releases
2. Baixe: `iisnode-full-v0.2.26-x64.msi` (ou versao mais recente)
3. Execute como Administrador
4. Reinicie o IIS: `iisreset`

### Passo 3: Verificar Instalacao

Execute no PowerShell (como Administrador):

```powershell
# Verificar modulo registrado
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}

# Deve retornar algo como:
# Name    Image
# ----    -----
# iisnode C:\Program Files\iisnode\iisnode.dll
```

Se retornar algo, esta instalado!

### Passo 4: Registrar Modulo (se arquivo existe mas nao esta registrado)

Se o arquivo existe mas o modulo nao esta registrado:

```powershell
# Registrar manualmente
Import-Module WebAdministration
New-WebGlobalModule -Name "iisnode" -Image "C:\Program Files\iisnode\iisnode.dll"
iisreset
```

### Passo 5: Ativar Handler no web.config

Apos instalar e registrar o iisnode:

1. Edite o `web.config`
2. **Descomente** a linha 7 (remova `<!--` e `-->`):

**ANTES:**
```xml
<handlers>
  <!-- <add name="iisnode" path="index.js" verb="*" modules="iisnode"/> -->
</handlers>
```

**DEPOIS:**
```xml
<handlers>
  <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
</handlers>
```

### Passo 6: Reiniciar IIS e Testar

```powershell
iisreset
```

Teste:
- Acesse: `http://localhost:84/api/status`
- Deve funcionar sem erros!

## Checklist Completo

- [ ] iisnode instalado (`Instalacao\iisnode-full-v0.2.26-x64.msi`)
- [ ] Modulo registrado (`Get-WebGlobalModule`)
- [ ] IIS reiniciado (`iisreset`)
- [ ] Handler descomentado no `web.config` (linha 7)
- [ ] Teste funcionando (`http://localhost:84/api/status`)

## Verificacao Rapida

Execute este comando para verificar tudo de uma vez:

```powershell
# Verificar modulo
$module = Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}
if ($module) {
    Write-Host "[OK] Modulo registrado: $($module.Image)" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Modulo nao registrado" -ForegroundColor Red
}

# Verificar arquivo
$file = Test-Path "C:\Program Files\iisnode\iisnode.dll"
if ($file) {
    Write-Host "[OK] Arquivo existe" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Arquivo nao existe" -ForegroundColor Red
}
```

## Se Nada Funcionar

1. **Desinstale o iisnode** (se estiver instalado):
   - Programs and Features ? iisnode ? Uninstall

2. **Reinstale do zero**:
   - Execute o instalador novamente
   - Reinicie o computador (se necessario)

3. **Verifique permissoes**:
   - Certifique-se de executar tudo como Administrador
   - Verifique se o IIS tem permissoes adequadas

4. **Verifique versao do Windows/IIS**:
   - iisnode requer IIS 7.0 ou superior
   - Windows Server 2008 R2 ou superior

## Nota Importante

O handler do iisnode **DEVE estar descomentado** no `web.config` para a aplicacao funcionar. Se estiver comentado, a aplicacao nao vai processar requisoes Node.js.

Apos instalar o iisnode, **sempre descomente a linha 7** do `web.config`!



