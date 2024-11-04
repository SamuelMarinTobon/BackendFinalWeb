import { getConnection } from '../database/database.js';

const obtenerMovimientos = async (req, res) => {
  try {
    const { numeroCuenta } = req.body; 
    const connection = await getConnection();

    const consultaMovimientos = `
    SELECT 
      DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha, 
      tipo, 
      monto, 
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

//console.log('Probando función verMovimientos');
// transferencias.js
const verMovimientos = async (req, res) => {
    try {
      const { numeroCuenta } = req.body;
      const connection = await getConnection();
  
      const consultaMovimientos = `
        SELECT 
          tipo, 
          SUM(monto) AS total 
        FROM transacciones 
        WHERE numero_cuenta = ? 
        GROUP BY tipo
      `;
      
      const [resultado] = await connection.query(consultaMovimientos, [numeroCuenta]);
      
      const ingresos = resultado.find(r => r.tipo === 'Ingreso')?.total || 0;
      const egresos = resultado.find(r => r.tipo === 'Egreso')?.total || 0;
      const balance = ingresos - egresos;
    
      //console.log('Balance en backend:', balance);

      res.json({ success: true, balance });
    } catch (err) {
      console.log(err);
      res.json({ success: false, message: 'Error al obtener movimientos' });
    }
  };
  

export const metodosTransacciones = {
  obtenerMovimientos,verMovimientos,
};
