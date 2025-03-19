<template>
  <div>
    <TheHeader :title="isAdmin && company ? company.razao : 'usuários'">
      <a
        href=""
        @click.prevent="handleOpenModal()"
        class="btn btn--primary"
        v-if="getUsuario.nivelAcesso >= 5"
      >
        adicionar usuário
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
              <th>e-mail</th>
              <th>ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.nome }}
                <span class="tag" v-if="!item.nivelAcesso"
                  >confirmação pendente</span
                >
                <span class="tag tag--black" v-if="item.nivelAcesso == 5"
                  >administrador</span
                >
                <span class="tag tag--black" v-if="item.nivelAcesso == 10"
                  >owner</span
                >
              </td>
              <td>
                {{ item.email }}
              </td>
              <td class="table__buttons">
                <a
                  href=""
                  @click.prevent="updateUser(item.id, 1)"
                  class="confirm"
                  tooltip="confirmar usuário"
                  v-if="!item.nivelAcesso && getUsuario.nivelAcesso >= 5"
                >
                  <i class="flaticon-like"></i>
                </a>
                <a
                  href=""
                  @click.prevent="
                    updateUser(item.id, item.nivelAcesso == 5 ? 1 : 5)
                  "
                  class="permission"
                  tooltip="editar permissão"
                  v-if="
                    getUsuario.nivelAcesso >= 5 &&
                    (item.nivelAcesso == 1 || item.nivelAcesso == 5)
                  "
                >
                  <i class="flaticon-permission"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <FeedbackMessage class="banner--gold banner--home banner--titled">
          <h2>nenhum usuário foi adicionado até o momento</h2>
          <p>
            que tal começar agora? cadastre seu primeiro usuário.
            <a href="" @click.prevent="handleOpenModal()" class="lk"
              >adicionar usuário</a
            >
          </p>
        </FeedbackMessage>
      </div>
    </template>

    <TheModal
      @close="resetModal"
      modalType="first"
      v-if="getUsuario.nivelAcesso >= 5"
    >
      <h2>adicionar usuário</h2>
      <form @submit.prevent="submitItem">
        <div class="modal__form">
          <InputType
            label="nome"
            :error="erros.nome"
            placeholder="digite o nome do usuário"
            v-model="fields.nome"
            type="text"
            class="gold"
          />
          <InputType
            label="e-mail"
            :error="erros.email"
            placeholder="digite o e-mail do usuário"
            v-model="fields.email"
            type="email"
            class="gold"
          />
          <div class="modal__form__row">
            <InputType
              label="senha"
              :error="erros.senha"
              placeholder="digite sua senha"
              v-model="fields.senha"
              type="password"
              class="gold"
            />
            <InputType
              label="confirmar senha"
              :error="erros.confirmar_senha"
              placeholder="digite sua senha"
              v-model="fields.confirmar_senha"
              type="password"
              class="gold"
            />
          </div>
          <InputType
            label="CPF"
            :error="erros.cpf"
            placeholder="000.000.000-00"
            v-model="fields.cpf"
            mask="###.###.###-##"
            type="text"
            class="gold"
          />
          <InputType
            label="CNPJ"
            :error="erros.cnpj"
            placeholder="00.000.000/0000-00"
            v-model="fields.cnpj"
            mask="##.###.###/####-##"
            type="text"
            class="gold"
            :disabled="true"
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
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      saveLoading: false,
      isAdmin: false,
      loading: true,
      company: null,
      items: [],
      filters: {
        search: null,
      },
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
    };
  },
  computed: {
    ...mapGetters(["getUsuario"]),
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
    async updateUser(idUser, permission) {
      try {
        const confirm = await this.$swal.fire({
          title: "usuário?",
          text: "tem certeza que deseja confirmar este usuário?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "sim, confirmar!",
          cancelButtonText: "cancelar",
          confirmButtonColor: "#315d68",
          cancelButtonColor: "#363434",
        });

        if (confirm.isConfirmed) {
          await this.$http.post(`/Usuario/Permissoes`, {
            id: idUser,
            permissao: permission,
          });

          const index = this.items.findIndex(item => item.id === idUser);
          if (index !== -1) {
            this.items.find(item => item.id === idUser).nivelAcesso =
              permission;
            this.$swal.fire(
              "Feito!",
              "Usuário foi confirmado com sucesso.",
              "success"
            );
          }
        }
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async submitItem() {
      const { isValid, erros } = validate(this.fields);
      this.erros = erros;
      if (!isValid) return;
      this.saveLoading = true;

      try {
        let payload = { ...this.fields };
        delete payload.confirmar_senha;
        const response = await this.$http.post("/Usuario/Criar", payload);
        this.items.push(response.data);
        this.$swal.fire(
          "Feito!",
          "O usuário foi cadastrado com sucesso.",
          "success"
        );
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.saveLoading = false;
        this.resetModal();
      }
    },
    handleOpenModal() {
      this.fields.nome = null;
      this.fields.email = null;
      this.fields.cpf = null;
      this.fields.senha = null;
      this.fields.confirmar_senha = null;
      this.openModal();
    },
    resetModal() {
      this.isEdit = false;
      this.fields.nome = null;
      this.fields.email = null;
      this.fields.cpf = null;
      this.fields.senha = null;
      this.fields.confirmar_senha = null;
      this.currentItemId = null;
      this.closeModal();
    },
    async getEmployees(id = null) {
      try {
        const response = await this.$http.get(
          `/Usuario/Empresa/${id ? id : this.getUsuario.empresaId}/Listar`
        );
        this.items = response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async getCompany(id) {
      try {
        const response = await this.$http.get(`/Empresa/${id}`);
        this.company = response.data;
      } catch (error) {
        handleAxiosError(error);
      }
    },
    async init() {
      this.isAdmin = this.$route.params.id ? true : false;
      if (this.isAdmin) {
        let id = this.$route.params.id;
        await this.getCompany(id);
        await this.getEmployees(id);
        this.fields.cnpj = this.company.cnpj;
      } else {
        await this.getEmployees();
        this.fields.cnpj = this.getUsuario.cnpj;
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
