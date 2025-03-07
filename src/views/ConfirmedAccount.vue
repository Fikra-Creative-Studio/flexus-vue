<template>
  <FeedbackMessage class="banner--blue banner--medium">
    <div v-if="loading">
      <h2>aguarde</h2>
      <p>estamos ativando sua conta...</p>
    </div>
    <div v-else-if="success">
      <h2>conta ativada com sucesso!</h2>
      <p>
        agora que sua conta está confirmada, basta fazer login e explorar tudo o
        que preparamos para você!
      </p>
    </div>
    <div v-else>
      <h2>não conseguimos confirmar sua conta!</h2>
      <p>o link que você recebeu pode ter expirado ou já foi usado.</p>
      <p>
        <a href="" @click.prevent="reenviarEmail"
          >Reenviar e-mail de confirmação</a
        >
      </p>
    </div>
  </FeedbackMessage>
</template>

<script>
import FeedbackMessage from "@/components/FeedbackMessage.vue";

export default {
  components: {
    FeedbackMessage,
  },
  data() {
    return {
      loading: true,
      success: false,
    };
  },
  methods: {
    reenviarEmail() {
      // Usuario/ReenviarEmail
    },
  },
  async created() {
    const confirmToken = this.$route.query.confirm;

    setTimeout(async () => {
      if (!confirmToken) {
        this.loading = false;
        return;
      }

      try {
        const response = await this.$http.post(`/Usuario/Confirmar`, {
          id: confirmToken,
        });
        this.success = response.status === 200;
      } catch (error) {
        console.error("Erro ao confirmar conta:", error);
        this.success = false;
      } finally {
        this.loading = false;
      }
    }, 2000);
  },
};
</script>
