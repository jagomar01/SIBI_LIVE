<template>
    <v-parallax
    height="700"
    src="../assets/live-background.jpg">
    <v-container>
        <v-row class="text-center">
            <v-col cols="12">

            <!--Card de registro-->
            <v-card elevation="15" width="500">
                <v-card-title>
                    <h2 class="font-weight-light">Regístrate en LIVE!</h2>
                </v-card-title>
                <v-card-text>
                    <v-form @enter="registrar" @submit.prevent="registrar" class="pb-2">
                        <v-text-field
                            label="Nombre"
                            outlined
                            clearable
                            v-model="nombre"
                        ></v-text-field>
                        <v-text-field
                            label="Email"
                            outlined
                            clearable
                            v-model="email"
                        ></v-text-field>
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
                        <v-btn class="font-weight-regular" color="grey darken-1 white--text" type="submit">Registrarse</v-btn>
                    </v-form>
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

export default {
    name: 'SignIn',

    data() {
        return {
            snackbar: false,
            textoSnackbar: "",
            usuario:'',
            password: '',
            nombre: '',
            email: ''
        }
    },
    methods: {
        limpiarFormulario(){
            this.usuario = "";
            this.password = "";
            this.nombre = "";
            this.email = "";
        },
        registrar(){
            if(this.usuario.length == '0' || this.password.length == '0' || this.nombre.length == '0' || this.email.length == '0'){
                this.textoSnackbar = "Por favor, rellena todos los campos";
                this.snackbar = true;
            }else{
                axios
                    .post('http://localhost:3000/registro' ,{
                        usuario: this.usuario,
                        password: this.password,
                        email: this.email,
                        nombre: this.nombre

                    })
                    .then((response) => {
                        if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                            this.textoSnackbar = "Se produjo un error. Revisa los datos e inténtalo de nuevo";
                            this.snackbar = true;
                            this.limpiarFormulario();
                        }else{
                            axios
                                .post('http://localhost:3000/crearNodoDeseo', {
                                    usuario: this.usuario,
                                })
                                .then(response => {
                                    if(JSON.stringify(response.data) == JSON.stringify({msg: 'Error'})){
                                        this.textoSnackbar = "Se produjo un error. Revisa los datos e inténtalo de nuevo";
                                        this.snackbar = true;
                                        this.limpiarFormulario();
                                    }else{
                                        this.cambiarUsuario(this.usuario);
                                        this.$router.push({name: 'Dashboard'});
                                        this.limpiarFormulario();
                                    }
                                })
                                .catch(error => {
                                    this.textoSnackbar = "Se produjo un error. Revisa los datos e inténtalo de nuevo";
                                    this.snackbar = true;
                                    this.limpiarFormulario();
                                    console.log(error);
                                })
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
        ...mapMutations(['cambiarUsuario'])
    }

}
</script>