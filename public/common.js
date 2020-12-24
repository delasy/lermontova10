/* eslint-env browser */
/* global galleries, google */

(function (document, window) {
  const galleriesComponents = {}

  function Gallery (name, slides) {
    const self = this

    self._idx = 1
    self._name = name
    self._slideElements = {}
    self._slides = slides

    self._root = document.createElement('div')
    self._root.classList.add('gallery')
    document.body.appendChild(self._root)

    self._close = document.createElement('button')
    self._close.className = 'gallery__close button button--secondary'
    self._close.innerText = 'Закрыть'
    self._close.addEventListener('click', self._hide.bind(self))
    self._root.appendChild(self._close)

    self._counter = document.createElement('h6')
    self._counter.className = 'gallery__counter'
    self._root.appendChild(self._counter)

    self._slidesContainer = document.createElement('div')
    self._slidesContainer.className = 'gallery__slides'
    self._root.appendChild(self._slidesContainer)

    self._controls = document.createElement('div')
    self._controls.className = 'gallery__controls'
    self._root.appendChild(self._controls)

    self._nextButton = document.createElement('button')
    self._nextButton.className = 'gallery__next-button button'
    self._nextButton.addEventListener('click', self._next.bind(self))

    self._prevButton = document.createElement('button')
    self._prevButton.className = 'gallery__prev-button button'
    self._prevButton.addEventListener('click', self._prev.bind(self))

    self._addSlide(self._idx)

    if (self._idx !== self._slides.length) {
      self._controls.appendChild(self._nextButton)
      self._addSlide(self._idx + 1)
    }
  }

  Gallery.prototype._addSlide = function (idx) {
    const self = this

    if (!Object.prototype.hasOwnProperty.call(self._slideElements, idx)) {
      self._slideElements[idx] = document.createElement('div')
      self._slideElements[idx].className = 'gallery__slide'
      self._slideElements[idx].style.display = 'none'
      self._slidesContainer.appendChild(self._slideElements[idx])

      const slideImage = document.createElement('img')

      slideImage.className = 'gallery__slide-image'
      slideImage.src = self._slides[idx - 1]
      self._slideElements[idx].appendChild(slideImage)
    }
  }

  Gallery.prototype._hide = function () {
    const self = this

    document.body.classList.remove('gallery--active')
    self._root.classList.remove('gallery--animated')

    window.setTimeout(function () {
      self._root.classList.remove('gallery--visible')
    }, 250)
  }

  Gallery.prototype._next = function () {
    const self = this
    const prevIdx = self._idx

    self._idx += 1
    self._counter.innerText = self._idx + ' / ' + self._slides.length

    self._slideElements[prevIdx].style.display = 'none'
    self._slideElements[self._idx].style.display = ''

    if (self._idx === 2) {
      self._controls.appendChild(self._prevButton)
    }

    if (self._idx === self._slides.length) {
      self._controls.removeChild(self._nextButton)
    } else {
      self._addSlide(self._idx + 1)
    }
  }

  Gallery.prototype._prev = function () {
    const self = this
    const prevIdx = self._idx

    self._idx -= 1
    self._counter.innerText = self._idx + ' / ' + self._slides.length

    self._slideElements[prevIdx].style.display = 'none'
    self._slideElements[self._idx].style.display = ''

    if (prevIdx === self._slides.length) {
      self._controls.appendChild(self._nextButton)
    }

    if (self._idx === 1) {
      self._controls.removeChild(self._prevButton)
    } else {
      self._addSlide(self._idx - 1)
    }
  }

  Gallery.prototype._show = function (idx) {
    const self = this
    const prevIdx = self._idx

    self._idx = idx
    self._counter.innerText = self._idx + ' / ' + self._slides.length

    self._addSlide(self._idx)

    self._slideElements[prevIdx].style.display = 'none'
    self._slideElements[self._idx].style.display = ''

    document.body.classList.add('gallery--active')
    self._root.classList.add('gallery--visible')
    self._root.classList.add('gallery--animated')

    if (prevIdx === self._slides.length && self._idx < self._slides.length) {
      self._controls.appendChild(self._nextButton)
    } else if (
      prevIdx < self._slides.length &&
      self._idx === self._slides.length
    ) {
      self._controls.removeChild(self._nextButton)
    }

    if (prevIdx > 1 && self._idx === 1) {
      self._controls.removeChild(self._prevButton)
    } else if (prevIdx === 1 && self._idx > 1) {
      self._controls.appendChild(self._prevButton)
    }

    if (self._idx !== 1) {
      self._addSlide(self._idx - 1)
    }

    if (self._idx !== self._slides.length) {
      self._addSlide(self._idx + 1)
    }
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  if (isIOS && !window.MSStream) {
    document.body.classList.add('ios')
  }

  const toggles = document.querySelectorAll('[data-toggle]')

  for (let i = toggles.length; i--;) {
    const toggle = toggles[i]

    toggle.innerText = toggle.getAttribute('data-off')
    toggle.setAttribute('data-show', 'false')

    const targetsClassName = toggle.getAttribute('data-toggle')
    const targets = document.getElementsByClassName(targetsClassName)

    for (let j = targets.length; j--;) {
      targets[j].style.display = 'none'
    }

    toggle.addEventListener('click', function () {
      const self = this
      const targetsClassName = self.getAttribute('data-toggle')
      const targets = document.getElementsByClassName(targetsClassName)

      if (self.getAttribute('data-show') === 'false') {
        toggle.innerText = toggle.getAttribute('data-on')
        self.setAttribute('data-show', 'true')

        for (let j = targets.length; j--;) {
          targets[j].style.display = ''
        }
      } else {
        toggle.innerText = toggle.getAttribute('data-off')
        self.setAttribute('data-show', 'false')

        for (let j = targets.length; j--;) {
          targets[j].style.display = 'none'
        }
      }
    })
  }

  const galleryToggles = document.querySelectorAll('[data-gallery]')

  for (let i = galleryToggles.length; i--;) {
    const galleryToggle = galleryToggles[i]
    const key = galleryToggle.getAttribute('data-gallery')
    const idx = parseInt(galleryToggle.getAttribute('data-idx')) || 1

    if (
      !Object.prototype.hasOwnProperty.call(galleries, key) ||
      galleries[key].length < idx
    ) {
      continue
    } else if (
      !Object.prototype.hasOwnProperty.call(galleriesComponents, key)
    ) {
      galleriesComponents[key] = new Gallery(key, galleries[key])
    }

    galleryToggle.addEventListener('click', function () {
      return galleriesComponents[key]._show(idx)
    })
  }

  const sidebar = document.getElementById('sidebar_desktop')

  window.addEventListener('scroll', function () {
    const self = this
    const parentRect = sidebar.parentNode.getBoundingClientRect()
    const diffTop = self.scrollY - (parentRect.top + self.pageYOffset) + 40
    const diffBottom = parentRect.bottom - sidebar.offsetHeight - 40

    if (diffBottom <= 0) {
      sidebar.style.bottom = '0'
      sidebar.style.left = ''
      sidebar.style.position = ''
      sidebar.style.top = 'unset'
      sidebar.style.width = ''
    } else if (diffTop > 0) {
      sidebar.style.bottom = ''
      sidebar.style.left = parentRect.left + 'px'
      sidebar.style.position = 'fixed'
      sidebar.style.top = '40px'
      sidebar.style.width = sidebar.parentNode.offsetWidth + 'px'
    } else {
      sidebar.style.bottom = ''
      sidebar.style.left = ''
      sidebar.style.position = ''
      sidebar.style.top = ''
      sidebar.style.width = ''
    }
  }, { passive: true })

  window.initGMaps = function () {
    const { Map, Marker } = google.maps
    const markers = []

    const position = {
      lat: 47.90585257913731,
      lng: 33.34801992977139
    }

    const map = new Map(document.getElementById('map'), {
      center: position,
      disableDefaultUI: true,
      zoom: 17
    })

    markers.push(
      new Marker({
        map: map,
        position: position
      })
    )
  }
})(document, window)
