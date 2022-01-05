<template>
    <v-parallax
    height="700"
    src="../assets/live-background.jpg">
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">

            <!--Card de inicio de sesión-->
            <v-card elevation="15" width="500">
                <v-card-title>
                    <h2 class="font-weight-light">Inicia sesión en LIVE!</h2>
                </v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="login">
                        <v-text-field
                            label="Usuario"
                            outlined
                            clearable
                            v-model="usuario"
                        ></v-text-field>
                        <v-text-field
                            label="Contraseña"
                            outlined
                            clearable
                            v-model="password"
                            type="password"
                        ></v-text-field>
                        <v-btn class="font-weight-regular" color="grey darken-1 white--text" type="submit">Iniciar sesión</v-btn>
                    </v-form>

                    <div>
                        <br><router-link class="font-weight-regular grey--text" to="/register">¿No tienes cuenta? Haz click aquí para registrarte</router-link>
                    </div>
                </v-card-text>
            </v-card>

            </v-col>
        </v-row>

        <!-- Snackbar advertencia -->
        <v-snackbar v-model="snackbar" class="d-flex">
            {{ textoSnackbar }}
            <v-btn color="white" fab icon @click="snackbar = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

    </v-container>
    </v-parallax>
</template>

<script>
import { mapMutations } from 'vuex'

const axios = require('axios');

export default {
    name: 'SignIn',

    data() {
        return {
            usuario:'',
            password: '',
            snackbar: false,
            textoSnackbar: "",
        }
    },
    methods: {
        login(){
            if(this.usuario.length == '0' || this.password.length == '0'){
                this.textoSnackbar = "Por favor, rellena todos los campos";
                this.snackbar = true;
            }else{
                axios
                    .post('http://localhost:3000/login' ,{
                        usuario: this.usuario,
                        password: this.password
                    })
                    .then((response) => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Incorrecto'})){
                            this.textoSnackbar = "Usuario o contraseña incorrectos";
                            this.snackbar = true;
                            this.limpiarFormulario();
                        }else if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar ="Se produjo un error. Inténtalo de nuevo";
                            this.snackbar = true;
                            this.limpiarFormulario();
                        }else{
                            this.cambiarUsuario(this.usuario);
                            this.$router.push({name: 'Dashboard'});
                            this.limpiarFormulario();
                        }
                    })
                    .catch(error =>{
                        this.textoSnackbar = "Se produjo un error. Revisa los datos e inténtalo de nuevo";
                        this.snackbar = true;
                        this.limpiarFormulario();
                        console.log(error);
                    })
            }
        },
        limpiarFormulario(){
            this.usuario = "";
            this.password = "";
        },
        ...mapMutations(['cambiarUsuario'])
    },
}
</script>