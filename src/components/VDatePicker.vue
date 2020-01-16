<template>
  <div class="v_date_picker">
    <div class="v_date_picker--header">
      <div class="v_date_picker--title">date picker</div>
      <div class="v_date_picker--selected">{{ selected.formated }}</div>
    </div>
    <div class="v_date_picker--menu">
      <div class="v_date_picker--current">
        <v-button :key="current.formated" type="text" @click="slide = 'screen', screen = screen === 'years' ? 'dates' : 'years'">
          <span class="v_date_picker--label">{{ current.formated }}</span>
          <template #postfix>
            <v-icon name="drop-down" :class="['v_date_picker--drop_down', { open: screen === 'years' }]"/>
          </template>
        </v-button>
      </div>
      <v-transition-fade>
        <div v-show="screen === 'dates'" class="v_date_picker--controls">
          <v-button type="flat" size="small" shape="circle" icon="arrow-left"  @click="slide = 'prev', move(-1)"/>
          <v-button type="flat" size="small" shape="circle" icon="arrow-right" @click="slide = 'next', move(+1)"/>
        </div>
      </v-transition-fade>
    </div>
    <div class="v_date_picker--content">
      <v-transition-slide :direction="screen === 'dates' ? 'top' : 'bottom'">
        <div v-if="screen === 'dates'" key="dates" class="v_date_picker--dates">
          <div class="v_date_picker--weekdays">
            <div v-for="(weekday, index) in names.weekdays" :key="index" class="v_date_picker--weekday">{{ weekday }}</div>
          </div>
          <v-transition-slide :direction="slide === 'next' ? 'left' : 'right'">
            <div :key="current.formated" class="v_date_picker--days">
              <div
                v-for="(_, index) in weeksNumber * 7"
                :key="index"
                :class="['v_date_picker--day', { in_hover_range: isInHoverRange(index), in_range: isInRange(index), from: isFrom(index), to: isTo(index) || isHover(index) }]"
                @mouseenter="hover(index)"
                @mouseleave="unhover()"
              >
                <v-button
                  :label="dayOfIndex(index)"
                  :type="isSelected(index) ? 'regular' : isToday(index) ? 'outlined' : 'flat'"
                  shape="circle"
                  :theme="isSelected(index) || isToday(index) ? 'primary' : 'default'"
                  :disabled="isOutOfMonth(index) || !isAllowedDate(index)"
                  @click="select(index)"
                />
              </div>
            </div>
          </v-transition-slide>
        </div>
        <v-scroll v-else>
          <div key="years" class="v_date_picker--years">
            <div v-for="year in 200" :key="year" class="v_date_picker--year">
              <v-button
                ref="years"
                :label="year + 1900"
                :type="current.year === year + 1900 ? 'regular' : 'flat'"
                shape="rounded"
                :theme="current.year === year + 1900 ? 'primary' : 'default'"
                @click="current.year = year + 1900"
              />
            </div>
          </div>
        </v-scroll>
      </v-transition-slide>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { reactive, computed, watch, ref } from '@vue/composition-api'
import { Info, DateTime } from 'luxon'
import VButton from '@/components/VButton'
import VTransitionSlide from '@/components/transitions/VTransitionSlide'
import VTransitionFade from '@/components/transitions/VTransitionFade'
import { types } from '@/utils'

const nextTick = Vue.nextTick

