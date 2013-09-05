if (window.addEventListener) {
  var kkeys = [],
    //        ↑  ↑  ↓  ↓  ←  →  ←  →  b  a
    konami = "38,38,40,40,37,39,37,39,66,65";
    konami_cancel = "27"; // esc
    el_konami = null;
  window.addEventListener("keydown", function(e) {
    kkeys.push(e.keyCode); 
    if (kkeys.toString().indexOf(konami) >= 0) {
      // reset
      kkeys = [];
      
      el_konami = document.createElement('div');
      el_konami.className = 'putainde-Konami';
      document.body.appendChild(el_konami);
      
      // fun stuff here
      var el_konamiChild = [
        document.createElement('div'),
        document.createElement('div')
      ];
      
      el_konamiChild[0].className = 'putainde-Konami-content';
      el_konamiChild[1].className = 'putainde-Konami-content-hiddenPart';
      
      // add a qr code here  instead of this stupid phrase?
      el_konamiChild[1].appendChild(document.createTextNode("We've got you !"));
      
      el_konamiChild[0].appendChild(el_konamiChild[1]);
      
      el_konami.appendChild(el_konamiChild[0]);
    }
    
    // esc key => cancel: remove dom element
    if (kkeys.toString().indexOf(konami_cancel) >= 0 && el_konami) {
      document.body.removeChild(el_konami);
      el_konami = null;
    }
  }, true);
}
