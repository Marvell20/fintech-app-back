const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/:cardNum', async (req, res) => {
    let connection;
    let result;
    try {
      connection = await getdb();
      const {cardNum} = req.params;
  
      result = await connection.execute(
        `
        BEGIN
          pck_cards.read_card(:cardNum, :cardId, :cardCvv, :cardExpDate, :cardCustomerId, :cardTypeId, :v_error);
        END;
        `,
        { 
            cardNum:cardNum,
            cardId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            cardCvv: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
            cardExpDate: { type: oracledb.DB_TYPE_DATE, dir: oracledb.BIND_OUT },
            cardCustomerId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            cardTypeId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
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

route.post('/create', async(req, res) => {
let connection;
let result;
    try {
    connection = await getdb();
    const {cardNum, cardCvv, cardExpDate, cardCustomerId, cardTypeId} = req.body;
    console.log(cardNum, cardCvv, cardExpDate, cardCustomerId, cardTypeId)
    const sql = `
        BEGIN
        pck_cards.create_card(:cardNum, :cardCvv, :cardExpDate, :cardCustomerId, :cardTypeId, :v_error);
        END;
    `;
    
    result = await connection.execute(
        sql,
        {
        cardNum: cardNum,
        cardCvv: cardCvv,
        cardExpDate: cardExpDate,
        cardCustomerId: cardCustomerId,
        cardTypeId: cardTypeId,
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
        console.log(err)
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

route.patch('/update/:cardId', async(req, res) => {
let connection;
let result;
    try {
    connection = await getdb();
    const {cardNum, cardCvv, cardExpDate, cardCustomerId, cardTypeId} = req.body;
    const {cardId} = req.params;
    const sql = `
        BEGIN
        pck_cards.update_card(:cardId, :cardNum, :cardCvv, :cardExpDate, :cardCustomerId, :cardTypeId, :v_error, :v_rows_affected);
        END;
    `;
    
    result = await connection.execute(
        sql,
        {
        cardId:cardId,
        cardNum: cardNum,
        cardCvv: cardCvv,
        cardExpDate: cardExpDate,
        cardCustomerId: cardCustomerId,
        cardTypeId: cardTypeId,
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
            message:"Ocurrio un error y no se pudo actualizar la tarjeta",
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

route.delete('/delete/:cardNum', async(req, res) => {
    let connection;
    let result;
        try {
        connection = await getdb();
        const {cardNum} = req.params;
        const sql = `
            BEGIN
            pck_cards.delete_card(:cardNum, :v_rows_affected);
            END;
        `;
        
        result = await connection.execute(
            sql,
            {
            cardNum: cardNum,
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
                message:"No existe la tarjeta que desea eliminar",
                result: {v_rows_affected:result.outBinds.v_rows_affected}
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