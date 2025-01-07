//import { animate } from "./script_universe";


function explodeText() {

    const splitText = new SplitType('#Title');

    const chars = splitText.chars;

    gsap.set(chars, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0
    });

    gsap.to(chars, {
        delay: 3,
        duration: 2,
        opacity: 0,
        scale: 2,
        color: "red",
        rotation: () => gsap.utils.random(-720, 720),
        x: () => gsap.utils.random(-800, 800),
        y: () => gsap.utils.random(-800, 800),
        stagger: {
            each: 0.01,
            from: "left"
        },
        ease: "power2.out",
        onStart: () => {
            boom();
        },
        onComplete: () => {
          //chars.remove();
      }
    });
}

function createParticle(x, y) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  const size = Math.floor(Math.random() * 20 + 5);
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  
  //const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  //particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
  document.getElementById('explosion').appendChild(particle);
  
  const angle = Math.random() * Math.PI * 5;
  const speed = Math.random() * 35 + 5;
  const life = Math.random() * 3000 + 500;

  gsap.to(particle, {
      duration: life / 1000, // Convert life to seconds for GSAP
      x: Math.cos(angle) * speed * 20,
      y: Math.sin(angle) * speed * 20,
      opacity: 0,
      onComplete: () => {
          particle.remove();
          document.getElementById("explosion").style.zIndex = "-2"; 
      }
  });
}

function boom() {
  for (let i = 0; i < 400; i++) {
      createParticle(window.innerWidth / 2, window.innerHeight / 2);
  }
}
