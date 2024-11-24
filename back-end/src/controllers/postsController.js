import { getTodosPosts, createPost, atualizarPost } from "../models/postModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Controlador para listar todos os posts
export async function listarPosts(req, res) {
    // Busca todos os posts no banco de dados
    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

// Controlador para criar um novo post
export async function postarNovoPost(req, res) {
    // Recebe os dados do corpo da requisição
    const novoPost = req.body;

    // Tenta criar o novo post
    try {
        // Salva o novo post no banco de dados
        const postCriado = await createPost(novoPost);
        res.status(200).json(postCriado); 
    } catch (erro) {
        // Caso ocorra algum erro, loga a mensagem no console
        console.error(erro.message);
        res.status(500).json({ "Erro:": "Falha de requisição" });
    }
}

// Controlador para upload de uma imagem associada a um post
export async function uploadImagem(req, res) {
    // Cria um novo objeto de post com os detalhes da imagem
    const novoPost = {
        descricao: "", 
        imgUrl: req.file.originalname, 
        alt: ""
    };

    try {
        // Insere o novo post no banco de dados
        const postCriado = await createPost(novoPost);
        const imgAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Move e renomeia a imagem no sistema de arquivos com o ID gerado
        fs.renameSync(req.file.path, imgAtualizada);
        res.status(200).json(postCriado);  
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

export async function atualizaNovoPost(req, res){
    // Recebe os dados do corpo da requisição
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    // Tenta criar o novo post
    try {
        // Salva o novo post no banco de dados
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);

        const postAtt = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        
        const postCriado = await atualizarPost(id, postAtt);
        res.status(200).json(postCriado); 
    } catch (erro) {
        // Caso ocorra algum erro, loga a mensagem no console
        console.error(erro.message);
        res.status(500).json({ "Erro:": "Falha de requisição" });
    }
}
