<template>
    <!-- Columna de parámetros -->
    <v-col cols="4">

        <v-card class="pl-1 pt-1 pr-1">
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
                                <v-icon color="grey darken-2">
                                    mdi-minus
                                </v-icon>
                            </template>

                            <template v-slot:append>
                                <v-icon color="grey darken-2">
                                    mdi-plus
                                </v-icon>
                            </template>
                        </v-slider>
                        <v-checkbox
                            v-model="checkboxMode"
                            label="Modo automático"
                        ></v-checkbox>
                        <v-checkbox
                            v-model="checkboxGenero"
                            label="Mantener género"
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
                    <v-card-text v-if="!peticionSeleccionada">
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
                        label="Introducir título"
                        outlined
                        clearable
                        v-model="busqueda"
                    ></v-text-field>

                    <!-- Items sugeridos -->
                    <v-list>
                        <v-list-item @click="seleccionarTrack(item)" link v-for="(item,index) in buscar" :key="index">
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
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

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
            peticionSeleccionada: false,

            /*Variables relacionadas con el cuadro de búsqueda*/
            dialog: false,
            busqueda: null,

            /*Variables relacionadas con la snackbar*/
            snackbar: false,
            textoSnackbar: ""
        }
    },
    computed:{
        buscar(){
            if(this.busqueda){
                return this.itemsProvisionales.filter(item => 
                {return this.busqueda.toLowerCase().split(' ').every(v => item.titulo.toLowerCase().includes(v))
                })
            }else{
                return this.itemsProvisionales;
            }
        },
        actualizarEnergia(){
            if(this.checkboxMode == true && this.getSetup == true){
                axios
                    .post('http://localhost:3000/obtenerEnergia', {
                        usuario: this.getUsuario
                    })
                    .then(response => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar = "Ocurrió un error al actualizar la energía";
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
        },
        ...mapState(['itemsProvisionales']),
        ...mapGetters(['getUsuario', 'getSetup'])
    },
    methods: {
        seleccionarTrack(item){
            this.peticionSeleccionada = true;
            this.dialog = false;
            this.peticion = item;
        },
        deseleccionarTrack(){
            this.peticionSeleccionada = false;
            this.peticion = null;
        }
    },
    beforeDestroy() {
        clearInterval(this.interval)
    },
    created(){
        /*Actualiza la hora cada 1000 ms (1 segundo)*/
        this.interval = setInterval(() => {
            /*Formato de hora*/
            this.time = Intl.DateTimeFormat(navigator.language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format();

        }, 1000);

        /*Actualiza la energia en modo automático cada 30000 ms (medio minuto)*/
        this.intervalBis = setInterval(() => {
            this.actualizarEnergia();
        }, 30000);
    }

}
</script>