const express = require('express')
const app = express();
const port = 8081;
const cors = require('cors')
const bodyParser = require('body-parser');


//Rutas
const user = require('./routes/user.js');
const card = require('./routes/card.js');
const documentsType = require('./routes/documentsType.js');
const cardsType = require('./routes/cardsType.js');


app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/user', user);
app.use('/card', card);
app.use('/documents-type', documentsType);
app.use('/cards-type', cardsType);

app.listen(port, () => console.log("listening on port %s!", port))
  
  