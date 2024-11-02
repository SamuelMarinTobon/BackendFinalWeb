import { getConnection } from '../database/database.js';

const solicitarPrestamo = async (req, res) => {
  try {
    const { numeroCuenta, monto, plazo } = req.body;
    const connection = await getConnection();


    const actualizarSaldo = `UPDATE usuarios SET saldo = saldo + ${monto} WHERE numero_cuenta = '${numeroCuenta}'`;
    await connection.query(actualizarSaldo);

    const registrarPrestamo = `
      INSERT INTO prestamos (numero_cuenta, monto, monto_inicial, plazo, cuota_mensual, estado, fecha_solicitud) 
      VALUES ('${numeroCuenta}', ${monto}, ${monto}, ${plazo}, ${monto / plazo}, 'aprobado', NOW())`;
    await connection.query(registrarPrestamo);

    const registrarTransaccion = `
  INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha) 
  VALUES ('${numeroCuenta}', 'desembolso prestamo', ${monto}, NOW())`;
    await connection.query(registrarTransaccion);

    res.json({ success: true, message: 'Prestamo registrado' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la solicitud de prestamo' });
  }
};

const verPrestamos = async (req, res) => {
  try {
    const { numeroCuenta } = req.body;
    const connection = await getConnection();

    const consultarPrestamos = `
    SELECT id, monto, plazo, cuota_mensual, estado, fecha_solicitud 
      FROM prestamos 
      WHERE numero_cuenta = '${numeroCuenta}' AND estado = 'aprobado'`;
    const [resultado] = await connection.query(consultarPrestamos);


    res.json({ success: true, prestamos: resultado });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en obtener prestamos' });
  }
};



export const metodosPrestamos = {
  solicitarPrestamo,
  verPrestamos,
};