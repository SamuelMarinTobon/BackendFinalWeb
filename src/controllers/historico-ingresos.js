/*import { getConnection } from '../database/database.js';

const obtenerHistoricoIngresos = async (req, res) => {
  try {
    const { numeroCuenta } = req.body;
    const connection = await getConnection();

    const consultarIngresos = `
      SELECT tipo, monto, fecha 
      FROM transacciones 
      WHERE numero_cuenta = '${numeroCuenta}' AND tipo = 'depósito' 
      ORDER BY fecha DESC`;
    const [resultado] = await connection.query(consultarIngresos);

    res.json({ success: true, ingresos: resultado });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error al obtener el histórico de ingresos' });
  }
};

export const metodosHistorico = {
  obtenerHistoricoIngresos,
};*/