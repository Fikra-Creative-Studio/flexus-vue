<template>
  <div class="form-forgot-password">
    <TheTitle text="Esqueceu <br/>a senha? " />
    <form @submit.prevent="handleSubmit" v-if="!success">
      <div class="form-forgot-password__fields">
        <InputType
          label="e-mail"
          :error="erros.email"
          placeholder="digite seu e-mail"
          v-model="fields.email"
          type="email"
        />
      </div>

      <LoadingButton :text="'enviar'" :loading="loading" />
    </form>
    <div v-else>
      <h2>e-mail enviado</h2>
      <p>confira seu e-mail</p>
    </div>

    <p class="form-forgot-password__login">
      <router-link to="/login" class="bar bar--inverse lk"
        >conecte-se<span></span>
      </router-link>
      , se você já possui conta!
    </p>
  </div>
</template>

<script>
import TheTitle from "@/components/TheTitle.vue";
import InputType from "@/objects/InputType.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";

export default {
  data() {
    return {
      loading: false,
      success: false,
      fields: {
        email: "",
      },
      erros: {
        email: {
          status: false,
          msg: null,
        },
      },
    };
  },
  components: {
    TheTitle,
    InputType,
    LoadingButton,
  },
  methods: {
    async handleSubmit() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;
      this.loading = true;
      try {
        await this.$http.post("/Auth/EsqueceuSenha", this.fields);
        this.$swal.fire("feito", "e-mail enviado com sucesso", "success");
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form-forgot-password {
  &__description {
    font-size: 1.25em;
    line-height: 1.3em;
  }
  form {
    margin: 40px 0;
    .form-group {
      margin-bottom: 20px;
    }
  }

  &__login {
    margin-top: 40px;
    .bar {
      position: relative;
      span {
        width: 240px;
        position: absolute;
        right: initial;
        left: 0;
        bottom: -10px;
        transform: translateX(calc(-100% + 92px));
      }
    }
  }
}
</style>
