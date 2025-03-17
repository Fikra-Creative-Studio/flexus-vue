<template>
  <div class="form-create">
    <TheTitle text="criar conta" />
    <form @submit.prevent="handleCreate">
      <div class="form-create__fields">
        <InputType
          class="form-group--error-left"
          label="nome"
          :error="erros.nome"
          placeholder="digite seu nome"
          v-model="fields.nome"
          type="text"
        />
        <InputType
          label="e-mail"
          :error="erros.email"
          placeholder="digite seu e-mail"
          v-model="fields.email"
          type="email"
        />
        <div class="form-create__fields__row">
          <InputType
            label="senha"
            :error="erros.senha"
            placeholder="digite sua senha"
            v-model="fields.senha"
            type="password"
          />
          <InputType
            label="confirmar senha"
            :error="erros.confirmar_senha"
            placeholder="digite sua senha"
            v-model="fields.confirmar_senha"
            type="password"
          />
        </div>
        <InputType
          label="CPF"
          :error="erros.cpf"
          placeholder="000.000.000-00"
          v-model="fields.cpf"
          mask="###.###.###-##"
          type="text"
        />
        <InputType
          label="CNPJ"
          :error="erros.cnpj"
          placeholder="00.000.000/0000-00"
          v-model="fields.cnpj"
          mask="##.###.###/####-##"
          type="text"
        />
      </div>
      <LoadingButton :text="'cadastrar'" :loading="loading" />
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
        nome: "",
        email: "",
        senha: "",
        confirmar_senha: "",
        cpf: "",
        cnpj: "",
      },
      erros: {
        nome: {
          status: false,
          msg: null,
        },
        email: {
          status: false,
          msg: null,
        },
        senha: {
          status: false,
          msg: null,
        },
        confirmar_senha: {
          status: false,
          msg: null,
        },
        cpf: {
          status: false,
          msg: null,
        },
        cnpj: {
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
    async handleCreate() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;
      this.loading = true;

      try {
        let payload = { ...this.fields };
        delete payload.confirmar_senha;
        await this.$http.post("/Usuario/Criar", payload);
        this.$router.push("/confirm-account");
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
