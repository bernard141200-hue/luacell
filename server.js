const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Permite que o servidor entenda JSON e sirva as páginas HTML
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Banco de dados simulado da Lua Cell
let produtos = [
    {id: 1, nome: "iPhone 13 128GB - Estelar", tamanho: "Novo (Garantia Apple)", quantidade: 2, preco: 3499.00, imagem: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500"},
    {id: 2, nome: "Carregador Turbo 20W Tipo-C", tamanho: "Homologado Anatel", quantidade: 15, preco: 89.90, imagem: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500"},
    {id: 3, nome: "Caixa de Som JBL Flip 6", tamanho: "Original Lacrada", quantidade: 4, preco: 549.90, imagem: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"}
];
let pedidos = [];
let clientes = {};

// 1. Rota para carregar a vitrine
app.get('/api/produtos', (req, res) => {
    res.json(produtos);
});

// 2. Rota para salvar cliente (WhatsApp/Email)
app.post('/api/clientes', (req, res) => {
    const cliente = req.body;
    clientes[cliente.email] = cliente;
    console.log("🌙 [Lua Cell] Cliente Atualizado:", cliente.nome, "-", cliente.telefone);
    res.json({ success: true });
});

// 3. Rota para baixar estoque e faturar pedido
app.post('/api/pedidos', (req, res) => {
    const { cliente, itens, total } = req.body;
    
    // Baixa no estoque
    itens.forEach(itemPedido => {
        const produtoNoBanco = produtos.find(p => p.id === itemPedido.id);
        if (produtoNoBanco) {
            produtoNoBanco.quantidade -= itemPedido.qtd_desejada;
            if (produtoNoBanco.quantidade < 0) produtoNoBanco.quantidade = 0;
        }
    });

    // Salva o pedido
    const novoPedido = {
        id: pedidos.length + 1,
        cliente: cliente.nome,
        whatsapp: cliente.telefone,
        itens: itens,
        total: total,
        data: new Date()
    };
    pedidos.push(novoPedido);

    console.log(`📈 [Faturamento] Pedido #${novoPedido.id} recebido. Valor: R$ ${total}`);
    res.json({ success: true, produtosAtualizados: produtos });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Lua Cell rodando em http://localhost:${PORT}`);
});