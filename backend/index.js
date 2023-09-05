const connectToMongo=require('./db');
var cors=require("cors")


connectToMongo();
const express = require('express')
const app = express()
const port = 8890

app.use(cors())
app.use(express.json())

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotes app listening at http://127.0.0.1:${port}`)
})