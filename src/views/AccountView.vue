<template>
  <div>
    <TheHeader title="Minha conta"> </TheHeader>

    <TheLoading v-if="loading" />
    <template v-else>
      <div class="account-infos">
        <h4>Dados</h4>
        <h2>{{ getUsuario.nome }}</h2>
        <h3><strong>email:</strong> {{ getUsuario.email }}</h3>
      </div>
      <div class="account-company">
        <div class="account-title">
          <h4>Empresa</h4>
          <a
            href=""
            class="btn btn-primary"
            @click.prevent="handleOpenModal('company')"
            v-if="getUsuario.nivelAcesso >= 5"
          >
            <i class="flaticon-pencil"></i>
          </a>
        </div>
        <h2>{{ account.razao }}</h2>
        <h3><strong>CNPJ:</strong> {{ cnpjFormated(account.cnpj) }}</h3>
      </div>
      <div class="account-plans" v-if="getUsuario.nivelAcesso >= 5">
        <h4>Plano</h4>
        <div class="account-plans__wrapper">
          <p><strong>valor</strong> R$ {{ account.valor }}</p>
          <p>
            <strong>vencimento</strong> {{ dateFormated(account.vencimento) }}
          </p>
        </div>
      </div>
      <div class="account-half" v-if="getUsuario.nivelAcesso >= 5">
        <div class="account-half__item">
          <h4>usuários</h4>
          <div class="account-half__item__user">
            <p><strong>10</strong> ativos</p>
            <p><strong>0</strong> inativos</p>
          </div>
        </div>
        <div class="account-half__item">
          <h4>estatisticas</h4>
          <ul>
            <li>
              <span class="name">Módulos cadastrados:</span>
              <span class="value">10</span>
            </li>
            <li>
              <span class="name">Módulos finalizados:</span>
              <span class="value">10</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <TheModal @close="resetModal" modalType="first">
      <h2>{{ titles[current] }}</h2>
      <form
        @submit.prevent="submitItem"
        v-if="current === 'company'"
        enctype="multipart/form-data"
      >
        <div class="modal__form">
          <InputType
            label="razão social"
            :error="errors.company.razao"
            placeholder="digite a razão social do empresa"
            v-model="fields.company.razao"
            type="text"
            class="gold"
          />
          <InputType
            label="Logo"
            :error="errors.company.logo"
            placeholder="Selecione uma imagem"
            v-model="fields.company.logo"
            type="file"
            class="gold"
          />
        </div>
        <div class="modal__buttons">
          <a href="" @click.prevent="resetModal()" class="btn btn--secondary"
            >cancelar</a
          >
          <LoadingButton text="salvar" :loading="saveLoading" />
        </div>
      </form>
    </TheModal>
  </div>
</template>

