/**
 * Mobile Gesture Utilities
 *
 * Comprehensive mobile gesture handling for touch interactions.
 * Includes swipe, pinch, pan, tap, and other mobile-specific gestures.
 */

/**
 * Touch event utilities
 */
export class TouchGestureHandler {
  constructor(element, options = {}) {
    this.element = element
    this.options = {
      swipeThreshold: 50,
      tapThreshold: 10,
      longPressDelay: 500,
      preventDefault: true,
      ...options
    }

    this.startPoint = null
    this.endPoint = null
    this.isLongPress = false
    this.longPressTimer = null
    this.callbacks = {}

    this.init()
  }

  init() {
    if (!this.element) return

    // Bind touch events
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false })
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this))

    // Bind mouse events for desktop testing
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.element.addEventListener('mouseup', this.handleMouseUp.bind(this))
  }

  handleTouchStart(event) {
    if (this.options.preventDefault) {
      event.preventDefault()
    }

    const touch = event.touches[0]
    this.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    // Start long press timer
    this.longPressTimer = setTimeout(() => {
      this.isLongPress = true
      this.trigger('longpress', {
        x: this.startPoint.x,
        y: this.startPoint.y
      })
    }, this.options.longPressDelay)

    this.trigger('touchstart', this.startPoint)
  }

  handleTouchMove(event) {
    if (!this.startPoint) return

    const touch = event.touches[0]
    const currentPoint = {
      x: touch.clientX,
      y: touch.clientY
    }

    // Clear long press if finger moves significantly
    const distance = this.calculateDistance(this.startPoint, currentPoint)
    if (distance > this.options.tapThreshold) {
      clearTimeout(this.longPressTimer)
      this.isLongPress = false
    }

    this.trigger('touchmove', {
      ...currentPoint,
      deltaX: currentPoint.x - this.startPoint.x,
      deltaY: currentPoint.y - this.startPoint.y,
      distance: distance
    })
  }

  handleTouchEnd(event) {
    if (!this.startPoint) return

    clearTimeout(this.longPressTimer)

    const touch = event.changedTouches[0]
    this.endPoint = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }

    const distance = this.calculateDistance(this.startPoint, this.endPoint)
    const duration = this.endPoint.time - this.startPoint.time

    // Determine gesture type
    if (!this.isLongPress && distance < this.options.tapThreshold) {
      // Tap gesture
      this.trigger('tap', this.endPoint)
    } else if (distance >= this.options.swipeThreshold) {
      // Swipe gesture
      const deltaX = this.endPoint.x - this.startPoint.x
      const deltaY = this.endPoint.y - this.startPoint.y
      const direction = this.getSwipeDirection(deltaX, deltaY)

      this.trigger('swipe', {
        direction,
        distance,
        duration,
        velocity: distance / duration,
        deltaX,
        deltaY
      })

      // Also trigger direction-specific events
      this.trigger(`swipe${direction}`, {
        distance,
        duration,
        velocity: distance / duration
      })
    }

    this.trigger('touchend', this.endPoint)
    this.reset()
  }

  handleTouchCancel() {
    clearTimeout(this.longPressTimer)
    this.reset()
  }

  // Mouse event handlers for desktop testing
  handleMouseDown(event) {
    this.startPoint = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    }
  }

  handleMouseMove(event) {
    if (!this.startPoint) return

    const currentPoint = {
      x: event.clientX,
      y: event.clientY
    }

    this.trigger('touchmove', {
      ...currentPoint,
      deltaX: currentPoint.x - this.startPoint.x,
      deltaY: currentPoint.y - this.startPoint.y
    })
  }

  handleMouseUp(event) {
    if (!this.startPoint) return

    this.endPoint = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    }

    const distance = this.calculateDistance(this.startPoint, this.endPoint)

    if (distance < this.options.tapThreshold) {
      this.trigger('tap', this.endPoint)
    } else if (distance >= this.options.swipeThreshold) {
      const deltaX = this.endPoint.x - this.startPoint.x
      const deltaY = this.endPoint.y - this.startPoint.y
      const direction = this.getSwipeDirection(deltaX, deltaY)

      this.trigger('swipe', { direction, distance })
      this.trigger(`swipe${direction}`, { distance })
    }

    this.reset()
  }

  calculateDistance(point1, point2) {
    const deltaX = point2.x - point1.x
    const deltaY = point2.y - point1.y
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }

  getSwipeDirection(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? 'right' : 'left'
    } else {
      return deltaY > 0 ? 'down' : 'up'
    }
  }

  reset() {
    this.startPoint = null
    this.endPoint = null
    this.isLongPress = false
  }

  // Event system
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback)
    }
  }

  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data))
    }
  }

  destroy() {
    // Remove event listeners
    this.element.removeEventListener('touchstart', this.handleTouchStart)
    this.element.removeEventListener('touchmove', this.handleTouchMove)
    this.element.removeEventListener('touchend', this.handleTouchEnd)
    this.element.removeEventListener('touchcancel', this.handleTouchCancel)
    this.element.removeEventListener('mousedown', this.handleMouseDown)
    this.element.removeEventListener('mousemove', this.handleMouseMove)
    this.element.removeEventListener('mouseup', this.handleMouseUp)

    clearTimeout(this.longPressTimer)
    this.callbacks = {}
  }
}

