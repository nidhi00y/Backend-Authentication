import app from './src/app.js'
import dbconnect from './src/config/db.js'

dbconnect()

app.listen(8080,()=>{
    console.log("Server started")
})
