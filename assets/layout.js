/* Turn <select class="gal"> into a row of clickable buttons (LaTeX in labels is typeset later by math.js).
   The select stays in the page, hidden, so the page code keeps reading .value and its change events. */
(function(){
  [].forEach.call(document.querySelectorAll('select.gal'),function(sel){
    const box=document.createElement('div'); box.className='galb';
    const btns=[].map.call(sel.options,function(o){
      const b=document.createElement('button'); b.type='button'; b.innerHTML=o.innerHTML; b.dataset.v=o.value;
      b.onclick=function(){ sel.value=o.value; sel.dispatchEvent(new Event('change',{bubbles:true})); mark(); };
      box.appendChild(b); return b; });
    function mark(){ btns.forEach(function(b){ b.classList.toggle('on',b.dataset.v===sel.value); }); }
    sel.addEventListener('change',mark); sel.style.display='none'; sel.parentNode.insertBefore(box,sel.nextSibling); mark();
  });
})();
/* Move every .ctl parameter block into one sticky left-hand panel; figures and text stay on the right. */
(function(){
  const wrap=document.querySelector('body > .wrap');
  if(!wrap) return;
  const ctls=[].slice.call(wrap.querySelectorAll('.ctl'));
  if(!ctls.length) return;
  const layout=document.createElement('div'); layout.className='layout';
  const side=document.createElement('aside'); side.className='side'; side.setAttribute('aria-label','Parameters');
  const main=document.createElement('div'); main.className='main';
  const head=document.createElement('div'); head.className='side-h'; head.textContent='Parameters'; side.appendChild(head);
  function titleFor(el){
    let n=el; while(n){ n=n.previousElementSibling; if(n&&n.tagName==='H2') return n.textContent.replace(/^\s*\d+\.\s*/,''); }
    return '';
  }
  while(wrap.firstChild) main.appendChild(wrap.firstChild);
  let lastT=null;
  ctls.forEach(function(c,i){
    const g=document.createElement('div'); g.className='grp';
    let t=c.getAttribute('data-title'); if(t===null) t=titleFor(c);
    if(t===lastT) t=''; else lastT=t;
    if(t){const s=document.createElement('div'); s.className='grp-t'; s.textContent=t; g.appendChild(s);}
    c.parentNode.removeChild(c); g.appendChild(c); side.appendChild(g);
  });
  layout.appendChild(side); layout.appendChild(main); wrap.appendChild(layout);
  wrap.classList.add('has-side');
})();
