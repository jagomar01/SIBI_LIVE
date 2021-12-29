<template>
  <v-app>

    <!-- Barra de navegación modo oscuro-->
    <v-app-bar
      dark
    >
      <!-- Espaciadores + logo-->
      <v-spacer></v-spacer>
      <div class="justify-center">
        <v-img
          alt="LIVE!"
          contain
          src="./assets/Logo SIBI.png"
          transition="scale-transition"
          max-width="150"
          max-height="150"
        />
      </div>
      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>