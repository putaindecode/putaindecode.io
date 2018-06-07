---
date: "2017-10-26"
title: "Swift - la fonction: une closure particulière"
tags:
  - swift
  - function
  - closure
authors:
  - leolelego
reviewers:
  - bloodyowl
  - MoOx
header:
  image: swift.jpg
  linearGradient: 0deg, rgba(249,82,51, .9), rgba(252, 136, 63, .7)
---

**Swift** est un langage simple pour les débutants, tout en offrant de grandes
possibilitées aux développeurs expérimentés. Les _fonctions_ Swift sont un bon
exemple de cette façon d’avoir pensé le langage.

## Les fonctions

### Déclaration simple

La déclaration et l’utilisation de _fonctions_ est simple. On commence avec le
mot clé `func` suivi du _nom_, puis des _paramètres_ entre parenthèses (a.k.a.
`input`) :

```swift
func sayHello(name:String, age:UInt){
    print("Hello \(name), you are \(age)")
}
```

L’appel se fait aussi simplement que ça : `sayHello(name:"Bob", age: 32)`. Le
mot clé `_` permet d'enlever le label du paramètre dans l'appel si besoin :

```swift
// Declaration
func sayHello(name:String,_ age:UInt){
 print("Hello \(name), you are \(age)")
}
// Appel
sayHello(name:"Bob", 32)
```

Mais vous perdrez en clarté de code suivant les cas. Par exemple, avec
`min(3,6)` on voit tout de suite ce que fait la fonction. Alors que
`sayHelloTo("Bob", 32)`, le `32` pourrait être beaucoup de choses.

> Les paramètres sont obligatoirement typés, mais peuvent être optionnels (en
> autorisant la valeur nil) avec la notation ? (e.g. Int?, String?).

Vous pouvez aussi définir des valeurs par défauts pour les paramètres :

```swift
// Declaration
func sayHello(name:String, _ age:UInt? = nil){
    if age == nil {
        print("Hello \(name)")
    } else {
        print("Hello \(name), you are \(age!)") //! permet de pas afficher Optinal(value)
    }
}
// Appel
sayHello(name:"Bob") // -> Hello Bob
sayHello(name:"Bob", 32) // ->  Hello Bob, you are 32
```

La plupart du temps nos fonctions servent à nous retourner des informations.
Pour cela on utilise `->` en signe de retour suivi du type de la valeur
retournée.

```
func formatHelloSentence(name:String, age:UInt? = nil) -> String {
    if age == nil {
        return "Hello \(name)"
    } else {
        return "Hello \(name), you are \(age)"
    }
}
// Appel
let helloSentence = formatHelloSentence(name:"Bob", age: 32)
```

### Retours multiples ou Tuples

Apple n’est pas connu pour sa générosité, mais dans Swift ils en ont fait
autrement `:troll:` : on peut retourner plusieurs valeurs avec une seule
fonction. Pour cela on utilise un `Tuple` : un collection de variables
ordonnées.

```swift
func hardFunction(fInputs:[Float])->(Int,Int,Float,String) {
    var a = 0
    var b = 0
    var f : Float = 0.0
    var str = ""
    //...
    return (a,b,f,str)
}
```

Ici cette fonction prend en paramètres un tableau de `Float` et retourne un
_Tuple_ composé de deux `Int`, un `Float` et un `String` dans cet ordre. Vous
pouvez alors utiliser le _Tuple_ comme une structure en utilisant l’index des
éléments du _Tuple_ comme nom de variable (ex: `0`pour le premier `Int`, `3`
pour le `String`).

```swift
let myTuple = hardFunction([2.4,2.6,1.8])
let myTupleString = myTuple.3
```

Mais ceci reste assez confus, alors on peut nommer les éléments.

```swift
func hardFunction(fInputs:[Float])->(valSup:Int,
        valMax:Int,
        average:Float,
        errorString:String) {
    //...
}

//utilisation
let myTuple = hardFunction([2.4,2.6,1.8])
let myTupleString = myTuple.errorString // myTuple.3 marche encore
```

L'exécution du code permettant d'avoir les valeurs _Tuple_ n'est effectuée qu'à
la demande de ces valeurs. Dans l'exemple ci-dessus, le code de `hardFunction`
ne sera appelé qu'à la dernière ligne, car c'est là qu'on a besoin de
`errorString`, pas avant.

Et la notion de _Closure_ fait son entrée!

## La closure: la variable-fonction

### Quésaco