export default {
  name: 'VDatePicker',
  components: {
    VButton,
    VTransitionSlide,
    VTransitionFade
  },
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: { type: [Array, Object], default: null },
    locale: { type: String, default: 'system' },
    today: { type: Boolean, default: false },
    range: { type: Boolean, default: false },
    allowedDates: { type: Function, default: null },
    markedDates: { type: Function, default: null }
  },
  setup (props, { refs, emit }) {
    const names = reactive({
      weekdays: [],
      months: []
    })
    watch(props.locale, locale => {
      names.weekdays = Info.weekdays('short', { locale }).map(weekday => weekday.substring(0, 1))
      names.months = Info.months('long', { locale })
    })

    const now = DateTime.local()
    const current = reactive({
      year: now.year,
      month: now.month,
      formated: computed(() => `${names.months[current.month - 1]} ${current.year}`)
    })

    const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const view = reactive({
      firstMonthDayIndex: 0,
      daysInMonth: 0,
      daysInPrevMonth: 0
    })
    watch(() => {
      const isLeepYear = ((current.year % 4 === 0) && (current.year % 100 !== 0)) || (current.year % 400 === 0)
      view.daysInMonth = monthLengths[current.month - 1] + ((current.month === 2 && isLeepYear) ? 1 : 0)
      view.daysInPrevMonth = monthLengths[(current.month - 1 - 1 + 12) % 12] + ((current.month - 1 === 2 && isLeepYear) ? 1 : 0)

      const month = (current.month + 9) % 12 + 3
      const year = current.year - Math.floor(month / 13)
      view.firstMonthDayIndex = ((
        1 +
        Math.floor((13 * (month + 1)) / 5) +
        year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)
      ) % 7 + 5) % 7
    })
    const weeksNumber = computed(() => {
      return Math.ceil((view.firstMonthDayIndex + view.daysInMonth) / 7)
    })

    const move = step => {
      const temp = current.month - 1 + step
      current.year = current.year + Math.floor(temp / 12)
      current.month = (temp + 12 * Math.ceil(Math.abs(temp) / 12)) % 12 + 1
    }

    const selected = reactive({
      from: null,
      to: null,
      hover: null,
      formated: computed(() => {
        if (selected.from) {
          DateTime.fromObject(selected.from).toFormat('ccc, LLL d', { locale: props.locale })
        }
      })
    })
    watch(() => props.value, () => {
      if (types.isArray(props.value)) {
        const [from = null, to = null] = props.value
        selected.from = from
        selected.to = props.range ? to : null
      } else if (types.isObject(props.value)) {
        selected.from = props.value
        selected.to = null
      } else {
        selected.from = null
        selected.to = null
        selected.hover = null
      }
    })
    watch(() => [selected.from, selected.to], () => {
      if (props.range) {
        emit('update', [selected.from, selected.to])
      } else {
        emit('update', selected.from)
      }
    })
    const isFrom = (index) => {
      return selected.from && compareDates(selected.from, dateOfIndex(index)) === 0
    }
    const isTo = (index) => {
      return selected.to && compareDates(selected.to, dateOfIndex(index)) === 0
    }
    const isHover = (index) => {
      return selected.hover && compareDates(selected.hover, dateOfIndex(index)) === 0
    }
    const isSelected = (index) => {
      return isFrom(index) || isTo(index)
    }
    const isInRange = (index) => {
      if (selected.from && selected.to) {
        const date = dateOfIndex(index)
        return compareDates(date, selected.from) >= 0 && compareDates(date, selected.to) <= 0
      }
    }
    const isInHoverRange = (index) => {
      if (selected.from && selected.hover) {
        const date = dateOfIndex(index)
        return compareDates(date, selected.from) >= 0 && compareDates(date, selected.hover) <= 0
      }
    }

    const hover = (index) => {
      if (props.range && selected.from && !selected.to && !isOutOfMonth(index) && isAllowedDate(index)) {
        selected.hover = dateOfIndex(index)
      }
    }
    const unhover = () => {
      selected.hover = null
    }

    const select = (index) => {
      if (!isOutOfMonth(index)) {
        const date = dateOfIndex(index)
        if (props.range && selected.from && !selected.to && compareDates(selected.from, date) < 0) {
          selected.to = date
          selected.hover = null
        } else {
          selected.from = date
          selected.to = null
        }
      }
    }

    const today = reactive({
      year: now.year,
      month: now.month,
      day: now.day
    })
    const isToday = (index) => {
      return compareDates(today, dateOfIndex(index)) === 0
    }

    const slide = ref('')
    const screen = ref('dates')
    watch(screen, (screen) => {
      if (screen === 'years') {
        nextTick(() => refs.years[current.year - 1900].$el.scrollIntoView({ block: 'center' }))
      }
    })

    const compareDates = (left, right) => {
      if (left.year !== right.year) {
        return left.year > right.year ? 1 : -1
      } else if (left.month !== right.month) {
        return left.month > right.month ? 1 : -1
      } else if (left.day !== right.day) {
        return left.day > right.day ? 1 : -1
      } else {
        return 0
      }
    }
    const yearOfIndex = (index) => {
      return current.year + Math.floor((current.month + Math.floor((index - view.firstMonthDayIndex) / view.daysInMonth) - 1) / 12)
    }
    const monthOfIndex = (index) => {
      return (current.month + Math.floor((index - view.firstMonthDayIndex) / view.daysInMonth) - 1 + 12) % 12 + 1
    }
    const dayOfIndex = (index) => {
      if (index < view.firstMonthDayIndex) {
        return view.daysInPrevMonth - (view.firstMonthDayIndex - index) + 1
      } else if (index >= view.firstMonthDayIndex + view.daysInMonth) {
        return (index - view.firstMonthDayIndex - view.daysInMonth) + 1
      } else {
        return index - view.firstMonthDayIndex + 1
      }
    }
    const dateOfIndex = (index) => {
      return { year: yearOfIndex(index), month: monthOfIndex(index), day: dayOfIndex(index) }
    }

    const isOutOfMonth = (index) => {
      return index < view.firstMonthDayIndex || index >= view.daysInMonth + view.firstMonthDayIndex
    }
    const isAllowedDate = (index) => {
      if (props.allowedDates) {
        return props.allowedDates(dateOfIndex(index))
      } else {
        return true
      }
    }

    return {
      names,
      weeksNumber,
      current,
      selected,
      slide,
      screen,

      hover,
      unhover,
      select,
      move,

      dayOfIndex,
      monthOfIndex,
      yearOfIndex,

      isOutOfMonth,
      isAllowedDate,
      isFrom,
      isTo,
      isHover,
      isSelected,
      isInRange,
      isInHoverRange,
      isToday
    }
  }
}
</script>

