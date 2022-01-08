<template>
    <!-- Columna de recomendaciones -->
    <v-col cols="4">
        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Recomendaciones</h2>
                <v-spacer></v-spacer>
                <v-btn @click="obtenerRecomendaciones()" fab icon><v-icon>mdi-reload</v-icon></v-btn>
            </v-card-title>

            <!-- Tarjetas de recomendación -->
            <v-col v-for="(item, i) in itemsProvisionales" :key="i">
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
    </v-col>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'RecomendacionesDashboard',

    data() {
        return {
            listaColores: [
                "indigo lighten-1", "deep-orange lighten-2", "orange lighten-2"
            ]
        }
    },
    methods:{
        alterarReproduccion(i){
            i.button = !i.button;
        },
        obtenerRecomendaciones(){
            console.log("//TODO");
        }
    },
    computed:{
        ...mapState(['itemsProvisionales'])
    }

}
</script>