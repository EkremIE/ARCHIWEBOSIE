document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('#login-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem('token', token);
            window.location.href = 'index.html';
        } else {
            alert('Email ou mot de passe incorrect.');
        }
    });
});