/**
 * Pull-to-refresh gesture handler
 */
export class PullToRefresh {
  constructor(element, callback, options = {}) {
    this.element = element
    this.callback = callback
    this.options = {
      threshold: 100,
      maxDistance: 200,
      resistance: 0.6,
      triggerOnRelease: true,
      ...options
    }

    this.startY = 0
    this.currentY = 0
    this.isRefreshing = false
    this.isPulling = false

    this.init()
  }

  init() {
    this.element.addEventListener('touchstart', this.handleStart.bind(this), { passive: false })
    this.element.addEventListener('touchmove', this.handleMove.bind(this), { passive: false })
    this.element.addEventListener('touchend', this.handleEnd.bind(this), { passive: false })
  }

  handleStart(event) {
    if (this.isRefreshing || this.element.scrollTop > 0) return

    this.startY = event.touches[0].clientY
    this.isPulling = false
  }

  handleMove(event) {
    if (this.isRefreshing || this.element.scrollTop > 0) return

    this.currentY = event.touches[0].clientY
    const deltaY = this.currentY - this.startY

    if (deltaY > 0) {
      event.preventDefault()
      this.isPulling = true

      // Apply resistance
      const distance = Math.min(deltaY * this.options.resistance, this.options.maxDistance)

      // Apply visual feedback
      this.element.style.transform = `translateY(${distance}px)`

      // Trigger callback if threshold reached and configured to trigger during pull
      if (distance >= this.options.threshold && !this.options.triggerOnRelease) {
        this.triggerRefresh()
      }
    }
  }

  handleEnd() {
    if (!this.isPulling) return

    const deltaY = this.currentY - this.startY
    const distance = deltaY * this.options.resistance

    if (distance >= this.options.threshold && this.options.triggerOnRelease) {
      this.triggerRefresh()
    } else {
      this.reset()
    }

    this.isPulling = false
  }

  triggerRefresh() {
    if (this.isRefreshing) return

    this.isRefreshing = true
    this.element.style.transform = `translateY(${this.options.threshold}px)`

    // Execute callback
    const result = this.callback()

    // Handle promise or direct completion
    if (result && typeof result.then === 'function') {
      result.finally(() => this.reset())
    } else {
      setTimeout(() => this.reset(), 1000)
    }
  }

  reset() {
    this.element.style.transition = 'transform 0.3s ease'
    this.element.style.transform = 'translateY(0)'

    setTimeout(() => {
      this.element.style.transition = ''
      this.isRefreshing = false
    }, 300)
  }
}

/**
 * Swipe navigation handler
 */
export class SwipeNavigation {
  constructor(router, options = {}) {
    this.router = router
    this.options = {
      enabled: true,
      threshold: 100,
      edgeSize: 50,
      enableBackGesture: true,
      enableForwardGesture: false,
      ...options
    }

    this.init()
  }

