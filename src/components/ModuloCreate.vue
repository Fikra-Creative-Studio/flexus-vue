<template>
  <form @submit.prevent="handleSubmit" class="modulo-form">
    <TheModal @close="resetModal">
      <h2>adicionar lote</h2>
      <form @submit.prevent="submitLote" modalType="second">
        <div class="modal__form">
          <InputType
            label="lote"
            :error="errors.newLote"
            placeholder="digite o nome do lote"
            v-model="fields.newLote"
            type="text"
            class="gold"
          />
        </div>
        <div class="modal__buttons">
          <a href="" @click.prevent="resetModal()" class="btn btn--secondary"
            >cancelar</a
          >
          <LoadingButton :text="'cadastrar'" :loading="saveLoading" />
        </div>
      </form>
    </TheModal>
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
      <div class="modulo-form__fields__lot">
        <a @click.prevent="showModal"> adicionar lote </a>
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
import TheModal from "@/components/TheModal.vue";
import { formatSelect, handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isEditing: false,
      loading: false,
      saveLoading: false,
      fields: {
        newLote: null,
        nome: null,
        cliente: null,
        lote: null,
      },
      errors: {
        newLote: {
          status: false,
          msg: null,
        },
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
    TheModal,
  },
  computed: {
    clientsFormated() {
      return formatSelect(this.clients, "nome", "id");
    },
    lotsFormated() {
      return formatSelect(this.lots, "nome", "id");
    },
  },
  watch: {
    $route(to, from) {
      if (from.params.id === "new" && to.params.id !== "new") {
        this.init();
      }
    },
  },
  methods: {
    ...mapActions("modal", ["openSecondModal", "closeSecondModal"]),
    showModal() {
      this.openSecondModal();
    },
    resetModal() {
      this.fields.newLote = null;
      this.closeSecondModal();
    },
    async submitLote() {
      const { isValid, erros } = validate({ newLote: this.fields.newLote });
      this.errors.newLote = erros.newLote;
      if (!isValid) return;
      this.saveLoading = true;
      try {
        const response = await this.$http.post("/Lote/Cadastrar", {
          nome: this.fields.newLote,
        });
        this.lots.push(response.data);
        this.fields.lote = response.data.id;
        this.resetModal();
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.saveLoading = false;
      }
    },
    async handleSubmit() {
      let fields = { ...this.fields };
      delete fields.newLote;
      const { isValid, erros } = validate(fields);
      this.errors = erros;
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
          this.$router.push("/modules");
        } else {
          const response = await this.$http.post("/Modulo/Cadastrar", payload);
          const moduleId = response.data.id;
          const confirm = await this.$swal.fire({
            title: "módulo cadastrado",
            text: "deseja adicionar itens?",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "sim, adicionar itens",
            cancelButtonText: "não",
            confirmButtonColor: "#315d68",
            cancelButtonColor: "#363434",
          });
          if (confirm.isConfirmed) {
            this.$router.push(`/modules/${moduleId}/items`);
          } else {
            this.$router.push("/modules");
          }
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async getClients() {
      try {
        const response = await this.$http.get("/Cliente/Listar");
        this.clients = response.data;
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async getLots() {
      try {
        const response = await this.$http.get("/Lote/Listar");
        this.lots = response.data;
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async getModule(id) {
      try {
        const response = await this.$http.get(`/Modulo/${id}`);
        const data = response.data;
        this.fields.nome = data.nome;
        this.fields.cliente = data.clienteId;
        this.fields.lote = data.loteId;
      } catch (error) {
        handleAxiosError(error);
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
    &__lot {
      position: relative;
      z-index: 1;
      a {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 0.75em;
        text-decoration: underline;
        color: $color-brand;
        cursor: pointer;
        z-index: 2;
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
