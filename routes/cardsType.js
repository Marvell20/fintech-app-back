const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/all', async (req, res) => {
    let connection;
    try {
      connection = await getdb();
  
      result = await connection.execute(
        `SELECT * FROM CARDTYPES`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT });
  
        res.send(200,{
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
module.exports = route;