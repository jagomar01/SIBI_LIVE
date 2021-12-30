<template>
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
</template>

<script>
export default {
    name: 'ReproduccionActualDashboard',

    data() {
        return {
            
        }
    },

}
</script>