# Putain de Code !


[![Build Status](https://travis-ci.org/putaindecode/website.png?branch=master)](https://travis-ci.org/putaindecode/website)
[![Code Climate](https://codeclimate.com/github/putaindecode/website.png)](https://codeclimate.com/github/putaindecode/website)

<img align="right" alt="" src="https://raw.github.com/putaindecode/website/master/src/assets/_images/p!-logo--no-bubble-512--trim.png" width="128">

Dépôt contenant le code du site web.

Les articles seront postés ici sous forme de PR une fois qu'on est OK dans une issue du repo de [proposition de posts](https://github.com/putaindecode/propositions-de-posts) (afin de pas polluer les issues techniques du site)

---

## Development

__Notice: please be aware that we are using a `.editorconfig`. Be sure to respect it ([tip](http://editorconfig.org/)). Thanks__

This website is build on top of [happyplan](https://github.com/happyplan/happyplan), so please checkout [happyplan README](https://github.com/happyplan/happyplan#readme) before trying to do anything.

**Require node >=0.10.21**

    git clone https://github.com/putaindecode/website.git
    cd website
    make install
    make update

& launch the website locally

    happyplan

## Distribution

The following command will build the website & publish `dist` folder to `gh-pages` branch.

    happyplan publish

---

## Specific updates

### Generating favicon

Install [icoutils](http://www.nongnu.org/icoutils/)

    brew install icoutils

Then generate using command

    make favicon

---

## Credits

### Authors

* [Organization members](https://github.com/putaindecode?tab=members)
* [Contributors list](https://github.com/putaindecode/website/graphs/contributors)

### Logo & Avatar

All credits go to all the people involve in [this discussion](https://github.com/putaindecode/discussions/issues/4).
Special thanks to [@mlbli](https://github.com/mlbli) for the [initial logo](https://github.com/putaindecode/website/blob/3324cbe7637dacd1f42a412c1085431a2d551928/src/assets/_images/p!-logos.png).


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/putaindecode/website/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

