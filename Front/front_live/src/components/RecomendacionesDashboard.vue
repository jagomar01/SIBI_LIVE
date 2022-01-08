<template>
    <!-- Columna de recomendaciones -->
    <v-col cols="4">
        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Recomendaciones</h2>
                <v-spacer></v-spacer>
                <v-btn @click="obtenerRecomendaciones()" fab icon><v-icon>mdi-reload</v-icon></v-btn>
            </v-card-title>

            <v-card-text v-if="!hayRecomendaciones">
                {{textoColumna}}
            </v-card-text>

            <!-- Tarjetas de recomendación -->
            <v-col v-else v-for="(item, i) in itemsRecomendaciones" :key="i">
                <v-card dark :color="listaColores[i]" elevation="7">
                        <div class="d-flex flex-no-wrap justify-space-between">
                            <div>
                                <v-card-title class="font-weight-regular white--text">
                                    {{item.titulo}}
                                </v-card-title>
                                <v-card-subtitle>
                                    {{item.artista}}
                                    <br>
                                    {{item.bpm}} BPM
                                </v-card-subtitle>
                                <v-btn fab icon @click="alterarReproduccion(item)">
                                    <v-icon>{{item.button ? 'mdi-pause' : 'mdi-play'}}</v-icon>
                                </v-btn>
                            </div>

                            <v-avatar class="mt-4 mr-4" size="95" tile>
                                <v-img :src="item.cover"></v-img>
                            </v-avatar>
                        </div>
                </v-card>
            </v-col>
        </v-card>

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
import axios from 'axios';

export default {
    name: 'RecomendacionesDashboard',

    data() {
        return {
            /*Variables relacionadas con las tarjetas de recomendación*/
            listaColores: [
                "indigo lighten-1", "deep-orange lighten-2", "orange lighten-2"
            ],
            hayRecomendaciones: false,
            itemsRecomendaciones: null,
            textoColumna: "Para obtener recomendaciones, selecciona una canción, ajusta los parámetros y pulsa el botón de recargar situado encima",

            /*Variables relacionadas con la snackbar*/
            snackbar: false,
            textoSnackbar: ""
        }
    },
    methods:{
        alterarReproduccion(i){
            i.button = !i.button;
        },
        obtenerRecomendaciones(){
            axios
                .post('http://localhost:3000/obtenerRecomendaciones', {
                    usuario: this.getUsuario
                })
                .then(response => {
                    console.log(response);
                })
                .catch(error => {
                    this.textoSnackbar = "Ocurrió un error al obtener las recomendaciones";
                    this.snackbar = true;
                    console.log(error);
                })
        }
    },
    computed:{
        ...mapGetters(['getUsuario'])
    }

}
</script>