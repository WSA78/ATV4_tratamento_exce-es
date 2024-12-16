const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

let users = [];

// Função para validar os campos
function validateUser({ name, email, address, phone, username, password }) {
    if (!name || name.length < 3) throw new Error('O nome deve ter no mínimo 3 caracteres.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('O e-mail deve ser válido (ex: xxx@xx.com).');
    if (!address || address.length < 5) throw new Error('O endereço deve ter no mínimo 5 caracteres.');
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(phone)) throw new Error('O telefone deve estar no formato (DD) 99999-9999.');
    if (!username || username.length < 3) throw new Error('O nome de usuário deve ter no mínimo 3 caracteres.');
    if (!password || password.length < 4) throw new Error('A senha deve ter no mínimo 4 caracteres.');
}

// Criar um novo usuário (POST)
app.post('/api/users', (req, res) => {
    try {
        const user = req.body;
        validateUser(user);

        user.id = users.length + 1;
        users.push(user);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obter todos os usuários (GET)
app.get('/api/users', (req, res) => {
    try {
        const sanitizedUsers = users.map(({ id, name, email, address, phone, username }) => ({
            id, name, email, address, phone, username
        }));
        res.status(200).json(sanitizedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao obter usuários. Tente novamente mais tarde.' });
    }
});

// Obter um único usuário (GET by ID)
app.get('/api/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const user = users.find(u => u.id == id);
        if (!user) throw new Error('Usuário não encontrado.');

        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Atualizar um usuário (PUT)
app.put('/api/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = req.body;
        validateUser(updatedUser);

        const user = users.find(u => u.id == id);
        if (!user) throw new Error('Usuário não encontrado.');

        Object.assign(user, updatedUser);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Excluir um usuário (DELETE)
app.delete('/api/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const userIndex = users.findIndex(u => u.id == id);
        if (userIndex === -1) throw new Error('Usuário não encontrado.');

        users.splice(userIndex, 1);
        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
