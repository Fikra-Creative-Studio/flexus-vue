<template>
  <div>
    <TheHeader title="Etapas"> </TheHeader>
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
            <SelectType
              label=""
              :activeSearch="false"
              placeholder="selecione o status"
              v-model="filters.status"
              :items="statusFormated"
              :current="filters.status"
            />
          </div>
        </div>
      </section>
      <section class="alert">
        <p>arraste os items para reordenar</p>
      </section>
      <div v-if="items.length">
        <table class="table">
          <thead>
            <tr>
              <th>ordem</th>
              <th>nome</th>
              <th>status</th>
              <th>ações</th>
            </tr>
          </thead>
          <draggable tag="tbody" :list="items" @end="updatePositions">
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.posicao }}
              </td>
              <td>
                {{ item.nome }}
              </td>
              <td>
                {{ item.ativo ? "ativo" : "inativo" }}
              </td>
              <td class="table__buttons">
                <a
                  href=""
                  @click.prevent="handleOpenModal(item)"
                  class="primary"
                  tooltip="editar etapa"
                >
                  <i class="flaticon-edit-text"></i>
                </a>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </template>

    <TheModal @close="resetModal" modalType="first">
      <h2>{{ isEdit ? "editar etapa" : "adicionar etapa" }}</h2>
      <form @submit.prevent="submitItem">
        <div class="modal__form">
          <InputType
            label="nome"
            :error="errors.nome"
            placeholder="digite o nome do etapa"
            v-model="fields.nome"
            type="text"
            class="gold"
          />
          <SelectType
            label="status"
            :error="errors.ativo"
            placeholder="selecione o status"
            v-model="fields.ativo"
            :activeSearch="false"
            :items="statusFields"
            :current="fields.ativo"
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
import { VueDraggableNext } from "vue-draggable-next";
import TheModal from "@/components/TheModal.vue";
import TheHeader from "@/components/TheHeader.vue";
import TheLoading from "@/components/TheLoading.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import InputType from "@/objects/InputType.vue";
import SelectType from "@/objects/SelectType.vue";
import { formatSelect, handleAxiosError } from "@/utils/utils.js";
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
      status: [
        {
          name: "todos",
          value: "",
        },
        {
          name: "ativo",
          value: "ativo",
        },
        {
          name: "inativo",
          value: "inativo",
        },
      ],
      filters: {
        search: null,
        status: "",
      },
      fields: {
        nome: null,
        ativo: null,
      },
      errors: {
        nome: {
          status: false,
          msg: null,
        },
        ativo: {
          status: false,
          msg: null,
        },
      },
    };
  },
  components: {
    draggable: VueDraggableNext,
    TheModal,
    TheHeader,
    LoadingButton,
    TheLoading,
    InputType,
    SelectType,
  },
  computed: {
    statusFormated() {
      return formatSelect(this.status, "name", "value");
    },
    statusFields() {
      return this.status.filter(item => item.value !== "");
    },
  },
  methods: {
    ...mapActions("modal", ["openModal", "closeModal"]),
    payload() {
      return {
        nome: this.fields.nome,
        ativo: this.fields.ativo == "ativo" ? true : false,
        posicao: this.fields.posicao,
      };
    },
    async submitItem() {
      const { isValid, erros } = validate(this.fields);
      this.errors = erros;
      if (!isValid) return;
      this.saveLoading = true;

      try {
        if (this.isEdit) {
          const response = await this.$http.put(`/Etapa/Editar`, {
            id: this.currentItemId,
            ...this.payload(),
          });
          const index = this.items.findIndex(
            item => item.id === this.currentItemId
          );
          if (index !== -1) {
            this.items.splice(index, 1, response.data);
            this.$swal.fire(
              "Feito!",
              "A etapa foi atualizada com sucesso.",
              "success"
            );
          }
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
        this.fields.ativo = item.ativo ? "ativo" : "inativo";
        this.fields.posicao = item.posicao;
        this.currentItemId = item.id;
      } else {
        this.isEdit = false;
        this.fields.nome = null;
        this.fields.ativo = null;
        this.fields.posicao = this.items.length + 1;
        this.currentItemId = null;
      }
      this.openModal();
    },
    resetModal() {
      this.isEdit = false;
      this.fields.nome = null;
      this.fields.ativo = null;
      this.fields.posicao = null;
      this.currentItemId = null;
      this.closeModal();
    },
    async getSteps() {
      try {
        const response = await this.$http.get("/Etapa/Listar");
        this.items = response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      await this.getSteps();
    },
    async updatePositions() {
      this.items.forEach((item, index) => {
        item.posicao = index + 1;
      });
      try {
        await this.$http.put(`/Etapa/Editar`, this.items);
        this.$swal.fire(
          "Feito!",
          "As posições foram atualizadas com sucesso.",
          "success"
        );
      } catch (error) {
        handleAxiosError(error);
      }
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
table {
  tr {
    th {
      &:nth-child(1) {
        width: 100px !important;
      }
    }
  }
}
</style>
