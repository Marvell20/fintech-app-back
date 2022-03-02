const user = require('./routes/user.js');
const express = require('express')
// const oracledb = require('oracledb');
const app = express();
const port = 3000;

app.use('/user', user);

//   app.get('/usuario',function (req, res){
//       let id = req.query.id;
//       if (isNaN(id)){
//           res.send('Query param id is not number')
//           return
//       }
//       selectUsersById(req, res, id);
//   })

app.listen(port, () => console.log("listening on port %s!", port))
  