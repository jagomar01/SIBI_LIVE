const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "SIBI_LIVE"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false} ));

app.post("/registro", function(req, res) {
    var nombre = req.body.nombre;
    var email = req.body.email;
    var usuario = req.body.usuario;
    var password = req.body.password;

    const session = driver.session();

    var query = "CREATE (p:Person {name:'" + nombre + "', email:'" + email + 
    "', user:'" + usuario + "', password:'" + password + "'})";

    const resultPromise = session.run(query);
    resultPromise
        .then(result =>{
            res.json({msg: 'Correcto'});
        })
        .catch( error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/login", function(req, res) {
    var usuario = req.body.usuario;
    var password = req.body.password;

    const session = driver.session();

    var query = "MATCH (p:Person) WHERE p.user='" + usuario + "' AND p.password='" + password + "' RETURN p";

    const resultPromise = session.run(query);
    resultPromise
        .then(result =>{
            if(result.records.length == 0){
                res.json({msg: 'Incorrecto'});
            }else{
                /*Mayor tratamiento: devolver ultima canción reproducida*/
                res.json({msg: 'Correcto'});
            }
        })
        .catch( error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.listen(3000, function() {
    console.log("Backend escuchando en el puerto 3000");
})