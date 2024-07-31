<script setup lang="ts"></script>

<template>
  <v-responsive>
    <v-app>
      <v-main class="d-flex align-center justify-center">
        <v-btn>Add Expense</v-btn>
      </v-main>

      <v-bottom-navigation grow color="secondary">
        <v-btn>
          <v-icon>mdi-home</v-icon>
          <span>Home</span>
        </v-btn>

        <v-btn>
          <v-icon>mdi-chart-bar-stacked</v-icon>
          <span>Statistic</span>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </v-responsive>
</template>
