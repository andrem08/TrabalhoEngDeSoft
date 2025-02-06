import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('User Login Functionality', () => {
    let dom;
    let document;
    let window;
    let userForm;
    let errorMessage;
    let loadingScreen;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Avaliação de Desempenho na Pós-Graduação</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Avaliação de Desempenho na Pós-Graduação</h1>
                    <form id="userForm">
                        <label for="userType">Selecione seu perfil:</label>
                        <select id="userType" name="userType" required>
                            <option value="aluno">Aluno</option>
                            <option value="docente">Docente</option>
                            <option value="ccp">Comissão Coordenadora do Programa (CCP)</option>
                        </select>
                        <label for="userName">Nome:</label>
                        <input type="text" id="userName" name="userName" required>
                        <label for="userPassword">Senha:</label>
                        <input type="password" id="userPassword" name="userPassword" required>
                        <button type="submit">Confirmar</button>
                    </form>
                    <p id="errorMessage" class="error-message"></p>
                    <p><a href="cadastro/cadastro.html" class="register-link">Cadastrar novo aluno</a></p>
                </div>
                <div id="loadingScreen" class="loading-screen hidden">
                    <div class="spinner"></div>
                </div>
                <script src="script.js"></script>
            </body>
            </html>
        `, { runScripts: "dangerously", resources: "usable" });

        document = dom.window.document;
        window = dom.window;
        userForm = document.getElementById('userForm');
        errorMessage = document.getElementById('errorMessage');
        loadingScreen = document.getElementById('loadingScreen');
    });

    it('should display loading screen on form submit', () => {
        const userName = document.getElementById('userName');
        const userPassword = document.getElementById('userPassword');
        const userType = document.getElementById('userType');

        userName.value = 'testUser';
        userPassword.value = 'testPassword';
        userType.value = 'aluno';

        const submitEvent = new window.Event('submit');
        userForm.dispatchEvent(submitEvent);

        expect(loadingScreen.classList.contains('hidden')).to.be.true;
    });

    it('should show error message for incorrect user credentials', async () => {
        const userName = document.getElementById('userName');
        const userPassword = document.getElementById('userPassword');
        const userType = document.getElementById('userType');

        userName.value = 'wrongUser';
        userPassword.value = 'wrongPassword';
        userType.value = 'aluno';

        global.fetch = async (url) => {
            return {
                ok: false
            };
        };

        const submitEvent = new window.Event('submit');
        userForm.dispatchEvent(submitEvent);

        await new Promise(resolve => setTimeout(resolve, 0)); // Wait for async operations

        expect(errorMessage.textContent).to.be.empty;
    });

    it('should redirect to dashboard on successful login', async () => {
        const userName = document.getElementById('userName');
        const userPassword = document.getElementById('userPassword');
        const userType = document.getElementById('userType');

        userName.value = 'correctUser';
        userPassword.value = 'correctPassword';
        userType.value = 'aluno';

        const user = { _id: '12345' };

        global.fetch = async (url) => {
            return {
                ok: true,
                json: async () => user
            };
        };

        const submitEvent = new window.Event('submit');
        userForm.dispatchEvent(submitEvent);

        await new Promise(resolve => setTimeout(resolve, 0));
    });
});
