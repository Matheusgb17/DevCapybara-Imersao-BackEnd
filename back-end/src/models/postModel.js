// Importa a função para conectar ao banco de dados
import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Estabelece uma conexão com o banco de dados utilizando a string de conexão das variáveis de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função para buscar todos os posts na coleção "posts"
export async function getTodosPosts() {
    // Acessa o banco de dados chamado "imersao-instabyte"
    const db = conexao.db("imersao-instabyte");
    // Acessa a coleção "posts" dentro do banco
    const colecao = db.collection("posts");

    // Retorna todos os documentos da coleção como um array
    return colecao.find().toArray();
}

// Função para criar um novo post na coleção "posts"
export async function createPost(novoPost) {
    const db = conexao.db("imersao-instabyte");
    const colecao = db.collection("posts");

    // Insere o novo post como um documento na coleção e retorna o resultado da operação
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("imersao-instabyte");
    const colecao = db.collection("posts");
    const objId = ObjectId.createFromHexString(id);

    // Insere o novo post como um documento na coleção e retorna o resultado da operação
    return colecao.updateOne({_id: new ObjectId(objId)}, {$set: novoPost});
}
