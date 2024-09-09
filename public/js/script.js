// You can write JavaScript code here

console.log("Hello, world!"); 
// You can also write functions
function greet(name) {
  console.log(`Hello, ${name}!`);
}

// Add event listeners to the nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const id = link.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});

setTimeout(() => {
     confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      disableForReducedMotion: true
    });
  }, 500);