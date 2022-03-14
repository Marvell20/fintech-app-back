const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/all', async (req, res) => {
    let connection;
    try {
      connection = await getdb();
      result = await connection.execute(
        `SELECT * FROM CUSTOMERS`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      res.send({
        status:true,
        message:"OK",
        result: result.rows
      })

    } catch (err) {
      res.send(404,{
        status:false,
        message:"Ocurrio un error",
        err: err.message
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.send(500,err);
        }
      }
    }
})

route.get('/:docnum', async (req, res) => {
  let connection;
  try {
    connection = await getdb();
    const {docnum} = req.params;
    
    result = await connection.execute(
        `
        BEGIN
          pck_customers.read_customer(:docnum, :fs_name, :fs_surname, :phone, :doc_num, :doc_type);
        END;`,
        { 
          docnum: docnum,
          fs_name: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          fs_surname: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          phone: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          doc_num: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          doc_type: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true}
      );

      res.send({
        status:true,
        message:"OK",
        result: result.outBinds
      })

  } catch (err) {
    res.send(404,{
      status:false,
      message:"Ocurrio un error",
      err: err.message
    })
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        res.send(500,err);
      }
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
      res.send(404,{
        status:false,
        message:"Ocurrio un error",
        err: err.message
      })
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          res.send(500,err)
        }
      }
    }
})
module.exports = route;