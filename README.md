# <int-obs>

```html
<int-obs init="false">
  <!-- ... -->
</int-obs>
```

```js
const intObs = document.querySelector(`int-obs[init="false"]`);

intObs.observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // ...
    });
  },
  {
    root: rootElement,
    rootMargin: "10% 0px 100px 0px",
    threshold: [0, 0.25, 0.75, 1],
  }
);

intObs.init();
```
