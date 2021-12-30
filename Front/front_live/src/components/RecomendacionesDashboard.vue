<template>
    <!-- Columna de recomendaciones -->
    <v-col cols="4">
        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Recomendaciones</h2>
            </v-card-title>

            <!-- Tarjetas de recomendación -->
            <v-col v-for="(item, i) in listaRecomendaciones" :key="i">
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
                                <v-btn fab icon>
                                    <v-icon>mdi-plus</v-icon>
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
export default {
    name: 'RecomendacionesDashboard',

    data() {
        return {
            listaRecomendaciones : [
                {
                    id: 1,
                    titulo: "Everyday Of My Life",
                    artista: "Third Party",
                    bpm: 128,
                    cover: "https://i.scdn.co/image/ab67616d00001e0240398a34052af7ebb29d6b84",
                    button: false
                },
                {
                    id: 2, 
                    titulo: "Animals",
                    artista: "Martin Garrix",
                    bpm: 128,
                    cover: "https://i.scdn.co/image/ab67616d00001e02eb6f61d93514dfe530616a68",
                    button: false
                },
                {
                    id: 3,
                    titulo: "Don't You Worry Child",
                    artista: "Swedish House Mafia",
                    bpm: 125,
                    cover: "https://i.scdn.co/image/ab67616d00001e029cfe80c0c05ce104f7bab18e",
                    button: false
                }
            ],
            listaColores: [
                "indigo lighten-1", "deep-orange lighten-2", "orange lighten-2"
            ]
        }
    },
    methods:{
        alterarReproduccion(i){
            i.button = !i.button;
        }
    }

}
</script>