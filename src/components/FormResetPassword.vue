<template>
  <div class="form-create">
    <TheTitle text="Vamos criar uma nova senha" />
    <form @submit.prevent="handleSubmit">
      <div class="form-create__fields">
        <InputType
          label="nova senha"
          :error="erros.senha"
          placeholder="digite sua senha"
          v-model="fields.senha"
          type="password"
        />
        <InputType
          label="confirmar  senha"
          :error="erros.confirmar_senha"
          placeholder="confirme sua senha"
          v-model="fields.confirmar_senha"
          type="password"
        />
      </div>
      <LoadingButton :text="'salvar'" :loading="loading" />
    </form>
    <p class="form-create__login">
      <router-link to="/login" class="bar bar--inverse lk"
        >conecte-se<span></span>
      </router-link>
      , se você já possui conta!
    </p>
  </div>
</template>

<script>
import InputType from "@/objects/InputType.vue";
import TheTitle from "@/components/TheTitle.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";

export default {
  data() {
    return {
      fields: {
        senha: "",
        confirmar_senha: "",
      },
      erros: {
        senha: {
          status: false,
          msg: null,
        },
        confirmar_senha: {
          status: false,
          msg: null,
        },
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
    async handleSubmit() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;
      this.loading = true;

      try {
        let payload = { ...this.fields };
        delete payload.confirmar_senha;
        await this.$http.post(
          `/Auth/ResetarSenha/${this.$route.query.token}`,
          payload
        );
        this.$swal.fire("feito", "senha atualizada com sucesso", "success");
        this.$router.push("/login");
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
.form-create {
  &__fields {
    margin-bottom: 40px;
    .form-group {
      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }
    &__row {
      display: flex;
      gap: 20px;
      .form-group {
        margin-bottom: 20px;
      }
    }
  }
  &__login {
    margin-top: 40px;
    .bar {
      position: relative;
      span {
        width: calc(60px + 13vw);
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
