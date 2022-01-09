<template>
    <!-- Columna de parámetros -->
    <v-col cols="4">

        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Parámetros</h2>
            </v-card-title>

            <v-col>
                <!-- Tarjeta de energía -->
                <v-card class="mb-4" elevation="7">
                    <v-card-title>
                        <h2 class="font-weight-light">Energía</h2>
                        <v-spacer></v-spacer>
                        <h2 class="font-weight-light">{{porcentajeEnergia}}%</h2>
                    </v-card-title>
                    <v-card-text>
                        <!--Slider-->
                        <v-slider :disabled="checkboxMode" v-model="porcentajeEnergia" track-color="grey" min="0" max="100">
                            <template v-slot:prepend>
                                <v-icon color="grey darken-2">mdi-minus</v-icon>
                            </template>

                            <template v-slot:append>
                                <v-icon color="grey darken-2">mdi-plus</v-icon>
                            </template>
                        </v-slider>
                        <v-checkbox
                            @change="cambiarModo()"
                            v-model="checkboxMode"
                            label="Modo automático"
                        ></v-checkbox>
                        <v-checkbox
                            v-model="checkboxGenero"
                            label="Mantener género"
                            @change="actualizarGenero"
                        ></v-checkbox>
                    </v-card-text>
                </v-card>

                <!-- Tarjeta de peticiones -->
                <v-card class="mb-4" elevation="7">
                    <v-card-title>
                        <h2 class="font-weight-light">Peticiones</h2>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialog = true" fab icon><v-icon>mdi-plus</v-icon></v-btn>
                    </v-card-title>
                    <v-card-text v-if="!isPeticionSeleccionada">
                        Comienza agregando una petición
                    </v-card-text>

                    <v-list v-else>
                        <v-list-item @click="deseleccionarTrack">
                            <v-list-item-content>
                                <v-list-item-title>{{peticion.titulo}}</v-list-item-title>
                                <v-list-item-subtitle>{{peticion.artista}}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>

                <!-- Tarjeta de hora -->
                <v-card class="mb-4" elevation="7">
                    <v-card-title class="justify-center mr-3">
                        <h1 class="font-weight-light">{{time}}</h1>
                    </v-card-title>
                </v-card>

                <!-- Cerrar sesión -->
                <v-btn @click="cerrarSesion" class="red lighten-1" block elevation="7">
                    <h2 class="font-weight-light white--text">Cerrar sesión</h2>
                </v-btn>

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
                        <v-list-item :disabled="item.titulo == undefined" @click="seleccionarTrack(item, false)" link v-for="(item,index) in resultadosBusqueda" :key="index">
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
import axios from 'axios'

