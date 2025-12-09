# ?? PROBLEMA PRINCIPAL IDENTIFICADO

## O que está faltando:

A aplicação Node.js **NÃO está funcionando no IIS** porque falta o arquivo **`web.config`** na raiz do projeto.

## Por que o web.config é essencial?

O IIS precisa do arquivo `web.config` para:
1. **Configurar o iisnode** - módulo que permite o IIS executar aplicações Node.js
2. **Roteamento de requisições** - direcionar todas as requisições para `index.js`
3. **Servir arquivos estáticos** - permitir acesso a CSS, JS, imagens da pasta `public`
4. **Configurações de segurança** - proteger arquivos sensíveis

## Status Atual:

? **Funciona localmente** com `npm start` (porta 3000)
? **NÃO funciona no IIS** (porta 84) - falta `web.config`

## Solução:

O arquivo `web.config` foi criado na raiz do projeto. Agora siga os passos em:
- `02-INSTALACAO-IISNODE.md` - Verificar se iisnode está instalado
- `03-CONFIGURACAO-IIS.md` - Configurar o site no IIS
- `04-TESTE-APLICACAO.md` - Testar se está funcionando



