# ? Instalar iisnode AGORA - Passo a Passo

## Situacao Atual

O erro na linha 7 do `web.config` indica que o **iisnode nao esta instalado**.

## Solucao Rapida

### Passo 1: Instalar o iisnode

1. Localize o instalador na pasta do projeto:
   ```
   C:\PROJETOS\sql_api\Instalacao\iisnode-full-v0.2.26-x64.msi
   ```

2. Clique com botao direito no arquivo
3. Selecione **"Executar como administrador"**
4. Siga o assistente de instalacao
5. Aceite os termos e conclua a instalacao

### Passo 2: Verificar se foi instalado

Abra o PowerShell como **Administrador** e execute:

```powershell
# Verificar se o modulo esta registrado
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}

# Se retornar algo como:
# Name    Image
# ----    -----
# iisnode C:\Program Files\iisnode\iisnode.dll
# 
# Entao esta instalado corretamente!
```

### Passo 3: Reiniciar o IIS

```powershell
iisreset
```

### Passo 4: Ativar o handler no web.config

Apos instalar o iisnode, edite o `web.config` e **descomente** a linha do handler:

**ANTES (handler comentado):**
```xml
<handlers>
  <!-- <add name="iisnode" path="index.js" verb="*" modules="iisnode"/> -->
</handlers>
```

**DEPOIS (handler ativo):**
```xml
<handlers>
  <add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
</handlers>
```

Ou simplesmente copie o conteudo de `web.config.backup` para `web.config`.

### Passo 5: Testar

1. Acesse: `http://localhost:84/api/status`
2. Deve retornar JSON sem erros

## Se o Instalador Nao Funcionar

### Opcao 1: Download oficial
1. Acesse: https://github.com/Azure/iisnode/releases
2. Baixe: `iisnode-full-v0.2.26-x64.msi` (ou versao mais recente)
3. Execute como Administrador

### Opcao 2: Registrar manualmente

Se o arquivo existe mas nao esta registrado:

```powershell
# Verificar se o arquivo existe
Test-Path "C:\Program Files\iisnode\iisnode.dll"

# Se existir, registrar manualmente
Import-Module WebAdministration
New-WebGlobalModule -Name "iisnode" -Image "C:\Program Files\iisnode\iisnode.dll"
iisreset
```

## Verificacao Final

Execute estes comandos para confirmar:

```powershell
# 1. Verificar modulo
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}

# 2. Verificar arquivo fisico
Test-Path "C:\Program Files\iisnode\iisnode.dll"

# 3. Reiniciar IIS
iisreset

# 4. Testar API
Invoke-WebRequest -Uri "http://localhost:84/api/status" -UseBasicParsing
```

## Importante: URL Rewrite Module

O **URL Rewrite Module** tambem e necessario. Se nao estiver instalado:

1. Baixe: https://www.iis.net/downloads/microsoft/url-rewrite
2. Instale: **IIS URL Rewrite Module 2.1**
3. Reinicie o IIS: `iisreset`

## Checklist

- [ ] iisnode instalado (`Instalacao\iisnode-full-v0.2.26-x64.msi`)
- [ ] Modulo registrado (`Get-WebGlobalModule`)
- [ ] IIS reiniciado (`iisreset`)
- [ ] Handler descomentado no `web.config`
- [ ] URL Rewrite Module instalado (se necessario)
- [ ] Teste funcionando (`http://localhost:84/api/status`)

## Apos Instalar

1. O erro na linha 7 deve desaparecer
2. A aplicacao deve funcionar em `http://localhost:84/`
3. Todas as rotas devem responder corretamente



