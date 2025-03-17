<template>
  <div class="form-cnpj">
    <TheTitle :text="`Bem vindo, </br>${getUsuario.nome || ''}`" />
    <p class="form-cnpj__description">
      caso precise alterar a empresa associada à sua conta, basta informar um
      novo CNPJ
    </p>
    <form @submit.prevent="handleCNPJ">
      <div class="form-cnpj__fields">
        <InputType
          label="CNPJ"
          :error="erros.cnpj"
          placeholder="00.000.000/0000-00"
          v-model="fields.cnpj"
          mask="##.###.###/####-##"
          type="text"
        />
      </div>

      <LoadingButton :text="'salvar'" :loading="loading" />
    </form>
    <p class="form-cnpj__leave">
      fique tranquilo, enviaremos um e-mail quando seu acesso estiver pronto.
      <a href="" class="bar lk" @click.prevent="logout">sair <span></span></a>
    </p>
  </div>
</template>

<script>
import TheTitle from "@/components/TheTitle.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import InputType from "@/objects/InputType.vue";
import { mapGetters, mapActions } from "vuex";
import { handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";
export default {
  data() {
    return {
      loading: false,
      fields: {
        cnpj: null,
      },
      erros: {
        cnpj: {
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
  computed: {
    ...mapGetters(["getUsuario"]),
  },
  methods: {
    ...mapActions(["logout"]),
    async handleCNPJ() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;
      this.loading = true;

      try {
        const response = await this.$http.put(
          `/Empresa/${this.fields.cnpj
            .replaceAll(".", "")
            .replaceAll("/", "")}/Usuario/AlterarCNPJ`
        );
        const { cnpj, razao } = response.data;
        const novaEmpresa = {
          ...this.getUsuario,
          cnpj,
          razao,
        };
        this.$store.commit("setUsuario", novaEmpresa);
        this.$store.dispatch("toast/showToast", {
          message: "CNPJ atualizado com sucesso",
          type: "success",
        });
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
.form-cnpj {
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
  &__leave {
    line-height: 1.2em;
    span {
      width: 70% !important;
      right: 0;
      bottom: -5px;
      transform: translateX(calc(100% + 50px));
    }
  }
}
</style>
