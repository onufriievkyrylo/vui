<template>
  <button
    v-bind="$attrs"
    v-ripple="{ disabled: type === 'text', class: 'v_button--ripple' }"
    type="button"
    :class="['v_button', size, type, shape, themeClass, { block, raised, active }]"
    :style="themeStyle"
    @click="$el.blur()"
    v-on="$listeners"
  >
    <div class="v_button--content">
      <div class="v_button--prefix">
        <slot name="prefix">
          <v-icon v-if="prefix" :name="prefix"/>
        </slot>
      </div>
      <v-icon v-if="icon" :name="icon"/>
      <span v-else class="v_button--label">
        <slot>{{ label }}</slot>
      </span>
      <div class="v_button--postfix">
        <slot name="postfix">
          <v-icon v-if="postfix" :name="postfix"/>
        </slot>
      </div>
    </div>
  </button>
</template>

<script>
import { types, colors, props } from '@/utils'

import VIcon from '@/components/VIcon'
import Ripple from '@/directives/Ripple'

export default {
  name: 'VButton',
  components: {
    VIcon
  },
  directives: {
    Ripple
  },
  props: {
    theme: {
      type: [String, Object],
      default: 'default',
      validator: props.or(
        props.enums('default', 'primary', 'secondary'),
        props.schema({ main: String, onMain: String })
      )
    },
    type: {
      type: String,
      default: 'regular',
      validator: props.enums('regular', 'outlined', 'flat', 'text')
    },
    shape: {
      type: String,
      default: 'bar',
      validator: props.enums('bar', 'rounded', 'tile', 'circle')
    },
    size: {
      type: String,
      default: 'medium',
      validator: props.enums('tiny', 'small', 'medium', 'large')
    },
    active: { type: Boolean, default: false },
    raised: { type: Boolean, defalut: false },
    block: { type: Boolean, default: false },
    label: { type: [String, Number], default: '' },
    icon: { type: String, default: '' },
    prefix: { type: String, default: '' },
    postfix: { type: String, default: '' }
  },
  computed: {
    themeClass () {
      return types.isString(this.theme) ? this.theme : ''
    },
    themeStyle () {
      if (types.isObject(this.theme)) {
        const hslMain = colors.hexToHsl(this.theme.main)
        const hslOnMain = colors.hexToHsl(this.theme.onMain)
        return {
          '--color-main-h': hslMain.hue,
          '--color-main-s': hslMain.saturation,
          '--color-main-l': hslMain.lightness,
          '--color-on-main-h': hslOnMain.hue,
          '--color-on-main-s': hslOnMain.saturation,
          '--color-on-main-l': hslOnMain.lightness
        }
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .v_button {
    margin: 0;
    border-style: none;
    padding: 0;
    background: transparent;
    font-family: inherit;
    font-size: 100%;
    text-transform: none;
    overflow: visible;
    outline: none;
    -webkit-appearance: button;
  }

  .v_button {
    position: relative;
    transition-property: color, background-color, border-color;
    transition-duration: .2s;
    transition-timing-function: ease-in;
    cursor: pointer;
    overflow: hidden;

    &.default {
      --color-main-h: #{hue($color-on-default)};
      --color-main-s: #{saturation($color-on-default)};
      --color-main-l: #{lightness($color-on-default)};
      --color-on-main-h: #{hue($color-default)};
      --color-on-main-s: #{saturation($color-default)};
      --color-on-main-l: #{lightness($color-default)};
    }

    &.primary {
      --color-main-h: #{hue($color-primary)};
      --color-main-s: #{saturation($color-primary)};
      --color-main-l: #{lightness($color-primary)};
      --color-on-main-h: #{hue($color-on-primary)};
      --color-on-main-s: #{saturation($color-on-primary)};
      --color-on-main-l: #{lightness($color-on-primary)};
    }

    &.secondary {
      --color-main-h: #{hue($color-secondary)};
      --color-main-s: #{saturation($color-secondary)};
      --color-main-l: #{lightness($color-secondary)};
      --color-on-main-h: #{hue($color-on-secondary)};
      --color-on-main-s: #{saturation($color-on-secondary)};
      --color-on-main-l: #{lightness($color-on-secondary)};
    }

    &:disabled {
      pointer-events: none;
      box-shadow: none;
      --color-main-h: #{hue($color-disabled)};
      --color-main-s: #{saturation($color-disabled)};
      --color-main-l: #{lightness($color-disabled)};
      --color-on-main-h: #{hue($color-on-disabled)};
      --color-on-main-s: #{saturation($color-on-disabled)};
      --color-on-main-l: #{lightness($color-on-disabled)};
    }

    &.small {
      height: 24px;
      min-width: 42px;

      &.regular,
      &.outlined,
      &.rounded {
        padding: 0 10px;
      }

      &.flat {
        padding: 0 6px;
      }

      &.circle {
        min-width: 24px;
        width: 24px;
        padding: 0;
      }
    }

    &.medium {
      height: 36px;
      min-width: 64px;

      &.regular,
      &.outlined,
      &.rounded {
        padding: 0 15px;
      }

      &.flat {
        padding: 0 8px;
      }

      &.circle {
        min-width: 36px;
        width: 36px;
        padding: 5px;
      }
    }

    &.regular {
      background-color: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));
      color: hsl(var(--color-on-main-h), var(--color-on-main-s), var(--color-on-main-l));
      fill: hsl(var(--color-on-main-h), var(--color-on-main-s), var(--color-on-main-l));

      &:hover {
        background-color: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 5%));
      }

      &:focus {
        background-color: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 10%));
      }
    }

    &.outlined {
      border-width: 1px;
      border-style: solid;
      border-color: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));
      color: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));
      fill: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));

      &:hover {
        background-color: hsla(var(--color-main-h), var(--color-main-s), var(--color-main-l), .2);
        border-color: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 5%));
        color: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 10%));
      }

      &:focus {
        background-color: hsla(var(--color-main-h), var(--color-main-s), var(--color-main-l), .3);
      }
    }

    &.flat {
      color: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));
      fill: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));

      &:hover {
        background-color: hsla(var(--color-main-h), var(--color-main-s), var(--color-main-l), .1);
      }

      &:focus {
        background-color: hsla(var(--color-main-h), var(--color-main-s), var(--color-main-l), .3);
      }
    }

    &.text {
      height: auto;
      min-width: auto;
      color: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));
      fill: hsl(var(--color-main-h), var(--color-main-s), var(--color-main-l));

      &:hover {
        color: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 5%));
        fill: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 5%));
      }

      &:focus {
        color: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 10%));
        fill: hsl(var(--color-main-h), var(--color-main-s), calc(var(--color-main-l) - 5%));
      }
    }

    &.bar {
      border-radius: 4px;
    }

    &.rounded {
      border-radius: 100px;
    }

    &.circle {
      border-radius: 50%;
    }

    &.block {
      width: 100%;
    }

    &.raised {
      box-shadow:
        0 3px 1px -2px rgba(0,0,0,.2),
        0 2px 2px 0 rgba(0,0,0,.14),
        0 1px 5px 0 rgba(0,0,0,.12);
    }

    &--content {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &--label {
      overflow: hidden;
      display: -webkit-inline-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      font-weight: 500;
    }

    &--prefix {
      &:not(:empty) {
        .v_button.regular &,
        .v_button.outlined &,
        .v_button.flat & {
          margin-left: -4px;
          margin-right: 8px;
        }

        .v_button.text & {
          margin-right: 4px;
        }
      }
    }

    &--postfix {
      &:not(:empty) {
        .v_button.regular &,
        .v_button.outlined &,
        .v_button.flat & {
          margin-left: 8px;
          margin-right: -4px;
        }
        .v_button.text & {
          margin-left: 4px;
        }
      }
    }

    /deep/ &--ripple {
      .v_button.regular & {
        background-color: hsla(var(--color-on-main-h), var(--color-on-main-s), var(--color-on-main-l), .2);
      }

      .v_button.flat &,
      .v_button.outlined & {
        background-color: hsla(var(--color-main-h), var(--color-main-s), var(--color-main-l), .2);
      }
    }
  }
</style>
