const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'supabase_agent_workflow.json');

try {
    if (!fs.existsSync(filePath)) {
        console.error("ERRO: O arquivo supabase_agent_workflow.json não foi encontrado.");
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const workflow = JSON.parse(content);

    console.log("--- INICIANDO VERIFICAÇÃO ESTÁTICA ---");
    console.log(`Arquivo carregado: ${filePath}`);
    console.log(`Nome do Workflow: ${workflow.name}`);

    let success = true;
    const nodesToCheck = ['Supabase Create', 'Supabase Read', 'Supabase Update', 'Supabase Delete'];

    workflow.nodes.forEach(node => {
        if (nodesToCheck.includes(node.name)) {
            if (node.parameters.tableId === 'documents') {
                console.log(`[PASS] Nó '${node.name}' está apontando para a tabela 'documents'.`);
            } else {
                console.error(`[FAIL] Nó '${node.name}' está apontando para '${node.parameters.tableId}' (Esperado: 'documents').`);
                success = false;
            }
        }
    });

    if (success) {
        console.log("\nRESULTADO: O arquivo JSON está configurado CORRETAMENTE para a tabela 'documents'.");
    } else {
        console.log("\nRESULTADO: Falha na verificação. Alguns nós não foram atualizados.");
    }

} catch (err) {
    console.error("Erro ao ler ou processar o arquivo:", err);
}
