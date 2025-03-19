<template>
  <div
    class="layout"
    :class="{ 'layout--inverse': layoutInverse.includes($route.name) }"
  >
    <aside
      class="aside"
      :class="{ 'aside--large': asideLarge.includes($route.name) }"
    >
      <router-link to="/" class="logo" aria-label="Voltar para o início">
        <img src="./assets/img/logo-flexus.svg" alt="Logo Flexus" />
      </router-link>
      <div class="aside__content">
        <FormCPNJ v-if="$route.name == 'home'" />
        <FormLogin
          v-if="
            ['login', 'confirm-account', 'confirmed-account'].includes(
              $route.name
            )
          "
        />
        <FormCreate v-if="$route.name == 'create'" />
        <FormForgotPassword
          v-if="
            $route.name == 'forgot-password' ||
            ($route.name == 'reset-password' && !this.$route.query.token)
          "
        />
        <FormResetPassword
          v-if="$route.name == 'reset-password' && this.$route.query.token"
        />
        <ModuloCreate v-if="asideCreate.includes($route.name)" />
        <TheMenu v-else-if="!asideLarge.includes($route.name)" />
      </div>
      <p
        class="help"
        v-if="
          asideLarge.includes($route.name) && !asideCreate.includes($route.name)
        "
      >
        <a href="" class="lk">precisa de ajuda?</a>
      </p>
      <div
        class="company"
        v-if="
          !asideLarge.includes($route.name) &&
          !asideCreate.includes($route.name)
        "
      >
        <figure>
          <img :src="empresaLogo" alt="Logo da empresa" />
        </figure>
        <div class="company__content">
          <p>
            você está em: <strong>{{ getUsuario.razao }}</strong>
          </p>
        </div>
      </div>
    </aside>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import FormCPNJ from "@/components/FormCPNJ.vue";
import FormLogin from "@/components/FormLogin.vue";
import FormCreate from "@/components/FormCreate.vue";
import FormForgotPassword from "@/components/FormForgotPassword.vue";
import FormResetPassword from "@/components/FormResetPassword.vue";
import TheMenu from "@/components/TheMenu.vue";
import ModuloCreate from "@/components/ModuloCreate.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      layoutInverse: ["create", "forgot-password", "reset-password"],
      asideCreate: ["items"],
      asideLarge: [
        "home",
        "login",
        "create",
        "confirm-account",
        "confirmed-account",
        "forgot-password",
        "reset-password",
      ],
    };
  },
  computed: {
    ...mapGetters(["getUsuario", "getEmpresaLogo"]),
    empresaLogo() {
      return this.getEmpresaLogo;
    },
  },
  components: {
    FormLogin,
    FormCPNJ,
    FormCreate,
    FormForgotPassword,
    FormResetPassword,
    TheMenu,
    ModuloCreate,
  },
  methods: {
    ...mapActions(["updateEmpresaLogo"]),
    async getImage() {
      try {
        const response = await this.$http.get(
          `Empresa/${this.getUsuario.empresaId}/Imagens`,
          { responseType: "arraybuffer" }
        );
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const image = `data:image/png;base64,${base64Image}`;
        this.updateEmpresaLogo(image);
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getImage();
  },
};
</script>

<style lang="scss">
button {
  &.swal2-cancel,
  &.swal2-confirm {
    border-radius: 20px;
    padding-left: 32px;
    padding-right: 32px;
    font-weight: 600;
  }
  &.swal2-confirm {
    background-color: $color-brand;
  }
}
.layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  padding: 20px;
  &--aside {
    aside {
      z-index: 3 !important;
    }
    main {
      z-index: 2 !important;
    }
  }
  &--inverse {
    flex-direction: row-reverse;
    .banner {
      &__content {
        text-align: right;
        left: initial !important;
        right: 120px;
      }
    }
  }
  .aside,
  main {
    width: 100%;
    height: 100%;
  }
  .aside {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: sticky;
    top: 20px;
    z-index: 2;
    min-height: calc(100vh - 40px);
    flex: 1 0 300px;
    background: $color-white;
    border-radius: 20px;
    // overflow: hidden;
    margin-right: 20px;
    &__content {
      margin: 80px 0 auto;
    }
    &--large {
      position: relative;
      flex: 1 0 440px;
      padding: 0 60px;
      background: initial;
      margin-right: initial;
      top: initial;
      .aside__content {
        margin: 60px 0 80px;
      }
      .logo {
        padding: initial !important;
      }
    }
    .logo {
      padding: 20px 40px 0;
    }
    .company {
      background: $color-brand;
      color: $color-white;
      padding: 20px;
      display: flex;
      align-items: flex-end;
      gap: 16px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      figure {
        width: 60px;
        height: 60px;
        overflow: hidden;
        border-radius: 8px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      &__content {
        p {
          font-size: 0.875em;
          strong {
            font-size: 1.429em;
            display: block;
            font-weight: 600;
          }
        }
      }
    }
  }
  main {
    position: sticky;
    top: 20px;
    z-index: 2;
  }
}
</style>
