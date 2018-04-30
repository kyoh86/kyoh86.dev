'use strict';

import {Encoder} from './encoder.js';

window.addEventListener("load",  function() {
  document.querySelectorAll('code.language-uml').forEach(el => {
    let text = el.textContent;
    let url = "http://plantuml.com/plantuml/img/" + Encoder.compress(text);
    el.parentNode.outerHTML = '<div><img src="' + url + '" /></div>';
    console.debug("encoding " + el.textContent);
  });
  console.debug("PlantUML");
});
