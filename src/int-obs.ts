const observers: Map<string, IntersectionObserver> = new Map();

export class IntObs extends HTMLElement {
  public observer?: IntersectionObserver;
  public callback?: (entry: IntersectionObserverEntry) => void;

  private _root: null | Element | Document = null;
  private initialized: boolean = false;
  private beingObserved: boolean = false;

  constructor() {
    super();

    if (this.getAttribute("init") !== "false") {
      this.initialize();
    }
  }

  set root(value: null | Element | Document) {
    if (this.observer) {
      return;
    }

    if (value instanceof Element || value instanceof Document) {
      this._root = value;
    } else {
      this._root = null;
    }
  }

  get root(): null | Element | Document {
    if (this.observer) {
      return this.observer.root;
    }

    return this._root;
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

    return this.getAttribute("root-margin")?.trim() ?? null;
  }

  set threshold(value: null | number | number[]) {
    if (this.observer) {
      return;
    }

    if (value === null) {
      this.removeAttribute("threshold");
    } else {
      try {
        this.setAttribute("threhold", JSON.stringify(value));
      } catch {}
    }
  }

  get threshold(): null | number | number[] {
    if (this.observer) {
      return this.observer.thresholds as number[];
    }

    const attrValue = this.getAttribute("threhold");

    if (attrValue) {
      try {
        return JSON.parse(attrValue);
      } catch {}
    }

    return null;
  }

  get options(): IntersectionObserverInit {
    if (this.observer) {
      const { root, rootMargin, thresholds } = this.observer;

      return {
        root,
        rootMargin,
        threshold: thresholds as number[],
      };
    }
    const opts: IntersectionObserverInit = {};
    const attrRootMargin = this.getAttribute("root-margin");
    const attrThreshold = this.getAttribute("threshold");
    const { root, rootMargin, threshold } = this;

    if (root) {
      opts.root = root;
    }

    if (rootMargin) {
      opts.rootMargin = rootMargin;
    }

    if (threshold !== null) {
      opts.threshold = threshold;
    }

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

      if (!observers.has(key)) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const { isIntersecting } = entry;
            const target = entry.target as IntObs;
            const classIn = target.getAttribute("class:in");
            const classOut = target.getAttribute("class:out");

            target.setAttribute("intersecting", isIntersecting.toString());

            if (classIn || classOut) {
              const classTarget = target.getAttribute("class:target");
              const classTargets = target.getAttribute("class:targets");
              const targetElements: Element[] = [];

              if (classTarget) {
                const element = target.querySelector(classTarget) ?? target;
                targetElements.push(element);
              }

              if (classTargets) {
                const elements = Array.from(
                  target.querySelectorAll(classTargets)
                );
                targetElements.push(...elements);
              }

              targetElements.forEach((element) => {
                if (classIn) {
                  element.classList.toggle(classIn, isIntersecting);
                }
                if (classOut) {
                  element.classList.toggle(classOut, !isIntersecting);
                }
              });
            }

            target.dispatchEvent(
              new CustomEvent("intersectionchange", {
                detail: entry,
                bubbles: true,
              })
            );

            if (typeof target.callback === "function") {
              target.callback(entry);
            }
          });
        }, options);

        observers.set(key, observer);
      }

      this.observer = observers.get(key);
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
