# ?? Verificação e Instalação do iisnode

## O que é iisnode?

O **iisnode** é um módulo nativo do IIS que permite executar aplicações Node.js diretamente no IIS, sem precisar de um servidor Node.js separado.

## ? Verificar se está instalado:

### Método 1: Via PowerShell (Recomendado)
```powershell
# Execute no PowerShell como Administrador
Get-WindowsFeature | Where-Object {$_.Name -like "*iisnode*"}
```

### Método 2: Verificar no IIS Manager
1. Abra o **IIS Manager**
2. Clique no servidor (nome do computador)
3. No painel direito, clique em **"Modules"**
4. Procure por **"iisnode"** na lista

### Método 3: Verificar arquivo físico
Verifique se existe o arquivo:
```
C:\Program Files\iisnode\iisnode.dll
```

## ?? Instalar iisnode (se não estiver instalado):

### Opção 1: Usar o instalador na pasta Instalacao
Você já tem o instalador em: `Instalacao\iisnode-full-v0.2.26-x64.msi`

1. Execute o arquivo `iisnode-full-v0.2.26-x64.msi` como **Administrador**
2. Siga o assistente de instalação
3. Reinicie o IIS após a instalação:
   ```powershell
   iisreset
   ```

### Opção 2: Download oficial
Se o instalador não funcionar, baixe a versão mais recente:
- Site oficial: https://github.com/Azure/iisnode/releases
- Baixe: `iisnode-full-v0.2.26-x64.msi` (ou versão mais recente)

## ? Verificar instalação após instalar:

```powershell
# Verificar se o módulo foi registrado
Get-WebGlobalModule | Where-Object {$_.Name -eq "iisnode"}

# Se retornar algo, está instalado corretamente
```

## ?? IMPORTANTE:

- O iisnode deve ser instalado **ANTES** de configurar o site no IIS
- Após instalar, **sempre reinicie o IIS** com `iisreset`
- Certifique-se de que o **Node.js está instalado** e no PATH:
  ```powershell
  node --version
  # Deve retornar algo como: v18.x.x ou v20.x.x
  ```

## ?? Próximo passo:

Após confirmar que o iisnode está instalado, siga para:
- `03-CONFIGURACAO-IIS.md` - Configurar o site no IIS Manager



