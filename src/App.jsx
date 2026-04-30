import React, { useState, useEffect, useRef, useCallback } from 'react';
import { invitationStyles, stylePalettes } from './data/invitationStyles';



/* ═══════════════════════════════════════════════════════════════
   TWEAKS PANEL
═══════════════════════════════════════════════════════════════ */
function useTweaks(defaults) {
  const [values, setValues] = useState(defaults);
  const setTweak = useCallback((keyOrObj, val) => {
    setValues(prev => typeof keyOrObj === 'object' ? { ...prev, ...keyOrObj } : { ...prev, [keyOrObj]: val });
  }, []);
  return [values, setTweak];
}

function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;
  const clamp = useCallback(() => {
    const p = dragRef.current; if (!p) return;
    const mR = Math.max(PAD, window.innerWidth - p.offsetWidth - PAD);
    const mB = Math.max(PAD, window.innerHeight - p.offsetHeight - PAD);
    offsetRef.current = { x: Math.min(mR, Math.max(PAD, offsetRef.current.x)), y: Math.min(mB, Math.max(PAD, offsetRef.current.y)) };
    p.style.right = offsetRef.current.x + 'px'; p.style.bottom = offsetRef.current.y + 'px';
  }, []);
  useEffect(() => {
    if (!open) return;
    clamp();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(clamp) : null;
    if (ro) { ro.observe(document.documentElement); return () => ro.disconnect(); }
    window.addEventListener('resize', clamp); return () => window.removeEventListener('resize', clamp);
  }, [open, clamp]);
  useEffect(() => {
    const h = (e) => { const t = e?.data?.type; if (t === '__activate_edit_mode') setOpen(true); else if (t === '__deactivate_edit_mode') setOpen(false); };
    window.addEventListener('message', h);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', h);
  }, []);
  const onDragStart = (e) => {
    const p = dragRef.current; if (!p) return;
    const r = p.getBoundingClientRect();
    const sR = window.innerWidth - r.right, sB = window.innerHeight - r.bottom, sx = e.clientX, sy = e.clientY;
    const mv = (ev) => { offsetRef.current = { x: sR - (ev.clientX - sx), y: sB - (ev.clientY - sy) }; clamp(); };
    const up = () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return (
    <div ref={dragRef} className="twk-panel" style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
      <div className="twk-hd" onMouseDown={onDragStart}><b>{title}</b><button className="twk-x" onMouseDown={e => e.stopPropagation()} onClick={() => setOpen(false)}>✕</button></div>
      <div className="twk-body">{children}</div>
    </div>
  );
}
function TweakSection({ label, children }) { return (<><div className="twk-sect">{label}</div>{children}</>); }
function TweakToggle({ label, value, onChange }) {
  return (<div className="twk-row twk-row-h"><div className="twk-lbl"><span>{label}</span></div><button type="button" className="twk-toggle" data-on={value?'1':'0'} onClick={() => onChange(!value)}><i/></button></div>);
}
function TweakRadio({ label, value, options, onChange }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const opts = options.map(o => typeof o === 'object' ? o : { value: o, label: o });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const vRef = useRef(value); vRef.current = value;
  const segAt = (cx) => { const r = ref.current.getBoundingClientRect(); const i = Math.floor(((cx - r.left - 2) / (r.width - 4)) * n); return opts[Math.max(0, Math.min(n-1, i))].value; };
  const onDown = (e) => {
    setDrag(true); const v0 = segAt(e.clientX); if (v0 !== vRef.current) onChange(v0);
    const mv = (ev) => { const v = segAt(ev.clientX); if (v !== vRef.current) onChange(v); };
    const up = () => { setDrag(false); window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (<div className="twk-row"><div className="twk-lbl"><span>{label}</span></div><div ref={ref} role="radiogroup" onPointerDown={onDown} className={drag?'twk-seg dragging':'twk-seg'}><div className="twk-seg-thumb" style={{ left:`calc(2px + ${idx} * (100% - 4px) / ${n})`, width:`calc((100% - 4px) / ${n})` }}/>{opts.map(o => <button key={o.value} type="button">{o.label}</button>)}</div></div>);
}
function TweakSelect({ label, value, options, onChange }) {
  return (<div className="twk-row"><div className="twk-lbl"><span>{label}</span></div><select className="twk-field" value={value} onChange={e => onChange(e.target.value)}>{options.map(o => { const v = typeof o === 'object' ? o.value : o; const l = typeof o === 'object' ? o.label : o; return <option key={v} value={v}>{l}</option>; })}</select></div>);
}

/* ═══════════════════════════════════════════════════════════════
   INVITE MOCKUPS
═══════════════════════════════════════════════════════════════ */
function BearSVG() {
  return (
    <svg viewBox="0 0 120 130" style={{ width:'100%', display:'block' }}>
      <ellipse cx="60" cy="85" rx="38" ry="35" fill="#d9a76a"/>
      <ellipse cx="60" cy="90" rx="26" ry="22" fill="#f0d4a8"/>
      <circle cx="32" cy="38" r="13" fill="#d9a76a"/><circle cx="88" cy="38" r="13" fill="#d9a76a"/>
      <circle cx="32" cy="38" r="7"  fill="#f0d4a8"/><circle cx="88" cy="38" r="7"  fill="#f0d4a8"/>
      <circle cx="60" cy="50" r="28" fill="#d9a76a"/>
      <ellipse cx="60" cy="58" rx="16" ry="13" fill="#f0d4a8"/>
      <ellipse cx="50" cy="48" rx="2" ry="3" fill="#3d2410"/>
      <ellipse cx="70" cy="48" rx="2" ry="3" fill="#3d2410"/>
      <ellipse cx="60" cy="56" rx="3" ry="2.2" fill="#3d2410"/>
      <path d="M56 60 Q60 63 64 60" stroke="#3d2410" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="44" cy="56" r="3" fill="#e8a89a" opacity="0.6"/>
      <circle cx="76" cy="56" r="3" fill="#e8a89a" opacity="0.6"/>
      <ellipse cx="78" cy="100" rx="10" ry="9" fill="#a06a2c"/>
      <ellipse cx="78" cy="94"  rx="10" ry="3" fill="#7a4f1f"/>
      <path d="M70 96 Q72 105 70 110" stroke="#e8c989" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  );
}
function PeonyCluster() {
  return (
    <svg viewBox="0 0 100 100" style={{ width:'100%', display:'block' }}>
      <defs>
        <radialGradient id="pg1" cx="50%" cy="50%"><stop offset="0%" stopColor="#fde4e0"/><stop offset="60%" stopColor="#e8b4b0"/><stop offset="100%" stopColor="#c87a76"/></radialGradient>
        <radialGradient id="pg2" cx="50%" cy="50%"><stop offset="0%" stopColor="#fff0eb"/><stop offset="100%" stopColor="#e8b4b0"/></radialGradient>
      </defs>
      <ellipse cx="20" cy="65" rx="14" ry="6" fill="#a8b89a" opacity="0.7" transform="rotate(-30 20 65)"/>
      <ellipse cx="78" cy="30" rx="12" ry="5" fill="#a8b89a" opacity="0.7" transform="rotate(40 78 30)"/>
      <ellipse cx="65" cy="78" rx="10" ry="4" fill="#a8b89a" opacity="0.6" transform="rotate(20 65 78)"/>
      <circle cx="40" cy="40" r="28" fill="url(#pg1)" opacity="0.95"/>
      <circle cx="40" cy="40" r="20" fill="url(#pg2)" opacity="0.7"/>
      <circle cx="40" cy="40" r="10" fill="#c87a76" opacity="0.4"/>
      <ellipse cx="20" cy="30" rx="8" ry="6" fill="#e8b4b0" opacity="0.7" transform="rotate(-20 20 30)"/>
      <ellipse cx="60" cy="22" rx="7" ry="5" fill="#f5cfc9" opacity="0.8" transform="rotate(30 60 22)"/>
      <ellipse cx="65" cy="55" rx="9" ry="6" fill="#e8b4b0" opacity="0.75" transform="rotate(50 65 55)"/>
      <ellipse cx="22" cy="58" rx="7" ry="5" fill="#f5cfc9" opacity="0.7" transform="rotate(-50 22 58)"/>
      <circle cx="78" cy="65" r="10" fill="url(#pg1)" opacity="0.85"/>
      <circle cx="78" cy="65" r="4"  fill="#c87a76" opacity="0.5"/>
    </svg>
  );
}

function DulceEsperaMock({ size = 'lg', babyName = 'Mateo', date = '12 · 06 · 26' }) {
  const sm = size === 'sm';
  return (
    <div className="invite-mock invite-honey">
      <div className="watercolor" style={{ width:'70%', height:'40%', top:'-8%', left:'-10%', background:'#e8c989' }}/>
      <div className="watercolor" style={{ width:'55%', height:'40%', bottom:'-10%', right:'-12%', background:'#d4a574' }}/>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position:'absolute', inset:0, opacity:0.07 }}>
        <defs><pattern id="hex" x="0" y="0" width="14" height="12" patternUnits="userSpaceOnUse"><polygon points="7,0 14,3.5 14,8.5 7,12 0,8.5 0,3.5" fill="none" stroke="#7a4f1f" strokeWidth="0.4"/></pattern></defs>
        <rect width="100" height="100" fill="url(#hex)"/>
      </svg>
      <div style={{ position:'absolute', top:'6%', left:0, right:0, textAlign:'center', fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.32em', textTransform:'uppercase', color:'#7a4f1f', fontWeight:500 }}>— Baby Shower —</div>
      <div style={{ position:'absolute', top:'24%', left:'50%', transform:'translateX(-50%)', width:sm?'44%':'50%' }}><BearSVG/></div>
      <div style={{ position:'absolute', bottom:sm?'22%':'23%', left:0, right:0, textAlign:'center', padding:'0 8%' }}>
        <div className="script" style={{ fontSize:sm?10:20, color:'#7a4f1f', lineHeight:1.1 }}>Una dulce</div>
        <div className="display" style={{ fontSize:sm?14:28, color:'#3d2410', letterSpacing:'-0.02em' }}>bendición</div>
        <div className="script" style={{ fontSize:sm?8:14, color:'#7a4f1f' }}>está en camino</div>
      </div>
      <div style={{ position:'absolute', bottom:'7%', left:0, right:0, textAlign:'center' }}>
        <div className="display" style={{ fontSize:sm?9:16, color:'#3d2410', letterSpacing:'0.1em' }}>{babyName}</div>
        <div style={{ width:sm?28:44, height:1, background:'#7a4f1f', margin:sm?'2px auto':'4px auto', opacity:0.4 }}/>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:sm?5:9, letterSpacing:'0.24em', color:'#7a4f1f' }}>{date}</div>
      </div>
    </div>
  );
}

function JardinMock({ size = 'lg', babyName = 'Sofía', date = '24 · 07 · 26' }) {
  const sm = size === 'sm';
  return (
    <div className="invite-mock invite-floral">
      <div className="watercolor" style={{ width:'70%', height:'50%', top:'-15%', right:'-15%', background:'#e8b4b0' }}/>
      <div className="watercolor" style={{ width:'50%', height:'40%', bottom:'-10%', left:'-10%', background:'#f5cfc9' }}/>
      <div style={{ position:'absolute', top:'-6%', left:'-10%', width:sm?'48%':'52%' }}><PeonyCluster/></div>
      <div style={{ position:'absolute', bottom:'-3%', right:'-8%', width:sm?'38%':'45%', transform:'rotate(180deg)' }}><PeonyCluster/></div>
      <div style={{ position:'absolute', top:'28%', right:'14%', fontSize:sm?5:8, color:'#c87a76', opacity:0.7 }}>❀</div>
      <div style={{ position:'absolute', top:'44%', left:'13%', fontSize:sm?4:7, color:'#c87a76', opacity:0.6 }}>❀</div>
      <div style={{ position:'absolute', top:'8%', left:0, right:0, textAlign:'center', fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:sm?7:12, color:'#8a4f4f', letterSpacing:'0.06em' }}>— celebrando —</div>
      <div style={{ position:'absolute', top:'36%', left:0, right:0, textAlign:'center', padding:'0 12%' }}>
        <div className="script" style={{ fontSize:sm?8:15, color:'#8a4f4f' }}>un nuevo amor</div>
        <div className="display" style={{ fontSize:sm?15:30, color:'#5c2a2a', letterSpacing:'-0.02em', lineHeight:0.95 }}>está por</div>
        <div className="display" style={{ fontSize:sm?20:40, color:'#5c2a2a', fontStyle:'italic', fontFamily:'DM Serif Display,serif', letterSpacing:'-0.03em', lineHeight:0.95 }}>florecer</div>
      </div>
      <div style={{ position:'absolute', top:sm?'68%':'69%', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:sm?4:8 }}>
        <div style={{ width:sm?12:22, height:1, background:'#c4a47c' }}/>
        <div style={{ width:sm?5:8, height:sm?5:8, border:'1px solid #c4a47c', transform:'rotate(45deg)' }}/>
        <div style={{ width:sm?12:22, height:1, background:'#c4a47c' }}/>
      </div>
      <div style={{ position:'absolute', bottom:'7%', left:0, right:0, textAlign:'center' }}>
        <div className="script" style={{ fontSize:sm?10:18, color:'#5c2a2a' }}>{babyName}</div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.32em', color:'#8a4f4f', marginTop:sm?1:4, textTransform:'uppercase' }}>{date}</div>
      </div>
    </div>
  );
}

