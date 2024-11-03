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
    SELECT prestamo_id, monto, plazo, cuota_mensual, estado, fecha_solicitud 
      FROM prestamos 
      WHERE numero_cuenta = '${numeroCuenta}' AND estado = 'aprobado'`;
    const [resultado] = await connection.query(consultarPrestamos);

    res.json({ success: true, prestamos: resultado });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en obtener prestamos' });
  }
};

const pagarPrestamo = async (req, res) => {
  try {
    const { idPrestamo, numeroCuenta, tipoPago } = req.body;
    const connection = await getConnection();

    const consultaSaldo = `SELECT saldo FROM usuarios WHERE numero_cuenta = '${numeroCuenta}'`;
    const [resultadoSaldo] = await connection.query(consultaSaldo);

    if (resultadoSaldo[0].saldo <= 0) {
      return res.json({ success: false, message: 'Saldo insuficiente' });
    }

    const consultaPrestamo = `SELECT monto, cuota_mensual FROM prestamos 
    WHERE prestamo_id = '${idPrestamo}' AND estado = 'aprobado'`;
    const [resultadoPrestamo] = await connection.query(consultaPrestamo);

    if (!resultadoPrestamo.length) {
      return res.json({ success: false, message: 'el prestamo no exixte o ya fue cancelado' });
    }
    
    const cuotaMensual=resultadoPrestamo[0].cuota_mensual;

    let montoApagar;

    if(tipoPago=='total'){
      montoApagar = resultadoPrestamo[0].monto;
    } else{
      montoApagar = cuotaMensual;
    }

    if (resultadoSaldo[0].saldo < montoApagar) {
      return res.json({ success: false, message: 'Saldo insuficiente' });
    }

    const actualizarSaldo = `UPDATE usuarios SET saldo = saldo - ${montoApagar} WHERE numero_cuenta = '${numeroCuenta}'`;
    await connection.query(actualizarSaldo);


    const registrarTransaccion = `INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha) 
  VALUES ('${numeroCuenta}', 'pago prestamo', ${montoApagar}, NOW())`;
    await connection.query(registrarTransaccion);

    const nuevoMonto = resultadoPrestamo[0].monto - montoApagar;

    if (nuevoMonto <= 0) {
      await connection.query(`UPDATE prestamos SET estado = 'cancelado', monto = 0 WHERE prestamo_id = '${idPrestamo}'`);
    } else {
      await connection.query(
        `UPDATE prestamos SET monto = ${nuevoMonto} WHERE prestamo_id = '${idPrestamo}' AND estado = 'aprobado'`
      );
    }

    res.json({ success: true, message: 'Pago realizado con exito' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la solicitud de prestamo' });
  }
};

export const metodosPrestamos = {
  solicitarPrestamo,
  verPrestamos,
  pagarPrestamo,
};
