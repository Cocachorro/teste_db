const express = require('express');
const mariadb = require('mariadb');

const app = express();
const porta = 3000;

// 1. Configura a ponte com o seu banco de dados
const pool = mariadb.createPool({
  host: '127.0.0.1', 
  user: 'vitor', // Digite seu usuário do MariaDB aqui
  password: 'Velp@1234', // Digite sua senha aqui
  database: 'cadastros_teste' // Seu banco de dados criado
});

// 2. Rota para testar se a conexão deu certo
app.get('/teste-banco', async (req, res) => {
  let conn;
  try {
    // Tenta pegar a conexão com o banco
    conn = await pool.getConnection(); 
    res.send("<h1>Sucesso! O Express entrou no MariaDB!</h1>");
  } catch (err) {
    // Se der erro de senha ou acesso, ele mostra aqui
    res.status(500).send("Erro ao conectar no banco: " + err.message);
  } finally {
    // Devolve a conexão para não travar o banco
    if (conn) conn.release(); 
  }
});

// 3. Libera o CSS e o HTML para aparecerem na tela
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// 4. Liga o servidor web
app.listen(porta, () => {
    console.log(`Servidor no ar! Teste a conexão acessando: http://IP_DO_SEU_SERVIDOR:${porta}/teste-banco`);
});
