/* Phone-width parameter bar for the version-2 tutorial pages. Load it only from those pages, BEFORE layout.js.
   Below 980 px the parameter panel that layout.js builds becomes a bar pinned to the top of the screen.
   - When every group title fits on one line: one button per parameter group; tapping a button opens that
     group over the page (at most 55 % of the screen, scrolling inside), tapping it again closes it.
   - When they do not fit: a single "Parameters" button opens all groups, scrolled to the group of the
     section being read.
   Above 980 px nothing changes: the left-hand sidebar is exactly as layout.js and style.css make it. */
(function(){
  // 1. Before layout.js moves the .ctl blocks: note the number of the section (h2 "N. ...") each one sits in.
  [].forEach.call(document.querySelectorAll('.ctl'),function(c){
    let n=c;
    while(n){ n=n.previousElementSibling;
      if(n&&n.tagName==='H2'){ const m=n.textContent.match(/^\s*(\d+)\./); if(m) c.dataset.sec=m[1]; return; } }
  });

  const css=
    '.pbar{display:none}'+
    '@media (max-width:980px){'+
    ' .layout .side{position:sticky;top:0;z-index:30;margin:0 -16px;border-radius:0;border-left:0;border-right:0;padding:0 10px;box-shadow:0 4px 14px rgba(0,0,0,.12)}'+
    ' .layout .side .side-h,.layout .side .grp-t{display:none}'+
    ' .pbar{display:flex;flex-wrap:nowrap;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;padding:6px 0}'+
    ' .pbar .pl{flex:none;font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:var(--copper)}'+
    ' .pbar button{flex:none;white-space:nowrap;margin:0;padding:5px 8px;font-size:13.5px}'+
    ' .pbar button::after{content:" \\25BE"}'+
    ' .pbar button.on{background:var(--copper);color:#fff}'+
    ' .pbar button.on::after{content:" \\25B4"}'+
    ' .pbar.one .pl,.pbar.one .chip,.pbar:not(.one) .all{display:none}'+
    ' .layout .side .grp{display:none;margin:2px 0 8px;padding-top:8px;border-top:1px solid var(--rule)}'+
    ' .layout .side .grp.on{display:block}'+
    ' .layout .side.open{max-height:55vh;overflow:auto;overscroll-behavior:contain}'+
    ' .layout .side .pbar{position:sticky;top:0;z-index:1;background:var(--card)}'+
    ' .layout .side.one .grp.on .grp-t{display:block}'+
    /* a wide display equation scrolls inside its own box instead of widening the page;
       the padding keeps tall delimiters unclipped */
    ' .katex-display{overflow-x:auto;overflow-y:hidden;padding:.45em 0}'+
    '}'+
    '@media (max-width:380px){.pbar{gap:4px}.pbar .pl{letter-spacing:.03em}.pbar button{padding:5px 6px;font-size:13px}}';
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

  // 2. After layout.js (and math.js) have run: build the bar.
  function build(){
    const side=document.querySelector('.layout .side'); if(!side) return;
    const bar=document.createElement('div'); bar.className='pbar';
    const lab=document.createElement('span'); lab.className='pl'; lab.textContent='Parameters'; bar.appendChild(lab);
    const all=document.createElement('button'); all.type='button'; all.className='all'; all.textContent='Parameters';
    all.setAttribute('aria-expanded','false'); bar.appendChild(all);
    const grps=[].slice.call(side.querySelectorAll('.grp'));
    const sets=[];   // a group without its own title belongs to the titled group before it
    grps.forEach(function(g){
      const t=g.querySelector('.grp-t');
      if(t||!sets.length) sets.push({html:t?t.innerHTML:'Show',grps:[g]}); else sets[sets.length-1].grps.push(g);
    });
    function close(){
      side.classList.remove('open'); all.classList.remove('on'); all.setAttribute('aria-expanded','false');
      sets.forEach(function(o){ o.btn.classList.remove('on'); o.btn.setAttribute('aria-expanded','false'); });
      grps.forEach(function(g){ g.classList.remove('on'); });
    }
    sets.forEach(function(s){
      const b=document.createElement('button'); b.type='button'; b.className='chip'; b.innerHTML=s.html;
      b.setAttribute('aria-expanded','false'); s.btn=b;
      b.onclick=function(){ const open=!b.classList.contains('on'); close();
        if(open){ side.classList.add('open'); side.scrollTop=0; b.classList.add('on'); b.setAttribute('aria-expanded','true');
          s.grps.forEach(function(g){ g.classList.add('on'); }); } };
      bar.appendChild(b);
    });
    // section currently being read: the last numbered h2 above 45 % of the screen height
    function current(){
      let cur=0;
      [].forEach.call(document.querySelectorAll('.main h2'),function(h){
        if(h.getBoundingClientRect().top<innerHeight*0.45){ const m=h.textContent.match(/^\s*(\d+)\./); if(m) cur=+m[1]; } });
      return cur;
    }
    all.onclick=function(){
      if(all.classList.contains('on')){ close(); return; }
      close(); side.classList.add('open'); all.classList.add('on'); all.setAttribute('aria-expanded','true');
      grps.forEach(function(g){ g.classList.add('on'); });
      const cur=current(); let target=null;
      grps.forEach(function(g){ const c=g.querySelector('.ctl'), s=c&&+c.dataset.sec; if(s&&s<=cur) target=g; });
      side.scrollTop=target?target.offsetTop-bar.offsetHeight:0;
    };
    // a group that is itself titled "Parameters" makes the bar's own label redundant
    if(sets.some(function(s){ return s.btn.textContent.trim().toLowerCase()==='parameters'; })) lab.style.display='none';
    side.insertBefore(bar,side.firstChild);
    // one button per group if the titles fit on one line, otherwise the single "Parameters" button
    let mode=null;
    function fit(){
      if(getComputedStyle(bar).display==='none') return;
      bar.classList.remove('one'); side.classList.remove('one');
      const one=bar.scrollWidth>bar.clientWidth+1;
      if(one!==mode){ close(); mode=one; }
      bar.classList.toggle('one',one); side.classList.toggle('one',one);
    }
    fit(); addEventListener('resize',fit); addEventListener('load',fit);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
})();
