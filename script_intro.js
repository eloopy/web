

import { animate } from "./script_universe.js";

let particles = [];

window.addEventListener('load', function () {
    revealTitle();
  })

const splitText = new SplitType('#Title');
const chars = splitText.chars;

//reveal title 
function revealTitle() {
    gsap.to(chars, {
        duration: 0.5,
        visibility: 'visible',
        opacity: 1,
        stagger: 0.05, 
        ease: "power2.out",
        onComplete: () => {
            shakeTitle();
        }
    });
}


//shake title
function shakeTitle() {
    gsap.to(chars,{
        delay: 2,
        scale: 1.1,
        duration: 0.4,
        repeat: 15, 
        yoyo: true, 
        ease: "steps(12)",
        x: () => gsap.utils.random(-3, 3),
        y: () => gsap.utils.random(-8, 8),
        onStart: () => {
            explodeText();
        }
    });
}

//explote text and create particles then call Universe animation
function explodeText() {

    gsap.set(chars, {
        scale: 1,
        rotation: 0,
    });

    gsap.to(chars, {
        delay: 2,
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
            createCanvasExplosion();
            animate();

        },
        onComplete: () => {
            IntroCompleted();
           
      }
    });
}

function IntroCompleted(){

    particles = [];
    document.getElementById("controls").style.visibility = "visible";
}

function createCanvasExplosion() {
    const canvas = document.getElementById('explosionCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    function createParticle() {
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() * 10 - 5) * 4, // change speed X
            vy: (Math.random() * 10 - 5) * 4, // change speed Y
            radius: Math.random() * 20 + 5,
            life: Math.random() * 100 + 500,
            alpha: 1,
            color: '#ac0404'
        };
    }

    function boom() {
        for (let i = 0; i < 70; i++) {
            particles.push(createParticle());
        }
    }


    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= 0.008;

            if (particle.alpha < 0) return false; 

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.fill();
            return true;
        });
        requestAnimationFrame(update);
    }

    boom();
    update();
}
