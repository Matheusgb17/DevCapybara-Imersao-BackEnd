import express from "express"; 
import multer from "multer"; 
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizaNovoPost } from "../controllers/postsController.js"; 

const corsOptions = {
    origin: "http://localhost:8000", 
    optionsSuccessStatus: 200
}

// Configuração do armazenamento para os uploads
const storage = multer.diskStorage({
    // Define o diretório de destino onde os arquivos serão salvos
        destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Salva os arquivos na pasta "uploads"
    },
    // Define o nome do arquivo que será salvo
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Mantém o nome original do arquivo
    }
});

// Cria a instância do multer com as configurações de armazenamento definidas
const upload = multer({ storage : storage });

// Define as rotas do aplicativo
const routes = (app) => {
  // Configura o middleware para interpretar requisições com JSON
  app.use(express.json());

  app.use(cors(cors.corsOptions));

  // Rota GET para listar os posts
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post
  app.post("/posts", postarNovoPost);

  // Rota POST para fazer upload de uma imagem
  // "upload.single('imagem')" processa um único arquivo enviado com o nome do campo "imagem"
  app.post("/upload", upload.single("imagem"), uploadImagem); 

  app.put("/upload/:id", atualizaNovoPost);
};

export default routes;
