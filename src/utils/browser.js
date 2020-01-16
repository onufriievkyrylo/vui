export const getScrollbarWidth = () => {
  const wrapper = document.createElement('div')
  const child = document.createElement('div')
  wrapper.style.position = 'absolute'
  wrapper.style.pointerEvents = 'none'
  wrapper.style.bottom = '0'
  wrapper.style.right = '0'
  wrapper.style.width = '100px'
  wrapper.style.overflow = 'hidden'
  wrapper.appendChild(child)
  document.body.appendChild(wrapper)

  const fullWidth = child.offsetWidth
  child.style.width = '100%'
  wrapper.style.overflowY = 'scroll'
  const width = fullWidth - child.offsetWidth

  document.body.removeChild(wrapper)

  return width
}

export const isScrollbarCustomizable = () => {
  const div = document.createElement('div')
  div.id = 'webkit_scrollbar'
  div.style.overflow = 'scroll'
  div.style.width = '40px'
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.sheet.insertRule(`#${div.id}::-webkit-scrollbar { display: none }`)
  document.body.appendChild(div)

  const customizable = div.scrollWidth === 40

  document.body.removeChild(div)
  document.head.removeChild(style)
  return customizable
}

export const disableBodyScroll = el => {
  if (!/iP(ad|hone|od)/.test(window.navigator.platform)) return
  const prevent = event => {
    if (event.touches.length > 1) return true
    if (event.preventDefault) event.preventDefault()
    return false
  }
  el.addEventListener('touchstart', event => {
    if (event.targetTouches.length === 1) {
      disableBodyScroll.clientY = event.targetTouches[0].clientY
    }
  })
  el.addEventListener('touchmove', event => {
    if (event.targetTouches.length === 1) {
      const clientY = event.targetTouches[0].clientY - disableBodyScroll.clientY
      if ((el.scrollTop === 0 && clientY > 0) || (el.scrollHeight - el.scrollTop <= el.clientHeight && clientY < 0)) {
        return prevent(event)
      }
      event.stopPropagation()
      return true
    }
  })
  if (!disableBodyScroll.locked) {
    document.addEventListener('touchmove', prevent, { passive: false })
    disableBodyScroll.locked = true
  }
}
