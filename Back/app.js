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

app.post("/crearNodoDeseo", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (p:Person {user: '" + usuario + "'})" +
    "MERGE (p)-[:DESIRES]->(s:Song {title: 'Desired Song " + usuario + "'})";

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
                res.json({msg: 'Correcto'});
            }
        })
        .catch( error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/obtenerUltimaReproduccion", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (p:Person)-[:LAST_PLAYED]-(s:Song) WHERE p.user='" + usuario + 
    "' RETURN s.id, s.title, s.artist, toInteger(s.bpm), s.genre, s.cover, s.preview";

    const resultPromise = session.run(query);
    resultPromise
        .then(result =>{
            if(result.records.length == 0){
                res.json({msg: 'Vacio'});
            }else{
                var cancion = {
                    id: result.records[0]._fields[0],
                    titulo: result.records[0]._fields[1],
                    artista: result.records[0]._fields[2],
                    bpm: result.records[0]._fields[3].low,
                    genero: result.records[0]._fields[4],
                    cover: result.records[0]._fields[5],
                    preview: result.records[0]._fields[6]
                };

                res.send(cancion);
            }
        })
        .catch( error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/actualizarUltimaReproduccion", function(req, res) {
    var usuario = req.body.usuario;
    var idCancion = req.body.idCancion;

    const session = driver.session();

    query = "MATCH (p:Person {user: '" + usuario + "'}) MATCH (s:Song {id: " + idCancion + "}) MERGE (p)-[:LAST_PLAYED]->(s)";

    const resultPromise = session.run(query);
    resultPromise
        .catch( error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/eliminarUltimaReproduccion", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (p:Person {user:'" + usuario + "'})-[r:LAST_PLAYED]->() DELETE r";

    const resultPromise = session.run(query);
    resultPromise
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/buscar", function(req, res) {
    var termino = req.body.termino;

    const session = driver.session();

    var query = "MATCH (s:Song) WHERE toLower(s.title) CONTAINS '" + termino + 
    "' OR toLower(s.artist) CONTAINS '" + termino + "' RETURN s.id, s.title, s.artist, toInteger(s.bpm), s.genre, s.cover, s.preview LIMIT 5";

    const resultPromise = session.run(query);
    resultPromise
        .then(result =>{
            if(result.records.length == 0){
                res.json({msg: 'Vacio'});
            }else{
                var respuesta = [];

                for(var i=0; i<result.records.length; i++){
                    var cancion = {
                        id: result.records[i]._fields[0],
                        titulo: result.records[i]._fields[1],
                        artista: result.records[i]._fields[2],
                        bpm: result.records[i]._fields[3].low,
                        genero: result.records[i]._fields[4],
                        cover: result.records[i]._fields[5],
                        preview: result.records[i]._fields[6]
                    };
    
                    respuesta.push(cancion);
                }

                res.send(respuesta);
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