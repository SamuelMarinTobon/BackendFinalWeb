import { getConnection } from '../database/database.js';

const obtenerMovimientos = async (req, res) => {
  try {
    const { numeroCuenta } = req.body; 
    const connection = await getConnection();

    const consultaMovimientos = `
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha, 
        tipo, 
        CAST(monto AS DECIMAL(10, 2)) AS monto,  
        numero_cuenta_destino 
      FROM transacciones
      WHERE numero_cuenta = ? 
      ORDER BY fecha DESC
    `;
    const [movimientos] = await connection.query(consultaMovimientos, [numeroCuenta]);

    res.json({ success: true, movimientos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error al obtener movimientos' });
  }
};

const verMovimientos = async (req, res) => {
  try {
    const { numeroCuenta } = req.body;
    const connection = await getConnection();

    const consultaMovimientos = `
      SELECT 
        tipo, 
        SUM(CAST(monto AS DECIMAL(10, 2))) AS total  
      FROM transacciones 
      WHERE numero_cuenta = ? 
      GROUP BY tipo
    `;

    const [resultado] = await connection.query(consultaMovimientos, [numeroCuenta]);

    const ingresos = parseFloat(resultado.find(r => r.tipo === 'Ingreso')?.total || 0);
    const egresos = parseFloat(resultado.find(r => r.tipo === 'Egreso')?.total || 0);
    const transferencias = parseFloat(resultado.find(r => r.tipo === 'Transferencia')?.total || 0);
    const balance = ingresos - egresos - transferencias;

    res.json({ success: true, balance });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error al obtener movimientos' });
  }
};


export const metodosTransacciones = {
  obtenerMovimientos,verMovimientos,
};
