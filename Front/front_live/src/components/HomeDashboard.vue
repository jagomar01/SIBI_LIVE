<template>
    <v-parallax
    height="700"
    src="../assets/live-background.jpg">
        <v-container>
            <v-row>
                <ReproduccionActualDashboard/>
                <ParametrosDashboard/>
                <RecomendacionesDashboard />

            </v-row>
        </v-container>
    </v-parallax>
</template>

<script>
import RecomendacionesDashboard from '../components/RecomendacionesDashboard.vue'
import ParametrosDashboard from '../components/ParametrosDashboard.vue'
import ReproduccionActualDashboard from '../components/ReproduccionActualDashboard.vue'

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
        ParametrosDashboard,
        ReproduccionActualDashboard
    }

}
</script>