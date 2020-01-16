import Vue from 'vue'
import CompositionApi from '@vue/composition-api'

import App from '@/App'

import VButton from '@/components/VButton'
import VIcon from '@/components/VIcon'
import VDatePicker from '@/components/VDatePicker'
import VScroll from '@/components/VScroll'

import '@/assets/scss/index.scss'

Vue.use(CompositionApi)
Vue.config.productionTip = false

Vue.component(VButton.name, VButton)
Vue.component(VIcon.name, VIcon)
Vue.component(VDatePicker.name, VDatePicker)
Vue.component(VScroll.name, VScroll)

new Vue({
  render: h => h(App)
}).$mount('#app')
