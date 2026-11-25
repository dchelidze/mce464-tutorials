/* Minimal wireframe 3D for the tutorials: orthographic camera shared by several canvases, drag to rotate. */
(function(){
  'use strict';
  const cam={yaw:-0.75,pitch:0.55,auto:true,drag:false};
  class View3D{
    constructor(canvas,o){
      this.c=canvas;this.o=Object.assign({zoom:1,cyf:0.6},o||{});
      let lx=0,ly=0;
      canvas.style.touchAction='none';canvas.style.cursor='grab';
      canvas.addEventListener('pointerdown',e=>{cam.drag=true;lx=e.clientX;ly=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing';});
      canvas.addEventListener('pointermove',e=>{if(!cam.drag)return;cam.yaw+=(e.clientX-lx)*0.01;cam.pitch=Math.max(0.05,Math.min(1.5,cam.pitch+(e.clientY-ly)*0.01));lx=e.clientX;ly=e.clientY;});
      const up=()=>{cam.drag=false;canvas.style.cursor='grab';};
      canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    }
    begin(){
      const c=this.c,w=c.clientWidth||320,ar=+c.dataset.ar||0.8,h=Math.round(w*ar),d=Math.min(window.devicePixelRatio||1,2);
      c.style.height=h+'px';if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}
      const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,w,h);
      this.g=g;this.w=w;this.h=h;this.cx=w/2;this.cy=h*this.o.cyf;this.sc=Math.min(w,h*1.15)*0.36*this.o.zoom;
      this.cy_=Math.cos(cam.yaw);this.sy_=Math.sin(cam.yaw);this.cp_=Math.cos(cam.pitch);this.sp_=Math.sin(cam.pitch);
      return g;
    }
    P(x,y,z){const x1=this.cy_*x-this.sy_*y,y1=this.sy_*x+this.cy_*y;return [this.cx+this.sc*x1,this.cy-this.sc*(z*this.cp_+y1*this.sp_),y1*this.cp_-z*this.sp_];}
    seg(a,b,col,lw){const g=this.g,p=this.P(a[0],a[1],a[2]),q=this.P(b[0],b[1],b[2]);g.strokeStyle=col;g.lineWidth=lw||1;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();}
    poly(pts,col,lw,dash){const g=this.g;g.save();g.strokeStyle=col;g.lineWidth=lw||1.5;g.lineJoin='round';g.setLineDash(dash||[]);g.beginPath();pts.forEach((p,i)=>{const q=this.P(p[0],p[1],p[2]);i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]);});g.stroke();g.restore();}
    dot(p,col,r,stroke){const g=this.g,q=this.P(p[0],p[1],p[2]);g.fillStyle=col;g.beginPath();g.arc(q[0],q[1],r||5,0,Math.PI*2);g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke();}}
    text(s,p,col,o){o=o||{};const g=this.g,q=this.P(p[0],p[1],p[2]);g.save();g.font=(o.bold?'700 ':'')+(o.size||12)+'px -apple-system,Helvetica,Arial,sans-serif';g.fillStyle=col||'#1b2a3a';g.textAlign=o.align||'left';g.textBaseline='middle';g.fillText(s,q[0]+(o.dx||0),q[1]+(o.dy||0));g.restore();}
  }
  function lerpCol(t){t=Math.max(0,Math.min(1,t));const a=[0,114,189],b=[217,83,25];return 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')';}
  window.TUT3={View3D,cam,lerpCol};
})();
