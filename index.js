const user = require('./routes/user.js');
const express = require('express')
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/user', user);


app.listen(port, () => console.log("listening on port %s!", port))
  