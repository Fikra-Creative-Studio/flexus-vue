<template>
  <FeedbackMessage class="banner--blue banner--medium">
    <h2>
      te enviamos um<br />
      e-mail!
    </h2>
    <p>
      verifique seu e-mail e clique no link de confirmação para ativar sua
      conta.
    </p>
    <p>
      <a href="">reenviar e-mail de confirmação</a>
    </p>
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
