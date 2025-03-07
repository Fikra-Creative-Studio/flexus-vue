<template>
  <div>
    <TheHeader title="Módulos">
      <a href="" @click.prevent class="btn btn--brown"> código de barra </a>
      <router-link
        :to="{ name: 'items', params: { id: 'new' } }"
        class="btn btn--primary"
      >
        adicionar módulo
      </router-link>
    </TheHeader>
    <TheLoading v-if="loading" />
    <template v-else>
      <div v-if="items.length">
        <section class="filters">
          <div class="filters__wrapper">
            <div class="filters__content">
              <InputType
                label=""
                :error="errors.search"
                placeholder="busque por nome"
                v-model="fields.search"
                type="text"
              />
              <SelectType
                v-if="clients.length"
                label=""
                :error="errors.cliente"
                placeholder="selecione o cliente"
                v-model="fields.cliente"
                :items="clientsFormated"
              />
              <SelectType
                v-if="lots.length"
                label=""
                :error="errors.lote"
                placeholder="selecione o lote"
                v-model="fields.lote"
                :items="lotsFormated"
              />
              <SelectType
                label=""
                :error="errors.status"
                placeholder="selecione o status"
                v-model="fields.status"
                :items="statusFormated"
                :current="fields.status"
              />
            </div>
            <div class="filters__buttons">
              <a
                href=""
                @click.prevent
                class="btn btn--black btn--iconed"
                v-if="fields.lote"
              >
                <i class="flaticon-export-1"></i>
                exportar lote
              </a>
            </div>
          </div>
        </section>
        <table class="table">
          <thead>
            <tr>
              <th>nome</th>
              <th>cliente</th>
              <th>ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.nome }}
                <span class="tag" v-if="item.lote">
                  <strong>{{ item.lote }}</strong>
                  {{ totalItem(item.totalItens) }}
                </span>
              </td>
              <td>{{ item.cliente }}</td>
              <td class="table__buttons">
                <router-link
                  :to="{ name: 'items', params: { id: item.id } }"
                  class="primary"
                >
                  <i class="flaticon-edit-text"></i>
                </router-link>
                <a href="" class="black" @click.prevent="">
                  <i class="flaticon-export-1"></i>
                </a>
                <a href="" class="red" @click.prevent="deleteItem(item.id)">
                  <i class="flaticon-trash"></i>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <FeedbackMessage class="banner--gold banner--home banner--titled">
          <h2>nenhum módulo foi adicionado até o momento</h2>
          <p>
            que tal começar agora? cadastre seu primeiro modulo.
            <router-link
              :to="{ name: 'items', params: { id: 'new' } }"
              class="lk"
              >adicionar módulo</router-link
            >
          </p>
        </FeedbackMessage>
      </div>
    </template>
  </div>
</template>
<script>
import TheHeader from "@/components/TheHeader.vue";
import FeedbackMessage from "@/components/FeedbackMessage.vue";
import TheLoading from "@/components/TheLoading.vue";
import InputType from "@/objects/InputType.vue";
import SelectType from "@/objects/SelectType.vue";
import { formatSelect, handleAxiosError } from "@/utils/utils.js";

export default {
  data() {
    return {
      loading: true,
      items: [],
      clients: [],
      lots: [],
      status: [
        {
          name: "em produção",
          value: "production",
        },
        {
          name: "concluídos",
          value: "complete",
        },
      ],
      fields: {
        search: null,
        lote: null,
        cliente: null,
        status: "production",
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
    };
  },
  computed: {
    clientsFormated() {
      return formatSelect(this.clients, "nome", "id");
    },
    lotsFormated() {
      return formatSelect(this.lots, "nome", "id");
    },
    statusFormated() {
      return formatSelect(this.status, "name", "value");
    },
  },
  components: {
    TheHeader,
    FeedbackMessage,
    TheLoading,
    InputType,
    SelectType,
  },
  methods: {
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
          await this.$http.delete(`/Modulo/Excluir?moduloId=${id}`);

          this.items = this.items.filter(item => item.id !== id);

          this.$swal.fire(
            "Excluído!",
            "O módulo removido com sucesso.",
            "success"
          );
        }
      } catch (error) {
        handleAxiosError(error);
      }
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
    async getModules() {
      try {
        const response = await this.$http.get("/Modulo/Listar");
        this.items = response.data;
      } catch (error) {
        handleAxiosError(error);
      } finally {
        this.loading = false;
      }
    },
    async init() {
      await this.getModules();
      await this.getClients();
      await this.getLots();
    },
  },
  created() {
    this.init();
  },
};
</script>
