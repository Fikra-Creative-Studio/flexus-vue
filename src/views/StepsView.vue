<template>
  <div>
    <TheHeader title="etapas">
      <a href="" @click.prevent class="btn btn--primary"> adicionar etapa </a>
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
