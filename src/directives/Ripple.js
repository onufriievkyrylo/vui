const state = Symbol('state')

export default {
  bind (el, binding) {
    if (binding.value.disabled) return

    const ripple = document.createElement('span')
    ripple.classList.add('ripple')

    const start = event => {
      const rect = ripple.getBoundingClientRect()
      const diameter = Math.sqrt(rect.width ** 2 + rect.height ** 2) * 2
      const ink = document.createElement('div')
      ink.classList.add('ripple--ink')
      ink.classList.add(binding.value.class)
      ink[state] = {}
      ink.style.left = `${event.x - rect.x}px`
      ink.style.top = `${event.y - rect.y}px`
      ink.style.width = 0
      ink.style.height = 0
      requestAnimationFrame(() => {
        ink.style.width = `${diameter}px`
        ink.style.height = `${diameter}px`
      })
      ink.addEventListener('transitionend', finish, { once: true })
      ripple.addEventListener('mouseup', finish, { once: true })
      ripple.addEventListener('mouseleave', finish, { once: true })
      ripple.append(ink)
    }

    const finish = event => {
      const ink = event instanceof TransitionEvent ? event.target : ripple.lastChild
      if (ink[state].removable) {
        ink.classList.add('animation-leave-active', 'animation-leave')
        requestAnimationFrame(() => {
          ink.classList.remove('animation-leave')
          ink.classList.add('animation-leave-to')
          ink.addEventListener('transitionend', () => ink.remove(), { once: true })
        })
      } else {
        ink[state].removable = true
      }
      if (event instanceof MouseEvent) {
        ripple.removeEventListener('mouseup', finish)
        ripple.removeEventListener('mouseleave', finish)
      }
    }

    ripple.addEventListener('mousedown', start)

    el.prepend(ripple)
    el[state] = { ripple }
  },
  unbind (el, binding) {
    if (binding.value.disabled) return
    el[state].ripple.remove()
  }
}
