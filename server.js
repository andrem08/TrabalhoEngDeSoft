import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));


const port = 3000;

mongoose.connect('mongodb://localhost:27017/usuarios', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
    Nome: String,
    Senha: String,
    Tipo: String,
    nUsp: String,
    Email: String,
    Telefone: String,
    RG: String,
    LocalNascimento: String,
    Nacionalidade: String,
    Curso: String,
    Orientador: String,
    LinkLattes: String,
    DataMatricula: String,
    DataAprovacaoExameQualificacao: String,
    DataAprovacaoExameProfLingua: String,
    DataLimiteDepositoTrabalhoFinal: String,
    DisciplinasCursadasAprovadas: [String],
    DisciplinasCursadasReprovadas: [String]
});

const reportSchema = new mongoose.Schema({
    idAluno: mongoose.Schema.Types.ObjectId,
    estadoDoRelatorio: String,
    nomeAluno: String,
    nomeOrientador: String,
    numeroUSP: String,
    linkLattes: String,
    dataAtualizacaoLattes: String,
    curso: String,
    dataIngresso: String,
    resultadoUltimoRelatorio: String,
    aprovacoesDisciplinas: String,
    reprovacoesDisciplinas: String,
    reprovacoesInicio: String,
    exameProficiencia: String,
    exameQualificacao: String,
    prazoInscricao: String,
    prazoDissertacao: String,
    artigosEscrita: String,
    artigosEmAvaliacao: String,
    artigosAceitos: String,
    atividadesEventos: String,
    resumoAtividades: String,
    declaracaoAdicional: String,
    dificuldades: String,
    segundoRelatorio: { type: Boolean, default: false },
    avaliadoPeloOrientador: { type: Boolean, default: false },
    avaliadoPelaCCP: { type: Boolean, default: false }
});

const evaluationSchema = new mongoose.Schema({
    nomeParecerista: String,
    papel: String,
    nomeAlunoAvaliado: String,
    parecer: String,
    desempenho: String
});

const User = mongoose.model('usuarios', userSchema);
const Report = mongoose.model('relatorios', reportSchema);
const Evaluation = mongoose.model('avaliacoes', evaluationSchema);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


//Esta rota é para criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para verificar se o usuário existe
//dado o nome, senha e tipo
app.post('/check-user', async (req, res) => {
    try {
        const { Nome, Senha, Tipo } = req.body;
        const user = await User.findOne({ Nome, Senha, Tipo });
        if (user) {
            res.json({ _id: user._id });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para buscar um usuário dado o id
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para adicionar um novo relatório
app.post('/reports', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        console.error('Error saving report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para buscar todos os relatórios dado o nome do orientador
//ou o tipo de usuário (ccp ou docente) e o estado do relatório
// nao pode ser insatisfatorio
app.get('/reports', async (req, res) => {
    try {
        const { nomeOrientador, userType } = req.query;
        let reports = [];
        if (userType === 'ccp') {
            reports = await Report.find({
                avaliadoPeloOrientador: true,
                avaliadoPelaCCP: false,
                estadoDoRelatorio: { $in: ['adequado', 'adequado com ressalvas'] }
            });
        } else {
            reports = await Report.find({ nomeOrientador, avaliadoPeloOrientador: false, estadoDoRelatorio: { $in: ['pendente', 'adequado', 'adequado com ressalvas'] } });
        }
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para buscar todos os relatórios dado o nome do aluno
app.get('/reportsByAluno/:nomeAluno', async (req, res) => {
    try {
        const { nomeAluno } = req.params;
        const reports = await Report.find({ nomeAluno });
        res.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para buscar todos os relatórios dado o nome do aluno
// e o estado do relatório
app.post('/reportsId', async (req, res) => {
    try {
        const { id, userType, parecer } = req.body; 

        const updateField = userType === 'docente' ? { avaliadoPeloOrientador: true, estadoDoRelatorio: parecer } : { avaliadoPelaCCP: true, estadoDoRelatorio: parecer };

        const updatedReport = await Report.findByIdAndUpdate(
            id,
            { $set: updateField },
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/reports/:nomeAluno', async (req, res) => {
    try {
        const { nomeAluno } = req.params;
        const updatedReport = await Report.findOneAndUpdate(
            { nomeAluno },
            { $set: { avaliadoPeloOrientador: true } },
            { new: true }
        );
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(updatedReport);
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para buscar um relatório dado o id
app.get('/reports/:id', async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (report) {
            res.json(report);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para atualizar um relatório dado o id
// e os novos dados do relatório
app.put('/reports/:id', async (req, res) => {
    try {
        const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (updatedReport) {
            res.json(updatedReport);
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        console.error('Error updating report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//Esta rota é para criar uma nova avaliação
app.post('/evaluations', async (req, res) => {
    try {
        const newEvaluation = new Evaluation(req.body);
        await newEvaluation.save();
        res.status(201).json(newEvaluation);
    } catch (error) {
        console.error('Error saving evaluation:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//Esta rota é para buscar todas as avaliações dado o nome do aluno avaliado
app.get('/evaluationsByAluno/:nomeAlunoAvaliado', async (req, res) => {
    try {
        const { nomeAlunoAvaliado } = req.params;
        const evaluations = await Evaluation.find({ nomeAlunoAvaliado });
        console.log('evaluations', evaluations);
        res.json(evaluations);
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
