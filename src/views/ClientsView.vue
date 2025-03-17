<template>
  <div>
    <TheHeader title="Clientes">
      <a href="" @click.prevent="handleOpenModal()" class="btn btn--primary">
        adicionar cliente
      </a>
    </TheHeader>
    <TheLoading v-if="loading" />
    <template v-else>
      <section class="filters">
        <div class="filters__wrapper">
          <div class="filters__content">
            <InputType
              label=""
              placeholder="busque por nome"
              v-model="filters.search"
              type="text"
            />
          </div>
        </div>
      </section>
      <div v-if="items.length">
        <table class="table">
          <thead>
            <tr>
              <th>nome</th>
              <th>ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.nome }}
              </td>
              <td class="table__buttons">
                <a
                  href=""
                  @click.prevent="handleOpenModal(item)"
                  class="primary"
                  tooltip="editar cliente"
                >
                  <i class="flaticon-edit-text"></i>
                </a>
                <a
                  href=""
                  class="red"
                  @click.prevent="deleteItem(item.id)"
                  tooltip="excluir cliente"
                >
                  <i class="flaticon-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <FeedbackMessage class="banner--gold banner--home banner--titled">
          <h2>nenhum cliente foi adicionado até o momento</h2>
          <p>
            que tal começar agora? cadastre seu primeiro cliente.
            <a href="" @click.prevent="handleOpenModal()" class="lk"
              >adicionar cliente</a
            >
          </p>
        </FeedbackMessage>
      </div>
    </template>

    <TheModal @close="resetModal" modalType="first">
      <h2>{{ isEdit ? "editar cliente" : "adicionar cliente" }}</h2>
      <form @submit.prevent="submitItem">
        <div class="modal__form">
          <InputType
            label="nome"
            :error="errors.nome"
            placeholder="digite o nome do cliente"
            v-model="fields.nome"
            type="text"
            class="gold"
          />
        </div>
        <div class="modal__buttons">
          <a href="" @click.prevent="resetModal()" class="btn btn--secondary"
            >cancelar</a
          >
          <LoadingButton
            :text="isEdit ? 'salvar' : 'cadastrar'"
            :loading="saveLoading"
          />
        </div>
      </form>
    </TheModal>
  </div>
</template>
<script>
import TheModal from "@/components/TheModal.vue";
import TheHeader from "@/components/TheHeader.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import TheLoading from "@/components/TheLoading.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import InputType from "@/objects/InputType.vue";
import { handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      saveLoading: false,
      isEdit: false,
      currentItemId: null,
      loading: true,
      items: [],
      filters: {
        search: null,
      },
      fields: {
        nome: null,
      },
      errors: {
        nome: {
          status: false,
          msg: null,
        },
      },
    };
  },
  components: {
    TheModal,
    TheHeader,
    FeedbackMessage,
    LoadingButton,
    TheLoading,
    InputType,
  },
  methods: {
    ...mapActions("modal", ["openModal", "closeModal"]),
    async deleteItem(id) {
      try {
        const confirm = await this.$swal.fire({
          title: "excluir?",
          text: "essa ação não pode ser desfeita!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "sim, excluir!",
          cancelButtonText: "cancelar",
          confirmButtonColor: "#a41313",
          cancelButtonColor: "#363434",
        });

        if (confirm.isConfirmed) {
          await this.$http.delete(`/Cliente/${id}/Excluir`);

          this.items = this.items.filter(item => item.id !== id);

          this.$swal.fire(
            "Excluído!",
            "O cliente foi removido com sucesso.",
            "success"
          );
        }
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async submitItem() {
      const { isValid, erros } = validate(this.fields);
      this.errors = erros;
      if (!isValid) return;
      this.saveLoading = true;

      try {
        if (this.isEdit) {
          const response = await this.$http.put(`/Cliente/Editar`, {
            id: this.currentItemId,
            ...this.fields,
          });
          const index = this.items.findIndex(
            item => item.id === this.currentItemId
          );
          if (index !== -1) {
            this.items.splice(index, 1, response.data);
            this.$swal.fire(
              "Feito!",
              "O cliente foi atualizado com sucesso.",
              "success"
            );
          }
        } else {
          const response = await this.$http.post(
            "/Cliente/Cadastrar",
            this.fields
          );
          this.items.push(response.data);
          this.$swal.fire(
            "Feito!",
            "O cliente foi cadastrado com sucesso.",
            "success"
          );
        }
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.saveLoading = false;
        this.resetModal();
      }
    },
    handleOpenModal(item = null) {
      if (item) {
        this.isEdit = true;
        this.fields.nome = item.nome;
        this.currentItemId = item.id;
      } else {
        this.isEdit = false;
        this.fields.nome = null;
        this.currentItemId = null;
      }
      this.openModal();
    },
    resetModal() {
      this.isEdit = false;
      this.fields.nome = null;
      this.currentItemId = null;
      this.closeModal();
    },
    async getClients() {
      try {
        const response = await this.$http.get("/Cliente/Listar");
        this.items = response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      await this.getClients();
    },
  },
  created() {
    this.init();
  },
};
</script>
