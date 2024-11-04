import { getConnection } from '../database/database.js';

const retirarDinero = async (req, res) => {
  try {
    const { numeroCuenta, monto } = req.body;
    const connection = await getConnection();

    const consultaSaldo = `SELECT saldo FROM usuarios WHERE numero_cuenta = '${numeroCuenta}'`;
    const [resultadoSaldo] = await connection.query(consultaSaldo);

    if (resultadoSaldo[0].saldo < monto) {
      return res.json({ success: false, message: 'Saldo insuficiente' });
    }
    const actualizarSaldo = `UPDATE usuarios SET saldo = saldo - ${monto} WHERE numero_cuenta = '${numeroCuenta}'`;
    await connection.query(actualizarSaldo);

    const registrarTransaccion = `
      INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha) 
      VALUES ('${numeroCuenta}', 'retiro', ${monto}, NOW())`;
    await connection.query(registrarTransaccion);

    res.json({ success: true, message: 'Retiro realizado con éxito' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la solicitud de retiro' });
  }
};

export const metodosRetiro = {
  retirarDinero,
};