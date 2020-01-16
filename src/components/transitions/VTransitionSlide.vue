<template>
  <transition :name="`slide_${direction}`">
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'VTransitionSlide',
  props: {
    direction: {
      type: String,
      default: 'left',
      validator: direction => ['right', 'left', 'top', 'bottom'].includes(direction)
    }
  }
}
</script>

<style lang="scss" scoped>
.slide {
  &_right {
    &-enter-active,
    &-leave-active {
      position: absolute;
      right: 0;
      transition: right .3s ease-in;
      will-change: right;
    }

    &-enter {
      right: 100%;
    }

    &-leave-to {
      right: -100%;
    }
  }

  &_left {
    &-enter-active,
    &-leave-active {
      position: absolute;
      left: 0;
      transition: left .3s ease-in;
      will-change: left;
    }

    &-enter {
      left: 100%;
    }

    &-leave-to {
      left: -100%;
    }
  }

  &_top {
    &-enter-active,
    &-leave-active {
      position: absolute;
      top: 0;
      transition: top .3s ease-in;
      will-change: top;
    }

    &-enter {
      top: 100%;
    }

    &-leave-to {
      top: -100%;
    }
  }

  &_bottom {
    &-enter-active,
    &-leave-active {
      position: absolute;
      bottom: 0;
      transition: bottom .3s ease-in;
      will-change: bottom;
    }

    &-enter {
      bottom: 100%;
    }

    &-leave-to {
      bottom: -100%;
    }
  }
}
</style>
