/*function repeter() {
  console.log("Hi faty");

  setTimeout(repeter, 1000); 
}

repeter();*/




let count = 0;
let timerId;   // on stocke ici l'id

function counter() {
  document.querySelector('.output').innerHTML = count;
  count++;
  console.log("Hi faty");

  timerId = setTimeout(counter, 1000);
}

counter();

// Pour arrêter après 5 secondes par exemple
setTimeout(() => {
  clearTimeout(timerId);
  console.log("Stopped!");
}, 5000);