<style lang="scss" scoped>
.v_date_picker {
  display: inline-flex;
  flex-direction: column;
  border-radius: 4px;

  &--header {
    background-color: $color-primary;
    color: $color-on-primary;
    padding: 16px 24px 24px;
  }

  &--title {
    margin-bottom: 12px;
    font-size: .8em;
    font-weight: 300;
    text-transform: uppercase;
  }

  &--selected {
    font-size: 1.6em;
    text-transform: capitalize;
    font-weight: 700;
  }

  &--menu {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 24px;
    align-items: center;
    width: 100%;
    padding: 16px 24px;
    box-sizing: border-box;
  }

  &--controls {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 24px;
    align-items: center;
    width: 100%;
  }

  &--current {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    overflow: hidden;
  }

  &--label {
    text-transform: capitalize;
  }

  &--drop_down {
    transition: transform .2s ease-in;
    transform-origin: center;

    &.open {
      transform: rotate(180deg)
    }
  }

  &--content {
    position: relative;
    width: 328px;
    height: 280px;
    overflow: hidden;
  }

  &--dates {
    height: 100%;
    margin: 0 12px;
  }

  &--weekdays,
  &--days {
    display: grid;
    grid-template-columns: repeat(7, 44px);
    grid-auto-rows: 40px;
    justify-items: center;
    align-items: center;
  }

  &--day {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    &.in_range::before {
      background-color: hsla(hue($color-primary), saturation($color-primary), lightness($color-primary), .4);
    }

    &.in_hover_range::before {
      background-color: hsla(0, 0%, 0%, .3);
    }

    &.in_range, &.in_hover_range {
      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        display: block;
        height: 36px;
      }
      &:nth-child(7n - 6)::before,
      &.from::before {
        left: 4px;
        border-top-left-radius: 50%;
        border-bottom-left-radius: 50%;
      }

      &:nth-child(7n)::before,
      &.to::before {
        right: 4px;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;
      }
    }
  }

  &--years {
    display: grid;
    grid-template-columns: repeat(3, 88px);
    grid-auto-rows: 52px;
    grid-column-gap: 8px;
    align-items: center;
    justify-items: center;
    margin: 0 24px;
  }

  &--weekday {
    color: rgba($color-surface-text, .4);
    text-transform: uppercase;
    font-weight: 500;
  }
}
</style>
