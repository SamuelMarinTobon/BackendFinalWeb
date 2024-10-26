import { Router } from 'express';
import { methodsallinfo } from '../controllers/banco.controllers.js';
import cors from 'cors';

const router = Router();

router.get('/banco', cors({ origin: 'http://localhost:8081' }), methodsallinfo.getBancoall);
router.post('/login', cors({ origin: 'http://localhost:8081' }), methodsallinfo.loginUser);
router.post('/registro', cors({ origin: 'http://localhost:8081' }), methodsallinfo.registroUsuario);
router.post('/transferir', cors({ origin: 'http://localhost:8081' }), methodsallinfo.transferir);

export default router;
