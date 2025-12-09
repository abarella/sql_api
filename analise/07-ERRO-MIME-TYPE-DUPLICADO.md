# ?? Erro 500.19 - MIME Type Duplicado

## Problema

Ao acessar `http://localhost:84/`, ocorre o erro:

```
Erro HTTP 500.19 - Internal Server Error
Codigo do Erro: 0x800700b7
Erro de Configuracao: Nao e possivel adicionar a entrada de colecao duplicada 
do tipo 'mimeMap' com o atributo de chave exclusivo 'fileExtension' 
definido como '.json'
```

## Causa

O arquivo `web.config` estava tentando adicionar MIME types (`.json`, `.woff`, `.woff2`) que **ja existem no IIS** em nivel global. O IIS nao permite duplicar essas entradas.

## Solucao Aplicada

A secao `<staticContent>` foi **removida** do `web.config` porque:

1. O IIS ja tem esses MIME types configurados por padrao:
   - `.json` ? `application/json`
   - `.woff` ? `application/font-woff`
   - `.woff2` ? `application/font-woff2`

2. Nao e necessario adiciona-los novamente no `web.config` do site

## Como Verificar MIME Types no IIS

### Via PowerShell:
```powershell
# Listar todos os MIME types configurados
Get-WebConfigurationProperty -Filter "system.webServer/staticContent/mimeMap" -Name "fileExtension" | Select-Object Value
```

### Via IIS Manager:
1. Abra o IIS Manager
2. Selecione o servidor (nome do computador)
3. Clique duas vezes em **"MIME Types"**
4. Procure por `.json`, `.woff`, `.woff2`

## Se Precisar Adicionar um MIME Type Novo

Se voce realmente precisar adicionar ou sobrescrever um MIME type, use `<remove>` antes de `<add>`:

```xml
<staticContent>
  <!-- Remove o MIME type existente (se houver) -->
  <remove fileExtension=".novo" />
  <!-- Adiciona o novo MIME type -->
  <mimeMap fileExtension=".novo" mimeType="application/novo-tipo" />
</staticContent>
```

**Importante:** So faca isso se realmente precisar adicionar um MIME type que nao existe no IIS.

## Verificacao

Apos remover a secao `<staticContent>`, o erro deve desaparecer:

1. Reinicie o IIS: `iisreset`
2. Acesse: `http://localhost:84/api/status`
3. Deve retornar JSON sem erros

## Status

? **Problema resolvido** - A secao `<staticContent>` foi removida do `web.config`

O arquivo `web.config` agora esta correto e nao tenta adicionar MIME types duplicados.