**Une _closure_ est une partie de code, avec paramètres et sorties, qui peut
être encapsulé dans une variable, et exécutée à la demande**. Si vous développez
en C++ ou Objective-C vous connaissez peut-être déjà les _blocks_ et en Java ou
C# les _lambdas_ qui sont des _features_ très (très) proches.

### Déclaration

Une _closure_ se déclare grâce au `{}` et peut être appelée (exécutée) grâce aux
parenthèses :

```swift
 let helloClosure = {
     print("hello, I’m a closure")
 }

 helloClosure() // Le code est exécuté ici
```

Ça vous rappelle rien ? L’appel d’une _fonction_ ! En réalité, la _fonction_ est
une _closure_ particulière associé à un contexte (Object, environnement,
Bundle...) pour réaliser des optimisations et une meilleur compréhension du
code.

> Pour une _closure_ "à l’air libre", on dit d’elle, qu’elle est _Self
> Contained_ alors qu’une fonction est contenue par un contexte (`class` par
> exemple)

Comme les fonctions, les _closures_ ont des paramètres d’entrée et de retour:

```swift
let complexClosure = {(name:String, age:Float) -> Bool in
    // Code
    return false
}
let success = complexClosure("Louis",32)
print("Louis has \(success)")
```

Ainsi, les valeurs dans la première partie après la `{` sont les paramètres
d’entrées et après la `->` ce sont les paramètres de sortie. Le code à exécuter
est après le `in`.

> Comme vous avez dû le remarquer, les _closures_ n’ont pas de paramètres
> nominatif. IL faut passer les paramètres d'entrée dans l'ordre de la
> déclaration.

### Closure et Type

Toute variable est typée en _Swift_, implicitement ou explicitement. Pour les
_closures_ le type est souvent implicite, aussi bien qu’on en oublie souvent
qu’elles sont typées. Le type d’une closure va être défini par ses paramètres
d’entrée et de sortie. Ainsi la _complexClosure_ ci-dessus est du type :
`((String, Float)) -> (Bool)`.

Je peux alors écrire ce code puisque les closures sont du même type :

```swift
let otherComplexClosure = { (surname:String,size:Float) -> Bool in
    // Other complexe Code
    return true
}
complexClosure = otherComplexClosure
```

### Utilisation du contexte

Les _closures_ ont une connaissance du contexte qui l’entoure. Ce qui veut dire
que si la closure est créé dans une méthode, elle aura accès :

- au contexte de classe en passant par `self` (variables, autre fonctions...)
- au contexte de la fonction (paramètres, fonctions internes...)

```swift
class Animal {
    var name = "Boby"

    func crier(cri:String){
        let uselessClosure = {
            print("\(self.name) cri \(cri)")
        }
        uselessClosure()
    }
}
```

### Trailing Closure

Pour finir, un peu d'esthétisme car on aime tous le _beau_ code. La _Trailing
Closure_ est une syntaxe d'appel de fonction qui permet de rendre le code plus
facile à lire.

Prenant la fonction suivante, prenant une `URL` est une closure de type
`Void->Void` :

```swift
func doLongTask(on file:URL,
        completion:() -> ()){
    //long task
    completion()
}
```

On alors l'appeler cette fonction comme ceci :

```swift
doLongTask(on: aFileURL, completion:{
    print("Task Applied on \(aFileURL)")
})
```

Avec du code plus complexe, ça commence à devenir difficile à lire. Or si le
dernier paramètre d'une fonction est une _closure_, on peut alors écrire l'appel
comme ceci :

```swift
doLongTask(on: aFileURL){
    print("Task Applied on \(aFileURL)")
}
```

## Pro Tip

Imaginons une classe `A` ayant une variable `event` et un classe `B` ayant une
fonction `awesomeEvent` ayant le même type que la variable `event` de la classe
`A`. Je peux alors allouer, à la variable `event`, le code de `awesomeEvent`.

```swift
class A {
    var event : ((String)->Void)?
}

class B {
    func awesome(name:String){
        print("Awesome \(name)")
    }
}

let b = B()
let a = A()

a.event = b.awesome
a.event?("Mate")
```

[Exécutez ce code sur IBM Swift Sandbox c'est magique!](http://swift.sandbox.bluemix.net/#/repl/59ecdb8508529b23242b5696)

## Conclusion

Voilà vous savez tout, ou presque, sur les fonctions et les closures. Les
closures ont vraiment la part belle en Swift, donc apprenez à les utiliser et
les comprendre pour simplifiez votre code. Elles sont partout dans les API iOS
et macOS.

Et un petit conseil: faite attention à l'état de vos _closures_ dans vos
`Thread` si vous ne voulez pas de fuite 😊
