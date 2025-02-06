document.addEventListener('DOMContentLoaded', async function() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        alert('Usuário não autenticado.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/user/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const user = await response.json();

        document.getElementById('nomeAluno').value = user.Nome;
        document.getElementById('nomeOrientador').value = user.Orientador;
        document.getElementById('numeroUSP').value = user.nUsp;
        document.getElementById('linkLattes').value = user.LinkLattes;
        document.getElementById('dataAtualizacaoLattes').value = user.DataAtualizacaoLattes ? user.DataAtualizacaoLattes.split('T')[0] : '';
        document.getElementById('curso').value = user.Curso.toLowerCase();
        document.getElementById('dataIngresso').value = user.DataMatricula ? user.DataMatricula.split('T')[0] : '';
        document.getElementById('resultadoUltimoRelatorio').value = user.ResultadoUltimoRelatorio || '';
        document.getElementById('exameQualificacao').value = user.ExameQualificacao || '';
        document.getElementById('atividadesEventos').value = user.AtividadesEventos || '';
        document.getElementById('resumoAtividades').value = user.ResumoAtividades || '';
        document.getElementById('declaracaoAdicional').value = user.DeclaracaoAdicional || '';
        document.getElementById('dificuldades').value = user.Dificuldades || '';
        document.getElementById('prazoInscricao').value = user.prazoInscricao || '';

        
    } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Erro ao buscar detalhes do usuário.');
    }

    const form = document.getElementById('reportForm');

    form.addEventListener('backToDashboardButton', async function() {
        sessionStorage.setItem('userId', userId);
        window.location.href = '../dashboard/dashboard.html';
    });
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const reportData = {
            idAluno: userId,

            nomeAluno: document.getElementById('nomeAluno').value,
            nomeOrientador: document.getElementById('nomeOrientador').value,
            numeroUSP: document.getElementById('numeroUSP').value,
            linkLattes: document.getElementById('linkLattes').value,
            dataAtualizacaoLattes: document.getElementById('dataAtualizacaoLattes').value,
            curso: document.getElementById('curso').value,
            dataIngresso: document.getElementById('dataIngresso').value,
            resultadoUltimoRelatorio: document.querySelector('input[name="resultadoUltimoRelatorio"]:checked').value,
            aprovacoesDisciplinas: document.querySelector('input[name="aprovacoesDisciplinas"]:checked').value,
            reprovacoesDisciplinas: document.querySelector('input[name="reprovacoesDisciplinas"]:checked').value,
            reprovacoesInicio: document.querySelector('input[name="reprovacoesInicio"]:checked').value,
            exameProficiencia: document.querySelector('input[name="exameProficiencia"]:checked').value,
            exameQualificacao: document.querySelector('input[name="exameQualificacao"]:checked').value,
            prazoInscricao: document.getElementById('prazoInscricao').value,
            prazoDissertacao: document.getElementById('prazoDissertacao').value,
            artigosEscrita: document.querySelector('input[name="artigosEscrita"]:checked').value,
            artigosEmAvaliacao: document.querySelector('input[name="artigosEmAvaliacao"]:checked').value,
            artigosAceitos: document.querySelector('input[name="artigosAceitos"]:checked').value,
            atividadesEventos: document.getElementById('atividadesEventos').value,
            resumoAtividades: document.getElementById('resumoAtividades').value,
            declaracaoAdicional: document.getElementById('declaracaoAdicional').value,
            dificuldades: document.querySelector('input[name="dificuldades"]:checked').value,
            avaliadoPeloOrientador: false,
            estadoDoRelatorio: 'pendente',
            avaliadoPelaCCP: false,
            segundoRelatorio: false
        };

        const [prazoMes, prazoAno] = reportData.prazoInscricao.split('/').map(Number);
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // getMonth() returns 0-based month
        const currentYear = today.getFullYear();

        if (currentYear > prazoAno || (currentYear === prazoAno && currentMonth > prazoMes)) {
            reportData.estadoDoRelatorio = 'insatisfatorio';
        } else {
            reportData.estadoDoRelatorio = 'pendente';
        }

        try {
            const response = await fetch('http://localhost:3000/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Relatório enviado com sucesso!');
            form.reset();
            window.location.href = '../dashboard/dashboard.html';
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Erro ao enviar relatório.');
        }
    });
});