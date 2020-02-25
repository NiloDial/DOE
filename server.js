const express = require("express")
const server = express()


server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))


//configure a conexão.
const Pool = require('pg').Pool
const db = new Pool({
    user: '',
    password: '',
    host: '',
    port: 5432,
    database: ''
})


const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


server.get("/", function(req, res){
    
    db.query("SELECT * FROM donors", function(err, results){
        if (err) return res.send("Erro de banco de dados.")
        const donors = results.rows
        return res.render("index.html", { donors })
    })

})

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") { 
        return res.send("todos os campos são obrigatórios!")
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    const values = [name, email, blood] 
    
    db.query(query, values, function(err){
        if (err) return res.send("erro no banco de dados.")

        return res.redirect("/")
    })

})

server.listen(3000, function() {
    console.log("iniciei o servidor")
})  