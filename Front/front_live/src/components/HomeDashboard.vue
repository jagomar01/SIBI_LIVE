<template>
    <v-parallax
    height="700"
    src="../assets/live-background.jpg">
        <v-container>
            <v-row>
                <!-- Columna de reproducción actual -->
                <v-col cols="4">
                    <v-card class="pl-1 pt-1">
                        <v-card-actions>
                            <v-btn fab><v-icon>mdi-plus</v-icon></v-btn>
                        </v-card-actions>
                        <v-card-title>
                            <h2 class="font-weight-light">Reproducción actual</h2>
                        </v-card-title>
                        <v-card-text>
                            <body-1>Comienza añadiendo una canción</body-1>
                        </v-card-text>   
                    </v-card>
                </v-col>

                <!-- Columna de parámetros -->
                <v-col cols="4">
                    <v-card class="pl-1 pt-1">
                        <v-card-title>
                            <h2 class="font-weight-light">Parámetros</h2>
                        </v-card-title>
                    </v-card>
                </v-col>

                <RecomendacionesDashboard />

            </v-row>
        </v-container>
    </v-parallax>
</template>

<script>
import RecomendacionesDashboard from '../components/RecomendacionesDashboard.vue'

export default {

    name: 'HomeDashboard',

    data() {
        return {

        }
    },
    methods:{

    },
    components:{
        RecomendacionesDashboard,
    }

}
</script>