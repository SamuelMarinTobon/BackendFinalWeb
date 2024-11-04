import { getConnection } from '../database/database.js';

const depositarDinero = async (req, res) => {
  try {
    const { numeroCuenta, monto } = req.body;
    const connection = await getConnection();

    if (monto <= 0) {
      return res.json({ success: false, message: 'El monto a depositar debe ser mayor que cero' });
    }

    const actualizarSaldo = `UPDATE usuarios SET saldo = saldo + ${monto} WHERE numero_cuenta = '${numeroCuenta}'`;
    await connection.query(actualizarSaldo);

    const registrarTransaccion = `
      INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha) 
      VALUES ('${numeroCuenta}', 'depósito', ${monto}, NOW())`;
    await connection.query(registrarTransaccion);

    res.json({ success: true, message: 'Depósito realizado con éxito' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la solicitud de depósito' });
  }
};

export const metodosDeposito = {
  depositarDinero,
};