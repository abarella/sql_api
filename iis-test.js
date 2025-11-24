// iis-test.js
// Script específico para testar conectividade no ambiente IIS
const fs = require('fs');
const path = require('path');

// Função para escrever log
function writeLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    
    // Escrever no arquivo de log para o IIS
    try {
        fs.appendFileSync('iis-debug.log', logMessage);
    } catch (e) {
        // Ignorar erros de escrita de log
    }
}

async function testIISEnvironment() {
    writeLog('🚀 TESTE DE AMBIENTE IIS - INICIADO');
    writeLog('=====================================');
    
    // Teste 1: Informações do ambiente
    writeLog('📊 Informações do Ambiente:');
    writeLog(`   Node.js: ${process.version}`);
    writeLog(`   Plataforma: ${process.platform} ${process.arch}`);
    writeLog(`   PID: ${process.pid}`);
    writeLog(`   Usuário: ${process.env.USERNAME || process.env.USER || 'N/A'}`);
    writeLog(`   Diretório de trabalho: ${process.cwd()}`);
    writeLog(`   IIS_IUSRS: ${process.env.IIS_IUSRS || 'N/A'}`);
    writeLog(`   COMPUTERNAME: ${process.env.COMPUTERNAME || 'N/A'}`);
    writeLog('');

    // Teste 2: Verificar módulos
    writeLog('📦 Verificando módulos:');
    try {
        const mssql = require('mssql');
        writeLog('   ✅ mssql - OK');
    } catch (e) {
        writeLog(`   ❌ mssql - ERRO: ${e.message}`);
        return;
    }
    writeLog('');

    // Teste 3: Teste de conectividade SQL
    writeLog('🔌 Teste de Conectividade SQL Server:');
    
    const DatabaseFacade = require('./db');
    const db = new DatabaseFacade();
    
    try {
        // Log da configuração (sem senha)
        writeLog('📋 Configuração do banco:');
        writeLog(`   Server: ${db.config.server}`);
        writeLog(`   Database: ${db.config.database}`);
        writeLog(`   User: ${db.config.user}`);
        writeLog(`   Port: ${db.config.port}`);
        writeLog(`   TrustedConnection: ${db.config.options.trustedConnection}`);
        writeLog(`   Encrypt: ${db.config.options.encrypt}`);
        writeLog('');

        // Teste de conexão
        writeLog('🔄 Tentando conectar...');
        await db.connect();
        writeLog('✅ Conexão estabelecida com sucesso!');
        
        // Teste de query simples
        writeLog('🔍 Executando query de teste...');
        const result = await db.executeQuery('SELECT GETDATE() as agora, SYSTEM_USER as usuario_sistema', [], [], false);
        writeLog(`✅ Query executada com sucesso!`);
        writeLog(`   Data/Hora: ${result.recordset[0].agora}`);
        writeLog(`   Usuário Sistema: ${result.recordset[0].usuario_sistema}`);
        
        writeLog('');
        writeLog('🎉 TODOS OS TESTES PASSARAM!');
        
    } catch (error) {
        writeLog('❌ ERRO DETECTADO:');
        writeLog(`   Mensagem: ${error.message}`);
        writeLog(`   Código: ${error.code || 'N/A'}`);
        writeLog(`   Stack: ${error.stack}`);
        
        // Diagnósticos específicos
        writeLog('');
        writeLog('🔧 POSSÍVEIS SOLUÇÕES:');
        
        if (error.code === 'ENOTFOUND') {
            writeLog('   🎯 Servidor não encontrado:');
            writeLog('      1. Verificar se o nome do servidor está correto');
            writeLog('      2. Verificar se o SQL Server está rodando');
            writeLog('      3. Testar: ping UIRAPURU');
        }
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEOUT') {
            writeLog('   🎯 Conexão recusada/timeout:');
            writeLog('      1. Verificar se SQL Server aceita conexões TCP/IP');
            writeLog('      2. Verificar se porta 1433 está aberta');
            writeLog('      3. Verificar firewall');
            writeLog('      4. Executar: telnet UIRAPURU 1433');
        }
        
        if (error.message.includes('Login failed') || error.message.includes('authentication')) {
            writeLog('   🎯 Falha de autenticação:');
            writeLog('      1. PRINCIPAL: Configurar trustedConnection: false');
            writeLog('      2. Verificar usuário e senha SQL Server');
            writeLog('      3. Verificar se conta IIS tem permissão no banco');
            writeLog('      4. Considerar usar SQL Authentication em vez de Windows');
        }
        
        if (error.message.includes('permission') || error.message.includes('access')) {
            writeLog('   🎯 Problema de permissão:');
            writeLog('      1. Verificar permissões da conta IIS_IUSRS no SQL Server');
            writeLog('      2. Adicionar IIS_IUSRS como login no SQL Server');
            writeLog('      3. Dar permissões db_datareader/db_datawriter');
        }
        
    } finally {
        try {
            await db.close();
            writeLog('🔒 Conexões fechadas');
        } catch (e) {
            writeLog(`⚠️ Erro ao fechar conexões: ${e.message}`);
        }
    }
    
    writeLog('');
    writeLog('📊 TESTE FINALIZADO');
    writeLog('=====================================');
}

// Executar se chamado diretamente
if (require.main === module) {
    testIISEnvironment().catch(err => {
        writeLog(`❌ Erro crítico: ${err.message}`);
        process.exit(1);
    });
}

// Exportar para uso via API
module.exports = testIISEnvironment;