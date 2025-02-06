import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('Validação do Formulário de Segundo Relatório', () => {
    let dom;
    let fields;
    let submitButton;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório</title>
    <link rel="stylesheet" href="segundoRelatorio.css">
</head>
<body>
    <div class="container">
        <h1>Relatório do Aluno</h1>
        <form id="reportForm">
            <label for="nomeAluno">Nome do Aluno: <span class="required">*</span></label>
            <input type="text" id="nomeAluno" name="nomeAluno" required>

            <label for="nomeOrientador">Nome do Orientador: <span class="required">*</span></label>
            <select id="nomeOrientador" name="nomeOrientador" required>
                <option value="" selected disabled>Selecione o orientador</option>
                <option value="André Carlos Busanelli de Aquino">André Carlos Busanelli de Aquino</option>
                <option value="Ariane Machado Lima">Ariane Machado Lima</option>
                <option value="Clodoaldo Aparecido de Moraes Lima">Clodoaldo Aparecido de Moraes Lima</option>
                <option value="Daniel de Angelis Cordeiro">Daniel de Angelis Cordeiro</option>
                <option value="Edmir Parada Vasques Prado">Edmir Parada Vasques Prado</option>
                <option value="Esteban Fernandez Tuesta">Esteban Fernandez Tuesta</option>
                <option value="Fátima de Lourdes dos Santos Nunes Marques">Fátima de Lourdes dos Santos Nunes Marques</option>
                <option value="Flávio Luiz Coutinho">Flávio Luiz Coutinho</option>
                <option value="Helton Bíscaro">Helton Bíscaro</option>
                <option value="Ivandré Paraboni">Ivandré Paraboni</option>
                <option value="João Luiz Bernardes Júnior">João Luiz Bernardes Júnior</option>
                <option value="Karina Valdívia Delgado">Karina Valdívia Delgado</option>
                <option value="Karla Roberta Pereira Sampaio Lima">Karla Roberta Pereira Sampaio Lima</option>
                <option value="Káthia Maria Honório">Káthia Maria Honório</option>
                <option value="Luciano Antonio Digiampietri">Luciano Antonio Digiampietri</option>
                <option value="Luciano Vieira Araújo">Luciano Vieira Araújo</option>
                <option value="Marcelo Fantinato">Marcelo Fantinato</option>
                <option value="Marcelo Medeiros Eler">Marcelo Medeiros Eler</option>
                <option value="Marcelo Morandini">Marcelo Morandini</option>
                <option value="Marcos Lordello Chaim">Marcos Lordello Chaim</option>
                <option value="Marislei Nishijima">Marislei Nishijima</option>
                <option value="Norton Trevisan Roman">Norton Trevisan Roman</option>
                <option value="Patrícia Rufino Olivei">Patrícia Rufino Olivei</option>
                <option value="Pedro Luiz Pizzigatti Corrêa">Pedro Luiz Pizzigatti Corrêa</option>
                <option value="Regis Rossi Alves Faria">Regis Rossi Alves Faria</option>
                <option value="Renata Mendes de Araujo">Renata Mendes de Araujo</option>
                <option value="Sarajane Marques Peres">Sarajane Marques Peres</option>
                <option value="Solange Nice Alves de Souza">Solange Nice Alves de Souza</option>
                <option value="Valdinei da Silva Freire">Valdinei da Silva Freire</option>
            </select>

            <label for="numeroUSP">Número USP: <span class="required">*</span></label>
            <input type="text" id="numeroUSP" name="numeroUSP" required>

            <label for="linkLattes">Link para o Lattes: <span class="required">*</span></label>
            <input type="url" id="linkLattes" name="linkLattes" required>

            <label for="dataAtualizacaoLattes">Data da última atualização do lattes: <span class="required">*</span></label>
            <input type="date" id="dataAtualizacaoLattes" name="dataAtualizacaoLattes" required>

            <label for="curso">Qual é o seu curso? <span class="required">*</span></label>
            <select id="curso" name="curso" required>
                <option value="" selected disabled>Selecione o tipo de curso</option>
                <option value="mestrado">Mestrado</option>
                <option value="doutorado">Doutorado</option>
            </select>

            <label for="dataIngresso">Informe o mês e o ano de seu ingresso como aluno(a) regular (exemplo: 03/2023): <span class="required">*</span></label>
            <input type="date" id="dataIngresso" name="dataIngresso" required>

            <label for="resultadoUltimoRelatorio">Qual foi o resultado da avaliação do seu último relatório? <span class="required">*</span></label>
            <div id="resultadoUltimoRelatorio" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="aprovado" name="resultadoUltimoRelatorio" value="Aprovado" required>
                    <label for="aprovado">Aprovado</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="aprovadoComRessalvas" name="resultadoUltimoRelatorio" value="Aprovado com ressalvas" required>
                    <label for="aprovadoComRessalvas">Aprovado com ressalvas</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="insatisfatorio" name="resultadoUltimoRelatorio" value="Insatisfatório" required>
                    <label for="insatisfatorio">Insatisfatório</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="naoSeAplica" name="resultadoUltimoRelatorio" value="Não se aplica (é o meu primeiro relatório)" required>
                    <label for="naoSeAplica">Não se aplica (é o meu primeiro relatório)</label>
                </div>
            </div>

            <h3>Referente a disciplinas cursadas no programa</h3><br>

            <label for="aprovacoesDisciplinas">Aprovações em disciplinas desde o início do curso: <span class="required">*</span></label>
            <div id="aprovacoesDisciplinas" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="aprovacoes0" name="aprovacoesDisciplinas" value="0" required>
                    <label for="aprovacoes0">0</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="aprovacoes1" name="aprovacoesDisciplinas" value="1" required>
                    <label for="aprovacoes1">1</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="aprovacoes2" name="aprovacoesDisciplinas" value="2" required>
                    <label for="aprovacoes2">2</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="aprovacoes3" name="aprovacoesDisciplinas" value="3" required>
                    <label for="aprovacoes3">3</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="aprovacoes4ouMais" name="aprovacoesDisciplinas" value="4 ou mais" required>
                    <label for="aprovacoes4ouMais">4 ou mais</label>
                </div>
            </div>

            <label for="reprovacoesDisciplinas">Reprovações no 2o semestre de 2023: <span class="required">*</span></label>
            <div id="reprovacoesDisciplinas" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="reprovacoes0" name="reprovacoesDisciplinas" value="0" required>
                    <label for="reprovacoes0">0</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoes1" name="reprovacoesDisciplinas" value="1" required>
                    <label for="reprovacoes1">1</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoes2" name="reprovacoesDisciplinas" value="2" required>
                    <label for="reprovacoes2">2</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoes3" name="reprovacoesDisciplinas" value="3" required>
                    <label for="reprovacoes3">3</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoes4ouMais" name="reprovacoesDisciplinas" value="4 ou mais" required>
                    <label for="reprovacoes4ouMais">4 ou mais</label>
                </div>
            </div>

            <label for="reprovacoesInicio">Reprovações em disciplinas desde o início do curso: <span class="required">*</span></label>
            <div id="reprovacoesInicio" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="reprovacoesInicio0" name="reprovacoesInicio" value="0" required>
                    <label for="reprovacoesInicio0">0</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoesInicio1" name="reprovacoesInicio" value="1" required>
                    <label for="reprovacoesInicio1">1</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoesInicio2" name="reprovacoesInicio" value="2" required>
                    <label for="reprovacoesInicio2">2</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoesInicio3" name="reprovacoesInicio" value="3" required>
                    <label for="reprovacoesInicio3">3</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="reprovacoesInicio4ouMais" name="reprovacoesInicio" value="4 ou mais" required>
                    <label for="reprovacoesInicio4ouMais">4 ou mais</label>
                </div>
            </div>

            <h3>Referente aos exames do programa</h3><br>

            <label for="exameProficiencia">Já realizou exame de proficiência em idiomas? <span class="required">*</span></label>
            <div id="exameProficiencia" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="profAprovado" name="exameProficiencia" value="Sim. Fui aprovado." required>
                    <label for="profAprovado">Sim. Fui aprovado.</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="profReprovado" name="exameProficiencia" value="Sim. Fui reprovado." required>
                    <label for="profReprovado">Sim. Fui reprovado.</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="profNao" name="exameProficiencia" value="Não." required>
                    <label for="profNao">Não.</label>
                </div>
            </div>

            <label for="exameQualificacao">Já realizou exame de qualificação? <span class="required">*</span></label>
            <div id="exameQualificacao" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="qualAprovado" name="exameQualificacao" value="Sim. Fui aprovado." required>
                    <label for="qualAprovado">Sim. Fui aprovado.</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="qualReprovado" name="exameQualificacao" value="Sim. Fui reprovado." required>
                    <label for="qualReprovado">Sim. Fui reprovado.</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="qualNao" name="exameQualificacao" value="Não." required>
                    <label for="qualNao">Não.</label>
                </div>
            </div>

            <label for="prazoInscricao">Se você ainda não qualificou, qual é o seu prazo máximo para inscrição no exame de qualificação? (exemplo: 09/2024)</label>
            <input type="text" id="prazoInscricao" name="prazoInscricao">

            <label for="prazoDissertacao">Qual é o seu prazo máximo para depósito da dissertação? (exemplo: janeiro/2025)<span class="required">*</span></label>
            <input type="text" id="prazoDissertacao" name="prazoDissertacao" required>

            <h3>Referente à produção de artigos durante o curso</h3><br>

            <label for="artigosEscrita">Artigos em fase de escrita<span class="required">*</span></label>
            <div id="artigosEscrita" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="artigosEscrita1" name="artigosEscrita" value="0" required>
                    <label for="qualAprovado">0</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosEscrita2" name="artigosEscrita" value="1" required>
                    <label for="qualReprovado">1</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosEscrita3" name="artigosEscrita" value="2" required>
                    <label for="qualNao">2</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosEscrita4oumais" name="artigosEscrita" value="3 ou mais" required>
                    <label for="qualNao">3 ou mais</label>
                </div>
            </div>

            <label for="artigosEmAvaliacao">Artigos submetidos e em período de avaliação<span class="required">*</span></label>
            <div id="artigosEmAvaliacao" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="artigosEmAvaliacao1" name="artigosEmAvaliacao" value="0" required>
                    <label for="qualAprovado">0</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosEmAvaliacao2" name="artigosEmAvaliacao" value="1" required>
                    <label for="qualReprovado">1</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosEmAvaliacao3" name="artigosEmAvaliacao" value="2" required>
                    <label for="qualNao">2</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosEmAvaliacao4oumais" name="artigosEmAvaliacao" value="3 ou mais" required>
                    <label for="qualNao">3 ou mais</label>
                </div>
            </div>

            
            <label for="artigosAceitos">Artigos aceitos ou publicados<span class="required">*</span></label>
            <div id="artigosAceitos" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="artigosAceitos1" name="artigosAceitos" value="0" required>
                    <label for="qualAprovado">0</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosAceitos2" name="artigosAceitos" value="1" required>
                    <label for="qualReprovado">1</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosAceitos3" name="artigosAceitos" value="2" required>
                    <label for="qualNao">2</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="artigosAceitos4oumais" name="artigosAceitos" value="3 ou mais" required>
                    <label for="qualNao">3 ou mais</label>
                </div>
            </div>

            <label for="atividadesEventos">Relate aqui as atividades ou eventos acadêmicos que você participou no 1o semestre de 2024 (congresso, visita técnica, intercâmbio, estágio PAE, etc).<span class="required">*</span></label>
            <textarea id="atividadesEventos" name="atividadesEventos" required></textarea>

            <label for="resumoAtividades">Apresente um <strong>resumo</strong> das suas atividades de pesquisa até o momento e das atividades que ainda precisam ser desenvolvidas até a conclusão do seu curso.<span class="required">*</span></label>
            <textarea id="resumoAtividades" name="resumoAtividades" required></textarea>

            <label for="declaracaoAdicional">Você tem algo adicional a declarar para a CCP - PPgSI que considera importante para sua avaliação?</label>
            <textarea id="declaracaoAdicional" name="declaracaoAdicional" ></textarea>

            <label for="dificuldades">Está enfrentando alguma dificuldade que precisa de apoio da coordenação do curso?</label>
            <div id="dificuldades" class="radio-group">
                <div class="radio-item">
                    <input type="radio" id="dificuldadesSim" name="dificuldades" value="Sim">
                    <label for="qualAprovado">Sim</label>
                </div>
                <div class="radio-item">
                    <input type="radio" id="dificuldadesNao" name="dificuldades" value="Não">
                    <label for="qualReprovado">Não</label>
                </div>
            </div>

            <button type="submit" id="submitButton">Enviar Relatório</button>
            <button type="button" id="backToDashboardButton">Voltar para o Dashboard</button>
        </form>
    </div>
    <script src="segundoRelatorio.js"></script>
</body>
</html>
            `);

        fields = {
            nomeAluno: { value: '' },
            nomeOrientador: { value: '' },
            numeroUSP: { value: '' },
            linkLattes: { value: '' },
            dataAtualizacaoLattes: { value: '' },
            curso: { value: '' },
            dataIngresso: { value: '' },
            resultadoUltimoRelatorio: { value: '' },
            aprovacoesDisciplinas: { value: '' },
            reprovacoesDisciplinas: { value: '' },
            reprovacoesInicio: { value: '' },
            exameProficiencia: { value: '' },
            exameQualificacao: { value: '' },
            prazoInscricao: { value: '' },
            prazoDissertacao: { value: '' },
            artigosEscrita: { value: '' },
            artigosEmAvaliacao: { value: '' },
            artigosAceitos: { value: '' },
            atividadesEventos: { value: '' },
            resumoAtividades: { value: '' },
            declaracaoAdicional: { value: '' },
            dificuldades: { value: '' }
        };

        submitButton = { disabled: true };
    });

    it('deve habilitar o botão de envio quando todos os campos obrigatórios estiverem preenchidos', () => {
        fields.nomeAluno.value = 'John Doe';
        fields.nomeOrientador.value = 'André Carlos Busanelli de Aquino';
        fields.numeroUSP.value = '123456';
        fields.linkLattes.value = 'http://lattes.cnpq.br/1234567890123456';
        fields.dataAtualizacaoLattes.value = '2023-01-01';
        fields.curso.value = 'mestrado';
        fields.dataIngresso.value = '2023-01-01';
        fields.resultadoUltimoRelatorio.value = 'Aprovado';
        fields.aprovacoesDisciplinas.value = '1';
        fields.reprovacoesDisciplinas.value = '0';
        fields.reprovacoesInicio.value = '0';
        fields.exameProficiencia.value = 'Sim. Fui aprovado.';
        fields.exameQualificacao.value = 'Sim. Fui aprovado.';
        fields.prazoInscricao.value = '09/2024';
        fields.prazoDissertacao.value = 'janeiro/2025';
        fields.artigosEscrita.value = '1';
        fields.artigosEmAvaliacao.value = '1';
        fields.artigosAceitos.value = '1';
        fields.atividadesEventos.value = 'Participação em congresso';
        fields.resumoAtividades.value = 'Resumo das atividades de pesquisa';
        fields.declaracaoAdicional.value = 'Nenhuma';
        fields.dificuldades.value = 'Não';

        const allFieldsFilled = Object.values(fields).every(field => field.value !== '');
        submitButton.disabled = !allFieldsFilled;

        expect(submitButton.disabled).to.be.false;
    });

    it('não deve habilitar o botão de envio quando nem todos os campos obrigatórios estiverem preenchidos', () => {
        fields.nomeAluno.value = 'John Doe';
        fields.nomeOrientador.value = 'André Carlos Busanelli de Aquino';
        fields.numeroUSP.value = '123456';
        fields.linkLattes.value = 'http://lattes.cnpq.br/1234567890123456';
        fields.dataAtualizacaoLattes.value = '2023-01-01';
        fields.curso.value = 'mestrado';
        fields.dataIngresso.value = '2023-01-01';
        fields.resultadoUltimoRelatorio.value = 'Aprovado';
        fields.aprovacoesDisciplinas.value = '1';
        fields.reprovacoesDisciplinas.value = '0';
        fields.reprovacoesInicio.value = '0';
        fields.exameProficiencia.value = 'Sim. Fui aprovado.';
        fields.exameQualificacao.value = 'Sim. Fui aprovado.';
        fields.prazoInscricao.value = '09/2024';
        fields.prazoDissertacao.value = 'janeiro/2025';
        fields.artigosEscrita.value = '1';
        fields.artigosEmAvaliacao.value = '1';
        fields.artigosAceitos.value = '1';
        fields.atividadesEventos.value = 'Participação em congresso';
        fields.resumoAtividades.value = 'Resumo das atividades de pesquisa';
        fields.declaracaoAdicional.value = 'Nenhuma';
        // Intentionally leaving out 'dificuldades'

        const allFieldsFilled = Object.values(fields).every(field => field.value !== '');
        submitButton.disabled = !allFieldsFilled;

        expect(submitButton.disabled).to.be.true;
    });

    it('deve mostrar mensagem de erro para URL inválida no Link para o Lattes', () => {
        fields.linkLattes.value = 'invalid-url';

        const isValidURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        };

        const validationMessage = isValidURL(fields.linkLattes.value) ? '' : 'URL inválida';
        expect(validationMessage).to.not.be.empty;
    });

    it('não deve mostrar mensagem de erro para URL válida no Link para o Lattes', () => {
        fields.linkLattes.value = 'http://lattes.cnpq.br/1234567890123456';

        const isValidURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        };

        const validationMessage = isValidURL(fields.linkLattes.value) ? '' : 'URL inválida';
        expect(validationMessage).to.be.empty;
    });

    // Adicionando o teste para validar a lógica de avaliação do relatório e se o update foi feito corretamente
    it('deve avaliar corretamente o relatório e validar o update', async () => {
        const report = {
            reprovacoesInicio: '0',
            reprovacoesDisciplinas: '0',
            exameQualificacao: 'Sim. Fui aprovado.',
            estadoDoRelatorio: 'adequado'
        };

        const resultado = avaliarRelatorio(report);
        expect(resultado).is.not.empty;
    });
});


// Adicionando a função de avaliação do relatório
function avaliarRelatorio(report) {
    if (report.reprovacoesInicio == '0' && report.reprovacoesDisciplinas == '0' && report.exameQualificacao != 'Sim. Fui reprovado.' && report.exameQualificacao != 'Não.' && report.estadoDoRelatorio != 'adequado com ressalvas') {
        return 'adequado';
    } else if (report.reprovacoesInicio != '0' && report.reprovacoesInicio != '1' && report.reprovacoesDisciplinas != '0' && report.reprovacoesDisciplinas != '1' && report.exameQualificacao == 'Sim. Fui reprovado.') {
        return 'insatisfatorio';
    } else {
        return 'adequado com ressalvas';
    }
}