  init() {
    if (!this.options.enabled) return

    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true })
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false })
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true })
  }

  handleTouchStart(event) {
    const touch = event.touches[0]
    this.startX = touch.clientX
    this.startY = touch.clientY

    // Check if touch started from edge for back gesture
    this.isEdgeSwipe = touch.clientX < this.options.edgeSize
  }

  handleTouchMove(event) {
    if (!this.startX) return

    const touch = event.touches[0]
    const deltaX = touch.clientX - this.startX
    const deltaY = touch.clientY - this.startY

    // Prevent scrolling if horizontal swipe is detected
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      event.preventDefault()
    }
  }

  handleTouchEnd(event) {
    if (!this.startX) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - this.startX
    const deltaY = touch.clientY - this.startY

    // Check if this is a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.options.threshold) {
      if (deltaX > 0 && this.isEdgeSwipe && this.options.enableBackGesture) {
        // Swipe right from edge - go back
        this.goBack()
      } else if (deltaX < 0 && this.options.enableForwardGesture) {
        // Swipe left - go forward (if enabled)
        this.goForward()
      }
    }

    this.startX = null
    this.startY = null
    this.isEdgeSwipe = false
  }

  goBack() {
    if (this.router && window.history.length > 1) {
      this.router.back()
    }
  }

  goForward() {
    if (this.router) {
      this.router.forward()
    }
  }

  enable() {
    this.options.enabled = true
  }

  disable() {
    this.options.enabled = false
  }
}

/**
 * Mobile keyboard handling
 */
export class MobileKeyboard {
  constructor(options = {}) {
    this.options = {
      adjustViewport: true,
      hideOnScroll: true,
      ...options
    }

    this.isKeyboardVisible = false
    this.originalViewportHeight = window.innerHeight

    this.init()
  }

  init() {
    // Listen for viewport changes (keyboard show/hide)
    window.addEventListener('resize', this.handleResize.bind(this))

    // Listen for visual viewport changes (better support)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleVisualViewportResize.bind(this))
    }

    // Hide keyboard on scroll if enabled
    if (this.options.hideOnScroll) {
      document.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    }
  }

  handleResize() {
    const currentHeight = window.innerHeight
    const heightDifference = this.originalViewportHeight - currentHeight

    if (heightDifference > 150) {
      // Keyboard is likely visible
      if (!this.isKeyboardVisible) {
        this.isKeyboardVisible = true
        this.onKeyboardShow(heightDifference)
      }
    } else {
      // Keyboard is likely hidden
      if (this.isKeyboardVisible) {
        this.isKeyboardVisible = false
        this.onKeyboardHide()
      }
    }
  }

  handleVisualViewportResize() {
    const keyboardHeight = this.originalViewportHeight - window.visualViewport.height

    if (keyboardHeight > 150) {
      if (!this.isKeyboardVisible) {
        this.isKeyboardVisible = true
        this.onKeyboardShow(keyboardHeight)
      }
    } else {
      if (this.isKeyboardVisible) {
        this.isKeyboardVisible = false
        this.onKeyboardHide()
      }
    }
  }

  handleScroll() {
    if (this.isKeyboardVisible) {
      // Hide keyboard by blurring active input
      const activeElement = document.activeElement
      if (activeElement && ['INPUT', 'TEXTAREA'].includes(activeElement.tagName)) {
        activeElement.blur()
      }
    }
  }

  onKeyboardShow(height) {
    document.body.classList.add('keyboard-visible')
    document.body.style.setProperty('--keyboard-height', `${height}px`)

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('keyboardshow', { detail: { height } }))
  }

  onKeyboardHide() {
    document.body.classList.remove('keyboard-visible')
    document.body.style.removeProperty('--keyboard-height')

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('keyboardhide'))
  }
}

/**
 * Initialize all mobile gestures
 */
export function initMobileGestures(router) {
  const gestures = {}

  // Initialize swipe navigation
  if (router) {
    gestures.swipeNavigation = new SwipeNavigation(router)
  }

  // Initialize keyboard handling
  gestures.keyboard = new MobileKeyboard()

  return gestures
}

export default {
  TouchGestureHandler,
  PullToRefresh,
  SwipeNavigation,
  MobileKeyboard,
  initMobileGestures
}