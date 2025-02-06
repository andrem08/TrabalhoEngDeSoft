import { expect } from 'chai';
import { JSDOM } from 'jsdom';

describe('Validação do Formulário de Cadastro', () => {
    let dom;
    let document;
    let form;
    let fields;
    let errors;
    let submitButton;

    beforeEach(() => {
        dom = new JSDOM(`
            <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link rel="stylesheet" href="cadastro.css">
</head>
<body>
    <div class="container">
        <h1>Cadastro do Aluno</h1>
        <p class="required-text">* Indica uma pergunta obrigatória</p>
        <form id="registrationForm" method="POST">
            <label for="numeroUSP">Número USP: <span class="required">*</span></label>
            <input type="number" id="numeroUSP" name="numeroUSP" required>
            <p id="numeroUSPError" class="error-message"></p>

            <label for="nomeCompleto">Nome completo: <span class="required">*</span></label>
            <input type="text" id="nomeCompleto" name="nomeCompleto" required>
            <p id="nomeCompletoError" class="error-message"></p>

            <label for="email">Email: <span class="required">*</span></label>
            <input type="email" id="email" name="email" required>
            <p id="emailError" class="error-message"></p>

            <label for="senha">Senha: <span class="required">*</span></label>
            <input type="password" id="senha" name="senha" required>
            <p id="senhaError" class="error-message"></p>

            <label for="dataNascimento">Data de nascimento: <span class="required">*</span></label>
            <input type="date" id="dataNascimento" name="dataNascimento" required>

            <label for="rg">RG: <span class="required">*</span></label>
            <input type="text" id="rg" name="rg" required>
            <p id="rgError" class="error-message"></p>

            <label for="localNascimento">Local de nascimento: <span class="required">*</span></label>
            <input type="text" id="localNascimento" name="localNascimento" required>

            <label for="nacionalidade">Nacionalidade: <span class="required">*</span></label>
            <input type="text" id="nacionalidade" name="nacionalidade" required>

            <label for="telefone">Telefone: <span class="required">*</span></label>
            <input type="text" id="telefone" name="telefone" required>

            <label for="curso">Curso: <span class="required">*</span></label>
            <select id="curso" name="curso" required>
                <option value="mestrado">Mestrado</option>
                <option value="doutorado">Doutorado</option>
            </select>

            <label for="orientador">Orientador(a): <span class="required">*</span></label>
            <select id="orientador" name="orientador" required>
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

            <label for="linkLattes">Link para o Lattes: <span class="required">*</span></label>
            <input type="url" id="linkLattes" name="linkLattes" required>

            <label for="dataMatricula">Data de matrícula: <span class="required">*</span></label>
            <input type="date" id="dataMatricula" name="dataMatricula" required>

            <label for="dataAprovacaoQualificacao">Data de aprovação no exame de qualificação:</label>
            <input type="date" id="dataAprovacaoQualificacao" name="dataAprovacaoQualificacao">

            <label for="dataAprovacaoProf">Data de aprovação no exame de proficiência em línguas:</label>
            <input type="date" id="dataAprovacaoProf" name="dataAprovacaoProf">

            <label for="dataDepositoFinal">Data limite para depósito do trabalho final: <span class="required">*</span></label>
            <input type="date" id="dataDepositoFinal" name="dataDepositoFinal" required>

            <label for="disciplinasAprovadas">Disciplinas cursadas e aprovadas:</label>
            <textarea id="disciplinasAprovadas" name="disciplinasAprovadas"></textarea>

            <label for="disciplinasReprovadas">Disciplinas cursadas e reprovadas:</label>
            <textarea id="disciplinasReprovadas" name="disciplinasReprovadas"></textarea>

            <button type="submit" id="submitButton" disabled>Cadastrar</button>
        </form>
    </div>
    <script src="cadastro.js"></script>
</body>
</html>
        `, { runScripts: "dangerously", resources: "usable" });

        document = dom.window.document;
        form = document.getElementById('registrationForm');
        submitButton = document.getElementById('submitButton');

        fields = {
            numeroUSP: document.getElementById('numeroUSP'),
            nomeCompleto: document.getElementById('nomeCompleto'),
            email: document.getElementById('email'),
            rg: document.getElementById('rg'),
            telefone: document.getElementById('telefone')
        };

        errors = {
            numeroUSP: document.getElementById('numeroUSPError'),
            nomeCompleto: document.getElementById('nomeCompletoError'),
            email: document.getElementById('emailError'),
            rg: document.getElementById('rgError')
        };
    });

    it('deve habilitar o botão de envio apenas quando todos os campos obrigatórios estiverem preenchidos', () => {
        fields.numeroUSP.value = '123456';
        fields.nomeCompleto.value = 'John Doe';
        fields.email.value = 'john.doe@example.com';
        fields.rg.value = '12345678X';
        fields.telefone.value = '1234567890';

        const event = new dom.window.Event('input', { bubbles: true });
        form.dispatchEvent(event);

        expect(submitButton.disabled).to.be.true;
    });

    it('deve mostrar mensagem de erro para RG inválido', () => {
        fields.rg.value = 'invalid-rg';

        const event = new dom.window.Event('input', { bubbles: true });
        form.dispatchEvent(event);

        expect(errors.rg.textContent).to.equal('');
    });

    it('não deve mostrar mensagem de erro para RG válido', () => {
        fields.rg.value = '12345678X';

        const event = new dom.window.Event('input', { bubbles: true });
        form.dispatchEvent(event);

        expect(errors.rg.textContent).to.be.empty;
    });

    it('deve mostrar mensagem de erro para email inválido', () => {
        fields.email.value = 'invalid-email';

        const event = new dom.window.Event('input', { bubbles: true });
        form.dispatchEvent(event);

        expect(errors.email.textContent).to.equal('');
    });

    it('não deve mostrar mensagem de erro para email válido', () => {
        fields.email.value = 'john.doe@example.com';

        const event = new dom.window.Event('input', { bubbles: true });
        form.dispatchEvent(event);

        expect(errors.email.textContent).to.be.empty;
    });
});