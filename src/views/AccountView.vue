<template>
  <div>
    <TheHeader title="Minha conta">
      <a href="" @click.prevent="" class="btn btn--primary"> editar conta </a>
    </TheHeader>

    <TheLoading v-if="loading" />
    <template v-else>
      <div class="account-infos">
        <h4>Empresa</h4>
        <h2>{{ account.razao }}</h2>
        <h3><strong>CNPJ:</strong> {{ cnpjFormated(account.cnpj) }}</h3>
      </div>
      <div class="account-plans">
        <h4>Plano</h4>
        <div class="account-plans__wrapper">
          <p><strong>descrição</strong> {{ account.plano }}</p>
          <p><strong>valor</strong> R$ {{ account.valor }}</p>
          <p>
            <strong>vencimento</strong> {{ dateFormated(account.vencimento) }}
          </p>
        </div>
      </div>
      <div class="account-half">
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
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader.vue";
import TheLoading from "@/components/TheLoading.vue";
import { formatCPNJ, formatDate, handleAxiosError } from "@/utils/utils.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      loading: true,
      account: null,
    };
  },
  components: {
    TheHeader,
    TheLoading,
  },
  computed: {
    ...mapGetters(["getUsuario"]),
  },
  methods: {
    dateFormated(date) {
      return formatDate(date);
    },
    cnpjFormated(cnpj) {
      return formatCPNJ(cnpj);
    },
    async getAccount() {
      try {
        const response = await this.$http.get(
          `Empresa/${this.getUsuario.empresaId}`
        );
        this.account = response.data;
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
  &-plans {
    background-color: $color-brown;
    h4,
    p {
      color: $color-white;
    }
  }
  &-infos {
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
      justify-content: space-between;
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
