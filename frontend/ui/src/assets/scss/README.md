Here is the list of global css definitions like colors and
other things that might be useful while developing in this app.

If you need to modify third party dependencies, put them into the
`third-party` folder so that we have them isolated in one place.

### Colors

These are the colors we use in the app. Simply import them with

```css
@import "assets/scss/colors.scss";
```

After that you have the following variables defined:

```js
<div class="color-examples">
  <div class="color-example">
    <div class="color-example-box color-example-box-text-contrast"></div>
    <div class="color-example-name">--color-text-contrast</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-text-gray"></div>
    <div class="color-example-name">--color-text-gray</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-dark-elements-gray"></div>
    <div class="color-example-name">--color-dark-elements-gray</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-light-gray"></div>
    <div class="color-example-name">--color-light-gray</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-background-gray"></div>
    <div class="color-example-name">--color-background-gray</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-airy-dark-blue"></div>
    <div class="color-example-name">--color-airy-dark-blue</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-airy-blue"></div>
    <div class="color-example-name">--color-airy-blue</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-airy-logo-blue"></div>
    <div class="color-example-name">--color-airy-logo-blue</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-cta"></div>
    <div class="color-example-name">--color-airy-blue</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-cta-hover"></div>
    <div class="color-example-name">--color-airy-blue-hover</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-cta-pressed"></div>
    <div class="color-example-name">--color-airy-blue-pressed</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-background-blue"></div>
    <div class="color-example-name">--color-background-blue</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-red-alert"></div>
    <div class="color-example-name">--color-red-alert</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-accent-magenta"></div>
    <div class="color-example-name">--color-accent-magenta</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-highlight-yellow"></div>
    <div class="color-example-name">--color-highlight-yellow</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-background-yellow"></div>
    <div class="color-example-name">--color-background-yellow</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-background-red"></div>
    <div class="color-example-name">--color-background-red</div>
  </div>

  <div class="color-example">
    <div class="color-example-box color-example-box-soft-green"></div>
    <div class="color-example-name">--color-soft-green</div>
  </div>
</div>
```

## Font Sizes

These are our font sizes:

```js
<ul>
  <li class="font-s">font-s</li>
  <li class="font-base">font-base</li>
  <li class="font-m">font-m</li>
  <li class="font-l">font-l</li>
  <li class="font-xl">font-xl</li>
  <li class="font-xl">font-xxl</li>
</ul>
```

You can either use them as mixins via

```scss
.element {
  @include font-s;
}
```

or directly as class names.

## Animations

You will find some animations in the `.animations.scss`. If you need
more sophisticated animations, use [Lottie.js](https://airbnb.design/lottie/) and
export JSON.
