<template>
    <!-- Columna de reproducción actual -->
    <v-col cols="4">
        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-actions>
                <v-btn fab icon class="pr-6"><v-icon>mdi-plus</v-icon></v-btn>
            </v-card-actions>
            <v-card-title>
                <h2 class="font-weight-light">Reproducción actual</h2>
            </v-card-title>
            <v-card-text v-if="!isCancionSeleccionada">
                <body-1>Comienza añadiendo una canción</body-1>
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
    </v-col>
</template>

<script>
export default {
    name: 'ReproduccionActualDashboard',

    data() {
        return {
            isCancionSeleccionada: true,
            cancionSeleccionada: {
                id: 1,
                titulo: "Nobody Like You",
                artista: "Kaskade",
                bpm: 121,
                cover: "https://i.scdn.co/image/ab67616d0000b273ff13f0d37ea0d092b5482c0a",
                button: false
            }
        }
    },
    methods: {
        seleccionarCancion(){
            this.isCancionSeleccionada = true;
        },
        alterarReproduccion(){
            this.cancionSeleccionada.button = !this.cancionSeleccionada.button;
        }
    },

}
</script>