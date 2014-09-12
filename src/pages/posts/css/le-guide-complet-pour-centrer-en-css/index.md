## Récap

* [techniques tradtionnelles](#techniques-tradtionnelles)
  * [un bloc dans un bloc](#un-bloc-dans-un-bloc)
  * [des blocs dans un bloc](#des-blocs-dans-un-bloc)
  * [des éléments inlines dans un bloc](#des-elements-inlines-dans-un-bloc)
* [techniques avancées : flexbox(ie11+)](#techniques-avancees-flexbox-a-href-http-caniuse-com-feat-flexbox-ie11-a-)

## techniques tradtionnelles

### un bloc dans un bloc

#### horizontal

```css
.parent {
  position: relative;
  transform-style: preserve-3d;
}

.child {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### vertical

```css
.parent {
  position: relative;
  transform-style: preserve-3d;
}

.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

#### les deux

```css
.parent {
  position: relative;
  transform-style: preserve-3d;
}

.child {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

### des blocs dans un bloc

#### horizontal

```css
.parent {
  text-align: center;
}

.child {
  display: inline-block;  
}
```

#### vertical

```css
.parent {}

.child {
  display: inline-block;
  vertical-align: middle; 
}
```

#### les deux

```css
.parent {
  text-align: center;
}

.child {
  display: inline-block;
  vertical-align: middle;
}
```

### des éléments inlines dans un bloc

#### horizontal

```css
.parent {
  text-align: center;
}

.child {}
```

#### vertical

```css
.parent {}

.child {
  vertical-align: middle;
}
```

#### les deux

```css
.parent {
  text-align: center;
}

.child {
  vertical-align: middle;
}
```

## techniques avancées : flexbox ([ie11+](http://caniuse.com/#feat=flexbox))

à venir
