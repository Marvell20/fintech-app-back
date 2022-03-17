const express = require('express');
const oracledb = require('oracledb');
const getdb = require('../db');
const route = express.Router()

route.get('/:cardNum', async (req, res) => {
    let connection;
    try {
      connection = await getdb();
      const {cardNum} = req.params;
  
      result = await connection.execute(
        `
        BEGIN
          pck_cards.read_card(:cardNum, :cardId, :cardCvv, :cardExpDate, :cardCustomerId, :cardTypeId);
        END;
        `,
        { 
            cardNum:cardNum,
            cardId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            cardCvv: { type: oracledb.DB_TYPE_VARCHAR, dir: oracledb.BIND_OUT },
            cardExpDate: { type: oracledb.DB_TYPE_DATE, dir: oracledb.BIND_OUT },
            cardCustomerId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
            cardTypeId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        },
        { autoCommit: true}
        );
  
        res.send(200,{
          status:true,
          message:"OK",
          result: result.outBinds
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

route.post('/create', async(req, res) => {
let connection;
    try {
    connection = await getdb();
    const {cardNum, cardCvv, cardExpDate, cardCustomerId, cardTypeId} = req.body;
    
    const sql = `
        BEGIN
        pck_cards.create_card(:cardNum, :cardCvv, :cardExpDate, :cardCustomerId, :cardTypeId);
        END;
    `;
    
    await connection.execute(
        sql,
        {
        cardNum: cardNum,
        cardCvv: cardCvv,
        cardExpDate: cardExpDate,
        cardCustomerId: cardCustomerId,
        cardTypeId: cardTypeId
        },
        { autoCommit: true}
    );

    res.send(200,{
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

route.patch('/update/:cardId', async(req, res) => {
let connection;
    try {
    connection = await getdb();
    const {cardNum, cardCvv, cardExpDate, cardCustomerId, cardTypeId} = req.body;
    const {cardId} = req.params;
    const sql = `
        BEGIN
        pck_cards.update_card(:cardId, :cardNum, :cardCvv, :cardExpDate, :cardCustomerId, :cardTypeId);
        END;
    `;
    
    await connection.execute(
        sql,
        {
        cardId:cardId,
        cardNum: cardNum,
        cardCvv: cardCvv,
        cardExpDate: cardExpDate,
        cardCustomerId: cardCustomerId,
        cardTypeId: cardTypeId
        },
        { autoCommit: true}
    );

    res.send(200,{
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

route.delete('/delete/:cardNum', async(req, res) => {
    let connection;
        try {
        connection = await getdb();
        const {cardNum} = req.params;
        const sql = `
            BEGIN
            pck_cards.delete_card(:cardNum);
            END;
        `;
        
        await connection.execute(
            sql,
            {
            cardNum: cardNum,
            },
            { autoCommit: true}
        );
    
        res.send(200,{
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