document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitButton = document.getElementById('submitButton');

    const fields = {
        numeroUSP: document.getElementById('numeroUSP'),
        nomeCompleto: document.getElementById('nomeCompleto'),
        email: document.getElementById('email'),
        rg: document.getElementById('rg'),
        telefone: document.getElementById('telefone')
    };

    const errors = {
        numeroUSP: document.getElementById('numeroUSPError'),
        nomeCompleto: document.getElementById('nomeCompletoError'),
        email: document.getElementById('emailError'),
        rg: document.getElementById('rgError')
    };

    const validaRG = rg => {
        if (!/^\d{8}[0-9Xx]$/.test(rg)) return false;
        let soma = 0, cont = 9;
        for (let i = 0; i < 8; i++) soma += parseInt(rg[i]) * cont--;
        let dv = soma % 11;
        return (dv === 10 && rg[rg.length - 1].toUpperCase() === 'X') || parseInt(rg[rg.length - 1]) === dv;
    };

    form.addEventListener('input', () => {
        const ignoreFields = ['disciplinasReprovadas', 'disciplinasAprovadas', 'dataAprovacaoProf', 'dataAprovacaoQualificacao'];
        submitButton.disabled = ![...form.querySelectorAll('input[required], select[required], textarea[required]')]
            .filter(input => !ignoreFields.includes(input.id))
            .every(input => input.value.trim());
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();

        let valid = true;
        const validations = {
            numeroUSP: /^\d+$/.test(fields.numeroUSP.value),
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value),
            rg: validaRG(fields.rg.value)
        };

        for (let key in validations) {
            if (!validations[key]) {
                errors[key].textContent = `Invalid ${key}`;
                valid = false;
            } else {
                errors[key].textContent = '';
            }
        }

        if (valid) {
            const userData = {
                nUsp: fields.numeroUSP.value,
                Tipo: 'aluno',
                Nome: fields.nomeCompleto.value,
                Email: fields.email.value,
                dataNascimento: document.getElementById('dataNascimento').value,
                Senha: document.getElementById('senha').value,
                RG: fields.rg.value,
                LocalNascimento: document.getElementById('localNascimento').value,
                Nacionalidade: document.getElementById('nacionalidade').value,
                Telefone: fields.telefone.value,
                Curso: document.getElementById('curso').value,
                Orientador: document.getElementById('orientador').value,
                LinkLattes: document.getElementById('linkLattes').value,
                DataMatricula: document.getElementById('dataMatricula').value,
                DataAprovacaoExameQualificacao: document.getElementById('dataAprovacaoQualificacao').value || null,
                DataAprovacaoExameProfLingua: document.getElementById('dataAprovacaoProf').value || null,
                DataLimiteDepositoTrabalhoFinal: document.getElementById('dataDepositoFinal').value,
                DisciplinasCursadasAprovadas: document.getElementById('disciplinasAprovadas').value ? document.getElementById('disciplinasAprovadas').value.split(',').map(item => item.trim()) : [],
                DisciplinasCursadasReprovadas: document.getElementById('disciplinasReprovadas').value ? document.getElementById('disciplinasReprovadas').value.split(',').map(item => item.trim()) : []
            };

            try {
                const response = await fetch('http://localhost:3000/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const newUser = await response.json();
                sessionStorage.setItem('userId', newUser._id);
                window.location.href = '../dashboard/dashboard.html';
            } catch (error) {
                console.error('Error adding user:', error);
            }
        }
    });
});