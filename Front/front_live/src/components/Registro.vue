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
                    Regístrate en LIVE!
                </v-card-title>
                <v-card-text>
                    <v-text-field
                        label="Nombre"
                        outlined
                        clearable
                    ></v-text-field>
                    <v-text-field
                        label="Email"
                        outlined
                        clearable
                    ></v-text-field>
                    <v-text-field
                        label="Usuario"
                        outlined
                        clearable
                    ></v-text-field>
                    <v-text-field
                        label="Contraseña"
                        outlined
                        clearable
                    ></v-text-field>
                    <v-btn color="grey darken-1 white--text">Registrarse</v-btn>
                </v-card-text>
            </v-card>

            </v-col>
        </v-row>
    </v-container>
    </v-parallax>
</template>

<script>
export default {
    name: 'SignIn',

    data() {
        return {
            
        }
    },

}
</script>