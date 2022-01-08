<template>
    <v-parallax
    height="700"
    src="../assets/live-background.jpg">
        <v-container fluid>
            <v-row>
                <ReproduccionActualDashboard/>
                <ParametrosDashboard ref="parametros"/>
                <RecomendacionesDashboard />
            </v-row>
        </v-container>

        <v-dialog v-model="dialogoInicial" width="500" persistent>
            <v-card class="pl-1 pt-1 pr-1">
                <v-card-title>
                    <h2 class="font-weight-light">Establecer fechas</h2>
                </v-card-title>
                <v-spacer></v-spacer>
                <v-card-subtitle>
                    Para usar el modo automático de energía, establece la fecha y hora de inicio y fin de la sesión
                </v-card-subtitle>
                <v-spacer></v-spacer>
                <v-card-text>
                    <v-form @submit.prevent="establecerFechasInicioYFin">
                        <v-row>
                            <!-- Seleccion de fecha de inicio -->
                            <v-col cols="6">
                                <v-menu v-model="mostrarCalendarioInicio" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined v-model="fechaInicio" readonly  label="Fecha de inicio" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker color="grey darken-2" v-model="fechaInicio" scrollable no-title @input="mostrarCalendarioInicio = false" locale="es-ES">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>
                            
                            <!-- Seleccion de hora de inicio -->
                            <v-col cols ="6">
                                <v-menu v-model="mostrarRelojInicio" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined v-model="horaInicio" readonly  label="Hora de inicio" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker color="grey darken-2" v-model="horaInicio" @input="mostrarRelojInicio = false">
                                    </v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <v-row>
                            <!-- Seleccion de fecha de fin -->
                            <v-col cols="6">
                                <v-menu v-model="mostrarCalendarioFin" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined v-model="fechaFin" readonly  label="Fecha de fin" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-date-picker color="grey darken-2" v-model="fechaFin" scrollable no-title @input="mostrarCalendarioFin = false" locale="es-ES">
                                    </v-date-picker>
                                </v-menu>
                            </v-col>

                            <!-- Selección de hora de fin -->
                            <v-col cols="6">
                                <v-menu v-model="mostrarRelojFin" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field outlined v-model="horaFin" readonly  label="Hora de fin" v-on="on">
                                        </v-text-field>
                                    </template>
                                    <v-time-picker color="grey darken-2" v-model="horaFin" @input="mostrarRelojFin = false">
                                    </v-time-picker>
                                </v-menu>
                            </v-col>
                        </v-row>

                        <v-card-actions class="ml-16">
                            <div class="ml-16">
                                <v-btn class="font-weight-regular ml-8" color="grey darken-1 white--text" type="submit">Aceptar</v-btn>
                            </div>
                        </v-card-actions>
                    </v-form>
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

    </v-parallax>
</template>

<script>
import RecomendacionesDashboard from '../components/RecomendacionesDashboard.vue'
import ParametrosDashboard from '../components/ParametrosDashboard.vue'
import ReproduccionActualDashboard from '../components/ReproduccionActualDashboard.vue'
import { mapGetters } from 'vuex'
import { mapMutations } from 'vuex'

const axios = require('axios');

export default {

    name: 'HomeDashboard',

    data() {
        return {
            dialogoInicial: true,

            /*Variables relacionadas con la fecha y hora de inicio*/
            fechaInicio: null,
            mostrarCalendarioInicio: false,
            mostrarRelojInicio: false,
            horaInicio: null,

            /*Variables relacionadas con la fecha y hora de fin*/
            fechaFin: null,
            mostrarCalendarioFin: false,
            mostrarRelojFin: false,
            horaFin: null,

            /*Variables relacionadas con la snackbar*/
            snackbar: false,
            textoSnackbar: ""
        }
    },
    methods:{
        establecerFechasInicioYFin(){
            var momentoActual = Date.now();
            var momentoInicio = new Date((this.fechaInicio + " ") + (this.horaInicio + ":00")).getTime();
            var momentoFin = new Date((this.fechaFin + " ") + (this.horaFin + ":00")).getTime();

            if(momentoActual < momentoInicio || momentoActual > momentoFin || this.fechaInicio == null || this.fechaFin == null || this.horaInicio == null || this.horaFin == null){
                this.textoSnackbar = "La fechas introducidas no son válidas. Revisa los datos introducidos y la hora actual"
                this.snackbar = true;
            }else{
                axios
                    .post('http://localhost:3000/establecerFechasInicioYFin', {
                        usuario: this.getUsuario,
                        momentoInicio: momentoInicio,
                        momentoFin: momentoFin
                    })
                    .then(response => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar = "Ocurrió un error al establecer las fechas. Vuelve a intentarlo";
                            this.snackbar= true;
                        }else{
                            this.dialogoInicial = false;
                            this.finalizarSetup();
                            this.$refs.parametros.actualizarEnergia;
                        }
                    })
                    .catch(error => {
                        this.textoSnackbar = "Ocurrió un error al establecer las fechas. Vuelve a intentarlo";
                        this.snackbar= true;
                        console.log(error);
                    })
            }

        },
        ...mapMutations(['finalizarSetup'])
    },
    computed:{
        ...mapGetters(['getUsuario'])
    },
    components:{
        RecomendacionesDashboard,
        ParametrosDashboard,
        ReproduccionActualDashboard
    }

}
</script>