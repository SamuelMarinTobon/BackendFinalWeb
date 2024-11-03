import { getConnection } from '../database/database.js';


const transferir = async (req, res) => {
  try {
    const { numeroCuentaOrigen, numeroCuentaDestino, monto } = req.body;
    const connection = await getConnection();

    const cuentaDestino = `SELECT saldo FROM usuarios WHERE numero_cuenta = '${numeroCuentaDestino}'`;
    const [resultadoCuentaDestino] = await connection.query(cuentaDestino);
    if (resultadoCuentaDestino.length === 0) {
      return res.json({ succes: false, message: 'La cuenta de destino no existe' });
    }

    const saldoOrigen = `SELECT saldo FROM usuarios WHERE numero_cuenta = '${numeroCuentaOrigen}'`;
    const [resultadoSaldoOrigen] = await connection.query(saldoOrigen);
    if (resultadoSaldoOrigen[0].saldo < monto) {
      return res.json({ succes: false, message: 'Saldo insuficiente' });
    }

    const actualizarOrigen = `UPDATE usuarios SET saldo = saldo - ${monto} WHERE numero_cuenta = '${numeroCuentaOrigen}'`;
    await connection.query(actualizarOrigen);

    const actualizarDestino = `UPDATE usuarios SET saldo = saldo + ${monto} WHERE numero_cuenta = '${numeroCuentaDestino}'`;
    await connection.query(actualizarDestino);

    const registrarTransaccion = `
  INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha, numero_cuenta_destino) 
  VALUES ('${numeroCuentaOrigen}', 'transferencia', ${monto}, NOW(), '${numeroCuentaDestino}')
`;
    try {
      await connection.query(registrarTransaccion);
    } catch (error) {
      console.error('Error al registrar la transacción:', error);
    }

    res.json({ success: true, message: 'Transferencia realizada' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la transferencia' });
  }
};



export const metodosTrasferencias = {
  transferir,
};