<script>
import TheModal from "@/components/TheModal.vue";
import TheHeader from "@/components/TheHeader.vue";
import TheLoading from "@/components/TheLoading.vue";
import InputType from "@/objects/InputType.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import { formatCPNJ, formatDate, handleAxiosError } from "@/utils/utils.js";
import { validate } from "@/utils/validation.js";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      loading: true,
      account: null,
      current: null,
      saveLoading: false,
      titles: {
        company: "Empresa",
      },
      fields: {
        company: {
          razao: null,
          logo: null,
        },
      },
      errors: {
        company: {
          razao: {
            status: false,
            msg: null,
          },
        },
      },
    };
  },
  components: {
    TheHeader,
    TheLoading,
    TheModal,
    LoadingButton,
    InputType,
  },
  computed: {
    ...mapGetters(["getUsuario"]),
  },
  methods: {
    ...mapActions("modal", ["openModal", "closeModal"], "updateEmpresaLogo"),
    handleOpenModal(current) {
      this.current = current;
      this.openModal();
    },
    resetModal() {
      this.current = null;
      this.fields.company.logo = null;
      this.closeModal();
    },
    dateFormated(date) {
      return formatDate(date);
    },
    cnpjFormated(cnpj) {
      return formatCPNJ(cnpj);
    },

    submitItem() {
      if (this.current === "company") {
        this.submitCompany();
      }
    },
    async submitCompany() {
      let required = { ...this.fields.company };
      delete required.logo;
      delete required.extensao;
      const { isValid, erros } = validate(required);
      this.errors.company = erros;
      if (!isValid) return;

      if (this.fields.company.logo) {
        const file = this.fields.company.logo;
        if (!(file instanceof File)) {
          this.$swal.fire(
            "Erro",
            "O arquivo selecionado não é válido.",
            "error"
          );
          return;
        }

        const validExtensions = ["image/jpeg", "image/png", "image/gif"];
        if (!validExtensions.includes(file.type)) {
          this.$swal.fire(
            "Erro",
            "O arquivo deve ser uma imagem (jpeg, png, gif).",
            "error"
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = async e => {
          const base64 = e.target.result.split(",")[1];
          const extensao = file.type.split("/")[1];
          this.saveLoading = true;

          try {
            const response = await this.$http.put(`/Empresa/Atualizar`, {
              empresaId: this.getUsuario.empresaId,
              razao: this.fields.company.razao,
              logo: base64,
              extensao: extensao,
            });
            this.account.razao = response.data.razao;
            const image = `data:image/${extensao};base64,${base64}`;
            this.updateEmpresaLogo(image);

            this.$swal.fire(
              "Feito!",
              "A empresa foi atualizada com sucesso.",
              "success"
            );
          } catch (error) {
            handleAxiosError(error);
          } finally {
            this.saveLoading = false;
            this.resetModal();
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.saveLoading = true;
        try {
          await this.$http.put(`/Empresa/Atualizar`, {
            empresaId: this.getUsuario.empresaId,
            razao: this.fields.company.razao,
          });
          this.$swal.fire(
            "Feito!",
            "A empresa foi atualizada com sucesso.",
            "success"
          );
        } catch (error) {
          handleAxiosError(error);
        } finally {
          this.saveLoading = false;
          this.resetModal();
        }
      }
    },
    async getAccount() {
      try {
        const response = await this.$http.get(
          `Empresa/${this.getUsuario.empresaId}`
        );
        this.account = response.data;
        this.fields.company.razao = this.account.razao;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      await this.getAccount();
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
.account {
  &-infos,
  &-company,
  &-plans,
  &-half__item {
    background-color: $color-white;
    padding: 24px;
    border-radius: 8px;
    margin-bottom: 16px;
    h4 {
      font-size: 1em;
      font-family: $font-secondary;
      font-weight: 400;
      color: $color-brand;
      margin-bottom: 16px;
    }
  }
  &-title {
    position: relative;
    a {
      display: inline-flex;
      background-color: $color-brand;
      color: $color-white;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      padding: initial;
      position: absolute;
      top: -10px;
      right: -10px;
    }
  }
  &-plans {
    background-color: $color-brown;
    h4,
    p {
      color: $color-white;
    }
  }
  &-infos,
  &-company {
    h2 {
      font-size: 1.5em;
      margin-bottom: 8px;
    }
    h3 {
      font-size: 1em;
      color: $color-gray;
      font-weight: 400;
    }
  }
  &-plans {
    &__wrapper {
      display: flex;
      gap: 30%;
      p {
        font-size: 1.5em;
        font-weight: 600;
        strong {
          font-size: 0.65em;
          font-weight: 400;
          display: block;
          margin-bottom: 4px;
        }
      }
    }
  }
  &-half {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    &__item {
      &__user {
        display: flex;
        justify-content: space-around;
        p {
          text-align: center;
          strong {
            font-size: 1.25em;
            display: block;
          }
        }
      }
      ul {
        list-style-type: none;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 0;
          position: relative;
          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 1px;
            background-color: #ccc;
            transform: translate(-50%, -50%);
          }
          .name,
          .value {
            background-color: $color-white;
            position: relative;
            z-index: 2;
            padding: 5px;
          }
          .name {
            padding-left: 0px;
            padding-right: 10px;
          }
          .value {
            padding-left: 10px;
            padding-right: 0px;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
