const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nerdamer = require("nerdamer/all.min");
var cors = require('cors');

const neo4j = require('neo4j-driver');
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "SIBI_LIVE"));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));

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
            res.sendStatus(200);
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
    "MERGE (p)-[:DESIRES]->(s:Song {title: 'Desired Song " + usuario + 
    "'}) ON CREATE SET s.genre='keep', s.energy=" + 0;

    const resultPromise = session.run(query);
    resultPromise
        .then(result =>{
            res.sendStatus(200);
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

app.post("/obtenerPeticion", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (p:Person)-[:WAS_ASKED]->(s:Song) WHERE p.user='" + usuario + 
    "' RETURN s.id, s.title, s.artist";

    const resultPromise = session.run(query);
    resultPromise
        .then(result =>{
            if(result.records.length == 0){
                res.json({msg: 'Vacio'});
            }else{
                var cancion = {
                    id: result.records[0]._fields[0],
                    titulo: result.records[0]._fields[1],
                    artista: result.records[0]._fields[2]
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

app.post("/actualizarPetición", function(req, res) {
    var usuario = req.body.usuario;
    var idCancion = req.body.idCancion;

    const session = driver.session();

    var query = "MATCH (p:Person {user:'"+ usuario + "'}) MATCH (s:Song {id:" + idCancion + "}) MERGE (p)-[:WAS_ASKED]->(s)"

    const resultPromise = session.run(query);
    resultPromise
        .then(response => res.sendStatus(200))
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
        .then(response => res.sendStatus(200))
        .catch( error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/eliminarPeticion", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (p:Person {user:'" + usuario + "'})-[r:WAS_ASKED]->() DELETE r";

    const resultPromise = session.run(query);
    resultPromise
        .then(response => res.sendStatus(200))
        .catch(error => {
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
        .then(response => res.sendStatus(200))
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/establecerEnergia", function(req, res) {
    var usuario = req.body.usuario;
    var energia = req.body.energia;

    const session = driver.session();

    var query = "MATCH (s:Song {title: 'Desired Song " + usuario + "'}) SET s.energy=" + energia;

    const resultPromise = session.run(query);
    resultPromise
        .then(response => res.sendStatus(200))
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/obtenerEnergia", function(req, res) {
    var usuario = req.body.usuario;
    var energy = {value: 0};

    const session = driver.session();

    var query = "MATCH (p:Person {user:'" + usuario + "'})-[:DESIRES]->(s:Song) RETURN toFloat(p.timeBegin), toFloat(p.timeEnd)";

    const resultPromise = session.run(query);
    resultPromise
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(result => {
            var momentoActual = new Date().getTime();
            var momentoInicio =  result.records[0]._fields[0];
            var momentoFin = result.records[0]._fields[1];

            var ecuacion = nerdamer.solveEquations([(momentoInicio + 'a + b = 0'),(momentoFin + 'a + b = 1')]).toString();
            var a = parseFloat(ecuacion.split(',')[1]);
            var b = parseFloat(ecuacion.split(',')[3]);

            var momentoNormalizado = momentoActual*a + b;
            energy = {value: (240*momentoNormalizado) - (240*momentoNormalizado*momentoNormalizado) + 30};
            
            const anotherSession = driver.session();
            var secondQuery = "MATCH (p:Person {user:'" + usuario + "'})-[:DESIRES]->(s:Song) SET s.energy=" + energy.value;

            const secondResultPromise = anotherSession.run(secondQuery);
            secondResultPromise
                .catch(error => {
                    res.json({msg: 'Error'});
                    console.log(error);
                })
                .then(() => session.close());

            res.send(energy);
        })
        .then(() => session.close());

});

app.post("/establecerFechasInicioYFin", function(req, res) {
    var usuario = req.body.usuario;
    var momentoInicio = req.body.momentoInicio;
    var momentoFin = req.body.momentoFin;

    const session = driver.session();

    var query = "MATCH (p:Person {user: '" + usuario + "'}) SET p.timeBegin=" + momentoInicio + ", p.timeEnd=" + momentoFin;

    const resultPromise = session.run(query);
    resultPromise
        .then(result => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => session.close());

});

app.post("/establecerGenero", function(req, res) {
    var usuario = req.body.usuario;
    var genero = req.body.genero;

    const session = driver.session();

    var query = "MATCH (s:Song {title: 'Desired Song " + usuario + "'}) SET s.genre='" + genero + "'";

    const resultPromise = session.run(query);
    resultPromise
        .then(response => res.sendStatus(200))
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => {
            session.close();
        });
});

app.post("/obtenerGenero", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (s:Song {title: 'Desired Song " + usuario + "'}) RETURN s.genre";

    const resultPromise = session.run(query);
    resultPromise
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(result => {
            var genero = result.records[0]._fields[0];
            res.send(genero);
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