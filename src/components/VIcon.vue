<template>
  <component :is="`icon-${name}`" class="v_icon" v-on="$listeners"/>
</template>

<script>
import IconAdd from '@/assets/icons/add.svg'
import IconArrowLeft from '@/assets/icons/arrow_left.svg'
import IconArrowRight from '@/assets/icons/arrow_right.svg'
import IconDropDown from '@/assets/icons/drop_down.svg'

export default {
  name: 'VIcon',
  components: {
    IconAdd,
    IconArrowLeft,
    IconArrowRight,
    IconDropDown
  },
  props: {
    name: { type: String, required: true }
  }
}
</script>

<style lang="scss" scoped>
.v_icon {
  display: block;
}
</style>
