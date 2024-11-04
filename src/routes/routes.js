import cors from 'cors';
import { Router } from 'express';
import { methodsallinfo } from '../controllers/banco.controllers.js';
import { metodosPrestamos } from '../controllers/prestamos.js';
import { metodosUsuario } from '../controllers/usuarios.js';
import { metodosTrasferencias } from '../controllers/transferencias.js';
import { metodosTransacciones } from '../controllers/transacciones.js';


const router = Router();

router.get('/banco', cors({ origin: 'http://localhost:5173' }), methodsallinfo.getBancoall);

//usuario
router.post('/login', cors({ origin: 'http://localhost:5173' }), metodosUsuario.loginUser);
router.post('/registro', cors({ origin: 'http://localhost:5173' }), metodosUsuario.registroUsuario);

//transferencias
router.post('/transferir', cors({ origin: 'http://localhost:5173' }), metodosTrasferencias.transferir);

//prestamos
router.post('/solicitar_prestamo', cors({ origin: 'http://localhost:5173' }), metodosPrestamos.solicitarPrestamo);
router.post('/ver_prestamos', cors({ origin: 'http://localhost:5173' }), metodosPrestamos.verPrestamos);
router.post('/pagar_prestamo', cors({ origin: 'http://localhost:5173' }), metodosPrestamos.pagarPrestamo);

//transacciones
router.post('/movimientos', cors({ origin: 'http://localhost:5173' }), metodosTransacciones.obtenerMovimientos);
router.post('/balance', cors({ origin: 'http://localhost:5173' }), metodosTransacciones.verMovimientos);



export default router;
