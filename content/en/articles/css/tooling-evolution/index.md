---
date: "2016-02-23"
title: CSS tooling evolution
tags:
  - css
  - tooling
  - css modules
authors:
  - thibthib
---

> I think that even before I ever knew what it was, I already heard someone
telling me “Oh god, I HATE CSS”. This sentence is often said by one of my
backender friends, and often for very good reasons. This post isn’t going to
defend nor make you embrace CSS , but as front-end tooling is quickly improving,
I find it interesting to explain the new ways of writing it.

## Back to basics

First, to understand what are the problems that the new tools are attempting to
solve, a small reminder of what CSS is: *Cascading Style Sheets*.

A style sheet ? Boy, that’s easy ! It’s some code that maps some  “styles” to
HTML elements. Cascading ? Well, sometimes more than one (or no) style can match
for an HTML element, and “cascading” is the set of rules that exist to determine
which one to apply.

Let’s see some basic CSS code: we want our h1 titles to be red.

```css
h1 {
  color: red;
}
```

Here, we map the ***rule (or declaration)*** “color: red” to the ***selector***
“h1”. A selector can contain multiples rules in its declaration block.

> And now the delight dies as we enter the cascade hell.

## The cascading thing

The cascade is for me the disaster that makes CSS un-maintainable without
guidelines nor tools when writing it. I’ll show you some examples explaining the
main concepts of the cascade, but they will be quite simple, whereas most web
app nowadays have huge codebases, making the cascade effects bigger.

The need for such a system like the cascade comes from the fact that CSS allows
multiple rules to be applied on the same element, even from different origins
(the website, but also the browser or even from the user). It is therefore
necessary to define what is the rule that ultimately will be applied in this
case.
The cascade gives each rule a weight, calculated from several criteria, and
apply the heaviest on the element.
I could appear simple at first, but the calculations
criteria are not, at all.

The rules that have the lightest cascade weight are not really an issue, but we
have to keep them in mind to avoid surprises:

### Browser defaults

Here is the top of the cascade. These are the rules that makes a h1 title big
even if it isn't specified.

### Parent inheritance

Then, the rules are inherited from the parents HTML elements. Back to our h1
element, if there is a “color: blue” rule on the body element, the title will
inherit it, and will therefore be blue.

That being said, we now enter a more painful level of cascade weight.

### Rule order

The position of a rule compared with others will have an influence on its
weight. Thus, if two rules were to have the same weight if on the same position,
it finally will be the latest that will be the heaviest, and so applied. ***The
latest.*** With some quite simple code, it can be easy to understand:

```css
h1 {
  color: red;
  color: blue;
}
```

Easy, right ? The h1 will be blue ! But if there is a “color: red” rule in one
CSS file named *foo.css*, a “color: blue” rule in another file named *bar.css*,
that the *foo.css* loading takes more time than *bar.css*, but that the
*foo.css* HTML tag is before the *bar.css* one, which rule is applied ? Well,
it’s quite harder to know. *(hint: the loading time is not taken into account)*

### Selector specificity

