import { getConnection } from '../database/database.js';

const loginUser = async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const connection = await getConnection();

    const query = `SELECT * FROM usuarios WHERE email = '${email}'`;
    const [result] = await connection.query(query);

    if (result.length > 0) {
      const user = result[0];
      if (user.contraseña === password) {
        const userInfo = {
          nombre: user.nombre,
          tipo: user.tipo,
          numero_cuenta: user.numero_cuenta,
        };

        res.json({ success: true, message: 'Login exitoso', user: userInfo });
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

const saldo = async (req, res) => {
  try {
    const { numeroCuenta } = req.body;
    const connection = await getConnection();

    const [resultado] = await connection.query(`SELECT saldo FROM usuarios WHERE numero_cuenta = '${numeroCuenta}'`);

    const saldoActual = resultado[0]?.saldo;
    res.json({ success: true, saldo: saldoActual });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: 'Error en la consulta de saldo' });
  }
};



const registroUsuario = async (req, res) => {
  try {
    const { telefono, nombre, email, contraseña, tipocuenta, saldo } = req.body;
    const connection = await getConnection();

    const queryemail = `SELECT * FROM usuarios WHERE email = '${email}'`;
    const [resultadoemail] = await connection.query(queryemail);

    if (resultadoemail.length > 0) {
      return res.json({ message: 'email ya esta registrado' });
    }

    const querytelefono = `SELECT * FROM usuarios WHERE numero_cuenta = '${telefono}'`;
    const [resultadotelefono] = await connection.query(querytelefono);

    if (resultadotelefono.length > 0) {
      return res.json({ message: 'telefono ya registrado' });
    }

    const queryInsert = `
  INSERT INTO usuarios (numero_cuenta, nombre, email, contraseña, tipo, saldo) 
  VALUES ('${telefono}', '${nombre}', '${email}', '${contraseña}', '${tipocuenta}', 0)
`;
    await connection.query(queryInsert);

    res.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.json({ message: 'Error al registrar el usuario', error: err.message });
  }
};


export const metodosUsuario = {
  loginUser,
  registroUsuario,
  saldo,
};