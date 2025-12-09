# ?? Erro: iisnode was unable to read the configuration file

## Problema

Erro ao iniciar a aplicacao:
```
iisnode was unable to read the configuration file. Make sure the web.config file 
syntax is correct. In particular, verify the iisnode configuration section matches 
the expected schema. The schema of the iisnode section that your version of iisnode 
requires is stored in the %systemroot%\system32\inetsrv\config\schema\iisnode_schema.xml file.
```

## Causa

A secao `<iisnode>` no `web.config` contem atributos que **nao sao suportados** pela versao do iisnode instalada. Versoes diferentes do iisnode suportam atributos diferentes.

## Solucao Aplicada

Foi criada uma versao **minima e compativel** do `web.config` com apenas os atributos essenciais:

```xml
<iisnode
  node_env="production"
  loggingEnabled="true"
  logDirectory="iisnode"
  devErrorsEnabled="true"
  nodeProcessCommandLine="C:\Program Files\nodejs\node.exe"
/>
```

As configuracoes detalhadas ficam no arquivo `iisnode.yml`, que e mais flexivel.

## Verificar Schema do iisnode

Para ver quais atributos sao suportados pela sua versao:

1. Abra o arquivo de schema:
   ```
   C:\Windows\System32\inetsrv\config\schema\iisnode_schema.xml
   ```

2. Procure pela secao `<attribute>` para ver os atributos validos

3. Compare com os atributos usados no `web.config`

## Configuracao via iisnode.yml

O arquivo `iisnode.yml` e mais flexivel e permite configuracoes adicionais:

```yaml
loggingEnabled: true
devErrorsEnabled: true
logDirectory: iisnode
node_env: production
nodeProcessCommandLine: "C:\Program Files\nodejs\node.exe"
```

Este arquivo e lido automaticamente pelo iisnode se o atributo `configOverrides` estiver presente, mas na versao minima removemos isso para evitar problemas.

## Versao Minima vs Completa

### Versao Minima (Atual - Recomendada)
- Apenas atributos essenciais
- Compativel com todas as versoes do iisnode
- Configuracoes adicionais via `iisnode.yml`

### Versao Completa (Anterior)
- Muitos atributos avancados
- Pode nao ser compativel com versoes antigas do iisnode
- Mais controle direto no web.config

## Teste

Apos aplicar a versao minima:

1. Reinicie o IIS:
   ```powershell
   iisreset
   ```

2. Teste a aplicacao:
   - Acesse: `http://localhost:84/api/status`
   - Deve funcionar sem erros de schema

## Se o Erro Persistir

1. Verifique a versao do iisnode instalada:
   ```powershell
   Get-Item "C:\Program Files\iisnode\iisnode.dll" | Select-Object VersionInfo
   ```

2. Consulte o schema:
   ```
   C:\Windows\System32\inetsrv\config\schema\iisnode_schema.xml
   ```

3. Remova ainda mais atributos se necessario, deixando apenas:
   ```xml
   <iisnode />
   ```

4. Use apenas o `iisnode.yml` para configuracoes

## Nota Importante

A versao minima do `web.config` e mais segura e compativel. As configuracoes avancadas podem ser adicionadas gradualmente se necessario, testando a cada adicao.