function MilagroMock({ size = 'lg', babyName = 'Luna', date = '03 · 09 · 26' }) {
  const sm = size === 'sm';
  return (
    <div className="invite-mock invite-minimal">
      <div className="watercolor" style={{ width:'75%', height:'40%', top:'15%', left:'10%', background:'#e8d4a8', opacity:0.28 }}/>
      <div style={{ position:'absolute', top:sm?'19%':'21%', left:'50%', transform:'translateX(-50%)', width:sm?'27%':'30%' }}>
        <svg viewBox="0 0 100 100" style={{ width:'100%', display:'block' }}>
          <defs><radialGradient id="mn" cx="40%" cy="40%"><stop offset="0%" stopColor="#f5e9d8"/><stop offset="100%" stopColor="#c9a876"/></radialGradient></defs>
          <path d="M50 10 A40 40 0 1 0 50 90 A30 35 0 1 1 50 10 Z" fill="url(#mn)"/>
        </svg>
      </div>
      {[{t:'11%',l:'17%',s:sm?5:8},{t:'17%',l:'77%',s:sm?4:7},{t:'29%',l:'14%',s:sm?3:5},{t:'57%',l:'84%',s:sm?4:7}].map((st,i) => (
        <div key={i} style={{ position:'absolute', top:st.t, left:st.l, fontSize:st.s, color:'#c9a876', opacity:0.7 }}>✦</div>
      ))}
      <div style={{ position:'absolute', top:'7%', left:0, right:0, textAlign:'center', fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.42em', textTransform:'uppercase', color:'#a08560', fontWeight:500 }}>Baby Shower</div>
      <div style={{ position:'absolute', top:sm?'51%':'53%', left:0, right:0, textAlign:'center', padding:'0 10%' }}>
        <div className="script" style={{ fontSize:sm?7:13, color:'#a08560' }}>lo más pequeño</div>
        <div className="display" style={{ fontSize:sm?12:22, color:'#3a2a1a', letterSpacing:'-0.02em', lineHeight:1.05 }}>puede cambiarlo</div>
        <div className="display" style={{ fontSize:sm?15:28, color:'#3a2a1a', fontFamily:'DM Serif Display,serif', fontStyle:'italic', letterSpacing:'-0.02em', lineHeight:1 }}>todo.</div>
      </div>
      <div style={{ position:'absolute', top:sm?'77%':'78%', left:'50%', transform:'translateX(-50%)', display:'flex', alignItems:'center', gap:sm?3:6 }}>
        <div style={{ width:sm?18:34, height:1, background:'#c9a876' }}/><div style={{ fontSize:sm?5:10, color:'#c9a876' }}>✦</div><div style={{ width:sm?18:34, height:1, background:'#c9a876' }}/>
      </div>
      <div style={{ position:'absolute', bottom:'7%', left:0, right:0, textAlign:'center' }}>
        <div className="display" style={{ fontSize:sm?8:15, color:'#3a2a1a', letterSpacing:'0.18em', textTransform:'uppercase' }}>{babyName}</div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.32em', color:'#a08560', marginTop:sm?1:3 }}>{date}</div>
      </div>
    </div>
  );
}

function CelestialMock({ size = 'lg', babyName = 'Baby Isabella', date = 'Domingo 26 de mayo', place = 'Terraza Rosé' }) {
  const sm = size === 'sm';
  return (
    <div className="invite-mock invite-celestial">
      <div className="watercolor" style={{ width:'70%', height:'42%', top:'-14%', left:'-18%', background:'#d6b878', opacity:.22 }}/>
      <div className="watercolor" style={{ width:'60%', height:'42%', bottom:'-14%', right:'-18%', background:'#7f8ea8', opacity:.32 }}/>
      {[{t:'15%',l:'18%',s:sm?5:9},{t:'20%',l:'78%',s:sm?4:8},{t:'41%',l:'12%',s:sm?4:7},{t:'61%',l:'82%',s:sm?5:9},{t:'73%',l:'24%',s:sm?3:6}].map((st,i)=>(
        <div key={i} style={{ position:'absolute', top:st.t, left:st.l, fontSize:st.s, color:'#f8ead5', opacity:.72, animation:'xp-shimmer 3s ease-in-out infinite', animationDelay:`${i*.35}s` }}>✦</div>
      ))}
      <div style={{ position:'absolute', top:'20%', left:'50%', transform:'translateX(-50%)', width:sm?'30%':'35%', filter:'drop-shadow(0 0 18px rgba(214,184,120,.35))' }}>
        <svg viewBox="0 0 100 100" style={{ width:'100%', display:'block' }}>
          <path d="M50 8 A42 42 0 1 0 50 92 A31 36 0 1 1 50 8 Z" fill="#d6b878"/>
          <path d="M18 68 C30 58 42 64 50 70 C61 78 74 71 84 62" stroke="#f8ead5" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".42"/>
        </svg>
      </div>
      <div style={{ position:'absolute', top:'7%', left:0, right:0, textAlign:'center', fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.42em', textTransform:'uppercase', color:'#f8ead5', fontWeight:600 }}>Baby Shower</div>
      <div style={{ position:'absolute', top:'50%', left:0, right:0, textAlign:'center', padding:'0 11%' }}>
        <div className="script" style={{ fontSize:sm?8:15, color:'#f8ead5' }}>una estrellita</div>
        <div className="display" style={{ fontSize:sm?16:32, color:'#fff9ee', lineHeight:.96 }}>viene en camino</div>
      </div>
      <div style={{ position:'absolute', bottom:'8%', left:0, right:0, textAlign:'center' }}>
        <div className="display" style={{ fontSize:sm?9:17, color:'#fff9ee', letterSpacing:'0.08em' }}>{babyName}</div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.24em', color:'#f8ead5', marginTop:sm?2:5 }}>{date}</div>
        {!sm && <div className="script" style={{ fontSize:11, color:'rgba(248,234,213,.82)', marginTop:3 }}>{place}</div>}
      </div>
    </div>
  );
}

function SafariMock({ size = 'lg', babyName = 'Baby Isabella', date = 'Domingo 26 de mayo', place = 'Terraza Rosé' }) {
  const sm = size === 'sm';
  return (
    <div className="invite-mock invite-safari">
      <div className="watercolor" style={{ width:'70%', height:'45%', top:'-12%', right:'-16%', background:'#9caf88', opacity:.28 }}/>
      <div className="watercolor" style={{ width:'60%', height:'42%', bottom:'-12%', left:'-18%', background:'#d9c29d', opacity:.38 }}/>
      {[{t:'18%',l:'12%',r:-24},{t:'31%',l:'78%',r:34},{t:'69%',l:'17%',r:-12},{t:'75%',l:'76%',r:22}].map((leaf,i)=>(
        <span key={i} style={{ position:'absolute', top:leaf.t, left:leaf.l, width:sm?14:23, height:sm?6:10, borderRadius:'50%', background:'#9caf88', opacity:.42, transform:`rotate(${leaf.r}deg)`, animation:'xp-float 5s ease-in-out infinite', animationDelay:`${i*.45}s` }}/>
      ))}
      <div style={{ position:'absolute', top:'22%', left:'50%', transform:'translateX(-50%)', width:sm?'42%':'48%', animation:'xp-float 6s ease-in-out infinite' }}>
        <svg viewBox="0 0 130 120" style={{ width:'100%', display:'block' }}>
          <ellipse cx="66" cy="82" rx="34" ry="24" fill="#d9b27c"/>
          <rect x="47" y="78" width="8" height="28" rx="4" fill="#b37a4c"/>
          <rect x="77" y="78" width="8" height="28" rx="4" fill="#b37a4c"/>
          <path d="M82 26 C98 25 107 39 105 55 C103 71 92 78 82 75 Z" fill="#d9b27c"/>
          <rect x="72" y="30" width="16" height="50" rx="8" fill="#d9b27c"/>
          <circle cx="93" cy="43" r="2.2" fill="#4c3a28"/>
          <path d="M90 52 Q96 55 101 51" stroke="#4c3a28" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
          <path d="M74 38 L66 19 L83 31 Z" fill="#b37a4c" opacity=".65"/>
          <path d="M96 35 L105 18 L105 41 Z" fill="#b37a4c" opacity=".65"/>
          <circle cx="58" cy="61" r="3" fill="#b37a4c" opacity=".55"/>
          <circle cx="72" cy="54" r="2.5" fill="#b37a4c" opacity=".5"/>
          <circle cx="81" cy="68" r="3" fill="#b37a4c" opacity=".45"/>
        </svg>
      </div>
      <div style={{ position:'absolute', top:'7%', left:0, right:0, textAlign:'center', fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.34em', textTransform:'uppercase', color:'#6d7b55', fontWeight:700 }}>Baby Shower</div>
      <div style={{ position:'absolute', top:'57%', left:0, right:0, textAlign:'center', padding:'0 10%' }}>
        <div className="script" style={{ fontSize:sm?8:15, color:'#6d7b55' }}>una pequeña aventura</div>
        <div className="display" style={{ fontSize:sm?14:28, color:'#4c3a28', lineHeight:.96 }}>está por comenzar</div>
      </div>
      <div style={{ position:'absolute', bottom:'7%', left:0, right:0, textAlign:'center' }}>
        <div className="display" style={{ fontSize:sm?9:17, color:'#4c3a28', letterSpacing:'0.08em' }}>{babyName}</div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.22em', color:'#6d7b55', marginTop:sm?2:5 }}>{date}</div>
        {!sm && <div className="script" style={{ fontSize:11, color:'#6d7b55', marginTop:3 }}>{place}</div>}
      </div>
    </div>
  );
}

function CoquetteMock({ size = 'lg', babyName = 'Baby Isabella', date = 'Domingo 26 de mayo', place = 'Terraza Rosé' }) {
  const sm = size === 'sm';
  return (
    <div className="invite-mock invite-coquette">
      <div className="watercolor" style={{ width:'70%', height:'44%', top:'-12%', left:'-14%', background:'#f4c8df', opacity:.36 }}/>
      <div className="watercolor" style={{ width:'62%', height:'42%', bottom:'-12%', right:'-18%', background:'#d8b7ec', opacity:.34 }}/>
      {[{t:'21%',l:'18%',s:sm?12:20},{t:'27%',l:'76%',s:sm?9:16},{t:'63%',l:'13%',s:sm?8:14},{t:'70%',l:'82%',s:sm?10:18}].map((b,i)=>(
        <span key={i} style={{ position:'absolute', top:b.t, left:b.l, fontSize:b.s, color:i%2?'#d8b7ec':'#8b557a', opacity:.52, animation:'xp-butterfly 6.4s ease-in-out infinite', animationDelay:`${i*.55}s` }}>⌁</span>
      ))}
      <div style={{ position:'absolute', top:'23%', left:'50%', transform:'translateX(-50%)', width:sm?'40%':'46%', animation:'xp-float 5.6s ease-in-out infinite' }}>
        <svg viewBox="0 0 120 100" style={{ width:'100%', display:'block' }}>
          <path d="M58 50 C30 18 8 34 18 62 C25 84 48 69 58 52" fill="#f4c8df" opacity=".82"/>
          <path d="M62 50 C90 18 112 34 102 62 C95 84 72 69 62 52" fill="#d8b7ec" opacity=".86"/>
          <path d="M58 54 C34 86 16 80 22 58 C28 41 48 49 58 54" fill="#f6d8e8" opacity=".9"/>
          <path d="M62 54 C86 86 104 80 98 58 C92 41 72 49 62 54" fill="#e7c9f3" opacity=".9"/>
          <rect x="57" y="38" width="6" height="30" rx="3" fill="#8b557a"/>
          <path d="M58 38 Q52 27 44 24M62 38 Q68 27 76 24" stroke="#8b557a" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ position:'absolute', top:'7%', left:0, right:0, textAlign:'center', fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.36em', textTransform:'uppercase', color:'#8b557a', fontWeight:700 }}>Baby Shower</div>
      <div style={{ position:'absolute', top:'54%', left:0, right:0, textAlign:'center', padding:'0 10%' }}>
        <div className="script" style={{ fontSize:sm?8:15, color:'#8b557a' }}>un amor hermoso</div>
        <div className="display" style={{ fontSize:sm?16:31, color:'#6f4664', lineHeight:.95 }}>está por volar</div>
      </div>
      <div style={{ position:'absolute', bottom:'7%', left:0, right:0, textAlign:'center' }}>
        <div className="display" style={{ fontSize:sm?9:17, color:'#6f4664', letterSpacing:'0.08em' }}>{babyName}</div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:sm?5:8, letterSpacing:'0.22em', color:'#8b557a', marginTop:sm?2:5 }}>{date}</div>
        {!sm && <div className="script" style={{ fontSize:11, color:'#8b557a', marginTop:3 }}>{place}</div>}
      </div>
    </div>
  );
}

function StyleMock({ styleId, size = 'lg', babyName, date, place, palette }) {
  const props = { size, babyName, date, place };
  const mock = {
    honey: <DulceEsperaMock {...props}/>,
    floral: <JardinMock {...props}/>,
    minimal: <MilagroMock {...props}/>,
    celestial: <CelestialMock {...props}/>,
    safari: <SafariMock {...props}/>,
    coquette: <CoquetteMock {...props}/>,
  }[styleId] || <JardinMock {...props}/>;

  if (!palette) return mock;
  return (
    <div
      className="palette-preview"
      style={{
        '--invite-bg': palette.bg,
        '--invite-accent': palette.accent,
        '--invite-secondary': palette.secondary,
        '--invite-text': palette.text,
        '--invite-soft': palette.soft || palette.secondary,
      }}
    >
      {mock}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DEMO COMPONENTS
═══════════════════════════════════════════════════════════════ */
const INVITATION_STYLES = invitationStyles;
const STYLE_BY_ID = Object.fromEntries(INVITATION_STYLES.map(style => [style.id, style]));
const STYLE_PALETTES = stylePalettes;
function getStylePalettes(style) {
  return STYLE_PALETTES[style.id] || [
    { id:'base', name:'Base', bg:style.palette.bg1, accent:style.palette.accent, secondary:style.palette.bg2, soft:style.palette.soft, text:style.palette.ink },
  ];
}
const THEMES = Object.fromEntries(INVITATION_STYLES.map(style => [style.id, {
  bg1: style.palette.bg1,
  bg2: style.palette.bg2,
  accent: style.palette.accent,
  soft: style.palette.soft,
  ink: style.palette.ink,
  muted: style.palette.muted,
}]));
const CDATA = Object.fromEntries(INVITATION_STYLES.map(style => [style.id, {
  name: style.name,
  shortName: style.shortName,
  parents: style.demoData.parents,
  baby: style.demoData.babyName,
  phrase: style.phrase.replace(/\.$/, ''),
  date: style.demoData.date,
  dateInput: style.demoData.dateInput,
  time: style.demoData.time,
  place: style.demoData.place,
  city: style.demoData.address,
  address: style.demoData.address,
  category: style.category,
  description: style.description,
  emotionalTone: style.emotionalTone,
  whatsappMessage: style.whatsappMessage,
  Mock: (p) => <StyleMock styleId={style.id} size="lg" {...p}/>,
}]));
const LIVE_DEFAULTS = {
  baby: 'Baby Isabella',
  dateInput: '2026-05-26',
  date: '26 · 05 · 2026',
  time: '14:30',
  place: 'Terraza Rosé',
  address: 'Heredia, Costa Rica',
  whatsapp: '',
};

function formatInviteDate(value) {
  if (!value) value = LIVE_DEFAULTS.dateInput;
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return LIVE_DEFAULTS.date;
  return `${day} · ${month} · ${year}`;
}

function getLiveInviteData(collection, fields) {
  const style = CDATA[collection] ? collection : 'floral';
  const base = CDATA[style];
  const baby = fields.baby?.trim() || LIVE_DEFAULTS.baby;
  const dateInput = fields.date || LIVE_DEFAULTS.dateInput;
  const date = formatInviteDate(fields.date);
  const time = fields.time || LIVE_DEFAULTS.time;
  const place = fields.place?.trim() || LIVE_DEFAULTS.place;
  const address = fields.address?.trim() || LIVE_DEFAULTS.address;
  const whatsapp = fields.whatsapp?.trim() || LIVE_DEFAULTS.whatsapp;
  return {
    ...base,
    style,
    baby,
    dateInput,
    date,
    time,
    place,
    address,
    city: address,
    whatsapp,
  };
}

function cleanText(value, fallback = '', max = 80) {
  const text = String(value ?? '').replace(/[\u0000-\u001F\u007F<>]/g, '').trim();
  return (text || fallback).slice(0, max);
}

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 18);
}

function sanitizeInvitePayload(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const style = CDATA[raw.style] ? raw.style : 'floral';
  const dateInput = /^\d{4}-\d{2}-\d{2}$/.test(String(raw.dateInput || '')) ? raw.dateInput : LIVE_DEFAULTS.dateInput;
  const time = /^\d{2}:\d{2}$/.test(String(raw.time || '')) ? raw.time : LIVE_DEFAULTS.time;
  return {
    style,
    baby: cleanText(raw.baby, LIVE_DEFAULTS.baby, 48),
    dateInput,
    date: formatInviteDate(dateInput),
    time,
    place: cleanText(raw.place, LIVE_DEFAULTS.place, 80),
    address: cleanText(raw.address, LIVE_DEFAULTS.address, 120),
    whatsapp: normalizePhone(raw.whatsapp),
  };
}

function makeInviteDataFromPayload(payload) {
  const safe = sanitizeInvitePayload(payload);
  if (!safe) return null;
  const base = CDATA[safe.style];
  return { ...base, ...safe, city: safe.address };
}

function encodeInvitePayload(payload) {
  const json = JSON.stringify(sanitizeInvitePayload(payload));
  const binary = unescape(encodeURIComponent(json));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function decodeInvitePayload(encoded) {
  try {
    if (!encoded || encoded.length > 3000) return null;
    const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    return sanitizeInvitePayload(JSON.parse(json));
  } catch {
    return null;
  }
}

function makeInvitationUrl(payload) {
  const code = encodeInvitePayload(payload);
  return `${window.location.origin}/invitacion?data=${code}`;
}

function makeWhatsappUrl(data) {
  const phone = normalizePhone(data.whatsapp);
  const text = `Hola, confirmo mi asistencia al baby shower de ${data.baby}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function makeMapsUrl(data) {
  const query = [data.address, data.place].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function makeCalendarUrl(data) {
  const start = `${data.dateInput.replace(/-/g, '')}T${data.time.replace(':', '')}00`;
  const endDate = new Date(`${data.dateInput}T${data.time}:00`);
  if (Number.isFinite(endDate.getTime())) endDate.setHours(endDate.getHours() + 3);
  const end = Number.isFinite(endDate.getTime())
    ? `${endDate.getFullYear()}${String(endDate.getMonth()+1).padStart(2,'0')}${String(endDate.getDate()).padStart(2,'0')}T${String(endDate.getHours()).padStart(2,'0')}${String(endDate.getMinutes()).padStart(2,'0')}00`
    : start;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Baby Shower de ${data.baby}`,
    dates: `${start}/${end}`,
    details: `Baby shower de ${data.baby}. Confirma tu asistencia por WhatsApp.`,
    location: [data.place, data.address].filter(Boolean).join(' - '),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function LiveValue({ value, as = 'span', className = '', style }) {
  const Tag = as;
  const initial = String(value ?? '');
  const [shown, setShown] = useState(initial);
  const [phase, setPhase] = useState('');
  const shownRef = useRef(initial);

  useEffect(() => {
    const incoming = String(value ?? '');
    if (incoming === shownRef.current) return;
    setPhase('is-out');
    const swap = setTimeout(() => {
      shownRef.current = incoming;
      setShown(incoming);
      setPhase('is-in');
    }, 150);
    const settle = setTimeout(() => setPhase(''), 420);
    return () => {
      clearTimeout(swap);
      clearTimeout(settle);
    };
  }, [value]);

  return <Tag className={`live-value ${phase} ${className}`.trim()} style={style}>{shown}</Tag>;
}

function WhatsappIcon({ size = 16 }) {
  return (<svg viewBox="0 0 32 32" width={size} height={size} fill="currentColor"><path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8c1.8 1 3.9 1.5 6.2 1.5 7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.7c-2 0-3.9-.5-5.5-1.5l-.4-.2-4 1 1.1-3.9-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.7 0-5.9 4.8-10.7 10.7-10.7s10.7 4.8 10.7 10.7-4.8 10.7-10.7 10.7zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-.9-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1 1-1 2.4 1 2.8 1.2 3c.2.2 2.1 3.2 5 4.4.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.3.2-1.5-.1-.1-.3-.2-.6-.4z"/></svg>);
}

function MusicPill({ t }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:100, background:'rgba(255,255,255,0.7)', backdropFilter:'blur(8px)', border:`1px solid ${t.soft}55`, fontSize:8, color:t.ink }}>
      <div style={{ display:'flex', alignItems:'center', gap:1, height:12, color:t.accent }}>
        {[0, 0.15, 0.3, 0.1].map((d,i)=><span key={i} className="wave-bar" style={{ animationDelay:`${d}s` }}/>)}
      </div>
      música suave
    </div>
  );
}

const XP_SCENES = [
  { id:'cover', label:'Portada' },
  { id:'message', label:'Mensaje' },
  { id:'details', label:'Detalles' },
  { id:'location', label:'Ubicación' },
  { id:'confirm', label:'Confirmar' },
];

function FineIcon({ type, size = 15 }) {
  const common = { fill:'none', stroke:'currentColor', strokeWidth:1.5, strokeLinecap:'round', strokeLinejoin:'round' };
  const paths = {
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></>,
    pin: <><path d="M12 21s6-6.4 6-11a6 6 0 1 0-12 0c0 4.6 6 11 6 11z"/><circle cx="12" cy="10" r="2"/></>,
    heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>,
    music: <><path d="M9 18V6l10-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    whatsapp: <><path d="M4 20l1.5-4A7 7 0 1 1 8 18.5L4 20z"/><path d="M9 10c.5 2.4 2.1 4 4.5 4.5"/></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} {...common}>{paths[type]}</svg>;
}

function InviteDecor({ collection }) {
  if (collection === 'floral') {
    return (
      <>
        {[8, 28, 64, 82].map((left,i)=><span key={i} className="xp-deco xp-petal" style={{ left:`${left}%`, top:`${-6 - i * 5}%`, animationDelay:`${i * 1.15}s` }}/>)}
        <div className="xp-deco" style={{ top:18, right:-24, width:94, opacity:.55 }}><PeonyCluster/></div>
      </>
    );
  }
  if (collection === 'minimal') {
    return (
      <>
        {[{t:18,l:18},{t:26,l:78},{t:55,l:12},{t:70,l:84},{t:36,l:48}].map((s,i)=><span key={i} className="xp-deco xp-star" style={{ top:`${s.t}%`, left:`${s.l}%`, fontSize:i===4?12:9, animationDelay:`${i * .42}s` }}>✦</span>)}
      </>
    );
  }
  if (collection === 'celestial') {
    return (
      <>
        {[{t:17,l:17},{t:25,l:78},{t:45,l:11},{t:64,l:84},{t:76,l:25}].map((s,i)=><span key={i} className="xp-deco xp-star" style={{ top:`${s.t}%`, left:`${s.l}%`, color:'#f8ead5', fontSize:i===1?12:9, animationDelay:`${i * .34}s` }}>✦</span>)}
        {[{t:32,l:-8,w:92},{t:69,l:63,w:78}].map((c,i)=><span key={`c${i}`} className="xp-deco" style={{ top:`${c.t}%`, left:`${c.l}%`, width:c.w, height:c.w*.32, borderRadius:999, background:'rgba(248,234,213,.22)', filter:'blur(1px)', animation:'xp-cloud 7s ease-in-out infinite', animationDelay:`${i * 1.3}s` }}/>)}
      </>
    );
  }
  if (collection === 'safari') {
    return (
      <>
        {[{t:17,l:12,r:-28},{t:28,l:78,r:38},{t:62,l:14,r:-10},{t:76,l:80,r:18}].map((leaf,i)=><span key={i} className="xp-deco" style={{ top:`${leaf.t}%`, left:`${leaf.l}%`, '--r':`${leaf.r}deg`, width:25, height:10, borderRadius:'50%', background:'var(--xp-soft)', opacity:.34, animation:'xp-leaf 5.8s ease-in-out infinite', animationDelay:`${i*.45}s` }}/>)}
      </>
    );
  }
  if (collection === 'coquette') {
    return (
      <>
        {[{t:18,l:16,s:18},{t:28,l:79,s:15},{t:62,l:12,s:14},{t:76,l:84,s:17}].map((b,i)=><span key={i} className="xp-deco" style={{ top:`${b.t}%`, left:`${b.l}%`, color:i%2?'#d8b7ec':'var(--xp-accent)', fontSize:b.s, opacity:.44, animation:'xp-butterfly 6.4s ease-in-out infinite', animationDelay:`${i*.52}s` }}>⌁</span>)}
        <span className="xp-deco" style={{ top:'21%', right:'22%', color:'#d5b985', fontSize:10, opacity:.55, animation:'xp-shimmer 2.8s ease-in-out infinite' }}>✦</span>
      </>
    );
  }
  return (
    <>
      {[{t:18,l:18},{t:26,l:74},{t:63,l:17},{t:75,l:79}].map((s,i)=><span key={i} className="xp-deco xp-honey-drop" style={{ top:`${s.t}%`, left:`${s.l}%`, animationDelay:`${i * .7}s` }}/>)}
      <span className="xp-deco" style={{ top:'19%', right:'18%', color:'var(--xp-soft)', fontSize:10, opacity:.42, animation:'xp-float 6s ease-in-out infinite' }}>••</span>
    </>
  );
}

function InviteSymbol({ collection }) {
  if (collection === 'floral') return <div className="xp-scale" style={{ '--d':'160ms' }}><div className="xp-symbol xp-flower-symbol"><PeonyCluster/></div></div>;
  if (collection === 'minimal') {
    return (
      <div className="xp-scale" style={{ '--d':'160ms' }}>
        <div className="xp-symbol xp-moon-symbol">
          <svg viewBox="0 0 100 100">
            <defs><radialGradient id="xpMoon" cx="40%" cy="35%"><stop offset="0%" stopColor="#fffaf0"/><stop offset="100%" stopColor="#c9a876"/></radialGradient></defs>
            <path d="M50 10 A40 40 0 1 0 50 90 A30 35 0 1 1 50 10 Z" fill="url(#xpMoon)"/>
            <path d="M32 72 Q50 84 68 72" stroke="#c9a876" strokeWidth="2" fill="none" opacity=".45"/>
          </svg>
        </div>
      </div>
    );
  }
  if (collection === 'celestial') {
    return (
      <div className="xp-scale" style={{ '--d':'160ms' }}>
        <div className="xp-symbol xp-moon-symbol">
          <svg viewBox="0 0 100 100">
            <path d="M50 8 A42 42 0 1 0 50 92 A31 36 0 1 1 50 8 Z" fill="#d6b878"/>
            <path d="M17 70 C30 58 43 64 51 71 C62 79 75 70 84 62" stroke="#f8ead5" strokeWidth="5" strokeLinecap="round" fill="none" opacity=".38"/>
          </svg>
        </div>
      </div>
    );
  }
  if (collection === 'safari') {
    return <div className="xp-scale" style={{ '--d':'160ms' }}><div className="xp-symbol"><SafariMock size="sm" babyName="" date=""/></div></div>;
  }
  if (collection === 'coquette') {
    return (
      <div className="xp-scale" style={{ '--d':'160ms' }}>
        <div className="xp-symbol">
          <svg viewBox="0 0 120 100" style={{ width:'100%', display:'block' }}>
            <path d="M58 50 C30 18 8 34 18 62 C25 84 48 69 58 52" fill="#f4c8df" opacity=".82"/>
            <path d="M62 50 C90 18 112 34 102 62 C95 84 72 69 62 52" fill="#d8b7ec" opacity=".86"/>
            <path d="M58 54 C34 86 16 80 22 58 C28 41 48 49 58 54" fill="#f6d8e8" opacity=".9"/>
            <path d="M62 54 C86 86 104 80 98 58 C92 41 72 49 62 54" fill="#e7c9f3" opacity=".9"/>
            <rect x="57" y="38" width="6" height="30" rx="3" fill="#8b557a"/>
          </svg>
        </div>
      </div>
    );
  }
  return <div className="xp-scale" style={{ '--d':'160ms' }}><div className="xp-symbol"><BearSVG/></div></div>;
}

function InviteSceneCover({ data, collection }) {
  return (
    <div className="xp-scene xp-center active" key={`cover-${collection}`}>
      <div className="xp-kicker xp-reveal" style={{ '--d':'120ms' }}>Baby Shower</div>
      <div className="xp-script xp-reveal" style={{ '--d':'260ms', fontSize:16, lineHeight:1.2, maxWidth:230 }}>Un pequeño milagro viene en camino...</div>
      <InviteSymbol collection={collection}/>
      <div className="xp-script xp-reveal" style={{ '--d':'560ms', fontSize:18, lineHeight:1.15, maxWidth:220 }}>{data.phrase}</div>
      <LiveValue as="div" value={data.baby} className="xp-name xp-reveal" style={{ '--d':'820ms' }}/>
      <div className="xp-copy xp-reveal" style={{ '--d':'1080ms', marginTop:8 }}>Una invitación hecha para emocionar.</div>
    </div>
  );
}

function InviteSceneMessage({ data }) {
  return (
    <div className="xp-scene xp-center active" key="message">
      <div className="xp-kicker xp-reveal" style={{ '--d':'120ms' }}>con mucho amor</div>
      <div className="xp-title xp-reveal" style={{ '--d':'300ms', maxWidth:240 }}>Queremos invitarte</div>
      <div className="xp-reveal" style={{ '--d':'540ms', width:38, height:1, background:'var(--xp-soft)', margin:'16px 0' }}/>
      <p className="xp-script xp-reveal" style={{ '--d':'680ms', fontSize:18, lineHeight:1.45, maxWidth:250, color:'var(--xp-ink)' }}>
        Con mucho amor queremos invitarte a celebrar este momento tan especial.
      </p>
      <div className="xp-copy xp-reveal" style={{ '--d':'980ms', marginTop:14 }}>{data.parents}</div>
    </div>
  );
}

function InviteSceneDetails({ data }) {
  const rows = [
    { icon:'calendar', label:'Fecha', value:data.date },
    { icon:'clock', label:'Hora', value:data.time },
    { icon:'heart', label:'Lugar', value:data.place },
    { icon:'pin', label:'Dirección', value:data.address || data.city },
  ];
  return (
    <div className="xp-scene active" key="details">
      <div className="xp-kicker xp-reveal" style={{ '--d':'100ms' }}>detalles del evento</div>
      <div className="xp-title xp-reveal" style={{ '--d':'260ms' }}>Acompáñanos a celebrar nuestro baby shower</div>
      <div className="xp-detail-list">
        {rows.map((r,i)=>(
          <div key={r.label} className="xp-detail xp-reveal" style={{ '--d':`${520 + i * 170}ms` }}>
            <div className="xp-detail-icon"><FineIcon type={r.icon}/></div>
            <div>
              <div className="xp-detail-label">{r.label}</div>
              <LiveValue as="div" value={r.value} className="xp-detail-value"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InviteSceneLocation({ data }) {
  return (
    <div className="xp-scene active" key="location">
      <div className="xp-kicker xp-reveal" style={{ '--d':'100ms' }}>ubicación</div>
      <div className="xp-title xp-reveal" style={{ '--d':'260ms' }}>Dirección lista para abrir</div>
      <div className="xp-map-card xp-scale" style={{ '--d':'420ms' }}>
        <svg className="xp-route" viewBox="0 0 260 190">
          <path d="M20 132 C72 96 88 156 132 112 S182 42 236 74" stroke="var(--xp-soft)" strokeWidth="10" fill="none" opacity=".34"/>
          <path d="M20 132 C72 96 88 156 132 112 S182 42 236 74" stroke="var(--xp-accent)" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <circle cx="42" cy="122" r="14" fill="var(--xp-soft)" opacity=".18"/>
          <circle cx="205" cy="76" r="24" fill="var(--xp-soft)" opacity=".16"/>
        </svg>
        <div className="xp-pin"/>
      </div>
      <LiveValue as="div" value={`${data.place} · ${data.address || data.city}`} className="xp-copy xp-reveal" style={{ '--d':'900ms' }}/>
      <button className="xp-btn xp-btn-secondary xp-reveal" style={{ '--d':'1080ms', marginTop:14, width:'100%' }} onClick={(e)=>e.stopPropagation()}>
        Ver ubicación
      </button>
      <div className="xp-copy xp-reveal" style={{ '--d':'1240ms', marginTop:10 }}>Te llevamos directo al lugar.</div>
    </div>
  );
}

function InviteSceneConfirm() {
  return (
    <div className="xp-scene xp-center active" key="confirm">
      <div className="xp-kicker xp-reveal" style={{ '--d':'120ms' }}>confirmación</div>
      <div className="xp-title xp-reveal" style={{ '--d':'300ms' }}>¿Nos acompañas?</div>
      <p className="xp-script xp-reveal" style={{ '--d':'520ms', fontSize:18, lineHeight:1.4, maxWidth:230, color:'var(--xp-ink)' }}>
        Confirma con un toque por WhatsApp y guarda el recordatorio.
      </p>
      <div className="xp-button-row">
        <div className="xp-reveal" style={{ '--d':'760ms' }}>
          <button className="xp-btn xp-btn-primary" style={{ width:'100%' }} onClick={(e)=>e.stopPropagation()}>
            Confirmar asistencia
          </button>
        </div>
        <button className="xp-btn xp-btn-secondary xp-reveal" style={{ '--d':'940ms' }} onClick={(e)=>e.stopPropagation()}>
          Agregar al calendario
        </button>
      </div>
      <div className="xp-copy xp-reveal" style={{ '--d':'1140ms', marginTop:14 }}>Confirmación en un toque · Recordatorio guardado</div>
    </div>
  );
}

function InviteDemo({ collection, step, setStep, data: liveData, musicOn = true, palette }) {
  const t = palette
    ? { bg1:palette.bg, bg2:palette.secondary, accent:palette.accent, soft:palette.soft || palette.secondary, ink:palette.text, muted:palette.accent }
    : THEMES[collection];
  const data = liveData || CDATA[collection];
  const next = () => setStep((step + 1) % XP_SCENES.length);
  const scene = XP_SCENES[step];
  const sceneNode = {
    cover: <InviteSceneCover data={data} collection={collection}/>,
    message: <InviteSceneMessage data={data}/>,
    details: <InviteSceneDetails data={data}/>,
    location: <InviteSceneLocation data={data}/>,
    confirm: <InviteSceneConfirm/>,
  }[scene.id];

  return (
    <div
      className={`invite-xp invite-xp-${collection}`}
      onClick={next}
      style={{ '--xp-bg1':t.bg1, '--xp-bg2':t.bg2, '--xp-accent':t.accent, '--xp-soft':t.soft, '--xp-ink':t.ink, '--xp-muted':t.muted }}
      role="button"
      tabIndex="0"
      aria-label="Avanzar demo de invitación"
      onKeyDown={(e)=>{ if (e.key === 'Enter' || e.key === ' ') next(); }}
    >
      <InviteDecor collection={collection}/>
      <div className="xp-status">
        <span>{data.name}</span>
        <span className="xp-music">
          <span className="xp-wave">{[0,.2,.4].map((d,i)=><span key={i} style={{ animationDelay:`${d}s` }}/>)}</span>
          {musicOn ? 'Música suave activada' : 'Música pausada'}
        </span>
      </div>
      {React.cloneElement(sceneNode, { key:`${collection}-${scene.id}` })}
      <div className="xp-indicators">
        {XP_SCENES.map((s,i)=>(
          <button key={s.id} className={`xp-dot ${i===step?'active':''}`} onClick={(e)=>{ e.stopPropagation(); setStep(i); }} title={s.label}>
            <span>{s.label}</span><i/>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCENES
═══════════════════════════════════════════════════════════════ */

/* ── 01 HERO ── */
function SceneHero({ onJump }) {
  return (
    <div className="scene scene-snap bg-night scene-hero">
      {/* Petals — decorative only */}
      {[...Array(5)].map((_,i)=>(
        <div key={i} style={{ position:'absolute', left:`${12+i*17}%`, top:'-20px', fontSize:7+(i%3)*2, color:['#d4a574','#e8b4b0','#c9a876'][i%3], opacity:0.45, animation:`fall ${9+i*1.3}s linear infinite`, animationDelay:`${i*1.6}s`, pointerEvents:'none', zIndex:1 }}>{['❀','✦','✦','❀','✦'][i]}</div>
      ))}

      {/* Top bar — below notch */}
      <div className="hero-topbar" style={{ paddingTop:66, padding:'66px 28px 0', position:'relative', zIndex:5, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'DM Serif Display', fontSize:12, color:'#f5e9d8', fontStyle:'italic' }}>Vol. 01</div>
          <div style={{ width:36, height:1, background:'rgba(245,233,216,0.25)' }}/>
          <div className="eyebrow hero-top-meta" style={{ color:'#d4a574', fontSize:8 }}>Boutique · 2026</div>
        </div>
      </div>

      {/* Headline */}
      <div className="hero-copy" style={{ padding:'14px 28px 0', position:'relative', zIndex:5, flexShrink:0 }}>
        <div className="script" style={{ fontSize:15, color:'#d4a574', marginBottom:2 }}>Desde $10 · Lista en 24h</div>
        <h1 className="display hero-title" style={{ fontSize:'clamp(34px,6.2vw,46px)', color:'#f5e9d8', lineHeight:0.95, letterSpacing:'-0.025em' }}>
          Invitaciones digitales animadas para baby shower.
        </h1>
        <p className="script hero-title-em" style={{ fontSize:'clamp(17px,3vw,22px)', color:'rgba(245,233,216,0.78)', lineHeight:1.35, letterSpacing:0, marginTop:12, maxWidth:520 }}>
          Personalizadas, con música, ubicación, calendario, confirmación por WhatsApp y link compartible.
        </p>
        <div className="hero-proof-row" aria-label="Beneficios principales">
          <span>Animada</span>
          <span>WhatsApp</span>
          <span>Link real</span>
        </div>
      </div>

      {/* Invite mockups — hero + flankers */}
      <div className="hero-art" style={{ flex:1, position:'relative', zIndex:3, minHeight:0, overflow:'hidden' }}>
        {/* Left flank */}
        <div className="hero-flank" style={{ position:'absolute', left:'12%', top:'49%', transform:'translateY(-50%) rotate(-6deg)', width:'min(15vw, 170px)', opacity:0.94, filter:'drop-shadow(0 28px 42px rgba(0,0,0,.42))', animation:'float-1 7s ease-in-out infinite', zIndex:2 }}>
          <DulceEsperaMock size="lg" babyName="Baby Isabella" date="Domingo 26 de mayo"/>
        </div>
        {/* Center hero */}
        <div className="hero-main-card" style={{ position:'absolute', top:'48%', left:'50%', transform:'translate(-50%,-50%)', width:'min(20vw, 220px)', animation:'float-2 6s ease-in-out infinite', zIndex:3, filter:'drop-shadow(0 34px 66px rgba(0,0,0,0.58))' }}>
          <JardinMock size="lg" babyName="Baby Isabella" date="Domingo 26 de mayo"/>
        </div>
        {/* Right flank */}
        <div className="hero-flank" style={{ position:'absolute', right:'12%', top:'50%', transform:'translateY(-50%) rotate(7deg)', width:'min(15vw, 170px)', opacity:0.94, filter:'drop-shadow(0 28px 42px rgba(0,0,0,.42))', animation:'float-3 7.5s ease-in-out infinite', zIndex:2 }}>
          <CelestialMock size="lg" babyName="Baby Isabella" date="Domingo 26 de mayo"/>
        </div>
      </div>

      {/* Bottom CTA — never overlaps, always at bottom */}
      <div className="hero-bottom" style={{ padding:'16px 28px 44px', background:'linear-gradient(180deg,transparent 0%,rgba(8,5,3,0.92) 45%)', position:'relative', zIndex:5, flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:14 }}>
          <div>
            <div className="eyebrow" style={{ color:'#d4a574', fontSize:8 }}>desde</div>
            <div className="display" style={{ fontSize:34, color:'#f5e9d8', lineHeight:1, marginTop:2 }}>$10</div>
            <div style={{ fontSize:9, color:'rgba(245,233,216,0.5)', letterSpacing:'0.06em', marginTop:2 }}>entrega en 24h</div>
          </div>
          <div className="script hero-cta-note" style={{ fontSize:12, color:'rgba(245,233,216,0.78)', lineHeight:1.4, textAlign:'right', maxWidth:155 }}>
            personalizada<br/>entrega rápida
          </div>
        </div>
        <button className="btn-pill btn-light hero-button" onClick={onJump} style={{ width:'calc(100% - 24px)', justifyContent:'space-between', padding:'16px 22px' }}>
          <span>Ver estilos boutique</span>
          <span style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:17 }}>→</span>
        </button>
      </div>
    </div>
  );
}

function StyleProductCard({ style, index, onTryDemo, onOrderStyle }) {
  const palettes = getStylePalettes(style);
  const [activePaletteId, setActivePaletteId] = useState(palettes[0].id);
  const activePalette = palettes.find(p => p.id === activePaletteId) || palettes[0];
  const cardInk = style.palette.ink === '#fff9ee' ? '#273047' : style.palette.ink;

  return (
    <article
      className="style-card"
      style={{
        '--card-bg':`linear-gradient(145deg, color-mix(in srgb, ${activePalette.bg} 82%, white), ${activePalette.secondary})`,
        '--card-ink':cardInk,
        '--card-accent':activePalette.accent,
        '--active-color':activePalette.accent,
      }}
    >
      <div className="style-card-preview" style={{ animationDelay:`${index * .18}s` }}>
        <div className="style-card-preview-shell" style={{ '--active-color':activePalette.accent }}>
          <StyleMock
            styleId={style.id}
            size="sm"
            babyName={style.demoData.babyName}
            date={style.demoData.date}
            place={style.demoData.place}
            palette={activePalette}
          />
        </div>
      </div>
      <div className="style-card-body">
        <div className="style-card-top">
          <div>
            <div className="eyebrow" style={{ fontSize:7, color:activePalette.accent, marginBottom:4 }}>{style.category} · {activePalette.name}</div>
            <h3 className="style-card-name">{style.name}</h3>
          </div>
          <div className="style-card-price">desde <strong>${style.price}</strong></div>
        </div>
        <div className="style-card-phrase">"{style.phrase}"</div>
        <p className="style-card-desc">{style.emotionalTone}</p>
        <div className="style-card-swatches" aria-label={`Variantes visuales de ${style.name}`}>
          {palettes.map((palette, idx)=>(
            <button
              key={palette.id}
              type="button"
              className={`style-card-swatch ${activePalette.id === palette.id ? 'active' : ''}`}
              style={{ background:`linear-gradient(135deg, ${palette.bg}, ${palette.accent})`, '--active-color':palette.accent }}
              aria-label={`Ver paleta ${palette.name} de ${style.name}`}
              aria-pressed={activePalette.id === palette.id}
              onClick={()=>setActivePaletteId(palette.id)}
            />
          ))}
        </div>
        <div className="style-card-actions">
          <button type="button" onClick={()=>onTryDemo(style.id, activePalette)}>Ver demo</button>
          <button type="button" onClick={()=>onOrderStyle(style.id, activePalette)}>Pedir este estilo</button>
        </div>
      </div>
    </article>
  );
}

/* ── 04 COLECCIONES ── */
function SceneCollectionIntro({ onTryDemo, onOrderStyle }) {
  return (
    <div className="scene scene-snap bg-paper style-catalog-scene">
      {/* Giant number — purely decorative, pointer-events none */}
      <div aria-hidden="true" style={{ position:'absolute', top:48, right:16, fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:120, color:'rgba(122,79,31,0.08)', lineHeight:1, letterSpacing:'-0.04em', pointerEvents:'none', userSelect:'none', zIndex:0 }}>04</div>

      {/* All content in flow */}
      <div className="style-catalog-wrap">
        <div className="style-catalog-head">
          <div className="eyebrow" style={{ color:'#7a4f1f', marginBottom:10 }}>elige tu estilo</div>
          <h2 className="display" style={{ fontSize:'clamp(34px,7vw,58px)', color:'#2a201a', lineHeight:0.92, letterSpacing:'-0.02em' }}>
            Elige el estilo que más se parece al momento que quieres compartir.
          </h2>
          <p>
            Seis colecciones boutique, animadas y listas para convertir tus datos en una invitación digital vendible desde $10.
          </p>
        </div>

        <div className="style-catalog-grid">
          {INVITATION_STYLES.map((style, i) => (
            <StyleProductCard key={style.id} style={style} index={i} onTryDemo={onTryDemo} onOrderStyle={onOrderStyle}/>
          ))}
        </div>
      </div>

      <div className="scroll-hint" style={{ color:'#7a4f1f', bottom:22 }}>
        <div>Ver demo</div><div style={{ fontSize:14 }}>↓</div>
      </div>
    </div>
  );
}

/* ── 03–05 COLLECTION PAGES ── */
function SceneCollectionPage({ which, onTryDemo }) {
  const D = {
    honey:   { bg:'bg-honey-deep', Mock:DulceEsperaMock, num:'I',   name:'Dulce Espera',    emoji:'🍯', tag:'Honey & Cream', quote:'Una dulce bendición está en camino.', ink:'#3d2410', accent:'#7a4f1f', muted:'#a07b3f', swatch:['#fff4dd','#f5e1bd','#d4a574','#7a4f1f'] },
    floral:  { bg:'bg-floral-deep', Mock:JardinMock,     num:'II',  name:'Jardín de Amor',  emoji:'🌸', tag:'Floral Blush',  quote:'Un nuevo amor está por florecer.',       ink:'#5c2a2a', accent:'#8a4f4f', muted:'#c87a76', swatch:['#fdf4f1','#f5cfc9','#e8b4b0','#c4a47c'] },
    minimal: { bg:'bg-minimal-deep',Mock:MilagroMock,    num:'III', name:'Pequeño Milagro', emoji:'🤍', tag:'Minimal Chic',  quote:'Lo más pequeño puede cambiarlo todo.',  ink:'#3a2a1a', accent:'#a08560', muted:'#c9a876', swatch:['#faf6f0','#f0e6d4','#c9a876','#3a2a1a'] },
  }[which];

  return (
    <div className={`scene scene-snap ${D.bg}`}>
      {/* Number watermark — decorative */}
      <div aria-hidden="true" style={{ position:'absolute', top:40, right:-12, fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:200, color:'rgba(0,0,0,0.05)', lineHeight:0.8, letterSpacing:'-0.05em', pointerEvents:'none', userSelect:'none', zIndex:0 }}>{D.num}</div>

      {/* Top tag — below notch */}
      <div style={{ paddingTop:70, padding:'70px 28px 0', flexShrink:0, position:'relative', zIndex:3 }}>
        <div className="eyebrow" style={{ color:D.accent, fontSize:9 }}>{D.emoji} · {D.tag}</div>
        {/* Vertical edition label */}
        <div style={{ position:'absolute', top:80, left:10, transform:'rotate(-90deg)', transformOrigin:'left center', fontFamily:'Outfit', fontSize:8, letterSpacing:'0.42em', color:D.accent, textTransform:'uppercase', opacity:0.55, fontWeight:500, whiteSpace:'nowrap' }}>
          Edición {D.num} de III
        </div>
      </div>

      {/* Invite mockup — sized to leave room for info below */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 48px', minHeight:0, position:'relative', zIndex:2 }}>
        <div style={{ width:'75%', animation:'drift 5s ease-in-out infinite', filter:'drop-shadow(0 22px 40px rgba(0,0,0,0.22))' }}>
          <D.Mock size="lg"/>
        </div>
      </div>

      {/* Info block — in flow, never overlaps */}
      <div style={{ padding:'16px 28px 36px', flexShrink:0, position:'relative', zIndex:3, background:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,0.05) 100%)' }}>
        <div className="display" style={{ fontSize:'clamp(28px,7.5vw,38px)', color:D.ink, lineHeight:0.95, letterSpacing:'-0.02em' }}>
          {D.name.split(' ')[0]}
        </div>
        <div style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:'clamp(32px,9vw,42px)', color:D.accent, lineHeight:0.95, letterSpacing:'-0.03em', marginTop:-4, marginBottom:8 }}>
          {D.name.split(' ').slice(1).join(' ')}
        </div>
        <div className="script" style={{ fontSize:15, color:D.ink, lineHeight:1.35, marginBottom:12 }}>"{D.quote}"</div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ display:'flex', gap:5 }}>
            {D.swatch.map((c,i)=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:c, border:'1px solid rgba(0,0,0,0.08)' }}/>)}
          </div>
          <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
            <div className="eyebrow" style={{ fontSize:8, color:D.muted }}>desde</div>
            <div className="display" style={{ fontSize:26, color:D.ink, lineHeight:1 }}>$10</div>
          </div>
        </div>

        <button onClick={()=>onTryDemo(which)} className="btn-pill" style={{ width:'100%', justifyContent:'space-between', background:D.ink, color:'#faf3e7', padding:'15px 20px' }}>
          <span>Probar demo en vivo</span>
          <span style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:16 }}>→</span>
        </button>
      </div>
    </div>
  );
}

/* ── 02 DEMO ── */
function SceneDemo({ collection, setCollection, liveFields, setLiveFields, selectedPalette, onViewStyles }) {
  const [step, setStep] = useState(0);
  const [manualTick, setManualTick] = useState(0);
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const liveData = getLiveInviteData(collection, liveFields);
  const benefits = [
    { icon:'music', label:'Música visual' },
    { icon:'pin', label:'Ubicación' },
    { icon:'whatsapp', label:'WhatsApp' },
    { icon:'calendar', label:'Calendario' },
    { icon:'heart', label:'Datos personalizados' },
  ];
  useEffect(()=>{ setStep(0); }, [collection]);
  const setInviteStep = useCallback((next) => {
    setStep(prev => typeof next === 'function' ? next(prev) : next);
    setManualTick(t => t + 1);
  }, []);
  useEffect(()=>{
    const id = setInterval(()=>setStep(s=>(s+1)%XP_SCENES.length), 3000);
    return ()=>clearInterval(id);
  }, [collection, manualTick]);
  const updateLiveField = (field, value) => {
    setLiveFields(current => ({ ...current, [field]: value }));
    setCopied(false);
  };
  const currentPayload = () => sanitizeInvitePayload({
    style: collection,
    baby: liveData.baby,
    dateInput: liveData.dateInput,
    time: liveData.time,
    place: liveData.place,
    address: liveData.address,
    whatsapp: liveData.whatsapp,
  });
  const generateInvitationLink = () => {
    const link = makeInvitationUrl(currentPayload());
    setShareLink(link);
    setCopied(false);
  };
  const copyInvitationLink = async () => {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
    } catch {
      const el = document.getElementById('generated-invite-link');
      if (el) {
        el.select();
        document.execCommand('copy');
        setCopied(true);
      }
    }
  };
  const openPersonalizedWhatsapp = () => {
    const message = `Hola, quiero esta invitación personalizada con estos datos: ${liveData.baby} + ${liveData.date} + ${liveData.place}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="scene scene-snap bg-night scene-demo">
      <div className="demo-grid">
        <div className="demo-copy">
          <div>
            <div className="eyebrow" style={{ color:'#d4a574', marginBottom:8 }}>02 · Demo en vivo</div>
            <h2 className="display" style={{ fontSize:'clamp(32px,6vw,50px)', color:'#f5e9d8', lineHeight:0.95, letterSpacing:'-0.02em' }}>
              Personaliza tu invitación en segundos.
            </h2>
            <p style={{ marginTop:14, fontSize:15, color:'rgba(245,233,216,0.68)', lineHeight:1.55, maxWidth:480 }}>
              Escribe los datos y mira cómo se crea en vivo.
            </p>
          </div>

          <div className="demo-personalizer" aria-label="Personalización en vivo">
            <div className="demo-form-grid">
              <div className="demo-field">
                <label htmlFor="demo-baby-name">Nombre</label>
                <input
                  id="demo-baby-name"
                  type="text"
                  value={liveFields.baby}
                  placeholder="Nombre del bebé"
                  onChange={e=>updateLiveField('baby', e.target.value)}
                />
              </div>
              <div className="demo-field">
                <label htmlFor="demo-event-date">Fecha</label>
                <input
                  id="demo-event-date"
                  type="date"
                  value={liveFields.date}
                  placeholder="Fecha del evento"
                  aria-label="Fecha del evento"
                  onChange={e=>updateLiveField('date', e.target.value)}
                />
              </div>
              <div className="demo-field">
                <label htmlFor="demo-event-time">Hora</label>
                <input
                  id="demo-event-time"
                  type="time"
                  value={liveFields.time}
                  aria-label="Hora del evento"
                  onChange={e=>updateLiveField('time', e.target.value)}
                />
              </div>
              <div className="demo-field">
                <label htmlFor="demo-event-place">Lugar</label>
                <input
                  id="demo-event-place"
                  type="text"
                  value={liveFields.place}
                  placeholder="Lugar (opcional)"
                  onChange={e=>updateLiveField('place', e.target.value)}
                />
              </div>
              <div className="demo-field">
                <label htmlFor="demo-event-address">Dirección</label>
                <input
                  id="demo-event-address"
                  type="text"
                  value={liveFields.address}
                  placeholder="Dirección o salón"
                  onChange={e=>updateLiveField('address', e.target.value)}
                />
              </div>
              <div className="demo-field">
                <label htmlFor="demo-event-whatsapp">WhatsApp</label>
                <input
                  id="demo-event-whatsapp"
                  type="tel"
                  value={liveFields.whatsapp}
                  placeholder="+50688888888"
                  onChange={e=>updateLiveField('whatsapp', e.target.value)}
                />
              </div>
            </div>
            <p className="demo-live-note">Escribe y mira cómo se crea tu invitación en tiempo real.</p>
          </div>

          <div className="demo-tabs" role="tablist" aria-label="Estilos de invitación">
            {INVITATION_STYLES.map(c=>(
              <button key={c.id} className={`demo-tab ${collection===c.id?'active':''}`} onClick={()=>setCollection(c.id)} role="tab" aria-selected={collection===c.id}>
                {c.shortName}
              </button>
            ))}
          </div>

          <div className="demo-link-actions">
            <button type="button" onClick={generateInvitationLink}>Generar link de invitación</button>
            <button type="button" onClick={openPersonalizedWhatsapp}>Pedir por WhatsApp</button>
          </div>

          {shareLink && (
            <div className="demo-share-panel">
              <label htmlFor="generated-invite-link">Link generado</label>
              <div className="demo-share-row">
                <input id="generated-invite-link" readOnly value={shareLink} onFocus={e=>e.target.select()}/>
                <button type="button" onClick={copyInvitationLink}>{copied ? 'Copiado' : 'Copiar link'}</button>
                <button type="button" onClick={()=>window.open(shareLink, '_blank')}>Abrir invitación</button>
              </div>
            </div>
          )}
        </div>

        <div className="demo-device-wrap">
          <div className="demo-device-stack">
            <div className="demo-frame demo-device">
              <div className="demo-screen">
                <InviteDemo collection={collection} step={step} setStep={setInviteStep} data={liveData} palette={selectedPalette}/>
              </div>
            </div>
            <div className="demo-device-caption">Así la verán tus invitados.</div>
            <button className="btn-pill btn-light demo-live-cta" onClick={openPersonalizedWhatsapp}>
              <WhatsappIcon size={15}/> Quiero esta invitación
            </button>
          </div>
        </div>

        <div className="demo-benefits">
          {benefits.map((b)=>(
            <div key={b.label} className="demo-benefit">
              <i/><span>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function navBtn(disabled) {
  return { width:40, height:40, borderRadius:'50%', border:'1px solid rgba(245,233,216,0.2)', background:'rgba(245,233,216,0.06)', color:'#f5e9d8', cursor:disabled?'default':'pointer', fontSize:22, opacity:disabled?0.28:1, display:'flex', alignItems:'center', justifyContent:'center' };
}

/* ── 03 CÓMO FUNCIONA ── */
function SceneHowWorks() {
  const steps = [
    { n:'01', title:'Elige diseño', desc:'Escoge la colección que va con tu baby shower.' },
    { n:'02', title:'Envía tus datos', desc:'Nombre, fecha, lugar, mensaje y canción si quieres música.' },
    { n:'03', title:'Comparte el link', desc:'Recibes tu invitación lista para enviar por WhatsApp.' },
  ];
  return (
    <div className="scene scene-snap bg-paper">
      <div aria-hidden="true" style={{ position:'absolute', top:48, right:16, fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:120, color:'rgba(122,79,31,0.08)', lineHeight:1, letterSpacing:'-0.04em', pointerEvents:'none', userSelect:'none', zIndex:0 }}>03</div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'72px 28px 36px', position:'relative', zIndex:2, overflow:'hidden' }}>
        <div className="eyebrow" style={{ color:'#7a4f1f', marginBottom:10 }}>cómo funciona</div>
        <h2 className="display" style={{ fontSize:'clamp(30px,8vw,42px)', color:'#2a201a', lineHeight:0.95, letterSpacing:'-0.025em' }}>Tu invitación</h2>
        <div style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:'clamp(34px,9vw,48px)', color:'#8a4f4f', lineHeight:0.95, letterSpacing:'-0.03em', marginTop:-3 }}>en 3 pasos.</div>
        <p style={{ fontSize:13, color:'#5a4838', marginTop:12, lineHeight:1.55, maxWidth:420 }}>
          Simple, rápido y sin complicarte con edición o diseño.
        </p>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:12, minHeight:0, marginTop:18 }}>
          {steps.map((step)=>(
            <div key={step.n} style={{ display:'grid', gridTemplateColumns:'46px 1fr', gap:14, alignItems:'start', padding:'16px 0', borderTop:'1px solid rgba(122,79,31,0.14)' }}>
              <div className="display" style={{ width:38, height:38, borderRadius:'50%', background:'#2a201a', color:'#f5e9d8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>{step.n}</div>
              <div>
                <div style={{ fontSize:16, fontWeight:500, color:'#2a201a' }}>{step.title}</div>
                <div style={{ fontSize:12, color:'#6a5848', marginTop:4, lineHeight:1.45 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 06 PRECIO ── */
function SceneIncludes() {
  const items = [
    { ic:<IcAnim/>, label:'Invitación animada',     desc:'Transiciones suaves entre secciones' },
    { ic:<IcHrt/>,  label:'Link compartible',        desc:'Lista para enviar por WhatsApp' },
    { ic:<IcWA/>,   label:'Confirmación WhatsApp',   desc:'Tus invitados confirman en un toque' },
    { ic:<IcPin/>,  label:'Mapa con ubicación',      desc:'Enlace directo a Google Maps' },
    { ic:<IcCal/>,  label:'Agenda automática',       desc:'Guardan el evento al instante' },
    { ic:<IcMusic/>,label:'Música visual',           desc:'Sensación premium sin verse recargada' },
    { ic:<IcHrt/>,  label:'Datos editables',         desc:'Nombres, fecha y mensaje personalizados' },
    { ic:<IcAnim/>, label:'Entrega en 24h',           desc:'Solo envías tus datos y hacemos el resto' },
  ];
  return (
    <div className="scene scene-snap bg-paper">
      <div aria-hidden="true" style={{ position:'absolute', top:48, right:16, fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:120, color:'rgba(122,79,31,0.07)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>06</div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'72px 28px 0', position:'relative', zIndex:2, overflow:'hidden' }}>
        <div className="eyebrow" style={{ color:'#7a4f1f', marginBottom:8 }}>qué incluye</div>
        <h2 className="display" style={{ fontSize:'clamp(28px,8vw,38px)', color:'#2a201a', lineHeight:0.95, letterSpacing:'-0.02em' }}>Más que una imagen:</h2>
        <div style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:'clamp(34px,9vw,48px)', color:'#8a4f4f', lineHeight:0.95, letterSpacing:'-0.03em', marginTop:-4, marginBottom:16 }}>una experiencia para tus invitados.</div>

        {/* Feature list */}
        <div style={{ flex:1, overflow:'hidden' }}>
          {items.map((it,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'28px 1fr 20px', gap:12, alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(122,79,31,0.15)', borderTop:i===0?'1px solid rgba(122,79,31,0.15)':'none' }}>
              <div style={{ width:24, height:24, color:'#7a4f1f', flexShrink:0 }}>{it.ic}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:'#2a201a' }}>{it.label}</div>
                <div style={{ fontSize:10, color:'#6a5848', marginTop:1 }}>{it.desc}</div>
              </div>
              <div className="script" style={{ fontSize:15, color:'#7a4f1f' }}>✓</div>
            </div>
          ))}
        </div>

        {/* Price — separated cleanly at bottom */}
        <div style={{ padding:'18px 0 36px', textAlign:'center', borderTop:'1px solid rgba(122,79,31,0.1)', marginTop:8 }}>
          <div className="script" style={{ fontSize:13, color:'#6a5848', marginBottom:2 }}>pago único</div>
          <div className="display" style={{ fontSize:'clamp(44px,13vw,56px)', color:'#2a201a', lineHeight:1 }}>$10</div>
          <div style={{ fontSize:8, letterSpacing:'0.32em', textTransform:'uppercase', color:'#7a4f1f', marginTop:4 }}>personalización incluida · entrega en 24h</div>
        </div>
      </div>
    </div>
  );
}
function IcAnim(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><circle cx="12" cy="6" r="2.5"/><path d="M12 8.5v7" strokeDasharray="1.5 1.5"/><circle cx="12" cy="18" r="2.5"/></svg> }
function IcMusic(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg> }
function IcWA(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.8-5A8 8 0 1 1 8 19.5L3 21z"/><path d="M9 10c0 3 2 5 5 5"/></svg> }
function IcPin(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg> }
function IcCal(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg> }
function IcHrt(){ return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg> }

/* ── 07 PRECIO LIMPIO ── */
function ScenePrice() {
  return (
    <div className="scene scene-snap bg-paper">
      <div aria-hidden="true" style={{ position:'absolute', top:48, right:16, fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:120, color:'rgba(122,79,31,0.07)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>07</div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'72px 28px 44px', position:'relative', zIndex:2 }}>
        <div className="eyebrow" style={{ color:'#7a4f1f', marginBottom:10 }}>precio</div>
        <h2 className="display" style={{ fontSize:'clamp(42px,11vw,72px)', color:'#2a201a', lineHeight:.9, letterSpacing:0 }}>Desde $10</h2>
        <p className="script" style={{ fontSize:'clamp(20px,5vw,30px)', color:'#8a4f4f', lineHeight:1.2, marginTop:10, maxWidth:560 }}>
          Personalización incluida.
        </p>
        <div style={{ marginTop:28, display:'grid', gap:10, maxWidth:520 }}>
          {[
            'Diseño animado según el estilo elegido',
            'Nombre, fecha, hora, lugar y WhatsApp personalizados',
            'Link compartible listo para enviar',
            'Entrega en 24h'
          ].map((item, i)=>(
            <div key={item} style={{ display:'grid', gridTemplateColumns:'34px 1fr', gap:12, alignItems:'center', padding:'13px 0', borderTop:i===0?'1px solid rgba(122,79,31,.16)':'none', borderBottom:'1px solid rgba(122,79,31,.16)' }}>
              <div className="display" style={{ width:28, height:28, borderRadius:'50%', background:'#2a201a', color:'#f5e9d8', display:'grid', placeItems:'center', fontSize:14 }}>✓</div>
              <div style={{ fontSize:14, color:'#4c3a28', lineHeight:1.35 }}>{item}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop:24, color:'#6a5848', fontSize:14, lineHeight:1.55, maxWidth:460 }}>
          Solo envías tus datos. Nosotros hacemos el resto.
        </p>
      </div>
    </div>
  );
}

/* ── 08 ANTES / DESPUÉS ── */
function BeforeFlatInvite() {
  return (
    <div className="compare-before-card" aria-label="Invitación plana básica">
      <div style={{ fontSize:7, color:'#9a9086', marginBottom:6 }}>imagen enviada por chat</div>
      <div className="compare-before-image">
        <div className="compare-before-stamp">Baby Shower</div>
        <div className="compare-before-title">Invitación<br/>simple</div>
        <div className="compare-before-lines"><span/><span/><span style={{ width:'72%' }}/></div>
        <div style={{ fontSize:8, marginTop:12 }}>Sábado 12 · Casa</div>
      </div>
      <div className="compare-before-note">
        <span>sin música</span>
        <span>sin mapa</span>
        <span>sin calendario ni confirmación</span>
      </div>
    </div>
  );
}

function AfterPremiumInvite() {
  return (
    <div className="compare-after-product" aria-label="Invitación digital premium completa">
      <div className="compare-after-item compare-after-kicker" style={{ '--d':'0s' }}>BABY SHOWER</div>
      <div className="compare-after-item compare-after-headline" style={{ '--d':'0.1s' }}>Está por<br/>florecer</div>
      <div className="compare-after-item compare-after-name" style={{ '--d':'0.2s' }}>Sofía</div>
      <div className="compare-after-item compare-after-date" style={{ '--d':'0.3s' }}>24 · 07 · 2026</div>
      <div className="compare-after-item compare-after-micro" style={{ '--d':'0.4s' }}>
        <FineIcon type="music" size={13}/> música suave
      </div>
      <div className="compare-after-item" style={{ '--d':'0.48s', display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, width:'min(230px, 82%)' }}>
        {[
          { icon:'pin', label:'Ubicación' },
          { icon:'calendar', label:'Calendario' },
          { icon:'whatsapp', label:'WhatsApp' },
          { icon:'heart', label:'Link listo' },
        ].map(item => (
          <div key={item.label} className="compare-after-micro" style={{ justifyContent:'center', padding:'5px 8px', fontSize:8 }}>
            <FineIcon type={item.icon} size={11}/> {item.label}
          </div>
        ))}
      </div>
      <div className="compare-after-item compare-after-separator" style={{ '--d':'0.5s' }}/>
      <button className="compare-after-item compare-after-button" style={{ '--d':'0.6s' }} type="button">Confirmar asistencia</button>
      <div className="compare-after-item compare-after-copy" style={{ '--d':'0.7s' }}>Ubicación + recordatorio en un toque</div>
    </div>
  );
}

function SceneCompare() {
  const [pos, setPos] = useState(50);
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const onMove = (cx) => {
    if (!trackRef.current) return;
    const r = trackRef.current.getBoundingClientRect();
    setPos(Math.max(6, Math.min(94, ((cx - r.left) / r.width) * 100)));
  };
  return (
    <div className="scene scene-snap bg-night">
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'68px 28px 36px', gap:14, overflow:'hidden' }}>
        {/* Header */}
        <div style={{ flexShrink:0 }}>
          <div className="eyebrow" style={{ color:'#d4a574', marginBottom:6 }}>05 · Antes / Después</div>
          <h2 className="display" style={{ fontSize:'clamp(24px,6.5vw,34px)', color:'#f5e9d8', lineHeight:0.95, letterSpacing:'-0.02em' }}>De una imagen plana a una invitación que se puede sentir.</h2>
          <p style={{ marginTop:8, fontSize:13, color:'rgba(245,233,216,0.65)', lineHeight:1.45, maxWidth:520 }}>
            Envía una experiencia con música, mapa y confirmación en un toque.
          </p>
        </div>

        {/* Labels row */}
        <div style={{ display:'flex', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(245,233,216,0.45)', fontWeight:600 }}>← ANTES</div>
          <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4a574', fontWeight:600 }}>DESPUÉS →</div>
        </div>

        {/* Compare track */}
        <div ref={trackRef} className="compare-track" style={{ flex:1, minHeight:0, maxHeight:380, cursor:'ew-resize' }}
          onMouseDown={()=>{ dragging.current=true; }}
          onMouseMove={e=>{ if(dragging.current) onMove(e.clientX); }}
          onMouseUp={()=>{ dragging.current=false; }}
          onMouseLeave={()=>{ dragging.current=false; }}
          onTouchStart={()=>{ dragging.current=true; }}
          onTouchMove={e=>onMove(e.touches[0].clientX)}
          onTouchEnd={()=>{ dragging.current=false; }}>

          {/* ANTES base */}
          <div className="compare-side" style={{ background:'#cfc7bd', display:'flex', alignItems:'center', justifyContent:'flex-start', padding:16 }}>
            <BeforeFlatInvite/>
          </div>

          {/* DESPUÉS overlay desde la derecha */}
          <div className="compare-side" style={{ clipPath:`inset(0 0 0 ${100-pos}%)`, background:'radial-gradient(circle at 16% 12%, rgba(255,255,255,.9), transparent 22%), radial-gradient(circle at 86% 84%, rgba(216,183,236,.36), transparent 28%), linear-gradient(180deg,#fff6f2 0%,#f5dcd5 100%)', display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'16px 34px 16px 16px' }}>
            <AfterPremiumInvite/>
          </div>

          {/* Drag handle */}
          <div className="compare-handle" style={{ left:`${pos}%` }}>
            <div className="compare-knob">⇆</div>
          </div>
        </div>

        <div style={{ fontSize:9, textAlign:'center', color:'rgba(245,233,216,0.4)', letterSpacing:'0.16em', textTransform:'uppercase', flexShrink:0 }}>arrastra para comparar</div>
      </div>
    </div>
  );
}

/* ── 09 REEL MOMENT ── */
function SceneViral() {
  const [idx, setIdx] = useState(0);
  const items = [
    { Mock:DulceEsperaMock, name:'Dulce Espera',    tag:'Honey & Cream',  accent:'#7a4f1f' },
    { Mock:JardinMock,      name:'Jardín de Amor',  tag:'Floral Blush',   accent:'#8a4f4f' },
    { Mock:MilagroMock,     name:'Pequeño Milagro', tag:'Minimal Chic',   accent:'#a08560' },
  ];
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%3),2800); return ()=>clearInterval(t); }, []);
  return (
    <div className="scene scene-snap bg-night" style={{ display:'flex', flexDirection:'column' }}>
      <div style={{ paddingTop:68, padding:'68px 28px 16px', flexShrink:0 }}>
        <div className="eyebrow" style={{ color:'#d4a574', marginBottom:6 }}>08 · Para ti</div>
        <div className="display" style={{ fontSize:'clamp(22px,6.5vw,28px)', color:'#f5e9d8', lineHeight:0.95, letterSpacing:'-0.02em' }}>Si estás preparando un</div>
        <div style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:'clamp(32px,9vw,40px)', color:'#d4a574', lineHeight:0.9, letterSpacing:'-0.03em', marginTop:-2 }}>baby shower…</div>
        <p style={{ marginTop:8, fontSize:13, color:'rgba(245,233,216,0.65)' }}>esto es para ti.</p>
      </div>

      {/* Cycling invite */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', minHeight:0, padding:'0 72px' }}>
        {items.map((it,i)=>(
          <div key={i} style={{ position:i===idx?'relative':'absolute', top:0, left:0, width:'100%', opacity:i===idx?1:0, transform:i===idx?'scale(1)':'scale(0.92) rotate(-2deg)', transition:'opacity 0.65s ease, transform 0.65s ease', animation:i===idx?'drift 4s ease-in-out infinite':'none', filter:'drop-shadow(0 40px 60px rgba(0,0,0,0.6))' }}>
            <it.Mock size="lg"/>
          </div>
        ))}
      </div>

      {/* Bottom meta + dots */}
      <div style={{ padding:'16px 28px 44px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div className="eyebrow" style={{ fontSize:8, color:items[idx].accent, marginBottom:3 }}>{String(idx+1).padStart(2,'0')} / 03</div>
          <div className="display" style={{ fontSize:20, color:'#f5e9d8', lineHeight:1 }}>{items[idx].name}</div>
          <div style={{ fontSize:10, color:'rgba(245,233,216,0.55)', marginTop:2, letterSpacing:'0.06em' }}>{items[idx].tag}</div>
        </div>
        <div style={{ display:'flex', gap:5 }}>
          {items.map((_,i)=><button key={i} onClick={()=>setIdx(i)} style={{ width:i===idx?20:5, height:4, borderRadius:2, background:i===idx?'#f5e9d8':'rgba(245,233,216,0.22)', border:'none', padding:0, cursor:'pointer', transition:'all 0.3s ease' }}/>)}
        </div>
      </div>
    </div>
  );
}

/* ── 07 CTA FINAL ── */
function SceneCTA() {
  return (
    <div className="scene scene-snap bg-paper scene-cta" style={{ display:'flex', flexDirection:'column' }}>
      <div aria-hidden="true" style={{ position:'absolute', top:48, right:16, fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:120, color:'rgba(122,79,31,0.07)', lineHeight:1, pointerEvents:'none', userSelect:'none' }}>09</div>

      {/* Headline */}
      <div className="final-cta-copy">
        <div className="eyebrow" style={{ color:'#7a4f1f', marginBottom:8 }}>pídela hoy</div>
        <h2 className="display" style={{ fontSize:'clamp(30px,8vw,40px)', color:'#2a201a', lineHeight:0.95, letterSpacing:'-0.02em' }}>¿Quieres una invitación así</h2>
        <div style={{ fontFamily:'DM Serif Display', fontStyle:'italic', fontSize:'clamp(34px,10vw,48px)', color:'#8a4f4f', lineHeight:0.9, letterSpacing:'-0.03em', marginTop:-4 }}>para tu baby shower?</div>
        <p style={{ marginTop:12, fontSize:13, color:'#5a4838', lineHeight:1.55, maxWidth:290 }}>
          Solo envías los datos. Nosotros hacemos el resto.
        </p>
      </div>

      {/* Invite preview — vertical, below the copy */}
      <div className="final-invite-wrap">
        <div className="final-invite-card" aria-label="Invitación final animada">
          <div className="final-deco final-deco-1"><PeonyCluster/></div>
          <div className="final-deco final-deco-2"><PeonyCluster/></div>
          <div className="final-deco final-deco-3"/>
          <div className="final-deco final-deco-4">⌁</div>
          <div className="final-deco final-deco-5">✦</div>
          <div className="final-invite-content">
            <div className="final-invite-line final-invite-kicker" style={{ '--d':'0s' }}>BABY SHOWER</div>
            <div className="final-invite-line final-invite-headline" style={{ '--d':'0.14s' }}>
              <span className="final-shimmer">Está por florecer</span>
            </div>
            <div className="final-invite-line final-invite-name" style={{ '--d':'0.28s' }}>Sofía</div>
            <div className="final-invite-line final-invite-date" style={{ '--d':'0.42s' }}>24 · 07 · 2026</div>
            <div className="final-invite-line final-invite-rule" style={{ '--d':'0.56s' }}/>
            <div className="final-invite-line final-invite-meta" style={{ '--d':'0.68s' }}>
              <FineIcon type="music" size={13}/> música suave
            </div>
            <button className="final-invite-line compare-after-button" style={{ '--d':'0.78s', marginTop:12 }} type="button">Confirmar asistencia</button>
            <div className="final-invite-line final-invite-copy" style={{ '--d':'0.88s' }}>Ubicación + recordatorio en un toque</div>
          </div>
        </div>
      </div>

      {/* Price ticket + WhatsApp CTA — always at bottom, never overlaps */}
      <div style={{ padding:'0 28px 40px', flexShrink:0, position:'relative', zIndex:3 }}>
        <div style={{ background:'white', borderRadius:16, padding:'14px 18px', boxShadow:'0 12px 32px -10px rgba(80,50,30,0.22)', border:'1px solid rgba(0,0,0,0.04)', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div>
            <div className="eyebrow" style={{ fontSize:8 }}>desde</div>
            <div className="display" style={{ fontSize:32, lineHeight:1, color:'#2a201a', marginTop:2 }}>$10</div>
            <div style={{ fontSize:8, color:'#6a5848', marginTop:2, letterSpacing:'0.06em' }}>USD · pago único</div>
          </div>
          <div style={{ width:1, alignSelf:'stretch', background:'rgba(0,0,0,0.07)', margin:'0 14px' }}/>
          <div style={{ textAlign:'right' }}>
            <div className="script" style={{ fontSize:12, color:'#8a4f4f' }}>entrega</div>
            <div className="display" style={{ fontSize:22, color:'#2a201a', lineHeight:1 }}>24h</div>
            <div style={{ fontSize:8, color:'#6a5848', marginTop:2, letterSpacing:'0.06em' }}>revisiones incluidas</div>
          </div>
        </div>
        <button onClick={()=>window.open('https://wa.me/?text=Hola,%20quiero%20una%20invitaci%C3%B3n%20de%20baby%20shower','_blank')} className="btn-pill btn-whatsapp" style={{ width:'100%', justifyContent:'center', padding:'17px 24px', fontSize:13 }}>
          <WhatsappIcon size={17}/> Pedir por WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESKTOP LEFT PANEL
═══════════════════════════════════════════════════════════════ */
const SCENE_COPY = {
  hero:      { headline:'Invitaciones digitales\npara baby shower.',                    sub:'Personalizadas, animadas y listas para compartir por WhatsApp desde $10.' },
  demo:      { headline:'Personaliza en vivo\nen segundos.',                           sub:'Escribe nombre, fecha y lugar mientras la invitación se actualiza dentro del teléfono.' },
  steps:     { headline:'Tu invitación\nen 3 pasos.',                                  sub:'Elige diseño, envía tus datos y recibe el link listo para compartir.' },
  collections:{ headline:'Elige el estilo\nque quieres enviar.',                        sub:'Seis colecciones boutique, personalizadas con los datos de tu evento.' },
  compare:   { headline:'Más que una\nimagen plana.',                                  sub:'Una invitación interactiva con música, mapa y confirmación.' },
  includes:  { headline:'Más que una\nimagen.',                                         sub:'Diseño animado, link, WhatsApp, ubicación, calendario y música visual.' },
  price:     { headline:'Desde $10\nlista en 24h.',                                    sub:'Personalización incluida. Solo envías tus datos y hacemos el resto.' },
  viral:     { headline:'Lista para\ncompartir.',                                      sub:'Una demo visual que se siente bonita en pantalla y funciona perfecto para reels o WhatsApp.' },
  cta:       { headline:'¿Quieres una\ninvitación así?',                               sub:'Pídela por WhatsApp y recibe tu experiencia lista en 24h.' },
};

function StageLeft({ activeScene, goTo }) {
  const copy = SCENE_COPY[activeScene] || SCENE_COPY.hero;
  const idx = Math.max(0, SCENES_META.findIndex(s => s.id === activeScene));
  return (
    <div className="stage-left">
      <div>
        <div className="stage-left-brand">Baby Invites</div>
        <div className="stage-left-sub">Digital · Baby Shower</div>
      </div>
      <div style={{ width:32, height:1, background:'rgba(212,165,116,0.3)' }}/>
      <div>
        <div className="stage-left-headline" style={{ whiteSpace:'pre-line' }}>{copy.headline}</div>
        <div className="stage-left-desc">{copy.sub}</div>
      </div>
      <div className="stage-left-divider"/>
      <div className="stage-left-scenes" aria-hidden="true">
        <div className="eyebrow" style={{ fontSize:8, color:'#d4a574' }}>{String(idx+1).padStart(2,'0')} / {SCENES_META.length}</div>
        <div style={{ display:'flex', gap:5, marginTop:6 }}>
          {SCENES_META.map((s,i)=>(
            <span key={s.id} style={{ width:i===idx?18:5, height:4, borderRadius:3, background:i===idx?'#d4a574':'rgba(245,233,216,0.18)', transition:'all 0.2s ease' }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
const STAGE_BG = {
  dark:  'radial-gradient(ellipse at 25% 20%, #3a2820 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, #2a1f18 0%, transparent 50%), linear-gradient(180deg, #1a1410 0%, #221814 100%)',
  cream: 'radial-gradient(ellipse at 30% 20%, #f5e9d8 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, #ead8c4 0%, transparent 50%), linear-gradient(180deg, #efe4d2 0%, #e6d5be 100%)',
  blush: 'radial-gradient(ellipse at 30% 20%, #fde4e0 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, #f5cfc9 0%, transparent 50%), linear-gradient(180deg, #fbe7e2 0%, #e8b4b0 100%)',
};
const SCENES_META = [
  {id:'hero',name:'Inicio'},
  {id:'demo',name:'Demo'},
  {id:'steps',name:'Cómo funciona'},
  {id:'collections',name:'Colecciones'},
  {id:'compare',name:'Antes / Después'},
  {id:'includes',name:'Qué incluye'},
  {id:'price',name:'Precio'},
  {id:'viral',name:'Reel'},
  {id:'cta',name:'Pídela'},
];

function PublicUnavailable() {
  return (
    <div className="public-invite-page">
      <div className="public-unavailable">
        <div className="eyebrow" style={{ color:'#d4a574', marginBottom:10 }}>Baby Invites</div>
        <h1 className="display">Esta invitación no está disponible.</h1>
        <p>El link puede estar incompleto o haber sido copiado con error.</p>
      </div>
    </div>
  );
}

function PublicInvitationPage() {
  const params = new URLSearchParams(window.location.search);
  const payload = decodeInvitePayload(params.get('data'));
  const data = makeInviteDataFromPayload(payload);
  const [step, setStep] = useState(0);
  const [manualTick, setManualTick] = useState(0);
  const [musicOn, setMusicOn] = useState(true);
  const [shareDone, setShareDone] = useState(false);

  useEffect(()=>{
    if (!data) return;
    const id = setInterval(()=>setStep(s=>(s+1)%XP_SCENES.length), 3000);
    return ()=>clearInterval(id);
  }, [data?.style, manualTick]);

  useEffect(()=>{
    if (!data) return;
    const previousTitle = document.title;
    document.title = `Baby Shower de ${data.baby} | Baby Invites Boutique`;
    return () => { document.title = previousTitle; };
  }, [data?.baby]);

  const setInviteStep = useCallback((next) => {
    setStep(prev => typeof next === 'function' ? next(prev) : next);
    setManualTick(t => t + 1);
  }, []);

  const sharePublicInvite = async () => {
    if (!data) return;
    const shareData = {
      title: `Baby Shower de ${data.baby}`,
      text: `Te comparto la invitación al baby shower de ${data.baby}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShareDone(true);
      window.setTimeout(() => setShareDone(false), 1800);
    } catch {
      setShareDone(false);
    }
  };

  if (!data) return <PublicUnavailable/>;

  return (
    <div className="public-invite-page">
      <div className="public-invite-shell">
        <div className="public-invite-meta">
          <div className="eyebrow">{data.name}</div>
          <h1 className="display">Baby Shower de {data.baby}</h1>
          <p>{data.date} · {data.time} · {data.place}</p>
        </div>

        <div className="public-invite-frame">
          <div className="demo-screen">
            <InviteDemo collection={data.style} step={step} setStep={setInviteStep} data={data} musicOn={musicOn}/>
          </div>
        </div>

        <div className="public-actions">
          <button className="public-action primary" onClick={()=>window.open(makeWhatsappUrl(data), '_blank')}>
            <WhatsappIcon size={15}/> Confirmar asistencia
          </button>
          <button className="public-action" onClick={()=>window.open(makeMapsUrl(data), '_blank')}>
            <FineIcon type="pin" size={14}/> Ver ubicación
          </button>
          <button className="public-action" onClick={()=>window.open(makeCalendarUrl(data), '_blank')}>
            <FineIcon type="calendar" size={14}/> Agendar
          </button>
          <button className="public-action" onClick={()=>setMusicOn(v=>!v)}>
            <FineIcon type="music" size={14}/> {musicOn ? 'Música on' : 'Música off'}
          </button>
          <button className="public-action public-action-share" onClick={sharePublicInvite}>
            <FineIcon type="heart" size={14}/> {shareDone ? 'Link copiado' : 'Compartir'}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweaks] = useTweaks({ showAdmin:false, snapScroll:true, stagePalette:'dark' });
  const [collection, setCollection] = useState('floral');
  const [demoPalette, setDemoPalette] = useState(getStylePalettes(STYLE_BY_ID.floral)[0]);
  const [selectedPalettes, setSelectedPalettes] = useState({ floral: getStylePalettes(STYLE_BY_ID.floral)[0] });
  const [liveFields, setLiveFields] = useState({ baby: '', date: '', time: '', place: '', address: '', whatsapp: '' });
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);

  useEffect(()=>{
    const el = scrollRef.current; if (!el) return;
    const fn = ()=>{
      const center = el.scrollTop + el.clientHeight * 0.45;
      const children = Array.from(el.children);
      const i = children.reduce((best, child, index) => {
        const dist = Math.abs(child.offsetTop - center);
        return dist < best.dist ? { index, dist } : best;
      }, { index:0, dist:Infinity }).index;
      setActiveIdx(Math.max(0, Math.min(SCENES_META.length-1, i)));
    };
    el.addEventListener('scroll', fn, { passive:true }); fn();
    return ()=>el.removeEventListener('scroll', fn);
  }, []);

  const goTo = (i) => {
    const el = scrollRef.current; if (!el) return;
    const target = el.children[i];
    el.scrollTo({ top: target ? target.offsetTop : i * el.clientHeight, behavior:'smooth' });
  };

  const chooseCollection = (styleId, palette) => {
    const style = STYLE_BY_ID[styleId] || STYLE_BY_ID.floral;
    const chosenPalette = palette || selectedPalettes[style.id] || getStylePalettes(style)[0];
    setCollection(style.id);
    setDemoPalette(chosenPalette);
    setSelectedPalettes(current => ({ ...current, [style.id]: chosenPalette }));
  };

  const orderStyle = (styleId, palette) => {
    const style = STYLE_BY_ID[styleId] || STYLE_BY_ID.floral;
    const data = getLiveInviteData(style.id, liveFields);
    const hasTypedData = Object.values(liveFields).some(value => String(value || '').trim());
    const paletteText = palette ? ` paleta ${palette.name}` : '';
    const details = hasTypedData
      ? ` Datos: ${data.baby} · ${data.date} · ${data.time} · ${data.place}.`
      : '';
    window.open(`https://wa.me/?text=${encodeURIComponent(`Hola, quiero una invitación digital estilo ${style.name}${paletteText}.${details}`)}`, '_blank');
  };

  return (
    <div className="boutique-stage" style={{ background: STAGE_BG[tweaks.stagePalette] }}>

      {/* Desktop left panel */}
      <StageLeft activeScene={SCENES_META[activeIdx].id} goTo={goTo}/>

      {/* Mobile chrome */}
      <div className="brand-mark">
        <div className="b1">Baby Invites</div>
        <div className="b2">Boutique · Vol. 01</div>
      </div>
      <div className="reel-meta">
        <div className="num">{String(activeIdx+1).padStart(2,'0')}</div>
        <div>{SCENES_META[activeIdx].name}</div>
        <div style={{ opacity:0.45 }}>de {SCENES_META.length}</div>
      </div>
      <div className="outside-controls">
        {SCENES_META.map((s,i)=>(
          <button key={s.id} className={`scene-jumper ${i===activeIdx?'active':''}`} onClick={()=>goTo(i)} title={s.name}>{i+1}</button>
        ))}
      </div>

      {/* Main experience */}
      <div className="phone">
        <div className="statusbar">
          <span>9:41</span>
          <div className="right">
            <span style={{ fontSize:10 }}>●●●●●</span>
            <span style={{ marginLeft:3 }}>5G</span>
            <svg viewBox="0 0 24 12" width="18" height="9" style={{ marginLeft:2 }}>
              <rect x="0.5" y="1" width="19" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1"/>
              <rect x="2" y="2.5" width="14" height="7" rx="1" fill="currentColor"/>
              <rect x="20" y="4" width="2" height="4" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div ref={scrollRef} className="phone-scroll" style={{ scrollSnapType: tweaks.snapScroll ? 'y mandatory' : 'none' }}>
          <SceneHero onJump={()=>goTo(3)}/>
          <SceneDemo collection={collection} setCollection={chooseCollection} liveFields={liveFields} setLiveFields={setLiveFields} selectedPalette={demoPalette} onViewStyles={()=>goTo(3)}/>
          <SceneHowWorks/>
          <SceneCollectionIntro onTryDemo={(c,palette)=>{chooseCollection(c, palette);goTo(1);}} onOrderStyle={orderStyle}/>
          <SceneCompare/>
          <SceneIncludes/>
          <ScenePrice/>
          <SceneViral/>
          <SceneCTA/>
        </div>

        {tweaks.showAdmin && (
          <div style={{ position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)', background:'rgba(20,14,10,0.9)', color:'#f5e9d8', padding:'6px 14px', borderRadius:100, fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase', zIndex:60 }}>
            ⚙ admin · personalizar datos
          </div>
        )}
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Stage">
          <TweakSelect label="Backdrop" value={tweaks.stagePalette} onChange={v=>setTweaks({stagePalette:v})}
            options={[{value:'dark',label:'Editorial dark'},{value:'cream',label:'Warm cream'},{value:'blush',label:'Blush rose'}]}/>
          <TweakToggle label="Snap scroll"  value={tweaks.snapScroll}  onChange={v=>setTweaks({snapScroll:v})}/>
        </TweakSection>
        <TweakSection label="Demo">
          <TweakRadio label="Colección" value={collection} onChange={chooseCollection}
            options={INVITATION_STYLES.map(style => ({ value:style.id, label:style.shortName.slice(0, 3) }))}/>
        </TweakSection>
        <TweakSection label="Internal">
          <TweakToggle label="Admin badge" value={tweaks.showAdmin} onChange={v=>setTweaks({showAdmin:v})}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function Root() {
  const isPublicInvitation = window.location.pathname.replace(/\/+$/, '') === '/invitacion';
  return isPublicInvitation ? <PublicInvitationPage/> : <App/>;
}

export default Root;
