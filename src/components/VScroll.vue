<template>
  <div ref="container" :style="style" :class="['v_scroll', flags]">
    <slot name="pane">
      <div ref="pane" class="v_scroll--pane" @scroll.passive="scroll">
        <slot/>
      </div>
    </slot>
    <div v-show="flags.custom" class="v_scroll--scrollbar">
      <div ref="track" class="v_scroll--track">
        <div ref="dragger" class="v_scroll--dragger" @mousedown.left="grab"/>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { reactive, computed, onBeforeMount, onMounted, onBeforeUnmount } from '@vue/composition-api'
import { browser, decorators } from '@/utils'
const nextTick = Vue.nextTick

const shared = {
  customizable: browser.isScrollbarCustomizable(),
  width: browser.getScrollbarWidth()
}

export default {
  name: 'VScroll',
  props: {
    native: { type: Boolean, default: true },
    pseudo: { type: Boolean, default: true }
  },
  setup (props, { slots, refs, emit }) {
    const style = reactive({})
    const flags = reactive({
      visible: false,
      dragging: false,
      scrolling: false,
      pseudo: false,
      floated: false,
      displace: false,
      custom: false,
      native: computed(() => !flags.custom)
    })
    onBeforeMount(() => {
      flags.custom = !(props.native && shared.width === 0)
      if (flags.custom) {
        if (props.pseudo && shared.customizable) {
          flags.pseudo = true
        } else if (shared.width === 0) {
          flags.floated = true
        } else {
          style['--scrollbar-width'] = `${shared.width}px`
          flags.displace = true
        }
      }
    })

    const observers = {
      mutation: null,
      resize: null
    }
    onMounted(() => {
      if (slots.pane) {
        refs.pane = refs.container.firstElementChil
        refs.pane.classList.add('v_scroll--pane')
        refs.pane.addEventListener('scroll', scroll, { passive: true })
      }
      if (typeof MutationObserver !== 'undefined') {
        observers.mutation = new MutationObserver(decorators.throttle(() => nextTick(refresh), 100))
        observers.mutation.observe(refs.pane, { childList: true, characterData: true, subtree: true })
      }
      if (typeof ResizeObserver !== 'undefined') {
        observers.resize = new ResizeObserver(decorators.throttle(() => nextTick(refresh), 100))
        observers.resize.observe(refs.pane)
      }
      refresh()
      browser.disableBodyScroll(refs.pane)
    })
    onBeforeUnmount(() => {
      if (observers.resize) {
        observers.resize.disconnect()
      }
      if (observers.mutation) {
        observers.mutation.disconnect()
      }
    })

    const state = {
      height: 0,
      top: 0,
      visible: 0
    }
    const refresh = () => {
      if (refs.pane) {
        state.visible = refs.pane.clientHeight / refs.pane.scrollHeight
        flags.visible = flags.custom && state.visible < 1
        nextTick(() => {
          if (refs.pane && refs.track) {
            state.top = refs.pane.scrollTop * state.visible
            state.height = state.visible < 1
              ? refs.track.clientHeight * state.visible
              : 0
            refs.dragger.style.top = `${Math.floor(Math.min(state.top, refs.track.clientHeight - state.height))}px`
            refs.dragger.style.height = `${Math.floor(state.height)}px`
          }
        })
      }
    }

    const grab = event => {
      flags.dragging = true
      state.offset = event.offsetY
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', release)
    }
    const move = decorators.throttle(event => {
      const offset = event.clientY - refs.container.getBoundingClientRect().top
      if (offset > state.offset) {
        state.top = offset - state.offset
        if ((state.top + state.height) >= refs.pane.clientHeight) {
          state.top = refs.pane.clientHeight - state.height
        }
      } else {
        state.top = 0
      }
      refresh()
      refs.pane.scrollTop = state.top * (refs.pane.scrollHeight / refs.pane.clientHeight)
    }, 10)
    const release = () => {
      flags.dragging = false
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', release)
    }

    const unscrolling = decorators.debounce(() => flags.scrolling = false, 1000)
    const scroll = decorators.throttle(event => {
      emit('scroll', event)
      refresh()
      if (!flags.dragging) {
        flags.scrolling = true
        unscrolling()
      }
    }, 10)

    return {
      flags,
      style,
      grab,
      scroll
    }
  }
}
</script>

<style lang="scss" scoped>
.v_scroll {
  position: relative;
  overflow: hidden;
  height: 100%;

  &.dragging {
    user-select: none;
  }

  &--pane {
    width: 100%;
    height: 100%;
    -webkit-overflow-scrolling: touch;

    .v_scroll.custom > & {
      overflow: hidden scroll;
    }

    .v_scroll.native > & {
      overflow: hidden auto;
    }

    .v_scroll.pseudo > & {
      width: 100%;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .v_scroll.floated > & {
      width: 100%;
      box-sizing: content-box;
      padding-right: 20px;
    }

    .v_scroll.displace > & {
      width: calc(100% + var(--scrollbar-width));
    }

    .v_scroll.dragging > & {
      scroll-behavior: auto;
    }
  }

  &--scrollbar {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    padding: 2px;
    box-sizing: border-box;
    opacity: 0;
    transition: opacity .2s ease-in-out;

    .v_scroll.visible > & {
      display: block;
    }

    .v_scroll.scrolling > & {
      opacity: .5;
    }

    &:hover {
      opacity: .6;
    }

    .v_scroll.dragging > & {
      opacity: 1;
    }
  }

  &--track {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: rgba(#cccccc, .4);
    transition: background-color .2s ease-in-out;

    .v_scroll.scrolling > .v_scroll--scrollbar > & {
      background-color: rgba(#cccccc, 0);
    }
  }

  &--dragger {
    position: absolute;
    width: 100%;
    border-radius: 5px;
    background-color: black;
  }
}
</style>
