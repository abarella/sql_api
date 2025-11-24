// test-connection.js
// Script para testar a conectividade com o SQL Server
const DatabaseFacade = require('./db');

async function testConnection() {
    console.log('🚀 Iniciando teste de conectividade...');
    console.log('📅 Data/Hora:', new Date().toLocaleString());
    console.log('🖥️ Sistema:', process.platform, process.arch);
    console.log('🟢 Node.js:', process.version);
    console.log('📂 Diretório:', process.cwd());
    console.log('👤 Usuário:', process.env.USERNAME || process.env.USER || 'Desconhecido');
    console.log('');

    const db = new DatabaseFacade();
    
    try {
        // Teste 1: Conectar ao banco
        console.log('🔌 Teste 1: Conectividade básica');
        await db.connect();
        console.log('✅ Conexão estabelecida com sucesso');
        console.log('');

        // Teste 2: Query simples
        console.log('🔍 Teste 2: Query SELECT simples');
        const result1 = await db.executeQuery('SELECT GETDATE() as data_atual, @@VERSION as versao', [], [], false);
        console.log('✅ Query executada:', result1.recordset[0]);
        console.log('');

        // Teste 3: Query dos pedidos (mesma do endpoint)
        console.log('📋 Teste 3: Query de produção (como no endpoint)');
        const query = `
            DECLARE @dia INT = DAY(GETDATE()),
                    @mes INT = MONTH(GETDATE()),
                    @ano INT = YEAR(GETDATE());
            SELECT TOP 5
              ROW_NUMBER() OVER (ORDER BY p110prod) AS id,
              p110prod, p110lote, p110serie, COUNT(*) AS regs
            FROM vendaspelicano..tcacp110
            WHERE p110situ = 0
              AND YEAR(p110said) = @ano
              AND MONTH(p110said) = @mes
              AND DAY(p110said) = @dia
              AND datausu_esteira IS NULL
              AND p110prod <> 'EMB.GER.'
              AND p110ccli <> '600055X'
            GROUP BY p110lote, p110prod, p110serie
            ORDER BY p110prod;
        `;
        
        const result2 = await db.executeQuery(query, [], [], false);
        console.log('✅ Registros encontrados:', result2.recordset.length);
        if (result2.recordset.length > 0) {
            console.log('📄 Primeiro registro:', result2.recordset[0]);
        }
        console.log('');

        // Teste 4: Procedure (se existir)
        try {
            console.log('🔧 Teste 4: Stored Procedure');
            const result3 = await db.executeQuery('usp_getPedidos', ['TEST123'], ['p110chve'], true);
            console.log('✅ Procedure executada com sucesso');
        } catch (procError) {
            console.log('⚠️ Erro na procedure (normal se não existir):', procError.message);
        }
        console.log('');

        console.log('🎉 Todos os testes concluídos com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante os testes:');
        console.error('   Mensagem:', error.message);
        console.error('   Código:', error.code);
        console.error('   Stack:', error.stack);
        
        // Diagnósticos adicionais
        console.log('');
        console.log('🔧 Diagnósticos adicionais:');
        
        if (error.code === 'ENOTFOUND') {
            console.log('   ❌ Servidor não encontrado. Verifique:');
            console.log('      - Nome do servidor está correto');
            console.log('      - Servidor está ligado');
            console.log('      - Rede está acessível');
        }
        
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEOUT') {
            console.log('   ❌ Conexão recusada/timeout. Verifique:');
            console.log('      - SQL Server está rodando');
            console.log('      - Porta 1433 está aberta');
            console.log('      - Firewall não está bloqueando');
        }
        
        if (error.message.includes('Login failed')) {
            console.log('   ❌ Falha na autenticação. Verifique:');
            console.log('      - Usuário e senha estão corretos');
            console.log('      - Usuário tem permissão no banco');
            console.log('      - Trusted Connection está configurada corretamente');
        }
        
    } finally {
        await db.close();
        console.log('');
        console.log('📊 Teste finalizado em:', new Date().toLocaleString());
    }
}

// Executar o teste se chamado diretamente
if (require.main === module) {
    testConnection().catch(console.error);
}

module.exports = testConnection;