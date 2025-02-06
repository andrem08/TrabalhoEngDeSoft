document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const errorMessage = document.getElementById('errorMessage');
    const loadingScreen = document.getElementById('loadingScreen');

    userForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userName = document.getElementById('userName').value;
        const userPassword = document.getElementById('userPassword').value;
        const userType = document.getElementById('userType').value;

        loadingScreen.classList.remove('hidden');

        try {
            const response = await fetch('http://localhost:3000/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Nome: userName, Senha: userPassword, Tipo: userType })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const user = await response.json();
            sessionStorage.setItem('userId', user._id);
            window.location.href = 'dashboard/dashboard.html';
        } catch (error) {
            console.error('Error checking user:', error);
            errorMessage.textContent = 'Usuário ou senha incorretos.';
            loadingScreen.classList.add('hidden');
        }
    });
});
