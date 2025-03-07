<template>
  <div class="form-login">
    <TheTitle text="Entre na </br>sua conta" />
    <form @submit.prevent="handleSubmit">
      <div class="form-login__fields">
        <InputType
          label="e-mail"
          :error="erros.email"
          placeholder="digite seu e-mail"
          v-model="fields.email"
          type="email"
        />
        <InputType
          label="senha"
          :error="erros.senha"
          placeholder="digite sua senha"
          v-model="fields.senha"
          type="password"
        />
      </div>
      <p class="form-login__recover">
        <router-link to="forgot-password" class="lk"
          >recuperar senha</router-link
        >
      </p>

      <LoadingButton :text="'entrar'" :loading="loading" />
    </form>
    <p class="form-login__create">
      ainda não tem uma conta?
      <router-link to="/create" class="bar lk"
        >cadastre-se <span></span
      ></router-link>
    </p>
  </div>
</template>

<script>
import InputType from "@/objects/InputType.vue";
import TheTitle from "@/components/TheTitle.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { mapActions } from "vuex";
import { handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";

export default {
  data() {
    return {
      fields: {
        email: "",
        senha: "",
      },
      erros: {
        email: { status: false, msg: null },
        senha: { status: false, msg: null },
      },
      loading: false,
    };
  },
  components: {
    TheTitle,
    InputType,
    LoadingButton,
  },
  methods: {
    ...mapActions(["login"]),

    async handleSubmit() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;

      this.loading = true;
      try {
        const response = await this.$http.post("/Auth", {
          email: this.fields.email,
          senha: this.fields.senha,
        });

        const { usuario, token } = response.data;

        this.login({ usuario, token });

        this.$router.push("/");
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
.form-login {
  form {
    .form-group {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
  }
  &__recover {
    text-align: right;
    margin: 10px 0 20px;
    a {
      font-size: 0.875em;
      font-weight: 500;
    }
  }
  &__create {
    margin-top: 40px;
    .bar {
      position: relative;
      span {
        width: 240px;
        position: absolute;
        right: 0;
        bottom: -10px;
        transform: translateX(calc(100% - 92px));
      }
    }
  }
}
</style>
