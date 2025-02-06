document.addEventListener('DOMContentLoaded', async function() {
    const reportId = sessionStorage.getItem('reportId');
    if (!reportId) {
        alert('Relatório não encontrado.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/reports/${reportId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const report = await response.json();

        document.getElementById('nomeAluno').value = report.nomeAluno;
        document.getElementById('nomeOrientador').value = report.nomeOrientador;
        document.getElementById('numeroUSP').value = report.numeroUSP;
        document.getElementById('linkLattes').value = report.linkLattes;
        document.getElementById('dataAtualizacaoLattes').value = report.dataAtualizacaoLattes ? report.dataAtualizacaoLattes.split('T')[0] : '';
        document.getElementById('curso').value = report.curso.toLowerCase();
        document.getElementById('dataIngresso').value = report.dataIngresso ? report.dataIngresso.split('T')[0] : '';
        document.querySelector(`input[name="resultadoUltimoRelatorio"][value="${report.resultadoUltimoRelatorio}"]`).checked = true;
        document.querySelector(`input[name="aprovacoesDisciplinas"][value="${report.aprovacoesDisciplinas}"]`).checked = true;
        document.querySelector(`input[name="reprovacoesDisciplinas"][value="${report.reprovacoesDisciplinas}"]`).checked = true;
        document.querySelector(`input[name="reprovacoesInicio"][value="${report.reprovacoesInicio}"]`).checked = true;
        document.querySelector(`input[name="exameProficiencia"][value="${report.exameProficiencia}"]`).checked = true;
        document.querySelector(`input[name="exameQualificacao"][value="${report.exameQualificacao}"]`).checked = true;
        document.getElementById('prazoInscricao').value = report.prazoInscricao || '';
        document.getElementById('prazoDissertacao').value = report.prazoDissertacao || '';
        document.querySelector(`input[name="artigosEscrita"][value="${report.artigosEscrita}"]`).checked = true;
        document.querySelector(`input[name="artigosEmAvaliacao"][value="${report.artigosEmAvaliacao}"]`).checked = true;
        document.querySelector(`input[name="artigosAceitos"][value="${report.artigosAceitos}"]`).checked = true;
        document.getElementById('atividadesEventos').value = report.atividadesEventos || '';
        document.getElementById('resumoAtividades').value = report.resumoAtividades || '';
        document.getElementById('declaracaoAdicional').value = report.declaracaoAdicional || '';
        document.querySelector(`input[name="dificuldades"][value="${report.dificuldades}"]`).checked = true;

    } catch (error) {
        console.error('Error fetching report details:', error);
        alert('Erro ao buscar detalhes do relatório.');
    }

    const form = document.getElementById('reportForm');

    document.getElementById('backToDashboardButton').addEventListener('click', function() {
        window.location.href = '../dashboard/dashboard.html';
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const reportData = {
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
            segundoRelatorio: true
        };

        try {
            const response = await fetch(`http://localhost:3000/reports/${reportId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Relatório atualizado com sucesso!');
            form.reset();
            window.location.href = '../dashboard/dashboard.html';
        } catch (error) {
            console.error('Error updating report:', error);
            alert('Erro ao atualizar relatório.');
        }
    });
});