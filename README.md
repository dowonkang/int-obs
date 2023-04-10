# `<int-obs>`

[IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)를 wrapping한 커스텀 엘리먼트입니다.

## Attributes

### `intersecting`

```html
<int-obs intersecting="false">...</int-obs>
<int-obs intersecting="true">...</int-obs>
```

[`IntersectionObserverEntry.isIntersecting`][isintersecting] 값이 반영됨.

### `root-margin`, `threshold`

IntersectionObserver 생성 시 [옵션 값](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#parameters)으로 적용됨

```html
<int-obs root-margin="-10px 0px 10% 0px" threhold="[0, 0.5, 1]"></int-obs>
```

- `root-margin`
  - CSS `margin` 문법과 동일
  - 퍼센트와 `px` 값만 사용 가능
  - 기본 값은 모두 `0px`
- `threshold`
  - [`JSON.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)로 파싱된 값이 사용됨
  - 두 개 이상 값을 지정하려면 JS 배열 문법으로 지정

### `class:in` / `class:out`

[`IntersectionObserverEntry.isIntersecting`][isintersecting] 값이 `true` 일 때 `class:in` 값이, `false` 일 때 `class:out` 값이 `class`로 적용됨

```html
<int-obs class="effect" class:in="effect--in" class:out="effect--out"></int-obs>

<!-- in -->
<int-obs
  class="effect effect--in"
  class:in="effect--in"
  class:out="effect--out"
  intersecting="true"
></int-obs>

<!-- out -->
<int-obs
  class="effect effect--out"
  class:in="effect--in"
  class:out="effect--out"
  intersecting="false"
></int-obs>
```

### `class:target`, `class:targets`

`class:in`, `class:out`을 `<int-obs>` 엘리먼트가 아닌 `<int-obs>`의 자식 요소들에 적용하고자 할 때 사용

```html
<int-obs class:in="effect--active" class:target=".effect">
  <div class="effect">...</div>
</int-obs>

<int-obs class:in="effect--active" class:targets=".effect">
  <div class="effect">...</div>
  <div class="effect">...</div>
  <div class="effect">...</div>
</int-obs>
```

- `class:target`: `intObsElement.querySelector` 사용
- `class:targets`: `intObsElement.querySelectorAll` 사용

### `init="false"`

다른 처리 후 [`initialize()`](#initialize)하는 경우 사용(기본 `IntersectionObserver`를 사용하지 않는 경우 등)

```html
<int-obs init="false">...</int-obs>
```

```js
const noInit = document.querySelector(`int-obs[init="false"]`);

noInit.observer = new IntersectionObserver(callback, options);

noInit.initialize();
```

## Properties

### `observer`

[`initialize()`](#initialize) 시 [`options`](#options)를 사용하여 생성된 `IntersectionObserver`가 지정됨

### `root`, `rootMargin`, `threshold`

- `observer`가 생성되어 있으면 해당 객체의 `root`, `rootMargin`, `thresholds` 값이 반환됨.
- `observer`가 생성되어 있지 않으면
  - `root`: `null`
  - `rootMargin`: `root-margin` attribute 값
  - `threshold`: `threshold` attribute 값

### `options`

- `IntersectionObserver` 생성 시 사용할 옵션 객체
- `root`, `rootMargin`, `threshold` 값이 사용됨

### `callback`

기본 콜백 외에 추가적인 처리를 하고 싶을 때 사용. ([`init="false"`](#initfalse)하지 않아도 됨.)

```js
const element = document.querySelector("int-obs");

element.callback = (entry) => {
  console.group("manually set callback");
  console.log(entry);
  console.groupEnd();
};
```

## Methods

### `initialize()`

- [`options`](#options)를 사용하여 `IntersectionObserver` 생성 및 적용
- 동일한 `options`의 `IntersectionObserver`는 추가로 생성하지 않고 재사용됨
- [`observer`](#observer)가 지정되어 있는 경우 생성하지 않음

### `observe()` / `unobserve()`

- [`IntersectionObserver.observe()`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/observe), [`IntersectionObserver.unobserve()`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/unobserve) 적용

## Events

### `intersectionchange`

```js
document.addEventListener("intersectionchange", (event) => {
  console.group(event.type);
  console.log("target:", event.target); // <int-obs> element
  console.log("detail:", event.detail); // IntersectionObserverEntry object
  console.groupEnd();
});
```

[isintersecting]: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting
