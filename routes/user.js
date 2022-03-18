const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/all', async (req, res) => {
    let connection;
    let result;
    try {
      connection = await getdb();
      result = await connection.execute(
        `SELECT * FROM CUSTOMERS`,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

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

route.get('/:userDocNum', async (req, res) => {
  let connection;
  try {
    connection = await getdb();
    const {userDocNum} = req.params;
    
    result = await connection.execute(
        `
        BEGIN
          pck_customers.read_customer(:userDocNum, :userId, :userName, :userLastN, :userPhone, :userDocType, :v_error);
        END;
        `,
        { 
          userDocNum: userDocNum,
          userId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
          userName: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          userLastN: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          userPhone: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          userDocType: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
          v_error: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true}
      );

      if (result.outBinds.v_error === null) {
        res.send(200,{
            status:true,
            message:"OK",
            result: result.outBinds
        })
      } else {
        res.send(400,{
            status:false,
            message:"Ocurrio un error",
            result: result.outBinds.v_error
        })
      }

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
  let result;
    try {
      connection = await getdb();
      const {userName, userLastN, userDocNum, userPhone, userDocType} = req.body;
      
      const sql = `
        BEGIN
          pck_customers.create_customer(:userName, :userLastN, :userPhone, :userDocNum, :userDocType, :v_error);
        END;
      `;
      
      result = await connection.execute(
        sql,
        {
          userName: userName,
          userLastN: userLastN,
          userPhone: userPhone,
          userDocNum: userDocNum,
          userDocType: userDocType,
          v_error: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true}
      );

      if (result.outBinds.v_error === null) {
        res.send(200,{
            status:true,
            message:"OK"
        })
      } else {
        res.send(400,{
            status:false,
            message:"Ocurrio un error",
            result: result.outBinds.v_error
        })
      }

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

route.patch('/update/:userId', async(req, res) => {
  let connection;
  let result;
    try {
      connection = await getdb();
      const {userName, userLastN, userPhone, userDocNum, userDocType} = req.body;
      const {userId} = req.params;
      
      const sql = `
        BEGIN
          pck_customers.update_customer(:userId, :userName, :userLastN, :userPhone, :userDocNum, :userDocType, :v_error, :v_rows_affected);
        END;
      `;
      
      result = await connection.execute(
        sql,
        {
          userId:userId,
          userName: userName,
          userLastN: userLastN,
          userPhone: userPhone,
          userDocNum: userDocNum,
          userDocType: userDocType,
          v_error: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
          v_rows_affected: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true}
      );

      if (result.outBinds.v_error === null && result.outBinds.v_rows_affected > 0) {
        res.send(200,{
            status:true,
            message:"OK"
        })
      } else {
        res.send(400,{
            status:false,
            message:"Ocurrio un error y no se pudo actualizar el usuario",
            result: {v_error:result.outBinds.v_error,v_rows_affected:result.outBinds.v_rows_affected}
        })
      }

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

route.delete('/delete/:userDocNum', async(req, res) => {
  let connection;
  let result;
    try {
      connection = await getdb();
      const {userDocNum} = req.params;
      
      const sql = `
        BEGIN
          pck_customers.delete_customer(:userDocNum, :v_rows_affected);
        END;
      `;
      
      result = await connection.execute(
        sql,
        {
          userDocNum: userDocNum,
          v_rows_affected: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true}
      );

      if (result.outBinds.v_rows_affected > 0) {
        res.send(200,{
            status:true,
            message:"OK"
        })
      } else {
        res.send(400,{
            status:false,
            message:"No existe el usuario que desea eliminar",
            result: result.outBinds.v_error
        })
      }

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