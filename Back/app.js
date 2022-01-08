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

app.post("/actualizarPeticion", function(req, res) {
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

    query = "MATCH (p:Person {user: '" + usuario + "'}) MATCH (s:Song {id: " + idCancion + 
    "}) MERGE (p)-[:LAST_PLAYED]->(s) MERGE (p)-[:PLAYED]->(s)";

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

app.post("/borrarHistorialReproduccion", function(req, res) {
    var usuario = req.body.usuario;

    const session = driver.session();

    var query = "MATCH (p:Person {user: '" + usuario + "'})-[r:PLAYED]->(s) WHERE NOT (p)-[:LAST_PLAYED]-(s) DELETE r";

    const resultPromise = session.run(query);
    resultPromise
        .then(result => res.sendStatus(200))
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

app.post("/obtenerRecomendaciones", function(req,res) {
    var usuario = req.body.usuario;

    const firstPhaseSession = driver.session();

    /*Fase 1: Comprobación de si existen peticiones*/
    var firstPhaseQuery = "MATCH (p:Person)-[:WAS_ASKED]->(s:Song) WHERE p.user='" + usuario + "' RETURN s";

    const firstPhaseResultPromise = firstPhaseSession.run(firstPhaseQuery);
    firstPhaseResultPromise
        .then(result => {
            /*Si no hay peticiones, se ejecuta el itinerario de recomendación basado en reproducción actual (non-petition-driven)*/
            if(result.records.length == 0){
                const secondPhaseSession = driver.session();

                /*Fase 2: obtención de información sobre la recomendación actual y los parámetros*/
                var secondPhaseQuery = "MATCH (s:Song)<-[:LAST_PLAYED]-(p:Person {user:'" + usuario + 
                                    "'})-[:DESIRES]->(d:Song) RETURN s.id, toFloat(s.bpm), s.genre, toFloat(d.energy), d.genre";

                const secondPhaseResultPromise = secondPhaseSession.run(secondPhaseQuery);
                secondPhaseResultPromise
                    .then(result => {
                        /*Si no se devuelven los 6 datos, se interrumpe el proceso*/
                        if(result.records.length == 0){
                            res.json({msg:'Incompleto'});
                        }else{
                            var idUltimo = result.records[0]._fields[0];
                            var bpmUltimo = result.records[0]._fields[1];
                            var generoUltimo = result.records[0]._fields[2];
                            var energiaPreferencia = result.records[0]._fields[3];
                            var generoPreferencia = result.records[0]._fields[4];

                            /*Fase 3: filtrado según preferencias de genero*/
                            if(generoPreferencia == 'null'){
                                /*Fase 3.a: no se ha seleecionado manterner el género*/
                                const bpmSession = driver.session();

                                /*Filtrado por bpm, con un margen de +-5% (y por canciones que no hayan sido reproducidas)*/
                                var bpmQuery = "MATCH (s:Song), (p:Person {user: '" + usuario + "'}) WHERE NOT (p)-[:PLAYED]->(s) AND s.bpm >=" + 
                                            (bpmUltimo - bpmUltimo*0.05) + " AND s.bpm <=" + (bpmUltimo + bpmUltimo*0.05) + " RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview";
                                const bpmResultPromise = bpmSession.run(bpmQuery);
                                bpmResultPromise
                                    .then(result => {
                                        if(result.records.length == 0){
                                            /*Si no hay ninguna canción, se finaliza*/
                                            res.json({msg: 'Vacio bpm'});
                                        }else if(result.records.length <= 3){
                                            /*Si hay de 1 a 3 canciones, se devuelven*/
                                            var respuesta = [];

                                            for(var i=0; i<result.records.length; i++){
                                                var cancion = {
                                                    id: result.records[i]._fields[0],
                                                    titulo: result.records[i]._fields[1],
                                                    artista: result.records[i]._fields[2],
                                                    bpm: result.records[i]._fields[3],
                                                    genero: result.records[i]._fields[4],
                                                    cover: result.records[i]._fields[5],
                                                    preview: result.records[i]._fields[6]
                                                };
                                
                                                respuesta.push(cancion);
                                            }

                                            res.send(respuesta);
                                        }else{
                                            /*Si sigue habiendo más de 3 canciones, se filtra por energía, con un margen de +-10%*/
                                            const energySession = driver.session();

                                            var energyQuery = "MATCH (s:Song), (p:Person {user: '" + usuario + "'}) WHERE NOT (p)-[:PLAYED]->(s) AND s.bpm >=" + (bpmUltimo - bpmUltimo*0.05) +
                                                             " AND s.bpm <=" + (bpmUltimo + bpmUltimo*0.05) + " AND s.energy>=" + (energiaPreferencia - energiaPreferencia*0.25) + 
                                                            " AND s.energy<=" + (energiaPreferencia + energiaPreferencia*0.25) + " RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview";
                                            const energyResultPremise = energySession.run(energyQuery);
                                            energyResultPremise
                                                .then(result => {
                                                    if(result.records.length == 0){
                                                        /*Si no hay ninguna canción, se finaliza*/
                                                        res.json({msg: 'Vacio energia'});
                                                    }else if(result.records.length <= 3){
                                                        /*Si hay de 1 a 3 canciones, se devuelven*/
                                                        var respuesta = [];

                                                        for(var i=0; i<result.records.length; i++){
                                                            var cancion = {
                                                                id: result.records[i]._fields[0],
                                                                titulo: result.records[i]._fields[1],
                                                                artista: result.records[i]._fields[2],
                                                                bpm: result.records[i]._fields[3],
                                                                genero: result.records[i]._fields[4],
                                                                cover: result.records[i]._fields[5],
                                                                preview: result.records[i]._fields[6]
                                                            };
                                            
                                                            respuesta.push(cancion);
                                                        }
            
                                                        res.send(respuesta);
                                                    }else{
                                                        /*Si sigue habiendo más de 3 canciones, se ordenan por puntuación en PageRank personalizado*/
                                                        const pageRankSession = driver.session();

                                                        var pageRankQuery = "MATCH (s:Song {id:" + idUltimo + 
                                                                        "}) CALL gds.pageRank.stream('grafoCanciones', { maxIterations: 20," +
                                                                        " dampingFactor: 0.85, sourceNodes: [s] }) YIELD nodeId, score" + 
                                                                        " WITH gds.util.asNode(nodeId) as s, score MATCH (p:Person {user: '" + usuario +
                                                                        "'}) WHERE NOT (p)-[:PLAYED]->(s) AND s.bpm >=" + (bpmUltimo - bpmUltimo*0.05) + " AND s.bpm <=" + (bpmUltimo + bpmUltimo*0.05) + 
                                                                        " AND s.energy>=" + (energiaPreferencia - energiaPreferencia*0.25) + " AND s.energy<=" + (energiaPreferencia + energiaPreferencia*0.25) + 
                                                                        " RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview ORDER BY score DESC LIMIT 3";
                                                        const pageRankResultPremise = pageRankSession.run(pageRankQuery);
                                                        pageRankResultPremise
                                                            .then(result => {
                                                                var respuesta = [];

                                                                for(var i=0; i<result.records.length; i++){
                                                                    var cancion = {
                                                                        id: result.records[i]._fields[0],
                                                                        titulo: result.records[i]._fields[1],
                                                                        artista: result.records[i]._fields[2],
                                                                        bpm: result.records[i]._fields[3],
                                                                        genero: result.records[i]._fields[4],
                                                                        cover: result.records[i]._fields[5],
                                                                        preview: result.records[i]._fields[6]
                                                                    };
                                                                    
                                                                    respuesta.push(cancion);
                                                                }
                    
                                                                res.send(respuesta);
                                                            })
                                                            .catch(error => {
                                                                res.json({msg: 'Error'});
                                                                console.log(error);
                                                            })
                                                            .then(() => pageRankSession.close());
                                                    }
                                                })
                                                .catch(error => {
                                                    res.json({msg: 'Error'});
                                                    console.log(error);
                                                })
                                                .then(() => energySession.close());
                                        }
                                    })
                                    .catch(error => {
                                        res.json({msg: 'Error'});
                                        console.log(error);
                                    })
                                    .then(() => bpmSession.close());

                            }else{
                                /*Fase 3.b: sí se ha seleccionado mantener el género*/
                                const genreSession = driver.session();
                                
                                /*Se filtra por genero (y por canciones que no hayan sido reproducidas)*/
                                var genreQuery = "MATCH (s:Song), (p:Person {user: '" + usuario + "'}) WHERE s.genre='" + generoUltimo + 
                                                "' AND NOT (p)-[:PLAYED]->(s) RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview";
                                const genreResultPromise = genreSession.run(genreQuery);
                                genreResultPromise
                                    .then(result => {
                                        if(result.records.length == 0){
                                            /*Si no hay ninguna canción, se finaliza*/
                                            res.json({msg: 'Vacio genero'});
                                        }else if (result.records.length <= 3){
                                            /*Si hay de 1 a 3 canciones, se devuelven*/
                                            var respuesta = [];

                                            for(var i=0; i<result.records.length; i++){
                                                var cancion = {
                                                    id: result.records[i]._fields[0],
                                                    titulo: result.records[i]._fields[1],
                                                    artista: result.records[i]._fields[2],
                                                    bpm: result.records[i]._fields[3],
                                                    genero: result.records[i]._fields[4],
                                                    cover: result.records[i]._fields[5],
                                                    preview: result.records[i]._fields[6]
                                                };
                                
                                                respuesta.push(cancion);
                                            }

                                            res.send(respuesta);
                                        }else{
                                            /*Si hay más de 3 canciones, se continúa filtrando por bpm, con un margen de +-5%*/
                                            const bpmSession = driver.session();

                                            var bpmQuery = "MATCH (s:Song), (p:Person {user: '" + usuario + "'}) WHERE s.genre='" + generoUltimo +
                                                        "' AND NOT (p)-[:PLAYED]->(s) AND s.bpm >=" + (bpmUltimo - bpmUltimo*0.05) + " AND s.bpm <=" + 
                                                        (bpmUltimo + bpmUltimo*0.05) + " RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview";
                                            const bpmResultPromise = bpmSession.run(bpmQuery);
                                            bpmResultPromise
                                                .then(result => {
                                                    if(result.records.length == 0){
                                                        /*Si no hay ninguna canción, se finaliza*/
                                                        res.json({msg: 'Vacio bpm'});
                                                    }else if(result.records.length <= 3){
                                                        /*Si hay de 1 a 3 canciones, se devuelven*/
                                                        var respuesta = [];

                                                        for(var i=0; i<result.records.length; i++){
                                                            var cancion = {
                                                                id: result.records[i]._fields[0],
                                                                titulo: result.records[i]._fields[1],
                                                                artista: result.records[i]._fields[2],
                                                                bpm: result.records[i]._fields[3],
                                                                genero: result.records[i]._fields[4],
                                                                cover: result.records[i]._fields[5],
                                                                preview: result.records[i]._fields[6]
                                                            };
                                            
                                                            respuesta.push(cancion);
                                                        }
            
                                                        res.send(respuesta);
                                                    }else{
                                                        /*Si sigue habiendo más de 3 canciones, se filtra por energía, con un margen de +-10%*/
                                                        const energySession = driver.session();

                                                        var energyQuery = "MATCH (s:Song), (p:Person {user: '" + usuario + "'}) WHERE s.genre='" + generoUltimo +
                                                                        "' AND NOT (p)-[:PLAYED]->(s) AND s.bpm >=" + (bpmUltimo - bpmUltimo*0.05) + " AND s.bpm <=" + 
                                                                        (bpmUltimo + bpmUltimo*0.05) + " AND s.energy>=" + (energiaPreferencia - energiaPreferencia*0.25) + 
                                                                        " AND s.energy<=" + (energiaPreferencia + energiaPreferencia*0.25) + " RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview";
                                                        const energyResultPremise = energySession.run(energyQuery);
                                                        energyResultPremise
                                                            .then(result => {
                                                                if(result.records.length == 0){
                                                                    /*Si no hay ninguna canción, se finaliza*/
                                                                    res.json({msg: 'Vacio energia'});
                                                                }else if(result.records.length <= 3){
                                                                    /*Si hay de 1 a 3 canciones, se devuelven*/
                                                                    var respuesta = [];

                                                                    for(var i=0; i<result.records.length; i++){
                                                                        var cancion = {
                                                                            id: result.records[i]._fields[0],
                                                                            titulo: result.records[i]._fields[1],
                                                                            artista: result.records[i]._fields[2],
                                                                            bpm: result.records[i]._fields[3],
                                                                            genero: result.records[i]._fields[4],
                                                                            cover: result.records[i]._fields[5],
                                                                            preview: result.records[i]._fields[6]
                                                                        };
                                                        
                                                                        respuesta.push(cancion);
                                                                    }
                        
                                                                    res.send(respuesta);
                                                                }else{
                                                                    /*Si sigue habiendo más de 3 canciones, se ordenan por puntuación en PageRank personalizado*/
                                                                    const pageRankSession = driver.session();

                                                                    var pageRankQuery = "MATCH (s:Song {id:" + idUltimo + 
                                                                                    "}) CALL gds.pageRank.stream('grafoCanciones', { maxIterations: 20," +
                                                                                    " dampingFactor: 0.85, sourceNodes: [s] }) YIELD nodeId, score" + 
                                                                                    " WITH gds.util.asNode(nodeId) as s, score MATCH (p:Person {user: '" + usuario +
                                                                                    "'}) WHERE s.genre='" + generoUltimo + "' AND NOT (p)-[:PLAYED]->(s) AND s.bpm >=" + (bpmUltimo - bpmUltimo*0.05) + " AND s.bpm <=" + 
                                                                                    (bpmUltimo + bpmUltimo*0.05) + " AND s.energy>=" + (energiaPreferencia - energiaPreferencia*0.25) + " AND s.energy<=" + (energiaPreferencia + energiaPreferencia*0.25) + 
                                                                                    " RETURN s.id, s.title, s.artist, s.bpm, s.genre, s.cover, s.preview ORDER BY score DESC LIMIT 3";
                                                                    const pageRankResultPremise = pageRankSession.run(pageRankQuery);
                                                                    pageRankResultPremise
                                                                        .then(result =>{
                                                                            var respuesta = [];

                                                                            for(var i=0; i<result.records.length; i++){
                                                                                var cancion = {
                                                                                    id: result.records[i]._fields[0],
                                                                                    titulo: result.records[i]._fields[1],
                                                                                    artista: result.records[i]._fields[2],
                                                                                    bpm: result.records[i]._fields[3],
                                                                                    genero: result.records[i]._fields[4],
                                                                                    cover: result.records[i]._fields[5],
                                                                                    preview: result.records[i]._fields[6]
                                                                                };
                                                                                
                                                                                respuesta.push(cancion);
                                                                            }
                                
                                                                            res.send(respuesta);
                                                                        })
                                                                        .catch(error => {
                                                                            res.json({msg: 'Error'});
                                                                            console.log(error);
                                                                        })
                                                                        .then(() => pageRankSession.close());
                                                                }
                                                            })
                                                            .catch(error => {
                                                                res.json({msg:'Error'});
                                                                console.log(error);
                                                            })
                                                            .then(() => energySession.close());
                                                    }
                                                })
                                                .catch(error =>{
                                                    res.json({msg:'Error'});
                                                    console.log(error);
                                                })
                                                .then(() => bpmSession.close()); 
                                        }
                                    })
                                    .catch(error => {
                                        res.json({msg: 'Error'});
                                        console.log(error);
                                    })
                                    .then(() => genreSession.close());
                            }
                        }
                    })
                    .catch(error => {
                        res.json({msg: 'Error'});
                        console.log(error);
                    })
                    .then(() => secondPhaseSession.close());

            }else{
                /*Si hay peticiones, se ejecuta el itinerario de recomendación basado en peticiones (petition-driven)*/
                /*TODO*/
            }
        })
        .catch(error => {
            res.json({msg: 'Error'});
            console.log(error);
        })
        .then(() => firstPhaseSession.close());
})

app.listen(3000, function() {
    console.log("Backend escuchando en el puerto 3000");
})