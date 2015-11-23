---
date: "2015-11-24"
title: Unit testing React components
tags:
  - js
  - react
  - tests
authors:
  - MoOx
header:
  image: https://farm6.staticflickr.com/5159/7112879347_9e0da289ca_z.jpg
  credit: https://www.flickr.com/photos/dvids/7112879347
  linearGradient: 160deg, rgba(0,0,0, .9), rgba(97, 218, 251, .7)
---

The React team has implemented a feature called
[shallow rendering](http://facebook.github.io/react/docs/test-utils.html#shallow-rendering),
which

>lets you render a component "one level deep" and assert facts about
what its render method returns, without worrying about the behavior of child
components, which are not instantiated or rendered.
This does not require a DOM.

Sounds good, right? And guess what, shallow rendering is currently the
[preferred way to test your React components](https://discuss.reactjs.org/t/whats-the-prefered-way-to-test-react-js-components/26).

As you can see in the post mentioned at the end of this one, the
actual code to test some components might seem a bit longer that what you could
expect.

Hopefully, [someone](https://github.com/vvo) created something pretty cool:
[react-element-to-jsx-string](https://github.com/algolia/react-element-to-jsx-string).
As the name of the package says, this library helps to render a react component
into a JSX string.

Now things start to become interesting:
with those two things in mind (shallow render and react components as JSX strings),
we can easily add some basic unit tests to some components.

_There are others techniques to test React components, and most of those
involve the DOM. This means you will need to run your tests in the browser (or
using jsdom): your tests will be slower than the following method
(which is more real unit testing since you execute less code and do not require
a huge environment)._

## Easy unit testing React components (without a DOM)

Let's do this with the following (dump) component:

```js
// web_modules/Picture/index.js

import React from "react"
import { PropTypes } from "react"

const Component = ({
  img,
  title,
  Loader,
  Title,
}) => (
  <div>
    {
      (!img || !img.src) && Loader &&
      <Loader />
    }
    {
      img && img.src &&
      <img src={ img.src } alt={ img.alt }/>
    }
    {
      title && Title &&
      <Title text={ title } />
    }
  </div>
)

const elementType = PropTypes.oneOfType([ PropTypes.node, PropTypes.func ])

Component.propTypes = {
  img: PropTypes.object,
  title: PropTypes.string,
  Loader: elementType.isRequired,
  Title: elementType.isRequired,
}

Component.displayName = "Picture"

export default Component
```

This component displays an image with a title component.
If the image data are not ready yet, it can display a loader component.

Now let's write some simple test for it. For the example we will use
[tape](https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4)
with the help of [tape-jsx-equals](https://github.com/atabel/tape-jsx-equals),
but you will find
[all kind of flavors on npm](https://www.npmjs.com/search?q=expect+jsx).

```js
// web_modules/Picture/__tests__/index.js

import tape from "tape"
import addAssertions from "extend-tape"
import jsxEquals from "tape-jsx-equals"
const test = addAssertions(tape, { jsxEquals })

import React from "react"
import { createRenderer } from "react-addons-test-utils"

import Picture from ".."

// fixtures (empty and stateless react components)
const Loader = () => {}
const Title = () => {}

test("PageContainer is properly rendered", (t) => {
  const renderer = createRenderer()

  renderer.render(
    <Picture
      Loader={ Loader }
      Title={ Title }
    />
  )
  t.jsxEquals(
    renderer.getRenderOutput(),
    <div>
      <Loader />
    </div>,
    "can render a Loader component if no image data are passed"
  )

  renderer.render(
    <Picture
      Loader={ Loader }
      Title={ Title }
      img={ {
        src: "SRC",
        alt: "ALT",
      } }
    />
  )
  t.jsxEquals(
    renderer.getRenderOutput(),
    <div>
      <img src="SRC" alt="ALT" />
    </div>,
    "should render an image if data are passed"
  )

  renderer.render(
    <Picture
      Loader={ Loader }
      Title={ Title }
      img={ {
        src: "SRC",
        alt: "ALT",
      } }
      title={ "TITLE" }
    />
  )
  t.jsxEquals(
    renderer.getRenderOutput(),
    <div>
      <img src="SRC" alt="ALT" />
      <Title text="TITLE" />
    </div>,
    "can render a Title if data are passed"
  )

  t.end()
})
```

These tests are the minimum coverage to ensure you don't break anything when you work
on your component.

As you can see, tests here are pretty easy to write & straightforward.  
**The interesting part is that you don't compare using strings.
You can use real React components.**

You can easily run this full example by getting it from this repository:

[github.com/MoOx/react-component-unit-testing-example](https://github.com/MoOx/react-component-unit-testing-example)

This example contains all the commands and dependencies
(defined in the `package.json`)
that you might need.

# What about testing events like `onClick`?

You don't need to reproduce the entire click.

**Your tests don't need to check that your `onClick` prop will be executed when
you click on a DOM element.**
_React probably have tests to cover this._  

You only need to test that the `onClick` prop value will do what you want.
So if you have something like `onClick={ yourCallback }`,
just call directly `yourCallback()` in your test just before your comparison.
That's enough!

If you want to go deeper, you might also read:
- [_Unit testing React components without a DOM_](https://simonsmith.io/unit-testing-react-components-without-a-dom/),
by Simon Smith, that covers the same topic without the simplicity of the JSX
comparisons,
- [_How we unit test React components using expect-jsx_](https://blog.algolia.com/how-we-unit-test-react-components-using-expect-jsx/)
on Algolia blog, that explains why they choose and create tools for this approach.

With all those examples, we hope you will stop being afraid to test your code
and will not hesitate to cover all your React components with tests 😍.
