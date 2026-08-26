/* ==========================================================================
   ROOMYHOST - INTERACTIVE PARALLAX & UTILITIES SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. COSMIC CANVAS PARTICLE BACKDROP
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 65); // Mobile optimized particle density

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.8 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Connect nearby nodes with delicate glow lines
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  /* --------------------------------------------------------------------------
     2. OPTIMIZED PARALLAX SCROLL ENGINE
     -------------------------------------------------------------------------- */
  const parallaxElements = document.querySelectorAll('.parallax-element, .parallax-bg-layer');
  let latestScrollY = window.scrollY;
  let ticking = false;

  function updateParallax() {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0;
      const rect = el.getBoundingClientRect();
      
      // Only compute if element is within viewport range
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight / 2 - rect.top) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    latestScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Sticky Header Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* --------------------------------------------------------------------------
     3. INTERACTIVE SERVER SPEC ESTIMATOR / CALCULATOR
     -------------------------------------------------------------------------- */
  const cpuSlider = document.getElementById('cpu-slider');
  const ramSlider = document.getElementById('ram-slider');
  const nvmeSlider = document.getElementById('nvme-slider');
  const bwSlider = document.getElementById('bandwidth-slider');

  const cpuValDisp = document.getElementById('cpu-val-display');
  const ramValDisp = document.getElementById('ram-val-display');
  const nvmeValDisp = document.getElementById('nvme-val-display');
  const bwValDisp = document.getElementById('bw-val-display');

  const summaryCpu = document.getElementById('summary-cpu');
  const summaryRam = document.getElementById('summary-ram');
  const summaryNvme = document.getElementById('summary-nvme');
  const summaryBw = document.getElementById('summary-bw');

  const calcPrice = document.getElementById('calculated-price');
  const calcPeriod = document.getElementById('calculated-period');
  const monthlyTab = document.getElementById('calc-monthly-tab');
  const hourlyTab = document.getElementById('calc-hourly-tab');

  let isHourlyMode = false;

  function calculateServerCost() {
    if (!cpuSlider) return;

    const cpu = parseInt(cpuSlider.value);
    const ram = parseInt(ramSlider.value);
    const nvme = parseInt(nvmeSlider.value);
    const bw = parseInt(bwSlider.value);

    // Display updates
    cpuValDisp.textContent = `${cpu} Core${cpu > 1 ? 's' : ''}`;
    ramValDisp.textContent = `${ram} GB`;
    nvmeValDisp.textContent = `${nvme} GB`;
    bwValDisp.textContent = `${bw} TB`;

    summaryCpu.textContent = `${cpu} vCPU AMD EPYC 9004`;
    summaryRam.textContent = `${ram} GB DDR5 ECC`;
    summaryNvme.textContent = `${nvme} GB NVMe Gen4`;
    summaryBw.textContent = `${bw} TB @ 10 Gbps Port`;

    // Pricing formula ($4 base + $3.5/cpu + $0.65/ram + $0.04/nvme + $0.4/bw)
    const baseCost = 4;
    const monthlyTotal = baseCost + (cpu * 3.5) + (ram * 0.65) + (nvme * 0.04) + (bw * 0.4);

    if (isHourlyMode) {
      const hourly = (monthlyTotal / 730).toFixed(4);
      calcPrice.textContent = hourly;
      calcPeriod.textContent = '/ hour';
    } else {
      calcPrice.textContent = monthlyTotal.toFixed(2);
      calcPeriod.textContent = '/ month';
    }
  }

  if (cpuSlider) {
    [cpuSlider, ramSlider, nvmeSlider, bwSlider].forEach(slider => {
      slider.addEventListener('input', calculateServerCost);
    });

    monthlyTab.addEventListener('click', () => {
      isHourlyMode = false;
      monthlyTab.classList.add('active');
      hourlyTab.classList.remove('active');
      calculateServerCost();
    });

    hourlyTab.addEventListener('click', () => {
      isHourlyMode = true;
      hourlyTab.classList.add('active');
      monthlyTab.classList.remove('active');
      calculateServerCost();
    });

    calculateServerCost(); // Initial calc
  }

  /* --------------------------------------------------------------------------
     4. REAL-TIME LATENCY PING SIMULATOR
     -------------------------------------------------------------------------- */
  const retestBtn = document.getElementById('retest-ping-btn');
  const pingTokyo = document.getElementById('ping-tokyo');
  const pingFrankfurt = document.getElementById('ping-frankfurt');
  const pingNy = document.getElementById('ping-ny');
  const pingLondon = document.getElementById('ping-london');
  const pingSingapore = document.getElementById('ping-singapore');

  function runPingTest() {
    if (!pingTokyo) return;

    const basePings = {
      tokyo: { el: pingTokyo, min: 12, max: 16 },
      frankfurt: { el: pingFrankfurt, min: 6, max: 10 },
      ny: { el: pingNy, min: 9, max: 13 },
      london: { el: pingLondon, min: 5, max: 8 },
      singapore: { el: pingSingapore, min: 17, max: 22 }
    };

    Object.values(basePings).forEach(({ el }) => {
      el.textContent = '...';
      el.style.opacity = '0.5';
    });

    setTimeout(() => {
      Object.values(basePings).forEach(({ el, min, max }) => {
        const ping = Math.floor(Math.random() * (max - min + 1)) + min;
        el.textContent = `${ping} ms`;
        el.style.opacity = '1';
      });
    }, 450);
  }

  if (retestBtn) {
    retestBtn.addEventListener('click', runPingTest);
  }

  // Ping cards interactive highlight
  const pingCards = document.querySelectorAll('.ping-card');
  pingCards.forEach(card => {
    card.addEventListener('click', () => {
      pingCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  /* --------------------------------------------------------------------------
     5. PRICING SECTION BILLING TOGGLE (20% DISCOUNT)
     -------------------------------------------------------------------------- */
  const billingToggle = document.getElementById('billing-toggle');
  const priceVals = document.querySelectorAll('.price-val');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');

  if (billingToggle) {
    let isAnnual = false;

    billingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billingToggle.classList.toggle('annual', isAnnual);

      priceVals.forEach(val => {
        const monthlyPrice = val.getAttribute('data-monthly');
        const annualPrice = val.getAttribute('data-annual');
        val.textContent = isAnnual ? annualPrice : monthlyPrice;
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. FAQ ACCORDION TOGGLE
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileToggleBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggleBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. DEPLOYMENT MODAL & SIMULATED PROVISIONING
     -------------------------------------------------------------------------- */
  const modal = document.getElementById('deploy-modal');
  const openModalBtns = document.querySelectorAll('.open-deploy-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const cancelModalBtn = document.getElementById('modal-cancel-btn');
  const confirmDeployBtn = document.getElementById('confirm-deploy-btn');
  const deployProgress = document.getElementById('deploy-progress');
  const deploySuccessBox = document.getElementById('deploy-success-box');
  const assignedIp = document.getElementById('assigned-ip');

  if (modal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Reset modal state
        deployProgress.style.display = 'none';
        deploySuccessBox.style.display = 'none';
        confirmDeployBtn.style.display = 'inline-flex';
        modal.showModal();
      });
    });

    const closeModal = () => modal.close();
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    // Region & OS Button Selectors inside Modal
    const regionBtns = document.querySelectorAll('.region-btn');
    regionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        regionBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    const osBtns = document.querySelectorAll('.os-btn');
    osBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        osBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    if (confirmDeployBtn) {
      confirmDeployBtn.addEventListener('click', () => {
        confirmDeployBtn.style.display = 'none';
        deployProgress.style.display = 'block';

        // Simulated Provisioning Progress
        setTimeout(() => {
          deployProgress.style.display = 'none';
          
          // Generate random IP
          const randomIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
          if (assignedIp) assignedIp.textContent = randomIp;
          
          deploySuccessBox.style.display = 'block';
        }, 1800);
      });
    }
  }

  /* --------------------------------------------------------------------------
     9. CLI COMMAND COPY SNIPPET
     -------------------------------------------------------------------------- */
  const copyCliBtn = document.getElementById('copy-cli-btn');
  if (copyCliBtn) {
    copyCliBtn.addEventListener('click', () => {
      const textToCopy = 'roomy deploy --name api-cluster-01 --region us-east --vcpus 16 --ram 64gb --nvme 500gb';
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = copyCliBtn.innerHTML;
        copyCliBtn.innerHTML = `<span>✔ Copied!</span>`;
        setTimeout(() => {
          copyCliBtn.innerHTML = originalHtml;
        }, 2000);
      });
    });
  }

});