export default {
    name: 'ParametrosDashboard',

    data() {
        return {
            /*Variables relacionadas con la hora*/
            interval: null,
            time: null,

            /*Variables relacionadas con la tarjeta de energía*/
            porcentajeEnergia: 0,
            checkboxMode: true,
            checkboxGenero: false,
            intervalBis: null,

            /*Variables relacionadas con la tarjeta de peticiones*/
            peticion: null,
            isPeticionSeleccionada: false,

            /*Variables relacionadas con el cuadro de búsqueda*/
            dialog: false,
            busqueda: null,
            resultadosBusqueda: null,

            /*Variables relacionadas con la snackbar*/
            snackbar: false,
            textoSnackbar: ""
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
                    this.textoSnackbar = "Ocurió un error. Intenta buscar de nuevo";
                    this.snackbar = true;
                    console.log(error);
                })
        },
        recuperarPeticion(){
            axios
                .post('http://localhost:3000/obtenerPeticion' , {
                    usuario: this.getUsuario
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurió un error al intentar recuperar la útlima petición";
                        this.snackbar = true;
                    }else if(JSON.stringify(response.data) != JSON.stringify({msg: 'Vacio'})){
                        this.seleccionarTrack(response.data, true);
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error al intentar recuperar la útlima petición";
                    this.snackbar = true;
                    console.log(error);
                })
        },
        actualizarPeticion(){
            axios
                .post('http://localhost:3000/actualizarPeticion', {
                    usuario: this.getUsuario,
                    idCancion: this.peticion.id.low
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurrió un error al actualizar la petición";
                        this.snackbar = true;
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error al actualizar la petición";
                    this.snackbar = true;
                    console.log(error)
                })
        },
        actualizarEnergia(){
            if(this.checkboxMode == true){
                axios
                    .post('http://localhost:3000/obtenerEnergia', {
                        usuario: this.getUsuario
                    })
                    .then(response => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar = "Ocurrió un error al actualizar la energía";
                            this.snackbar = true;
                        }else if(JSON.stringify(response.data) == JSON.stringify({msg: 'Pendiente'})){
                            this.textoSnackbar = "Selecciona una canción para poder obtener la energía en modo automático";
                            this.snackbar = true;
                        }else if(JSON.stringify(response.data) == JSON.stringify({msg: 'Finalizado'})){
                            this.textoSnackbar = "El tiempo de sesión ha finalizado. Desactiva el modo automatico";
                            this.snackbar = true;
                        }else{
                            this.porcentajeEnergia = parseInt(response.data.value);
                        }
                    })
                    .catch(error => {
                        this.textoSnackbar = "Ocurrió un error al actualizar la energía";
                        this.snackbar = true;
                        console.log(error);
                    })
            }else{
                axios
                    .post('http://localhost:3000/establecerEnergia', {
                        usuario: this.getUsuario,
                        energia: this.porcentajeEnergia
                    })
                    .then(response => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar = "Ocurrió un error al actualizar la energía";
                            this.snackbar = true;
                        }
                    })
                    .catch(error => {
                        this.textoSnackbar = "Ocurrió un error al actualizar la energía";
                        this.snackbar = true;
                        console.log(error);
                    })
            }
        },
        recuperarGenero(){
            axios
                .post('http://localhost:3000/obtenerGenero', {
                    usuario: this.getUsuario
                })
                .then(response => {
                    if(response.data == 'keep'){
                        this.checkboxGenero = true;
                    }else if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurrió un error al recuperar el útlimo género guardado"
                        this.snackbar = true;
                    }else{
                        this.checkboxGenero = false;
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurrió un error al recuperar el útlimo género guardado"
                    this.snackbar = true;
                    console.log(error);
                })
        },
        actualizarGenero(){
            var genero = 'null';

            if(this.checkboxGenero == true){
                genero = 'keep';
            }

            axios  
                .post('http://localhost:3000/establecerGenero', {
                    usuario: this.getUsuario,
                    genero: genero
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = 'Ocurrió un error al actualizar el género';
                        this.snackbar = true;
                    }
                })
                .catch(error => {
                    this.textoSnackbar = 'Ocurrió un error al actualizar el género';
                    this.snackbar = true;
                    console.log(error);
                })
        },
        ...mapGetters(['getUsuario', 'getSetup'])
    },
    methods: {
        seleccionarTrack(item, firstTime){
            this.isPeticionSeleccionada = true;
            this.peticion = item;
            this.dialog = false;

            if(firstTime == false){
                this.eliminarPeticion();
                this.actualizarPeticion;
            }
        },
        deseleccionarTrack(){
            this.isPeticionSeleccionada = false;
            this.peticion = null;

            this.eliminarPeticion();
        },
        cerrarSesion(){
            axios
                .post('http://localhost:3000/borrarHistorialReproduccion', {
                    usuario: this.getUsuario
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurrió un error al cerrar sesión"
                        this.snackbar = true;
                    }else{
                        this.$router.push({name: 'Login'});
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurrió un error al cerrar sesión";
                    this.snackbar = true;
                    console.log(error);
                })
        },
        eliminarPeticion(){
            axios
                .post('http://localhost:3000/eliminarPeticion', {
                    usuario: this.getUsuario
                })
                .then(response => {
                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                        this.textoSnackbar = "Ocurrió un error al actualizar la petición"
                        this.snackbar = true;
                    }
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurió un error al actualizar la petición";
                    this.snackbar = true;
                    console.log(error)
                })
        },
        cambiarModo(){
            this.actualizarEnergia;
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    created(){
        /*Actualizar la hora cada 1000 ms (1 segundo)*/
        this.interval = setInterval(() => {
            /*Formato de hora*/
            this.time = Intl.DateTimeFormat(navigator.language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format();

        }, 1000);

        /*Actualizar la energia en modo automático cada 5000 ms (5 segundos)*/
        this.intervalBis = setInterval(() => {
            if(this.checkboxMode == true && this.getSetup == true){
                axios
                    .post('http://localhost:3000/obtenerEnergia', {
                        usuario: this.getUsuario
                    })
                    .then(response => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar = "Ocurrió un error al actualizar la energía";
                            this.snackbar = true;
                        }else if(JSON.stringify(response.data) == JSON.stringify({msg: 'Pendiente'})){
                            this.textoSnackbar = "Selecciona una canción para poder obtener la energía en modo automático";
                            this.snackbar = true;
                        }else if(JSON.stringify(response.data) == JSON.stringify({msg: 'Finalizado'})){
                            this.textoSnackbar = "El tiempo de sesión ha finalizado. Desactiva el modo automatico";
                            this.snackbar = true;
                        }else{
                            this.porcentajeEnergia = parseInt(response.data.value);
                        }
                    })
                    .catch(error => {
                        this.textoSnackbar = "Ocurrió un error al actualizar la energía";
                        this.snackbar = true;
                        console.log(error);
                    })
            }

        }, 5000);

        this.recuperarGenero;
        this.recuperarPeticion;
    },
    beforeUpdate() {
        this.buscar;

        if(this.checkboxMode == false){
            this.actualizarEnergia;
        }
    },
}
</script>