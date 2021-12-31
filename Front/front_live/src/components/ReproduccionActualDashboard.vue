<template>
    <!-- Columna de reproducción actual -->
    <v-col cols="4">
        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Reproducción actual</h2>
                <v-spacer></v-spacer>
                <v-btn @click="dialog = true" fab icon><v-icon>mdi-plus</v-icon></v-btn>
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
                                    {{cancionSeleccionada.bpm}} BPM
                                </v-card-subtitle>
                                <v-btn fab icon @click="alterarReproduccion()">
                                    <v-icon>{{cancionSeleccionada.button ? 'mdi-pause' : 'mdi-play'}}</v-icon>
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
    name: 'ReproduccionActualDashboard',

    data() {
        return {
            /*Variables relacionadas con el cuadro de busqueda*/
            busqueda: null,
            dialog: false,

            /*Variables relacionadas con la tarjeta de selección*/
            isCancionSeleccionada: false,
            cancionSeleccionada: null
        }
    },
    methods: {
        alterarReproduccion(){
            this.cancionSeleccionada.button = !this.cancionSeleccionada.button;
        },
        seleccionarTrack(item){
            this.cancionSeleccionada = item;
            this.dialog = false;
            this.isCancionSeleccionada = true;
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
    }

}
</script>