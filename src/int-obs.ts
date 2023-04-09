export class IntObs extends HTMLElement {
  public static observers = new Map();
  public static callback(entry: IntersectionObserverEntry) {
    const { target, isIntersecting } = entry;
    const classIn = target.getAttribute("class:in");
    const classOut = target.getAttribute("class:out");

    target.setAttribute("intersecting", isIntersecting.toString());

    if (classIn) {
      target.classList.toggle(classIn, isIntersecting);
    }

    if (classOut) {
      target.classList.toggle(classOut, !isIntersecting);
    }

    entry.target.dispatchEvent(
      new CustomEvent("intersectionchange", {
        detail: entry,
        bubbles: true,
      })
    );
  }

  public observer?: IntersectionObserver;
  public callback?: (entry: IntersectionObserverEntry) => void;
  private initialized: boolean = false;
  private beingObserved: boolean = false;

  constructor() {
    super();

    if (this.getAttribute("init") !== "false") {
      this.initialize();
    }
  }

  set rootMargin(value: string | null) {
    if (this.observer) {
      return;
    }

    if (value === null) {
      this.removeAttribute("root-margin");
    } else {
      this.setAttribute("root-margin", value.trim());
    }
  }

  get rootMargin(): string | null {
    if (this.observer) {
      return this.observer.rootMargin;
    }

    return this.getAttribute("root-margin");
  }

  get options() {
    const opts: IntersectionObserverInit = {};
    const attrRootMargin = this.getAttribute("root-margin");
    const attrThreshold = this.getAttribute("threshold");

    if (attrRootMargin) {
      opts.rootMargin = attrRootMargin.trim();
    }

    if (attrThreshold) {
      try {
        opts.threshold = JSON.parse(attrThreshold);
      } catch {}
    }

    return opts;
  }

  observe() {
    if (this.beingObserved) {
      return;
    }

    this.beingObserved = true;
    this.observer?.observe(this);
  }

  unobserve() {
    this.observer?.unobserve(this);
    this.beingObserved = false;
  }

  initialize() {
    if (this.initialized) {
      return;
    }

    if (!(this.observer instanceof IntersectionObserver)) {
      const { options } = this;
      const key = JSON.stringify(options);

      if (!IntObs.observers.has(key)) {
        const callback = this.callback ?? IntObs.callback;
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(callback);
        }, options);
        IntObs.observers.set(key, observer);
      }

      this.observer = IntObs.observers.get(key);
    }

    this.initialized = true;

    if (this.isConnected) {
      this.observe();
    }
  }

  connectedCallback() {
    if (this.initialized) {
      this.observe();
    }
  }

  disconnectedCallback() {
    this.unobserve();
  }
}

if (!window.customElements.get("int-obs")) {
  window.customElements.define("int-obs", IntObs);
}

declare global {
  interface HTMLElementTagNameMap {
    "int-obs": IntObs;
  }
}

export default IntObs;
