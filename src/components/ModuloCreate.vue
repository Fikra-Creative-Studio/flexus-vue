<template>
  <form @submit.prevent="handleSubmit" class="modulo-form">
    <div class="modulo-form__fields">
      <InputType
        label="nome"
        :error="errors.nome"
        placeholder="digite o nome do módulo"
        v-model="fields.nome"
        type="text"
        class="gold"
      />
      <SelectType
        label="cliente"
        :error="errors.cliente"
        placeholder="selecione o cliente"
        v-model="fields.cliente"
        :current="fields.cliente"
        :items="clientsFormated"
        class="gold"
      />
      <SelectType
        label="lote"
        :error="errors.lote"
        placeholder="selecione o lote"
        v-model="fields.lote"
        :current="fields.lote"
        :items="lotsFormated"
        class="gold"
      />
    </div>
    <div class="modulo-form__buttons">
      <LoadingButton
        :text="isEditing ? 'salvar' : 'cadastrar'"
        :loading="loading"
      />
      <router-link
        class="btn btn--secondary btn--full"
        :to="{ name: 'modules' }"
      >
        cancelar
      </router-link>
    </div>
  </form>
</template>

<script>
import InputType from "@/objects/InputType.vue";
import SelectType from "@/objects/SelectType.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { formatSelect } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";

export default {
  data() {
    return {
      isEditing: false,
      loading: false,
      fields: {
        nome: null,
        cliente: null,
        lote: null,
      },
      errors: {
        nome: {
          status: false,
          msg: null,
        },
        cliente: {
          status: false,
          msg: null,
        },
        lote: {
          status: false,
          msg: null,
        },
      },
      clients: [],
      lots: [],
    };
  },
  components: {
    InputType,
    SelectType,
    LoadingButton,
  },
  computed: {
    clientsFormated() {
      return formatSelect(this.clients, "nome", "id");
    },
    lotsFormated() {
      return formatSelect(this.lots, "nome", "id");
    },
  },
  methods: {
    async handleSubmit() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;
      this.loading = true;

      try {
        let payload = {
          loteId: this.fields.lote,
          clienteId: this.fields.cliente,
          nome: this.fields.nome,
        };
        if (this.isEditing) {
          await this.$http.put("/Modulo/Editar", {
            moduloId: this.$route.params.id,
            ...payload,
          });
        } else {
          await this.$http.post("/Modulo/Cadastrar", payload);
        }
        this.$router.push("/modules");
      } catch (error) {
        this.$store.dispatch("toast/showToast", {
          message: error.response.data.error,
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    async getClients() {
      try {
        const response = await this.$http.get("/Cliente/Listar");
        this.clients = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getLots() {
      try {
        const response = await this.$http.get("/Lote/Listar");
        this.lots = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getModule(id) {
      try {
        const response = await this.$http.get(`/Modulo/${id}`);
        const data = response.data;
        this.fields.nome = data.nome;
        this.fields.cliente = data.cliente;
        this.fields.lote = data.lote;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      const id = this.$route.params.id;
      if (id && id !== "new") {
        this.isEditing = true;
        await this.getModule(id);
      }
      await this.getClients();
      await this.getLots();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style scoped lang="scss">
.modulo-form {
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: calc(100vh - 184px);
  &__fields {
    margin-bottom: auto;
    .form-group {
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
  }
  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
