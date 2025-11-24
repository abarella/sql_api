# 🎯 CONFIGURAÇÃO MANUAL DO IIS (PASSO A PASSO)

## ✅ **SUA APLICAÇÃO JÁ ESTÁ FUNCIONANDO!**
O teste `node iis-test.js` confirmou que a conectividade SQL Server está perfeita.

---

## 🚀 **CONFIGURAÇÃO IIS - PASSO A PASSO MANUAL**

### **1. 📥 INSTALAR IISNODE (OBRIGATÓRIO)**
1. Baixe: https://github.com/Azure/iisnode/releases/download/v0.2.26/iisnode-full-v0.2.26-x64.msi
2. Execute como Administrador
3. Reinicie o IIS: `iisreset` (no CMD como Admin)

### **2. 🌐 CONFIGURAR IIS**

#### **2.1. Abrir Gerenciador do IIS:**
- Windows + R → `inetmgr` → Enter

#### **2.2. Criar Application Pool:**
1. Clique em **Application Pools** no painel esquerdo
2. Clique **Add Application Pool** no painel direito
3. **Name**: `SqlApiPool`
4. **.NET CLR version**: **No Managed Code**
5. **Managed pipeline mode**: Integrated
6. Clique **OK**

#### **2.3. Configurar Application Pool:**
1. Clique em **SqlApiPool**
2. Clique **Advanced Settings** no painel direito
3. **Identity**: ApplicationPoolIdentity
4. **Load User Profile**: True
5. Clique **OK**

#### **2.4. Criar Site:**
1. Clique **Sites** no painel esquerdo
2. **Para do site padrão**: Clique em **Default Web Site** → **Stop**
3. Clique **Add Website** no painel direito:
   - **Site name**: `SqlApi`
   - **Application pool**: `SqlApiPool`
   - **Physical path**: `c:\PROJETOS\sql_api`
   - **Port**: `80`
4. Clique **OK**

### **3. 🔐 CONFIGURAR PERMISSÕES**

#### **3.1. Via Windows Explorer:**
1. Navegue para `c:\PROJETOS\sql_api`
2. Clique direito → **Properties** → **Security**
3. Clique **Edit** → **Add**
4. Digite: `IIS_IUSRS` → **Check Names** → **OK**
5. Marque **Full Control** → **OK** → **OK**

#### **3.2. Via Command Prompt (alternativo):**
```cmd
icacls "c:\PROJETOS\sql_api" /grant "IIS_IUSRS:(F)" /t
icacls "c:\PROJETOS\sql_api" /grant "IIS AppPool\SqlApiPool:(F)" /t
```

### **4. ✅ TESTAR**

1. **Reiniciar IIS:**
   ```cmd
   iisreset
   ```

2. **Testar no navegador:**
   - http://localhost
   - http://localhost/test-iis (diagnóstico)

3. **Testar endpoints da API:**
   - http://localhost/pedidos/producaohoje
   - http://localhost/pedidos/nfandamento

---

## 🔧 **COMANDOS ÚTEIS**

```cmd
# Reiniciar IIS
iisreset

# Verificar se o site está rodando
curl http://localhost

# Testar conectividade SQL
node iis-test.js

# Ver logs do IIS
Get-Content "C:\inetpub\logs\LogFiles\W3SVC*\*.log" | Select-Object -Last 10
```

---

## 🚨 **RESOLUÇÃO DE PROBLEMAS**

### **Se der erro 500.19:**
- Verifique se IISNode está instalado
- Verifique se web.config está correto

### **Se não conectar ao SQL:**
- Sua configuração já está correta!
- Execute: `node iis-test.js` para confirmar

### **Se der erro de permissão:**
- Execute os comandos icacls acima
- Verifique se o Application Pool tem permissão

---

## ✅ **RESULTADO ESPERADO**

Após seguir esses passos:
- ✅ http://localhost - Dashboard funcionando
- ✅ http://localhost/test-iis - Diagnóstico OK
- ✅ Dados atualizando a cada 5 segundos
- ✅ Todas as queries SQL funcionando

---

**🎉 Sua aplicação está pronta! O código já está correto, só falta a configuração do IIS.**