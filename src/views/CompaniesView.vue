<template>
  <div>
    <TheHeader title="Empresas">
      <a href="" @click.prevent="handleOpenModal()" class="btn btn--primary">
        adicionar empresa
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
              <th>razão social</th>
              <th>cnpj</th>
              <th>plano</th>
              <th>valor</th>
              <th>vencimento</th>
              <th>ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.razao }}
              </td>
              <td>{{ cnpjFormated(item.cnpj) }}</td>
              <td>{{ item.plano }}</td>
              <td>R$ {{ item.valor }}</td>
              <td>{{ dateFormated(item.vencimento) }}</td>
              <td class="table__buttons">
                <a
                  href=""
                  @click.prevent="handleOpenModal(item)"
                  class="primary"
                  tooltip="editar empresa"
                >
                  <i class="flaticon-edit-text"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <FeedbackMessage class="banner--gold banner--home banner--titled">
          <h2>nenhuma empresa foi adicionado até o momento</h2>
          <p>
            que tal começar agora? cadastre sua primeira empresa.
            <a href="" class="lk">adicionar empresa</a>
          </p>
        </FeedbackMessage>
      </div>
    </template>

    <TheModal @close="resetModal" modalType="first">
      <h2>{{ isEdit ? "editar empresa" : "adicionar empresa" }}</h2>
      <form @submit.prevent="submitItem">
        <div class="modal__form">
          <InputType
            label="razão social"
            :error="errors.razao"
            placeholder="digite a razão social do empresa"
            v-model="fields.razao"
            type="text"
            class="gold"
          />
          <InputType
            label="CNPJ"
            :error="errors.cnpj"
            placeholder="00.000.000/0000-00"
            v-model="fields.cnpj"
            mask="##.###.###/####-##"
            type="text"
            class="gold"
          />
          <InputType
            label="plano"
            :error="errors.plano"
            placeholder="digite o plano"
            v-model="fields.plano"
            type="text"
            class="gold"
          />
          <InputType
            label="vencimento"
            :error="errors.vencimento"
            placeholder="digite o vencimento do plano"
            v-model="fields.vencimento"
            type="date"
            class="gold"
          />
          <InputType
            label="valor"
            :error="errors.valor"
            placeholder="digite o valor do plano"
            v-model="fields.valor"
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
import { formatCPNJ, formatDate, handleAxiosError } from "@/utils/utils.js";
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
        logo: "",
        extensao: "",
        razao: null,
        cnpj: null,
        plano: null,
        vencimento: null,
        valor: null,
      },
      errors: {
        razao: {
          status: false,
          msg: null,
        },
        cnpj: {
          status: false,
          msg: null,
        },
        plano: {
          status: false,
          msg: null,
        },
        vencimento: {
          status: false,
          msg: null,
        },
        valor: {
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
    dateFormated(date) {
      return formatDate(date);
    },
    cnpjFormated(cnpj) {
      return formatCPNJ(cnpj);
    },
    async submitItem() {
      let required = { ...this.fields };
      delete required.logo;
      delete required.extensao;
      console.log(required);
      const { isValid, erros } = validate(required);
      this.errors = erros;
      console.log(this.errors);
      if (!isValid) return;
      this.saveLoading = true;

      try {
        if (this.isEdit) {
          const response = await this.$http.put(`/Empresa/Atualizar`, {
            empresaId: this.currentItemId,
            razao: this.fields.razao,
          });
          const responsePlans = await this.$http.put(
            `/Empresa/AtualizarPlanos`,
            {
              empresaId: this.currentItemId,
              plano: this.fields.plano,
              valor: this.fields.valor,
              vencimento: this.fields.vencimento,
            }
          );
          console.log(responsePlans);
          const index = this.items.findIndex(
            item => item.id === this.currentItemId
          );
          if (index !== -1) {
            this.items.splice(index, 1, response.data);
            this.$swal.fire(
              "Feito!",
              "A empresa foi atualizada com sucesso.",
              "success"
            );
          }
        } else {
          const response = await this.$http.post("/Empresa/Criar", this.fields);
          console.log(this.fields);
          this.items.push(response.data);
          this.$swal.fire(
            "Feito!",
            "A empresa foi cadastrada com sucesso.",
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
        this.fields.razao = item.razao;
        this.fields.cnpj = item.cnpj;
        this.fields.plano = item.plano;
        this.fields.valor = item.valor;
        this.fields.vencimento = item.vencimento;
        this.currentItemId = item.id;
      } else {
        this.isEdit = false;
        this.fields.razao = null;
        this.fields.cnpj = null;
        this.fields.plano = null;
        this.fields.valor = null;
        this.fields.vencimento = null;
        this.currentItemId = null;
      }
      this.openModal();
    },
    resetModal() {
      this.isEdit = false;
      this.fields.razao = null;
      this.fields.cnpj = null;
      this.fields.plano = null;
      this.fields.valor = null;
      this.fields.vencimento = null;
      this.currentItemId = null;
      this.closeModal();
    },
    async getCompanies() {
      try {
        const response = await this.$http.get("/Empresa/Listar");
        this.items = response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      await this.getCompanies();
    },
  },
  created() {
    this.init();
  },
};
</script>
