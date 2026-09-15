const express = require('express');
const mariadb = require('mariadb');

const app = express();
const porta = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const pool = mariadb.createPool({
  host: '127.0.0.1', 
  user: 'vitor',
  password: 'Velp@1234',
  database: 'cadastros_teste' 
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/salvar', async (req, res) => {
  let conn;
  try {
    const { consorcio, nome, cpf, email, slc_perfil, slc_funcao, telefone, voip, slc_registro, numRegistro, estado, cidade } = req.body;
    
    conn = await pool.getConnection();
    
    const sql = "INSERT INTO dados_cad (consorcio, nome, cpf, email, perfil, funcao, telefone, voip, nome_registro, registro, estado, cidade) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    await conn.query(sql, [consorcio, nome, cpf, email, slc_perfil, slc_funcao, telefone, voip, slc_registro, numRegistro, estado, cidade]);
    
    res.send("<h1>Cadastro salvo com sucesso no MariaDB! Pode fechar esta página.</h1>");
  } catch (err) {
    res.status(500).send("Deu erro ao salvar: " + err.message);
  } finally {
    if (conn) conn.release();
  }
});

app.get('/teste-banco', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection(); 
    res.send("<h1>Sucesso! O Express conectou no MariaDB!</h1>");
  } catch (err) {
    res.status(500).send("Erro: " + err.message);
  } finally {
    if (conn) conn.release(); 
  }
});

app.listen(porta, () => {
    console.log(`Servidor no ar na porta ${porta}!`);
});