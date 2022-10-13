const express = require('express');
const app = express();
const users = require('./routes/user');
const items = require('./routes/items');
const reimbursement = require('./routes/reimbursement')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/users', users);
app.use('/api/items', items);
app.use('/api/reimbursement', reimbursement)

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log("Listening in port " + port + ".....")})