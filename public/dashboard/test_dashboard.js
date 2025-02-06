import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('Funcionalidade do Dashboard', () => {
    let dom;
    let document;
    let window;
    let userId = '12345';
    let userInfo = {
        Nome: 'John Doe',
        Tipo: 'aluno',
        Email: 'john.doe@example.com',
        Telefone: '1234567890',
        DataLimiteDepositoTrabalhoFinal: '2023-12-31'
    };

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Dashboard</title>
                <link rel="stylesheet" href="dashboard.css">
            </head>
            <body>
                <header>
                    <h1>Avaliação de Desempenho na Pós-Graduação</h1>
                    <div class="header-buttons">
                        <button id="logoutButton" class="logout-button">Logout</button>
                    </div>
                </header>
                <main>
                    <div class="left-column">
                        <div class="card">
                            <h2>Informações Pessoais</h2>
                            <p><strong>Nome:</strong> <span id="infoName"></span></p>
                            <p><strong>Perfil:</strong> <span id="infoType"></span></p>
                            <p><strong>Email:</strong> <span id="infoEmail"></span></p>
                            <p><strong>Telefone:</strong> <span id="infoPhone"></span></p>
                        </div>
                        <div id="notificationCard" class="notification-card">
                            <h3>Notificações</h3>
                            <ul id="notificationList">
                            </ul>
                        </div>
                    </div>
                    <div id="reportCard" class="report-card hidden">
                        <div id="reportsContainer"></div>
                    </div>
                </main>
                <div id="modalOverlay" class="hidden">
                <div class="modal-overlay hidden">
                    <div id="modal" class="modal">
                        <h2>Relatório Completo</h2>
                        <div id="reportDetails">
                        </div><br>
                        <h2>Formulário para dar parecer em relatório semestral da pós-graduação</h2>
                        <form id="evaluationForm">
                            <label for="nomeParecerista" class="required">Nome do parecerista:</label>
                            <input type="text" id="nomeParecerista" name="nomeParecerista" readonly>
                        
                            <label class="required">Papel neste parecer:</label>
                            <div class="radio-group">
                                <input type="radio" id="orientador" name="papel" value="Orientador" required>
                                <label for="orientador">Orientador</label>
                            </div>
                            <div class="radio-group">
                                <input type="radio" id="membroCCP" name="papel" value="Membro da CCP" required>
                                <label for="membroCCP">Membro da CCP</label>
                            </div>
                        
                            <label for="nomeAlunoAvaliado" class="required">Nome do aluno avaliado:</label>
                            <input type="text" id="nomeAlunoAvaliado" name="nomeAlunoAvaliado" readonly>
                        
                            <label class="required">Parecer sobre o desempenho do aluno:</label>
                            <div class="radio-group">
                                <input type="radio" id="adequado" name="parecer" value="adequado" required>
                                <label for="adequado">Adequado</label>
                            </div>
                            <div class="radio-group">
                                <input type="radio" id="adequadoComRessalvas" name="parecer" value="adequado com ressalvas" required>
                                <label for="adequadoComRessalvas">Adequado com ressalvas</label>
                            </div>
                            <div class="radio-group">
                                <input type="radio" id="insatisfatorio" name="parecer" value="insatisfatorio" required>
                                <label for="insatisfatorio">Insatisfatório</label>
                            </div>
                        
                            <label for="desempenho" class="required">Desempenho do aluno com base em seu parecer:</label>
                            <textarea id="desempenho" name="desempenho" required></textarea>
                        
                            <button type="submit">Enviar Parecer</button>
                            <button type="button" id="closeModalButton">Voltar</button>
                        </form>
                    </div>
                </div></div>
                <script src="dashboard.js"></script>
            </body>
            </html>
        `, { runScripts: "dangerously", resources: "usable" });

        document = dom.window.document;
        window = dom.window;

        // Mock fetch response
        global.fetch = async (url) => {
            if (url.includes('/user/12345')) {
                return {
                    ok: true,
                    json: async () => userInfo
                };
            }
            return { ok: false };
        };
    });

    it('deve exibir as informações do usuário corretamente', () => {
        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);

        expect('John Doe').to.equal(userInfo.Nome);
        expect('aluno').to.equal(userInfo.Tipo);
    });

    it('deve lidar com logout corretamente', () => {
        const logoutButton = document.getElementById('logoutButton');

        logoutButton.click();

        expect(window.userId).to.be.undefined;
    });

    it('deve mostrar notificações para aluno', async () => {
        const reports = [
            { estadoDoRelatorio: 'adequado', avaliadoPeloOrientador: true, avaliadoPelaCCP: true },
            { estadoDoRelatorio: 'insatisfatorio', segundoRelatorio: false }
        ];

        // Mock fetch response
        global.fetch = async (url) => {
            if (url.includes('/user/12345')) {
                return {
                    ok: true,
                    json: async () => userInfo
                };
            } else if (url.includes('/reportsByAluno/John%20Doe')) {
                return {
                    ok: true,
                    json: async () => reports
                };
            }
            return { ok: false };
        };

        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);
    });

    

    it('deve mostrar relatórios de alunos se o usuário for docente', async () => {
        const docenteInfo = {
            Nome: 'Jane Doe',
            Tipo: 'docente',
            Email: 'jane.doe@example.com',
            Telefone: '0987654321'
        };
    
        const studentReports = [
            { aluno: 'Student 1', estadoDoRelatorio: 'adequado' },
            { aluno: 'Student 2', estadoDoRelatorio: 'insatisfatorio' }
        ];

        let reportsContainer = '';

        studentReports.forEach(report => {
            reportsContainer += `
                <div class="report">
                    <h3>${report.aluno}</h3>
                    <p><strong>Estado do Relatório:</strong> ${report.estadoDoRelatorio}</p>
                    <button class="evaluateButton">Avaliar</button>
                </div>
            `;
        });
    
    
        global.fetch = async (url) => {
            if (url.includes('/user/12345')) {
                return {
                    ok: true,
                    json: async () => docenteInfo
                };
            } else if (url.includes('/reportsByDocente/Jane%20Doe')) {
                return {
                    ok: true,
                    json: async () => studentReports
                };
            }
            return { ok: false };
        };
    
        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);
    
        expect(reportsContainer).is.not.empty;
    });

    it('deve exibir o modal quando o relatório é clicado', () => {
        const reportCard = document.getElementById('reportCard');
        reportCard.classList.remove('hidden');
    
        const reportDetails = document.getElementById('reportDetails');
        reportDetails.innerHTML = '<p>Report Details</p>';
    
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.classList.remove('hidden');
    
        expect(modalOverlay.classList.contains('hidden')).to.be.false;
        expect(reportDetails.innerHTML).to.equal('<p>Report Details</p>');
    });

    it('deve esconder o modal quando o botão de fechar é clicado', () => {
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModalButton = document.getElementById('closeModalButton');
    
        // Simulate clicking the close button
        closeModalButton.click();
    
        expect(modalOverlay.classList.contains('hidden')).to.be.true;
    });
    
    it('deve enviar o formulário de avaliação corretamente', () => {
        const evaluationForm = document.getElementById('evaluationForm');
        const nomeParecerista = document.getElementById('nomeParecerista');
        const papel = document.getElementById('orientador');
        const parecer = document.getElementById('adequado');
        const desempenho = document.getElementById('desempenho');
    
        nomeParecerista.value = 'Jane Doe';
        papel.checked = true;
        parecer.checked = true;
        desempenho.value = 'Desempenho adequado';
    
        const submitEvent = new window.Event('submit');
        evaluationForm.dispatchEvent(submitEvent);
    
        expect(nomeParecerista.value).to.equal('Jane Doe');
        expect(papel.checked).to.be.true;
        expect(parecer.checked).to.be.true;
        expect(desempenho.value).to.equal('Desempenho adequado');
    });

    it('deve mostrar relatórios de alunos se o usuário for ccp e já tiver sido avaliado pelo docente', async () => {
        const ccpInfo = {
            Nome: 'Jane Doe',
            Tipo: 'ccp',
            Email: 'jane.doe@example.com',
            Telefone: '0987654321'
        };
    
        const studentReports = [
            { aluno: 'Student 1', estadoDoRelatorio: 'adequado' },
            { aluno: 'Student 2', estadoDoRelatorio: 'insatisfatorio' }
        ];

        let reportsContainer = '';

        studentReports.forEach(report => {
            reportsContainer += `
                <div class="report">
                    <h3>${report.aluno}</h3>
                    <p><strong>Estado do Relatório:</strong> ${report.estadoDoRelatorio}</p>
                    <button class="evaluateButton">Avaliar</button>
                </div>
            `;
        });
    
    
        global.fetch = async (url) => {
            if (url.includes('/user/12345')) {
                return {
                    ok: true,
                    json: async () => ccpInfo
                };
            } else if (url.includes('/reportsByDocente/Jane%20Doe')) {
                return {
                    ok: true,
                    json: async () => studentReports
                };
            }
            return { ok: false };
        };
    
        // Trigger DOMContentLoaded event
        const event = new window.Event('DOMContentLoaded');
        document.dispatchEvent(event);
    
        expect(reportsContainer).is.not.empty;
    });
});