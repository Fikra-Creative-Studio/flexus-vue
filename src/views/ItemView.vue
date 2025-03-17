<template>
  <div>
    <TheHeader title="Itens">
      <a
        href=""
        @click.prevent="openModal"
        class="btn btn--primary"
        v-if="!ModuleNew"
      >
        adicionar item
      </a>
    </TheHeader>
    <TheLoading v-if="loading" />
    <template v-else>
      <div v-if="items.length">
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
                v-if="steps.length"
                label=""
                placeholder="selecione a etapa"
                v-model="filters.step"
                :items="stepFormated"
              />
            </div>
            <div class="filters__buttons">
              <a href="" @click.prevent="expandAll()" class="btn btn--black">
                {{ expanded ? "recolher itens" : "expandir itens" }}
              </a>
            </div>
          </div>
        </section>
        <div class="custom-table">
          <ul class="custom-table__header">
            <li>nome</li>
            <li>etapa atual</li>
            <li>ações</li>
          </ul>
          <div class="custom-table__body">
            <div
              v-for="(item, index) in items"
              :key="index"
              :class="{ active: item.isActive }"
              class="custom-table__row"
            >
              <div class="custom-table__row__content">
                <ul class="custom-table__row__content__infos">
                  <li>
                    {{ item.nome }}
                  </li>
                  <li>
                    <span @click="toggleStep(item)"
                      >{{ currentStep(item).nome }}
                      <i class="flaticon-chevron-down"></i
                    ></span>
                  </li>
                  <li class="custom-table__buttons">
                    <a
                      class="next"
                      @click.prevent="nextStep(item)"
                      tooltip="avançar para próxima etapa"
                      v-if="!item.etapasdoItem.every(etapa => etapa.status)"
                    >
                      <i class="flaticon-down-arrow"></i>
                    </a>
                    <a
                      class="primary"
                      @click.prevent="handleOpenModal(item)"
                      tooltip="editar item"
                    >
                      <i class="flaticon-edit-text"></i>
                    </a>
                    <a
                      href=""
                      class="red"
                      @click.prevent="deleteItem(item.id)"
                      tooltip="excluir item"
                    >
                      <i class="flaticon-trash"></i>
                    </a>
                  </li>
                </ul>
                <div class="custom-table__row__content__steps">
                  <BarStep
                    :steps="item.etapasdoItem"
                    :current="currentStep(item).id"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <FeedbackMessage class="banner--gold banner--home banner--titled">
          <h2>
            {{
              ModuleNew
                ? "preencha os campos ao lado para cadastrar seu módulo!"
                : "nenhum item adicionado para produção"
            }}
          </h2>
          <p v-if="!ModuleNew">
            que tal começar agora? cadastre seu primeiro item.
            <a class="lk" @click.prevent="openModal">adicionar item</a>
          </p>
        </FeedbackMessage>
      </div>
    </template>
    <TheModal @close="resetModal" modalType="first">
      <h2>{{ isEdit ? "editar item" : "adicionar item" }}</h2>
      <form @submit.prevent="submitItem">
        <div class="modal__form">
          <InputType
            label="nome"
            :error="erros.nome"
            placeholder="digite o nome do item"
            v-model="fields.nome"
            type="text"
            class="gold"
          />
          <InputType
            label="código EAN"
            placeholder="digite o código EAN"
            v-model="fields.codigoEAN"
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
import BarStep from "@/components/BarStep.vue";
import TheModal from "@/components/TheModal.vue";
import TheHeader from "@/components/TheHeader.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import TheLoading from "@/components/TheLoading.vue";
import InputType from "@/objects/InputType.vue";
import SelectType from "@/objects/SelectType.vue";
import { formatSelect, handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      expanded: false,
      isEdit: false,
      ModuleNew: false,
      loading: true,
      saveLoading: false,
      items: [],
      steps: [],
      filters: {
        search: null,
        step: null,
      },
      fields: {
        nome: null,
        codigoEAN: "",
      },
      erros: {
        nome: {
          status: false,
          msg: null,
        },
      },
      currentItemId: null,
    };
  },
  computed: {
    stepFormated() {
      return formatSelect(this.steps, "nome", "id");
    },
  },
  components: {
    BarStep,
    TheHeader,
    TheModal,
    FeedbackMessage,
    TheLoading,
    InputType,
    SelectType,
    LoadingButton,
  },
  watch: {
    $route(to, from) {
      if (from.params.id === "new" && to.params.id !== "new") {
        this.init();
        this.handleOpenModal();
      }
    },
  },
  methods: {
    ...mapActions("modal", ["openModal", "closeModal"]),
    expandAll() {
      this.expanded = !this.expanded;
      this.items.forEach(item => (item.isActive = this.expanded));
    },
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
          await this.$http.delete(`/item/${id}/Excluir`);

          this.items = this.items.filter(item => item.id !== id);

          this.$swal.fire(
            "Excluído!",
            "O item foi removido com sucesso.",
            "success"
          );
        }
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async nextStep(item) {
      try {
        const confirm = await this.$swal.fire({
          title: item.nome,
          text: "passar para próxima etapa?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "sim, passar!",
          cancelButtonText: "cancelar",
          confirmButtonColor: "#315d68",
          cancelButtonColor: "#363434",
        });

        if (confirm.isConfirmed) {
          const response = await this.$http.put(
            `/item/${item.id}/EtapaItem/Alterar`
          );

          this.items = this.items.map(el => {
            if (el.id === item.id) {
              return {
                ...response.data,
                isActive: el.isActive,
              };
            }
            return el;
          });
          this.$swal.fire(
            item.nome,
            "foi para próxima etapa com sucesso.",
            "success"
          );
        }
      } catch (error) {
        handleAxiosError(error);
      }
    },
    toggleStep(item) {
      item.isActive = !item.isActive;
    },
    totalItem(total) {
      switch (total) {
        case 0:
          return "";
        case 1:
          return " - 1 item";
        default:
          return ` - ${total} itens`;
      }
    },
    currentStep(item) {
      const allCompleted = item.etapasdoItem.every(etapa => etapa.status);

      if (allCompleted) {
        return { nome: "concluído" };
      }

      const lastCompletedStepIndex = item.etapasdoItem
        .slice()
        .reverse()
        .findIndex(etapa => etapa.status);

      if (lastCompletedStepIndex === -1) {
        return item.etapasdoItem[0];
      }

      const nextStepIndex =
        item.etapasdoItem.length - 1 - lastCompletedStepIndex + 1;
      return item.etapasdoItem[nextStepIndex] || item.etapasdoItem[0];
    },
    async submitItem() {
      let fieldsValidate = {
        nome: this.fields.nome,
      };
      const { isValid, erros } = validate(fieldsValidate);
      this.erros = erros;
      if (!isValid) return;
      this.saveLoading = true;

      let payload = {
        moduloId: this.$route.params.id,
        nome: this.fields.nome,
        codigoEAN: this.fields.codigoEAN,
      };
      try {
        if (this.isEdit) {
          const response = await this.$http.put(
            `/Item/${this.currentItemId}/Editar`,
            payload
          );
          this.items = response.data;
          this.$swal.fire(
            "Feito!",
            "O item foi atualizado com sucesso.",
            "success"
          );
        } else {
          const response = await this.$http.post("/Item/Cadastrar", payload);
          this.items = response.data;
          this.$swal.fire(
            "Feito!",
            "O item foi cadastrado com sucesso.",
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
        this.fields.codigoEAN = item.codigoEAN;
        this.currentItemId = item.id;
      } else {
        this.isEdit = false;
        this.fields.nome = null;
        this.fields.codigoEAN = "";
        this.currentItemId = null;
      }
      this.openModal();
    },
    resetModal() {
      this.isEdit = false;
      this.fields.nome = null;
      this.fields.codigoEAN = "";
      this.currentItemId = null;
      this.closeModal();
    },
    async getSteps() {
      try {
        const response = await this.$http.get("/Etapa/Listar");
        this.steps = response.data;
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async getItems(id) {
      try {
        const response = await this.$http.get(`/Modulo/${id}/Item/Listar`);
        this.items = response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      const id = this.$route.params.id;
      if (id && id === "new") {
        this.ModuleNew = true;
        this.loading = false;
      } else {
        await this.getItems(id);
      }
      await this.getSteps();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.custom-table {
  ul {
    list-style: none;
  }
  &__header {
    li {
      padding: 10px 0;
      font-weight: 600;
    }
  }
  &__header,
  &__row__content__infos {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    li {
      &:first-child {
        flex: 1 0 45%;
      }
      &:nth-child(2) {
        flex: 1 0 calc(55% - 124px);
      }
      &:last-child {
        flex: 1 0 124px;
      }
    }
  }
  &__body {
    .custom-table__row {
      &:nth-child(odd) {
        background-color: $color-white;
      }
    }
  }
  &__row {
    &__content {
      &__infos {
        align-items: center;
        span {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: 0.3s ease-in-out;
          i {
            font-size: 12px;
            transition: 0.3s ease-in-out;
            display: inline-block;
          }
          &:hover {
            color: $color-brand;
          }
        }
      }
      &__steps {
        padding: 0 20px;
        max-height: 0px;
        overflow: hidden;
        transition: 0.3s ease-in-out;
      }
    }
    &.active {
      .custom-table__row__content__infos {
        li {
          &:nth-child(2) {
            span {
              i {
                transform: rotate(180deg) translateY(2px);
              }
            }
          }
        }
      }
      .custom-table__row__content__steps {
        max-height: 110px;
      }
    }
  }
  &__buttons {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin: 8px 0;
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      color: $color-white;
      text-decoration: none;
      border-radius: 50%;
      transition: 0.3s ease-in-out;
      i {
        font-size: 16px;
      }
      &.primary {
        background-color: $color-brand;
      }
      &.black {
        background-color: $color-black;
      }
      &.secondary {
        background-color: $color-secondary;
      }
      &.next {
        background-color: $color-brown;
        i {
          font-size: 25px;
          transform: rotate(-90deg) translate(1px, 4px);
        }
      }
      &.red {
        background-color: $color-red;
        i {
          font-size: 19px;
          transform: translateY(2px);
        }
      }
      &:hover {
        filter: brightness(1.5);
      }
    }
  }
}
</style>
