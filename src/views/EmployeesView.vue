<template>
  <div>
    <TheHeader title="funcionários">
      <a href="" @click.prevent class="btn btn--primary">
        adicionar funcionário
      </a>
    </TheHeader>
  </div>
</template>
<script>
import TheHeader from "@/components/TheHeader.vue";

export default {
  data() {
    return {
      loading: true,
      items: [],
    };
  },
  components: {
    TheHeader,
  },
};
</script>
