import cors from 'cors';
import { Router } from 'express';
import { methodsallinfo } from '../controllers/banco.controllers.js';
import { metodosPrestamos } from '../controllers/prestamos.js';
import { metodosUsuario } from '../controllers/usuarios.js';
import { metodosTrasferencias } from '../controllers/transferencias.js';


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

//Retiro
router.post('/retirar', cors({ origin: 'http://localhost:5173' }), metodosRetiro.retirarDinero);

//Depósito
router.post('/depositar', cors({ origin: 'http://localhost:5173' }), metodosDeposito.depositarDinero);

//Histórico de Ingresos
router.post('/historico_ingresos', cors({ origin: 'http://localhost:5173' }), metodosHistorico.obtenerHistoricoIngresos);
export default router;
