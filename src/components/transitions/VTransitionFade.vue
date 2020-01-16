<template>
  <transition name="fade">
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'VTransitionFade'
}
</script>

<style lang="scss" scoped>
.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity .3s ease-in;
  }

  &-enter {
    opacity: 1;
  }

  &-leave-to {
    opacity: 0;
  }
}
</style>
