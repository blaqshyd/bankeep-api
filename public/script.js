// You can write JavaScript code here

console.log("Hello, world!"); 
// You can also write functions
function greet(name) {
  console.log(`Hello, ${name}!`);
}

setTimeout(() => {
     confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true
    });
  }, 500);