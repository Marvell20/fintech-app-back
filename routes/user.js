const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/all', async (req, res) => {
    let connection;
    try {
      connection = await getdb();
      console.log("Successfully connected to Oracle Database");
  
      result = await connection.execute(
        `SELECT * FROM usuarios`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT });
  
    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
      if (result.rows.length == 0) {
          return res.send('query send no rows');
      } else {
          return res.send(result.rows);
      }
    }
})

route.post('/create', async(req, res) => {
  let connection;
    try {
      connection = await getdb();
      const {nombres, apellidos, cedula, telefono, doc_id} = req.body;
      
      const sql = `INSERT INTO USUARIOS(nombres, apellidos, cedula, telefono, tipo_de_documentos_id) values(:nombres, :apellidos, :cedula, :telefono, :doc_id)`;
      
      await connection.execute(
        sql,
        {
          nombres: nombres,
          apellidos: apellidos,
          cedula: cedula,
          telefono: telefono,
          doc_id: doc_id
        },
        { autoCommit: true}
      );

      res.send(req.body)

    } catch (err) {
      console.error(err);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
        }
      }
    }
})
module.exports = route;