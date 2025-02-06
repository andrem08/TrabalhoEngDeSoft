let avaliacao = '';
let reportId = '';
let acceptedReports = [];
document.addEventListener('DOMContentLoaded', async function() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        console.error('No user ID found in sessionStorage');
        return;
    }

    let userName = '';
    let userType = '';
    let userLimitDate = '';

    try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        if (!response.ok) {
            console.error('Network response was not ok');
            throw new Error('Network response was not ok');
        }

        const user = await response.json();

        console.log('user', user);

        document.getElementById('infoName').textContent = user.Nome;
        document.getElementById('infoType').textContent = user.Tipo;
        document.getElementById('infoEmail').textContent = user.Email;
        document.getElementById('infoPhone').textContent = user.Telefone;
        userName = user.Nome;
        userType = user.Tipo;
        userLimitDate = user.DataLimiteDepositoTrabalhoFinal;
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            sessionStorage.clear();
            window.location.href = '../index.html';
        });
    }

    const notificationList = document.getElementById('notificationList');

    notificationList.innerHTML = '';
    if (userType === 'aluno') {
        try {
            const reportsResponse = await fetch(`http://localhost:3000/reportsByAluno/${encodeURIComponent(userName)}`);
            if (!reportsResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const reports = await reportsResponse.json();
            const link = document.createElement('a');

            if (reports.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Data limite para entrega do trabalho é dia ' + userLimitDate;
                notificationList.appendChild(li);
                link.href = '#';
                link.textContent = 'Página do Forms';
                link.id = 'paginaFormsLink';
                notificationList.appendChild(link);
            } else {
                let hasPendente = false;
                let hasInsatisfeito = false;
                let hasAprovado = false;
                reports.forEach(report => {
                    if (report.estadoDoRelatorio === 'insatisfatorio') {
                        hasInsatisfeito = true;
                        hasPendente = false;
                        hasAprovado = false;
                        isSecondReport = report.segundoRelatorio;
                        
                        reportId = report._id;
                        return;
                    } else if (hasAprovado ||((report.estadoDoRelatorio === 'adequado' || report.estadoDoRelatorio === 'adequado com ressalvas') && report.avaliadoPeloOrientador && report.avaliadoPelaCCP)) {
                        hasAprovado = true;
                        hasPendente = false;
                        acceptedReports.push(report);
                    } else {
                        hasPendente = true;
                    }
                });

                const li = document.createElement('li');
                if (hasInsatisfeito) {
                    if(isSecondReport == undefined || isSecondReport == false){
                        li.textContent = 'O seu relatorio foi declarado como insatisfeito. Por favor, faça as correções necessárias.';
                        link.href = '#';
                        link.textContent = 'Página do Forms';
                        link.id = 'paginaFormsLinkRemake';
                        notificationList.appendChild(link);
                    } else {
                        li.textContent = 'O seu segundo relatorio foi declarado como insatisfeito. Como este é o segundo relatorio, não podera refazer novamente.';
                    }
                } else if (hasAprovado) {
                    li.textContent = 'O seu relatorio foi aprovado';
                } else if (hasPendente) {
                    li.textContent = 'Você não tem nenhuma notificação.';
                }
                const reportCard = document.getElementById('reportCard');
                if (hasInsatisfeito || hasAprovado) {
                    const evaluationsResponse = await fetch(`http://localhost:3000/evaluationsByAluno/${encodeURIComponent(userName)}`);
                    if (!evaluationsResponse.ok) {
                        throw new Error('Network response was not ok');
                    }
                    console.log('evaluationsResponse', evaluationsResponse);
                
                    const evaluations = await evaluationsResponse.json();
                    let evaluationsSummary = `
                    <div class="evaluations-summary">
                        <h4>Resumo das Avaliações:</h4>
                    `;
                    evaluations.forEach(evaluation => {
                        evaluationsSummary += `
                            <div class="evaluation-item">
                                <p><strong>${evaluation.papel === 'Membro da CCP' ? 'Membro da CCP' : 'Orientador'}:</strong> ${evaluation.nomeParecerista}</p>
                                <p><strong>Parecer:</strong> ${evaluation.parecer}</p>
                                <p><strong>Desempenho:</strong> ${evaluation.desempenho}</p>
                            </div>
                            <hr class="evaluation-divider">
                        `;
                    });
                    evaluationsSummary += '</div>';
                
                    const reportDetails = document.getElementById('reportsContainer');
                    reportDetails.innerHTML = evaluationsSummary;
                    reportCard.classList.remove('hidden');
                } else {
                    reportCard.classList.add('hidden');
                }
                notificationList.appendChild(li);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }

        if (document.getElementById('paginaFormsLink')) {
            document.getElementById('paginaFormsLink').addEventListener('click', function(event) {
                event.preventDefault();
                const userId = sessionStorage.getItem('userId');
                if (userId) {
                    window.location.href = '../relatorio/relatorio.html';
                } else {
                    alert('Usuário não autenticado.');
                }
            });
        } else if (document.getElementById('paginaFormsLinkRemake')) {
            document.getElementById('paginaFormsLinkRemake').addEventListener('click', async function(event) {
                event.preventDefault();
                const userId = sessionStorage.getItem('userId');
                if (userId) {
                    sessionStorage.setItem('reportId', reportId);
                    window.location.href = '../segundoRelatorio/segundoRelatorio.html';
                } else {
                    alert('Usuário não autenticado.');
                }
            });
        }
    } else {
        const li = document.createElement('li');
        li.textContent = 'Você não tem nenhuma notificação.';
        notificationList.appendChild(li);
    }
    
    const reportCard = document.getElementById('reportCard');
    if (userType === 'docente' || userType === 'ccp') {
        reportCard.classList.remove('hidden');

        try {
            const reportsResponse = await fetch(`http://localhost:3000/reports?nomeOrientador=${encodeURIComponent(userName)}&userType=${userType}`);
            if (!reportsResponse.ok) {
                throw new Error('Network response was not ok');
            }
        
            const reports = await reportsResponse.json();
            const reportsContainer = document.createElement('div');
            reportsContainer.id = 'reportsContainer';
        
            let reportsContainerTitle = `
                <div class="evaluations-summary">
                    <h4>Relatórios para Avaliação:</h4>
                </div>
            `;
            reportsContainer.innerHTML = reportsContainerTitle;
        
            if (reports.length === 0) {
                reportsContainer.innerHTML += '<p>Nenhum relatório encontrado.</p>';
            } else {
                reports.forEach(report => {
                    const reportElement = document.createElement('div');
                    reportElement.classList.add('report');
        
                    reportElement.innerHTML = `
                        <h3>${report.nomeAluno}</h3>
                        <p><strong>Orientador:</strong> ${report.nomeOrientador}</p>
                        <p><strong>Curso:</strong> ${report.curso}</p>
                        <p><strong>Data de Ingresso:</strong> ${report.dataIngresso}</p>
                        <p><strong>Resultado do Último Relatório:</strong> ${report.resultadoUltimoRelatorio}</p>
                        <button class="viewReportButton" data-report='${JSON.stringify(report)}'>Ver Relatório Completo</button>
                        <br><br>
                    `;
        
                    reportsContainer.appendChild(reportElement);
                });
            }
        
            reportCard.appendChild(reportsContainer);
        } catch (error) {
            console.error('Error fetching reports:', error);
            reportCard.innerHTML = '<p>Erro ao carregar relatórios.</p>';
        }
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('viewReportButton')) {
            const report = JSON.parse(event.target.getAttribute('data-report'));
            showModal(report);
        }
    });

    

    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalButton = document.getElementById('closeModalButton');

    closeModalButton.addEventListener('click', function() {
        modalOverlay.classList.add('hidden');
    });

    function showModal(report) {
        const reportDetails = document.getElementById('reportDetails');
        reportDetails.innerHTML = `
            <p><strong>Estado do Relatório:</strong> ${report.estadoDoRelatorio}</p>
            <p><strong>Nome do Aluno:</strong> ${report.nomeAluno}</p>
            <p><strong>Orientador:</strong> ${report.nomeOrientador}</p>
            <p><strong>Número USP:</strong> ${report.numeroUSP}</p>
            <p><strong>Link Lattes:</strong> <a href="${report.linkLattes}" target="_blank">${report.linkLattes}</a></p>
            <p><strong>Data de Atualização do Lattes:</strong> ${report.dataAtualizacaoLattes}</p>
            <p><strong>Curso:</strong> ${report.curso}</p>
            <p><strong>Data de Ingresso:</strong> ${report.dataIngresso}</p>
            <p><strong>Resultado do Último Relatório:</strong> ${report.resultadoUltimoRelatorio}</p>
            <p><strong>Aprovações em Disciplinas:</strong> ${report.aprovacoesDisciplinas}</p>
            <p><strong>Reprovações no 2o semestre de 2023:</strong> ${report.reprovacoesDisciplinas}</p>
            <p><strong>Reprovações em Disciplinas desde o Início:</strong> ${report.reprovacoesInicio}</p>
            <p><strong>Exame de Proficiência:</strong> ${report.exameProficiencia}</p>
            <p><strong>Exame de Qualificação:</strong> ${report.exameQualificacao}</p>
            <p><strong>Prazo para Inscrição no Exame de Qualificação:</strong> ${report.prazoInscricao}</p>
            <p><strong>Prazo para Defesa da Dissertação:</strong> ${report.prazoDissertacao}</p>
            <p><strong>Artigos em Fase de Escrita:</strong> ${report.artigosEscrita}</p>
            <p><strong>Artigos Submetidos e em Avaliação:</strong> ${report.artigosEmAvaliacao}</p>
            <p><strong>Artigos Aceitos ou Publicados:</strong> ${report.artigosAceitos}</p>
            <p><strong>Atividades e Eventos:</strong> ${report.atividadesEventos}</p>
            <p><strong>Resumo das Atividades:</strong> ${report.resumoAtividades}</p>
            <p><strong>Declaração Adicional:</strong> ${report.declaracaoAdicional}</p>
            <p><strong>Dificuldades:</strong> ${report.dificuldades}</p>
        `;

        document.getElementById('nomeAlunoAvaliado').value = report.nomeAluno;
        document.getElementById('nomeParecerista').value = userName;
        document.getElementById(userType === 'docente' ? 'orientador' : 'membroCCP').checked = true;
        document.getElementById(userType !== 'docente' ? 'orientador' : 'membroCCP').disabled = true;

        if(report.reprovacoesInicio == '0' && report.reprovacoesDisciplinas == '0' && report.exameQualificacao != 'Sim. Fui reprovado.' && report.exameQualificacao != 'Não.' && report.estadoDoRelatorio != 'adequado com ressalvas'){
            document.getElementById('adequado').checked = true;
        } else if((report.reprovacoesInicio != '0' && report.reprovacoesInicio != '1') || (report.reprovacoesDisciplinas != '0' && report.reprovacoesDisciplinas != '1') || report.exameQualificacao == 'Sim. Fui reprovado.'){ 
            document.getElementById('insatisfatorio').checked = true;
        } else {
            document.getElementById('adequadoComRessalvas').checked = true;
        }

        modalOverlay.classList.remove('hidden');

        idRelatorio = report._id;
    }

    const evaluationForm = document.getElementById('evaluationForm');
    evaluationForm.addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const evaluationData = {
            nomeParecerista: document.getElementById('nomeParecerista').value,
            papel: document.querySelector('input[name="papel"]:checked').value,
            nomeAlunoAvaliado: document.getElementById('nomeAlunoAvaliado').value,
            parecer: document.querySelector('input[name="parecer"]:checked').value,
            desempenho: document.getElementById('desempenho').value
        };
    
        console.log('evaluationData', evaluationData);
    
        try {
            const response = await fetch('http://localhost:3000/evaluations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(evaluationData)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            alert('Parecer enviado com sucesso!');
            modalOverlay.classList.add('hidden');
    
            const reportResponse = await fetch(`http://localhost:3000/reportsId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: idRelatorio, userType, parecer: evaluationData.parecer }) // Pass userType and parecer
            });
            
            if (!reportResponse.ok) {
                throw new Error('Network response was not ok');
            }
            window.location.reload();
        } catch (error) {
            console.error('Error submitting evaluation:', error);
            alert('Erro ao enviar parecer.');
        }
    });
});

