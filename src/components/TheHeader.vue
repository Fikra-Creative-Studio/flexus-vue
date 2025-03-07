<template>
  <header class="header">
    <div class="header__user">
      <p>
        bem vindo, <strong>{{ getUsuario.nome }}</strong>
      </p>
      <p><a href="" class="lk" @click.prevent="logout">sair</a></p>
    </div>
    <div class="header__content">
      <h1>{{ title }}</h1>
      <div class="header__content__buttons">
        <slot></slot>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getUsuario"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
<style lang="scss">
.header {
  &__user {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    p {
      font-size: 0.875em;
    }
  }
  &__content {
    margin: 40px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1 {
      font-size: clamp(1.5em, 0.5em + 1.25vw, 2em);
    }
    &__buttons {
      display: flex;
      gap: 16px;

      a {
        text-decoration: none;
        font-size: 1em;
        font-weight: 600;
        text-transform: lowercase;
        padding: 10px 20px 9px;
        white-space: nowrap;
      }
    }
  }
}
</style>
