document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const userNameInput = document.getElementById('userName');
    const userEmailInput = document.getElementById('userEmail');
    const userAddressInput = document.getElementById('userAddress');
    const userPhoneInput = document.getElementById('userPhone');
    const userUsernameInput = document.getElementById('userUsername');
    const userPasswordInput = document.getElementById('userPassword');
    const userList = document.getElementById('userList');
    const messageBox = document.createElement('div'); // Elemento para mensagens
    messageBox.id = 'messageBox';
    document.body.insertBefore(messageBox, form);

    function showMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.style.color = isError ? 'red' : 'green';
        setTimeout(() => {
            messageBox.textContent = '';
        }, 4000);
    }

    // Função para listar usuários
    function listUsers() {
        fetch('http://localhost:3000/api/users')
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar usuários.');
                return response.json();
            })
            .then(users => {
                userList.innerHTML = '';
                users.forEach(user => {
                    const li = document.createElement('li');
                    li.innerHTML = `${user.name} (${user.email}, ${user.address}, ${user.phone}, Usuário: ${user.username}) 
                        <button onclick="editUser(${user.id})">Editar</button> 
                        <button onclick="deleteUser(${user.id})">Excluir</button>`;
                    userList.appendChild(li);
                });
            })
            .catch(error => showMessage(error.message, true));
    }

    // Função para salvar ou atualizar usuário
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const id = userIdInput.value;
        const name = userNameInput.value;
        const email = userEmailInput.value;
        const address = userAddressInput.value;
        const phone = userPhoneInput.value;
        const username = userUsernameInput.value;
        const password = userPasswordInput.value;

        const userData = { name, email, address, phone, username, password };

        fetch(id ? `http://localhost:3000/api/users/${id}` : 'http://localhost:3000/api/users', {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) return response.json().then(err => { throw new Error(err.message); });
                return response.json();
            })
            .then(() => {
                listUsers();
                form.reset();
                userIdInput.value = '';
                showMessage(id ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
            })
            .catch(error => showMessage(error.message, true));
    });

    // Função para editar usuário
    window.editUser = function (id) {
        fetch(`http://localhost:3000/api/users/${id}`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao carregar usuário para edição.');
                return response.json();
            })
            .then(user => {
                userIdInput.value = user.id;
                userNameInput.value = user.name;
                userEmailInput.value = user.email;
                userAddressInput.value = user.address;
                userPhoneInput.value = user.phone;
                userUsernameInput.value = user.username;
                userPasswordInput.value = user.password;
            })
            .catch(error => showMessage(error.message, true));
    };

    // Função para excluir usuário
    window.deleteUser = function (id) {
        fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao excluir usuário.');
                listUsers();
                showMessage('Usuário excluído com sucesso!');
            })
            .catch(error => showMessage(error.message, true));
    };

    // Carregar usuários inicialmente
    listUsers();
});