This one is a level of complexity higher, [some people even made calculators to
simplify it](https://specificity.keegan.st). I will not enter into much details,
but know that the weight of a selector is equal to the sum of all the weights of
the selectors composing it. And that all selectors does’t weigh the same.

```css
.title {
  color: red;
}

body header h1 {
  color: blue;
}
```

In this example, the first selector’s weight is 10 because it only contains a
CSS class selector which weigh 10. The second selector’s weight is 3, because it
contains three tag selectors, weighing each 1. So, as 10 > 3, the h1 title will
be red !

### Inline styles

The rules that are in the “style” attribute on a HTML element are heavier than
any selector previously defined. Here is a blue title:

```css
h1 {
  color: red;
}
```
```html
<h1 style="color: blue;">Title</h1>
```

### Importance

And last but not least, the God Mode, the crusher of all styles, the
***!important*** keyword. When we REALLY want our title to be red:

```css
h1 {
  color: red !important;
}
```
```html
<h1 style="color: blue;">Title</h1>
```

As all this cascade is about weight, if two rules are marked as !important, the
rest of the criteria is still taken into account to calculate which one is the
heavier, and so applied.

**…And that is as bad as it gets.** Now, imagine thousands and thousands of
selectors cascading over themselves to style a website, and you’ll understand
the hell CSS can be. So, some fellow CSS developers imagined several
methodologies and tools to prevent this nightmare to happen !

## Tooling evolution

Now I’ll present to you how my way of writing CSS evolved over time. Do not
expect a complete timeline of all the tools invented since the first release of
CSS in 1996 (I was 6 years old !), but a description of how I worked with (or
around) the cascade in my short personal experience.

### Pre-processors

I began developing web applications in 2012, in the golden age of the
pre-processors. They already had appeared a few years back, as CSS itself wasn’t
enough to build complex websites. Pre-processors are compilers that generate CSS
from slightly different languages, like [Sass](http://sass-lang.com) or
[LESS](http://lesscss.org). These new languages added some fantastic new
features as variables or nesting, among other wonders.

We could transform some old and un-easy to maintain CSS:

```css
body {
  background: #E5E5E5;
}

body h1 {
  color: #333333;
}
```

into this much *better* version:

```scss
$textColor: #333333;

body {
  background: lighten($textColor, 90%);

  h1 {
    color: $textColor
  }
}
```

With these new tools, and to prevent rules to collide in the cascade, we started
nesting and replicating the whole HTML structure into our Sass or LESS code. Our
CSS ended up with super long and heavy selectors matching only and exactly our
element, like this one:

> .searchPage .sideBar .refinements.default .category .star input

And this worked pretty well for a time ! But these selectors weren’t the more
efficient, and the HTML structure being doubled, any change in it must be passed
on the styles. So I moved on.

### CSS Methodologies

By this time, some new CSS writing guidelines began to drew my attention. They
weren’t exclusive with pre-processors, and aimed to avoid cascade collision
(just like nesting) with some rules, like on the selector naming.

These methodologies came by the time I started to split my developments into
components. The nesting didn’t work well with these, as the purpose was to
create bits of code usable everywhere in my web app, like a button for example.
The one I use (still today) is named [BEM, for Block Element
Modifier](https://en.bem.info/method/), but there are others with the same aim:
each HTML element of my component has to have an unique CSS class. This way, no
nesting is needed, and no cascade collision !

And this pre-processed code:

```scss
h1 {
  color: $textColor

  img {
    border: 1px solid black;
  }
}
```

was transformed into:

```css
.Title {
  color: $textColor
}

.Title-icon {
  border: 1px solid black;
}
```

Obviously, the HTML code needed to be updated with the new classes, but the
selectors are now short and self-explanatory ! Without any chance of cascade
collision.

Now, and to better explain a final tool, the one I think will solve all our
problems (for now), I must show you another approach of this “working around”
the cascade:

### CSS Frameworks

Here, to prevent our CSS to collide, we… stop writing our own ! CSS frameworks
are already written styles that we can use with specific CSS classes. There is
two different approaches here:

* “Final” styles framework as [Bootstrap](http://getbootstrap.com): a simple
 *“btn”* class on a HTML element and… tada ! Now it is a magnificent button.
 Besides, some variables are available to customize the frameworks’ look.
 Utility styles framework, like [Tachyons](http://tachyons.io). Here, there
 aren’t any pre-defined style, but a lot of utility CSS classes are available,
 like *“pam”* to make an element have a *medium padding*, or *“ba”* to make it
 have a *border all* around it.

* The second one is quite interesting, as our final CSS file will only weigh
 10kB and never more, even if the  website grows ! But the HTML will have a lot
 of gibberish classes.
 It’s comparable with having all the styles inline, with a
 weight optimization comparable with minification, as *“ba”* is shorter than
 *“border-style: solid; border-width: 1px;”*.

These frameworks will keep us from complex CSS cascade calculations ! But I
quite didn’t like the fact to use a framework, and to have a lot of quite
unreadable CSS classes in my HTML. But the full re-usability and modularity of
the styles, without any cascade problems, are awesome.

This bring us to this amazing tool, directly forged with the best JavaScript
magic:

### CSS Modules

This concept first took shape from a simple observation: nowadays, the CSS code
is compiled from other languages to make its writing way easier, and for the
same reason HTML code is mainly generated with JavaScript templating tools. But
the CSS selectors, the link between the elements and the styles, the ones for
which the coder really needs to cogitate to prevent them to collide, are not
tooled at all.

And so [CSS Modules](https://github.com/css-modules/css-modules) was created.
The first awesome feature is the CSS class names automatic generation. No more
worries about their uniqueness, we can name them as we want, the final one
generated on the HTML element will be unique. Promise. This allows to rewrite
this previous CSS BEM and HTML code:

```css
.Title {
  color: $textColor;
}
```

```html
<h1 class="Title"></h1>
```

into this CSS and JS template code:

```css
.styleName {
  color: $textColor
}
```

```js
import styles from './style.css';
`<h1 class=${styles.styleName}></h1>`
```

And when compiled, this code will generate something like this !

```css
.styleName__abc5436 {
  color: #333333;
}
```

```html
<h1 class="styleName__abc5436"></h1>
```

A casc-what ? I don’t know what this is ! ❤️

The second main feature, which is directly inspired by modular CSS frameworks
like Tachyons, is the styles composition. Just like it allowed to style HTML
elements with some common utility classes, CSS modules allows to compose our
classes with common styles. Let me show you !

```css
.titleColor {
  color: #333333;
}

.bigTitle {
  composes: titleColor;
  font-size: 24px;
}

.mediumTitle {
  composes: titleColor;
  font-size: 16px;
}
```

```js
import styles from './style.css';
`<h1 class=${styles.bigTitle}></h1>
 <h2 class=${styles.mediumTitle}></h2>`
```

will compile into:

```css
.titleColor__abc5436 {
  color: #333333;
}

.bigTitle__def6547 {
  font-size: 24px;
}

.mediumTitle__1638bcd {
  font-size: 16px;
}
```

```js
<h1 class="titleColor__abc5436 bigTitle__def6547"></h1>
<h2 class="titleColor__abc5436 mediumTitle__1638bcd"></h2>
```

And that, Sir, is pretty awesome. Styles are composable and modularizable, and
not with a lot of gibberish utility classes but directly in the stylesheet. And
styles colliding are just an old nightmare.

That’s how I’ve been playing around with CSS and its cascade until now. I expect
the months and years to come to surprise me with new and better tools or
methodologies, and I’ll be happy to learn and test them 👍.
