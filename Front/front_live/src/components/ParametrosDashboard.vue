<template>
    <!-- Columna de parámetros -->
    <v-col cols="4">

        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Parámetros</h2>
            </v-card-title>

            <v-col>
                <!-- Tarjeta de energía -->
                <v-card class="mb-6" elevation="7">
                    <v-card-title>
                        <h2 class="font-weight-light">Energía</h2>
                        <v-spacer></v-spacer>
                        <h2 class="font-weight-light">{{porcentajeEnergia}}%</h2>
                    </v-card-title>
                    <v-card-text>
                        <!--Slider-->
                        <v-slider :disabled="checkbox" v-model="porcentajeEnergia" track-color="grey" min="0" max="100">
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
                            v-model="checkbox"
                            label="Modo automático"
                        ></v-checkbox>
                    </v-card-text>
                </v-card>

                <!-- Tarjeta de peticiones -->
                <v-card class="mb-6" elevation="7">
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
                <v-card elevation="7">
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

    </v-col>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'ParametrosDashboard',

    data() {
        return {
            /*Variables relacionadas con la hora*/
            interval: null,
            time: null,

            /*Variables relacionadas con la tarjeta de energía*/
            porcentajeEnergia: 0,
            checkbox: true,

            /*Variables relacionadas con la tarjeta de peticiones*/
            peticion: null,
            peticionSeleccionada: false,

            /*Variables relacionadas con el cuadro de búsqueda*/
            dialog: false,
            busqueda: null
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
        ...mapState(['itemsProvisionales'])
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
        /*Actualizar la hora cada 1000 ms (1 segundo)*/
        this.interval = setInterval(() => {
            /*Formato de hora*/
            this.time = Intl.DateTimeFormat(navigator.language, {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }).format()
        }, 1000)
    }

}
</script>