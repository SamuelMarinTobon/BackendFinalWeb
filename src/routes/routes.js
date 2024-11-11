import cors from 'cors';
import { Router } from 'express';
import { methodsallinfo } from '../controllers/banco.controllers.js';
import { metodosDeposito } from '../controllers/depositar.js';
/*import { metodosHistorico } from '../controllers/historico-ingresos.js';*/
import { metodosPrestamos } from '../controllers/prestamos.js';
import { metodosRetiro } from '../controllers/retiros.js';
import { metodosTransacciones } from '../controllers/transacciones.js';
import { metodosTrasferencias } from '../controllers/transferencias.js';
import { metodosUsuario } from '../controllers/usuarios.js';

const router = Router();

router.get('/banco', cors({ origin: 'http://localhost:5173' }), methodsallinfo.getBancoall);

//usuario
router.post('/login', cors({ origin: 'http://localhost:5173' }), metodosUsuario.loginUser);
router.post('/registro', cors({ origin: 'http://localhost:5173' }), metodosUsuario.registroUsuario);
router.post('/saldo', cors({ origin: 'http://localhost:5173' }), metodosUsuario.saldo);

//transferencias
router.post('/transferir', cors({ origin: 'http://localhost:5173' }), metodosTrasferencias.transferir);
router.post('/retirar', cors({ origin: 'http://localhost:5173' }), metodosRetiro.retirarDinero);
router.post('/depositar', cors({ origin: 'http://localhost:5173' }), metodosDeposito.depositarDinero);

//prestamos
router.post('/solicitar_prestamo', cors({ origin: 'http://localhost:5173' }), metodosPrestamos.solicitarPrestamo);
router.post('/ver_prestamos', cors({ origin: 'http://localhost:5173' }), metodosPrestamos.verPrestamos);
router.post('/pagar_prestamo', cors({ origin: 'http://localhost:5173' }), metodosPrestamos.pagarPrestamo);

//reportes
router.post('/movimientos', cors({ origin: 'http://localhost:5173' }), metodosTransacciones.obtenerMovimientos);
router.post('/balance', cors({ origin: 'http://localhost:5173' }), metodosTransacciones.verMovimientos);

//Histórico de Ingresos
/*router.post('/historico_ingresos', cors({ origin: 'http://localhost:5173' }),metodosHistorico.obtenerHistoricoIngresos);*/

export default router;
