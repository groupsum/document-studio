class TestDOMMatrix {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;

  multiplySelf() {
    return this;
  }

  preMultiplySelf() {
    return this;
  }

  translateSelf() {
    return this;
  }

  scaleSelf() {
    return this;
  }
}

Object.defineProperty(globalThis, 'DOMMatrix', {
  configurable: true,
  value: globalThis.DOMMatrix ?? TestDOMMatrix,
});

Object.defineProperty(globalThis, 'Path2D', {
  configurable: true,
  value: globalThis.Path2D ?? class TestPath2D {},
});

Object.defineProperty(globalThis, 'ImageData', {
  configurable: true,
  value: globalThis.ImageData ?? class TestImageData {},
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value:
    globalThis.ResizeObserver ??
    class TestResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
});
