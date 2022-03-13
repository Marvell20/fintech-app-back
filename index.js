const express = require('express')
const app = express();
const port = 8081;
const cors = require('cors')
const bodyParser = require('body-parser');


//Rutas
const user = require('./routes/user.js');
const documentsType = require('./routes/documentsType.js')

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/user', user);
app.use('/documents-type', documentsType)


app.listen(port, () => console.log("listening on port %s!", port))
  
  