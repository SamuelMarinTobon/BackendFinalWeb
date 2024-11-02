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



export const methodsallinfo = {
  getBancoall,
};
