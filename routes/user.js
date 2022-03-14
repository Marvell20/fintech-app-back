const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/all', async (req, res) => {
    let connection;
    try {
      connection = await getdb();
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
      if (result?.rows?.length == 0) {
          return res.send('query send no rows');
      } else {
          return res.send(result?.rows);
      }
    }
})

route.get('/:docnum', async (req, res) => {
  let connection;
  try {
    connection = await getdb();
    const {docnum} = req.params;
    
    console.log(docnum);
    result = await connection.execute(
      `
      BEGIN
        read_customer(:docnum, :datos);
      END;`,
      { 
        docnum: { val: docnum, dir: oracledb.BIND_IN },
        datos: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
      });
      console.log(result);
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
    if (result?.rows?.length == 0) {
        return res.send('query send no rows');
    } else {
        return res.send(result?.rows);
    }
  }
})

route.post('/create', async(req, res) => {
  let connection;
    try {
      connection = await getdb();
      const {userName, userLastN, userDocNum, userPhone, userDocType} = req.body;
      
      const sql = `INSERT INTO USUARIOS(nombres, apellidos, cedula, telefono, tipo_de_documentos_id) values(:nombres, :apellidos, :cedula, :telefono, :doc_id)`;
      
      await connection.execute(
        sql,
        {
          nombres: userName,
          apellidos: userLastN,
          cedula: userDocNum,
          telefono: userPhone,
          doc_id: userDocType
        },
        { autoCommit: true}
      );

      res.send({
        status:true,
        message:"OK"
      })

    } catch (err) {
      res.send({
        status:true,
        message:"OK",
        err
      })
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.send(err)
        }
      }
    }
})
module.exports = route;