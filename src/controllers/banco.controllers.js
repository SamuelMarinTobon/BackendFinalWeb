import { query } from 'express';
import { getConnection } from '../database/database.js';
//parte logica y manejar la base de datos


const getBancoall = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('select * from usuarios');
    res.json(result[0]);
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const {email,password } = req.body;
    const connection = await getConnection();

    const query = 'SELECT * FROM usuarios WHERE email = ?';
const [result] = await connection.query(query, [email]);


    if (result.length > 0) {
      const user = result[0];
      if (user.contraseña === password) {
        const userInfo = {
          nombre: user.nombre,
          tipo: user.tipo,
          numero_cuenta:user.numero_cuenta,
          saldo:user.saldo,
        };
        const trasferenciaQuery = 'SELECT * FROM transacciones WHERE numero_cuenta = ?';
        const trasferencia = await connection.query(trasferenciaQuery, [user.numero_cuenta]);

        res.json({ success: true, message: 'Login exitoso', user: userInfo, transacciones: trasferencia });
      } else {
        res.json({ success: false, message: 'Contraseña incorrecta' });
      }
    } else {
      res.json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.log(err);
  }
  
};

const registroUsuario = async (req, res) => {
  try {
    const { telefono, nombre, email, contraseña, tipocuenta, saldo } = req.body;
    const connection = await getConnection();

    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [result] = await connection.query(query, [email]);


    if (result.length > 0) {
      return res.json({ message: 'email ya esta registrado' });
    }
   

    const queryInsert = `
      INSERT INTO usuarios (numero_cuenta, nombre, email, contraseña, tipo, saldo) 
      VALUES (?, ?, ?, ?, ?, 0)
    `;
    await connection.query(queryInsert, [telefono, nombre, email, contraseña, tipocuenta]);

    res.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err); 
    res.status(500).json({ message: 'Error al registrar el usuario', error: err.message }); 
  }
};

const transferir = async (req, res) => {
  try {
    const { numeroCuentaOrigen, numeroCuentaDestino, monto } = req.body;
    const connection = await getConnection();

    const cuentaDestino = 'SELECT saldo FROM usuarios WHERE numero_cuenta = ?';
    const [resultadoCuentaDestino] = await connection.query(cuentaDestino, [numeroCuentaDestino]);
    if (resultadoCuentaDestino.length === 0) {
      return res.json({ succes: false, message: 'La cuenta de destino no existe' });
    }

    
    const saldoOrigen = `SELECT saldo FROM usuarios WHERE numero_cuenta = ?`;
    const [resultadoSaldoOrigen] = await connection.query(saldoOrigen, [numeroCuentaOrigen]);
    if (resultadoSaldoOrigen[0].saldo <= monto) {
      return res.json({ succes: false, message: 'Saldo insuficiente' });
    }

    const actualizarOrigen = 'UPDATE usuarios SET saldo = saldo - ? WHERE numero_cuenta = ?';
    await connection.query(actualizarOrigen, [monto, numeroCuentaOrigen]);

    const actualizarDestino = 'UPDATE usuarios SET saldo = saldo + ? WHERE numero_cuenta = ?';
    await connection.query(actualizarDestino, [monto, numeroCuentaDestino]);


    console.log('Número de cuenta origen:', numeroCuentaOrigen);
    const registrarTransaccion = `INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha, numero_cuenta_destino) 
    VALUES (?, 'transferencia', ?, NOW(), ?)`;
    try {
      await connection.query(registrarTransaccion, [numeroCuentaOrigen, monto, numeroCuentaDestino]);
    } catch (error) {
      console.error('Error al registrar la transacción:', error);
      return res.json({ success: false, message: 'Error al registrar la transacción' });
    }

    res.json({ success: true, message: 'Transferencia realizada' });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la transferencia' });
  }

};


export const methodsallinfo = {
  getBancoall,
  loginUser,
  registroUsuario,
  transferir,
};
