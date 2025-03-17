<template>
  <FeedbackMessage class="banner--gold banner--home banner--medium">
    <h2>
      sua conta está aguardando aprovação da
      <strong>{{ getUsuario.razao }} </strong>
      <small>{{ cnpjFormatado }}</small>
    </h2>
    <p>após a liberação, você poderá acessar todos os recursos.</p>
  </FeedbackMessage>
</template>

<script>
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import { formatCPNJ } from "@/utils/utils.js";
import { mapGetters } from "vuex";
export default {
  components: {
    FeedbackMessage,
  },
  computed: {
    ...mapGetters(["getUsuario"]),
    cnpjFormatado() {
      return formatCPNJ(this.getUsuario.cnpj);
    },
  },
  created() {
    if (this.getUsuario.nivelAcesso) {
      this.$router.push({ name: "modules" });
    }
  },
};
</script>

<style lang="scss" scoped>
h2 {
  small {
    font-size: 0.75em;
    margin-left: 10px;
    font-weight: 400;
  }
}
</style>
