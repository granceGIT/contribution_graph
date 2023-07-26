<template>
  <div class="content">
      <h2>Contribution graph</h2>

      <Suspense>
          <template #default>
              <ContributionGraph />
          </template>
          <template #fallback>
              <LoadingSpinner />
          </template>
      </Suspense>
  </div>
</template>

<script setup>

import ContributionGraph from "@/components/ContributionGraph.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
</script>

<style>
*,*::before,*::after{
    box-sizing: border-box;
}

body{
    background-color: #fff;
    color: #000;
    font-family:Arial,sans-serif;
}

.content{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
