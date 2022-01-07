<template>
    <!-- Columna de reproducción actual -->
    <v-col cols="4">
        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Reproducción actual</h2>
                <v-spacer></v-spacer>
                <v-btn @click="activarDialogo()" fab icon><v-icon>mdi-plus</v-icon></v-btn>
            </v-card-title>
            <v-card-text v-if="!isCancionSeleccionada">
                Comienza añadiendo una canción
            </v-card-text>

            <!-- Tarjeta de canción seleccionada -->
            <v-col v-else>
                <v-card dark color="grey darken-2" elevation="7">
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <div>
                                <v-card-title class="font-weight-regular white--text">
                                    {{cancionSeleccionada.titulo}}
                                </v-card-title>
                                <v-card-subtitle>
                                    {{cancionSeleccionada.artista}}
                                    <br>
                                    {{cancionSeleccionada.bpm}} BPM - {{cancionSeleccionada.genero}}
                                </v-card-subtitle>
                                <v-btn fab icon @click="alterarReproduccion()">
                                    <v-icon>{{botonPlay ? 'mdi-pause' : 'mdi-play'}}</v-icon>
                                </v-btn>
                            </div>

                            <v-avatar class="mt-4 mr-4" size="95" tile>
                                <v-img :src="cancionSeleccionada.cover"></v-img>
                            </v-avatar>
                        </div>
                </v-card>
            </v-col>

        </v-card>

        <!-- Dialogo de búsqueda-->
        <v-dialog v-model="dialog" width="500">
            <v-card class="pb-1 pt-1 pl-1 pr-1">
                <v-btn @click="dialog = false" fab icon class="ml-2 mb-2 mt-2"><v-icon>mdi-close</v-icon></v-btn>
                <h1 class="font-weight-light pl-7">Buscar</h1>
                
                <v-card-text>
                    <br>
                    <!-- Cuadro de búsqueda -->
                    <v-text-field
                        label="Introducir título o artista"
                        outlined
                        clearable
                        v-model="busqueda"
                    ></v-text-field>

                    <!-- Items sugeridos -->
                    <v-list>
                        <v-list-item link :disabled="item.titulo == undefined" @click="seleccionarTrack(item, false)" v-for="(item,index) in resultadosBusqueda" :key="index">
                            <v-list-item-content>
                                <v-list-item-title>{{item.titulo}}</v-list-item-title>
                                <v-list-item-subtitle>{{item.artista}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Snackbar advertencia -->
        <v-snackbar v-model="snackbar" class="d-flex">
            {{ textoSnackbar }}
            <v-btn color="white" fab icon @click="snackbar = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

    </v-col>
</template>

<script>
import { mapGetters } from 'vuex'

const axios = require('axios');

export default {
    name: 'ReproduccionActualDashboard',

    data() {
        return {
            /*Variables relacionadas con el cuadro de busqueda*/
            busqueda: null,
            dialog: false,
            resultadosBusqueda: this.itemsProvisionales,

            /*Variables relacionadas con la tarjeta de selección*/
            isCancionSeleccionada: false,
            cancionSeleccionada: null,
            botonPlay: false,
            audio: null,

            /*Variables relacionadas con la snackbar*/
            snackbar: false,
            textoSnackbar: ""
        }
    },
    methods: {
        alterarReproduccion(){
            if(this.cancionSeleccionada.preview == 'null'){
                this.textoSnackbar = 'Lo sentimos, no hay disponible una muestra de esta canción';
                this.snackbar = true;
            }else{
                this.botonPlay = !this.botonPlay;
    
                if(this.botonPlay == false){
                    this.audio.pause();
                }else{
                    this.audio.play();
                }
            }
        },
        seleccionarTrack(item, firstTime){
            this.cancionSeleccionada = item;
            this.dialog = false;
            this.isCancionSeleccionada = true;

            if(this.cancionSeleccionada.preview != 'null'){
                this.audio = new Audio(this.cancionSeleccionada.preview);
            }

            if(firstTime == false){
                this.actualizarUltimaReproduccion;
            }
        },
        activarDialogo(){
            this.dialog = true;

            if(this.botonPlay == true){
                this.alterarReproduccion();
            }
        }
    },
    computed:{
        buscar(){
            axios
                .post('http://localhost:3000/buscar' , {
                    termino: this.busqueda
                })
                .then(response => {
                    this.resultadosBusqueda = response.data;
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error. Intenta buscar de nuevo.";
                    this.snackbar = true;
                    console.log(error);
                })
        },
        recuperarReproduccion(){
            axios
                .post('http://localhost:3000/obtenerUltimaReproduccion' , {
                    usuario: this.getUsuario
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurió un error al intentar recuperar la útlima reproducción";
                        this.snackbar = true;
                    }else if(JSON.stringify(response.data) != JSON.stringify({msg: 'Vacio'})){
                        this.seleccionarTrack(response.data, true);
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error al intentar recuperar la útlima reproducción";
                    this.snackbar = true;
                    console.log(error);
                })
        },
        actualizarUltimaReproduccion(){
            axios
                .post('http://localhost:3000/eliminarUltimaReproduccion', {
                    usuario: this.getUsuario
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurrió un error al actualizar la reproducción"
                        this.snackbar = true;
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error al actualizar la reproducción";
                    this.snackbar = true;
                    console.log(error)
                })
            axios
                .post('http://localhost:3000/actualizarUltimaReproduccion', {
                    usuario: this.getUsuario,
                    idCancion: this.cancionSeleccionada.id.low
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurrió un error al actualizar la reproducción";
                        this.snackbar = true;
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error al actualizar la reproducción";
                    this.snackbar = true;
                    console.log(error)
                })
        },
        ...mapGetters(['getUsuario'])
    },
    beforeUpdate() {
        this.buscar;
    },
    created() {
        this.recuperarReproduccion;
    }

}
</script>