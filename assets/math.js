/* Typeset every \( ... \) and $$ ... $$ with the vendored KaTeX (works offline). */
(function(){
  function go(el){ el=(el&&el.nodeType===1)?el:document.body;
    if(!window.renderMathInElement) return;
    renderMathInElement(el,{
      delimiters:[{left:'\\[',right:'\\]',display:true},{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}],
      throwOnError:false, macros:{'\\T':'{^{\\mathsf{T}}}','\\vb':'\\boldsymbol{#1}'}, ignoredTags:['script','style','textarea','pre','code','canvas']
    });
  }
  window.TUTmath=go;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go();
})();
