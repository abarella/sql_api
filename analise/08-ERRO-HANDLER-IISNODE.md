# ?? Erro no Handler do iisnode (Linha 7)

## Problema

Erro na linha 7 do `web.config`:
```xml
<add name="iisnode" path="index.js" verb="*" modules="iisnode"/>
```

**Mensagem de erro tipica:**
- "O modulo especificado na lista de modulos nao esta disponivel"
- "The specified module cannot be found"
- Erro 500.19 relacionado ao handler

## Causa

O modulo **iisnode** nao esta instalado ou nao esta registrado corretamente no IIS.

## Solucao 1: Verificar se iisnode esta instalado

### Via PowerShell (como Administrador):
```powershell
# Verificar se o modulo esta registrado
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}

# Se nao retornar nada, o modulo nao esta instalado
```

### Verificar arquivo fisico:
```powershell
# Verificar se o arquivo existe
Test-Path "C:\Program Files\iisnode\iisnode.dll"
```

### Se nao estiver instalado:
1. Execute o instalador: `Instalacao\iisnode-full-v0.2.26-x64.msi`
2. Execute como **Administrador**
3. Apos instalar, reinicie o IIS:
   ```powershell
   iisreset
   ```

## Solucao 2: Registrar o modulo manualmente

Se o arquivo existe mas o modulo nao esta registrado:

```powershell
# Registrar o modulo (como Administrador)
Import-Module WebAdministration
New-WebGlobalModule -Name "iisnode" -Image "C:\Program Files\iisnode\iisnode.dll"

# Reiniciar IIS
iisreset
```

## Solucao 3: Versao alternativa do web.config

Se o iisnode nao estiver instalado ainda, use uma versao do `web.config` que nao depende do handler:

**Opcao A: Comentar o handler temporariamente**
```xml
<handlers>
  <!-- Comentar ate instalar o iisnode -->
  <!-- <add name="iisnode" path="index.js" verb="*" modules="iisnode"/> -->
</handlers>
```

**Opcao B: Remover a secao handlers completamente**
O iisnode pode funcionar apenas com as regras de rewrite, sem o handler explicito.

## Verificacao apos instalar

1. Verifique se o modulo esta registrado:
   ```powershell
   Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}
   ```

2. Reinicie o IIS:
   ```powershell
   iisreset
   ```

3. Teste a aplicacao:
   - Acesse: `http://localhost:84/api/status`

## Checklist

- [ ] iisnode instalado? (`Instalacao\iisnode-full-v0.2.26-x64.msi`)
- [ ] Modulo registrado? (`Get-WebGlobalModule`)
- [ ] IIS reiniciado? (`iisreset`)
- [ ] URL Rewrite instalado? (necessario para as regras funcionarem)

## Nota Importante

O **URL Rewrite Module** tambem e necessario para as regras de rewrite funcionarem. Se nao estiver instalado:

1. Baixe: https://www.iis.net/downloads/microsoft/url-rewrite
2. Instale o **IIS URL Rewrite Module 2.1**
3. Reinicie o IIS

## Proximo Passo

Apos instalar o iisnode e registrar o modulo, o erro na linha 7 deve desaparecer.



