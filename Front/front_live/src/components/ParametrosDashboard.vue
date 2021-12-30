<template>
    <!-- Columna de parámetros -->
    <v-col cols="4">

        <v-card class="pl-1 pt-1 pr-1 pb-1">
            <v-card-title>
                <h2 class="font-weight-light">Parámetros</h2>
            </v-card-title>

            <v-col>
                 <!-- Tarjeta de hora -->
                <v-card elevation="7">
                    <v-card-title class="justify-center mr-3">
                        <h1 class="font-weight-regular">{{time}}</h1>
                    </v-card-title>
                </v-card>


            </v-col>
        </v-card>

    </v-col>
</template>

<script>
export default {
    name: 'ParametrosDashboard',

    data() {
        return {
            interval: null,
            time: null
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