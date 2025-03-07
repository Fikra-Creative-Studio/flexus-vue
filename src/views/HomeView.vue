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
import { mapGetters } from "vuex";
export default {
  components: {
    FeedbackMessage,
  },
  computed: {
    ...mapGetters(["getUsuario"]),
    cnpjFormatado() {
      if (!this.getUsuario?.cnpj) return "";
      return this.getUsuario.cnpj.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        "$1.$2.$3/$4-$5"
      );
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
