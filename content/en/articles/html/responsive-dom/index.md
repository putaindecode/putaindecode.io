---
date: "2013-12-26"
title: Responsive webdesign and DOM structure
tags:
  - responsive
  - html
  - javascript
authors:
  - neemzy
---

Alright, first things first, if you don't mind. Ever heard about **responsive
webdesign**? Yes? Good. You therefore may have encountered some pretty annoying
use case (I did). Whether you are a *mobile-first* adept or an old-fashioned
progressive degradator, you must have come to a point where you told yourself
this silly thing:

> Would really be great if this element was here instead of there. But it
> isn't.

Your typical example for this is a slightly complex menu, where we would like
to give the items a bit of reordering just above or below a certain screen
size. And we have to admit there is no miraculous way out of this.

I can already hear the nasty boys scream and shout, saying that a better
conception beforehand would have granted us better *markup* and spared us the
trouble. Although it's an easy thing to say, it turns out to be true in a
number of cases (yes, I'm quite good at avoiding picking a side). However, if
you ever find yourself wading in these swamps, it probably means going back
isn't an option anymore.

As fast as innovation in our profession goes, especially about anything
mobile-related in general and web-related especially, it's quite likely that
the tricks I'm going to deliver are obsolete six months from now, and that
this article becomes increasingly popular again on Twitter, RTs kindly mocking
the pre-Columbian techniques we were limited to not so long ago. Heck knows, I
might just become a paradoxally decadent celebrity *à la* Rick Astley. In the
meantime, I have nothing better to share on the subject. If you do, I strongly
recommend spitting it out in the comments for everyone to enjoy. Well, are you
ready now? I'm waiting, you know!

## Vintage: Do Repeat Yourself

Consider a blog page, where successively appear the article's title, its
photo, and its text at last. Given that a photo, depending your connection's
quality, can be quite a PITA to load on mobile (and that the responsive image
thing [is still a goddamn mess](http://css-tricks.com/responsive-images-hard/)),
you decide to put the photo below the text content so your readers can enjoy the
article even if the picture isn't done loading yet - even switching it for a
lighter version in the process.

In such a case, the best solution might as well be to duplicate the `img` tag,
and to hide one or the other with a CSS *media query* depending on the screen
size. Here is a dummy example:

```html
<article>
  <h1>My awesome article</h1>

  <img src="/my/desktop/image.jpg" class="img-desktop" />

  <p>Drop a comment, mate</p>

  <img src="/my/mobile/image.jpg" class="img-mobile" />
</article>
```

```css
.img-desktop {
  /* The desktop image is hidden by default */
  display: none;
}

@media screen and (min-width: 768px) {
  /* On "big" screens, we show the desktop image... */
  .img-desktop {
    display: block;
  }

  /* ...and hide the mobile image */
  .img-mobile {
    display: none;
  }
}
```

The most obvious drawback of such a solution is that content duplication means
overweight. For purely textual stuff, depending on the size, it may be
insignificant. Here, I chose the worst-case scenario on purpose: an image
shall never ever be loaded twice by our visitors. Let's cheat a bit with
JavaScript:

```html
<article>
  <h1>My awesome article</h1>

  <!-- Those images won't be loaded since they have no src attribute -->
  <img data-src="/my/desktop/image.jpg" class="img-desktop" />

  <p>Drop a comment, mate</p>

  <img data-src="/my/mobile/image.jpg" class="img-mobile" />

  <noscript>
    <!-- This image will only be loaded if our visitor has disabled JS -->
    <img src="/my/mobile/image.jpg" class="img-mobile img-noscript" />
  </noscript>
</article>
```

```css
.img-desktop {
  display: none;
}

@media screen and (min-width: 768px) {
  .img-desktop {
    display: block;
  }

  .img-mobile {
    display: none;
  }
}

.img-noscript {
  /* Let's override the desktop style to make sure
     this image is displayed regardless of screen size */

  display: block;
}
```

```javascript
var handleImages = function() {
  // Let's load images with a data-src attribute,
  // if they aren't yet (no src attribute)
  // and they aren't hidden by CSS

  [].forEach.call(document.querySelectorAll('img[data-src]:not([src])'), function(el) {
    if (window.getComputedStyle(el).display != 'none') {
      el.src = el.getAttribute('data-src');
    }
  });
};

window.addEventListener('load', handleImages);
window.addEventListener('resize', handleImages);
```

This way, only the required images will be loaded with the page. The same goes
with `resize`; I'll admit it's kind of dirty, `matchMedia` would probably help
us do better.

For a visitor browsing without JavaScript, we only load the mobile image: I'm
assuming that, since we are unable to define which version of the image is
best for them, it's wiser to go with the lightest.

## JS FTW: enquire.js

This second solution could totally be achieved without third-party tools, but
I'd like to introduce a little library of my liking I have used previously for
similar cases. It is called [enquire.js](http://wicky.nillia.ms/enquire.js/)
and allows binding callbacks to media queries:

```javascript
enquire.register('screen and (min-width: 768px)', {
  match: function() {
    // The screen is 768px wide or above...
  },

  unmatch: function() {
    // ...and here, 767px wide or below.
    // The lib relies on matchMedia and matchMedia.addListener
  }
});
```

Pretty neat, isn't it? Let's go through our previous example again (the CSS is
now unnecessary):

```html
<article>
  <h1>My awesome article</h1>

  <img data-src="/my/desktop/image.jpg" data-mobile-src="/my/mobile/image.jpg" />

  <p>Drop a comment, mate</p>

  <noscript>
    <img src="/my/mobile/image.jpg" />
  </noscript>
</article>
```

```javascript
var content = document.querySelector('p'),

  switchImage = function(isMobile) {
    var attr = isMobile ? 'data-mobile-src' : 'data-src';

    [].forEach.call(document.querySelectorAll('img[' + attr + ']'), function(el) {
      // We assign one source or the other to our image,
      // triggering its loading if necessary.
      el.src = el.getAttribute(attr);

      // We also move it before or after the text content
      content.parentNode.insertBefore(el, isMobile ? content.nextSibling : content);
    });
  };

enquire.register('screen and (min-width: 768px)', function() {
  switchImage(false);
});

enquire.register('screen and (max-width: 767px)', function() {
  switchImage(true);
});
```

We thus can easily handle our image's loading, as well as its position. I used
two distinct handlers to make sure enquire does the job upon pageload as well,
in any case (`unmatch` callbacks being called for resizing only, or so it
seems: with a single handler, the image thus never appears if the page is
initially loaded with a screen under 768px).

## That's all you've got, bitch?

We can also discuss different, moar marginal solutions, which are still worth
quoting (given you seem to want it that bad).

### Foundation

[Foundation](http://foundation.zurb.com/) offers, in its fifth version (and
maybe even before, didn't check lol) some HTML syntactic sugar allowing to
switch contents for a given element (through JS).

Not bad, I must say. Here it goes (from
[the docs](http://foundation.zurb.com/docs/components/interchange.html)):

> We use the data-interchange attribute on a markup container (probably a div)
> to do this. Here's an example which loads up a small, static map on mobile, a
> larger static map for medium-sized devices, and a full interactive Google map
> on large display devices.

```html
<div data-interchange="[../examples/interchange/default.html, (small)],
                       [../examples/interchange/medium.html, (medium)],
                       [../examples/interchange/large.html, (large)]">
  <div data-alert class="alert-box secondary radius">
    This is the default content.
    <a href="#" class="close">&times;</a>
  </div>
</div>
```

`small`, `medium` and `large` are just pretty names for given media queries
(in [the docs](http://foundation.zurb.com/docs/components/interchange.html),
once again. I insist.)

### Flexbox (not you, David)

We also can, as judiciously pointed out by lionelB, take a closer
look at Flexbox, a new positioning paradigm that landed with CSS3.
[Compatibility](http://caniuse.com/#search=flexbox) isn't quite satisfying yet
(because of IE, what were the odds) but you can still get ready! You have
pretty much nothing to do besides defining a container:

```css
.flex-container {
  display: flex;

  /* or */

  display: inline-flex;
}
```

...and assigning numbers to its children, Bangkok-style:

```css
.title {
  order: 1;
}

.content {
  order: 2;
}

.image {
  order: 3;
}

/*
You obviously were smart enough to put your image last in the DOM...
...weren't you?
*/

@media screen and (min-width: 768px) {
  .content {
    order: 3;
  }

  .image {
    order: 2;
  }
}
```

And there we are! No need to have graduated from Polly Pocket to understand
how such flexibility and code tidiness solve our problem in two goddamn
seconds. But this is just the tip of the flexberg; there are a lot of great
resources to walk yourself through it better than I ever could, like
[this article](http://www.adobe.com/devnet/html5/articles/working-with-flexbox-the-new-spec.html)
I shamelessly borrowed my snippets from.

## Conclusion

As you saw, I wasn't able to show you any really satisfying solution: to be
able to control an element's position in the DOM relatively to a responsive
webdesign, you must either duplicate it and play hide'n'seek, or move it with
JavaScript. I would therefore be glad for you to share your opinion, ideas or
experiences on this topic. That will give me something to read on my spare
time, and you will be doing something meaningful for once!

Time for me to let you go back to your life. Our paths may cross again, who
knows? Until that day comes, I wish you some happy coding!
