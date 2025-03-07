<template>
  <div>
    <TheHeader title="Itens">
      <a href="" @click.prevent class="btn btn--primary"> adicionar item </a>
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
                v-if="step.length"
                label=""
                :error="errors.lote"
                placeholder="selecione a etapa"
                v-model="fields.step"
                :items="stepFormated"
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
              <th>etapa</th>
              <th>ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td>
                {{ item.nome }}
              </td>
              <td>{{ item.etapa }}</td>
              <td class="table__buttons">
                <router-link
                  :to="{ name: 'items', params: { id: item.id } }"
                  class="primary"
                >
                  <i class="flaticon-edit-text"></i>
                </router-link>
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
          <h2>nenhum item adicionado para produção</h2>
          <p>
            que tal começar agora? cadastre seu primeiro item.
            <router-link class="lk">adicionar item</router-link>
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
      steps: [],
      fields: {
        search: null,
        step: null,
      },
      errors: {
        search: {
          status: false,
          msg: null,
        },
        step: {
          status: false,
          msg: null,
        },
      },
    };
  },
  computed: {
    stepFormated() {
      return formatSelect(this.step, "nome", "id");
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
    async getItems(id) {
      try {
        const response = await this.$http.get(`/Item/Listar?moduloId=${id}`);
        console.log(response.data);
        // this.items = response.data;
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
        await this.getItems(id);
      } else {
        this.loading = false;
      }
    },
  },
  created() {
    this.init();
  },
};
</script>
