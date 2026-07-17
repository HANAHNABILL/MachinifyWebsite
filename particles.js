// js/particles.js - Shared particle system
// Usage: initParticleCanvas('canvasId');
(function(){
  function initParticleCanvas(canvasId){
    const canvas = document.getElementById(canvasId);
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const mouse = {x:null,y:null};
    window.addEventListener('mousemove', e=>{ mouse.x = e.clientX; mouse.y = e.clientY; });
    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }
    function Particle(){
      this.x = Math.random()*canvas.width;
      this.y = Math.random()*canvas.height;
      this.size = Math.random()*5+3; // slightly larger for visual impact
      this.speedX = (Math.random()-0.5)*0.8;
      this.speedY = (Math.random()-0.5)*0.8;
      this.opacity = Math.random()*0.4+0.6;
      this.color = `rgba(255,118,24,${this.opacity})`;
    }
    Particle.prototype.update = function(){
      this.x += this.speedX;
      this.y += this.speedY;
      if(mouse.x && mouse.y){
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          this.x += dx*0.02;
          this.y += dy*0.02;
        }
      }
      if(this.x<0) this.x = canvas.width;
      if(this.x>canvas.width) this.x = 0;
      if(this.y<0) this.y = canvas.height;
      if(this.y>canvas.height) this.y = 0;
    };
    Particle.prototype.draw = function(){
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#ff7618';
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    };
    function initParticles(){
      particlesArray = [];
      const count = Math.min(Math.floor(window.innerWidth*window.innerHeight/15000), 100);
      for(let i=0;i<count;i++) particlesArray.push(new Particle());
    }
    function connect(){
      for(let a=0;a<particlesArray.length;a++){
        for(let b=a+1;b<particlesArray.length;b++){
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist<130){
            const opacity = (1 - dist/130)*0.5;
            ctx.strokeStyle = `rgba(255,140,40,${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }
    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particlesArray.forEach(p=>{p.update();p.draw();});
      connect();
      requestAnimationFrame(animate);
    }
    // Initialize
    resize();
    animate();
    window.addEventListener('resize', resize);
  }
  // Expose globally
  window.initParticleCanvas = initParticleCanvas;
})();
