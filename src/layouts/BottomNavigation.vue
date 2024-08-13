<template>
  <v-bottom-navigation grow color="primary">
    <v-btn :to="{ name: 'Home' }">
      <v-icon>mdi-wallet-bifold</v-icon>
      <span>{{ $t("bottomNavigation.home") }}</span>
    </v-btn>

    <v-btn :to="{ name: 'Statistic' }">
      <v-icon>mdi-chart-bar-stacked</v-icon>
      <span>{{ $t("bottomNavigation.statistic") }}</span>
    </v-btn>

    <v-btn :to="{ name: 'Profile' }">
      <v-icon>mdi-account</v-icon>
      <span>{{ $t("bottomNavigation.profile") }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>
