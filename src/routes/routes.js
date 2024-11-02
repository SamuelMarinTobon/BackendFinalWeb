import { Router } from 'express';
import { methodsallinfo } from '../controllers/banco.controllers.js';
import { metodosUsuario } from '../controllers/usuarios.js';
import cors from 'cors';

const router = Router();

router.get('/banco', cors({ origin: 'http://localhost:8081' }), methodsallinfo.getBancoall);

//usuario
router.post('/login', cors({ origin: 'http://localhost:8081' }), metodosUsuario.loginUser);
router.post('/registro', cors({ origin: 'http://localhost:8081' }), metodosUsuario.registroUsuario);
router.post('/transferir', cors({ origin: 'http://localhost:8081' }), metodosUsuario.transferir);

export default router;
