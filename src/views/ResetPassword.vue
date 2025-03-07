<template>
  <FeedbackMessage class="banner--blue banner--medium">
    <div v-if="$route.query.token">
      <h2>escolha uma nova senha para sua conta</h2>
      <p>lembre-se de que ela deve ser segura e fácil de lembrar.</p>
    </div>
    <div v-else>
      <h2>não conseguimos encontrar sua conta</h2>
      <p>
        informe seu e-mail e enviaremos um link para você criar uma nova senha.
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
};
</script>
