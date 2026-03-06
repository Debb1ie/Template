import { useState, useRef, useEffect, useCallback, useMemo } from "react";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Outfit:wght@200;300;400&display=swap');
`;

/* ─── SVG WEATHER ICONS ─────────────────────────────────── */
const SunIcon = ({ size = 56, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF5C0" />
        <stop offset="60%" stopColor="#FFD84D" />
        <stop offset="100%" stopColor="#FF9B1A" />
      </radialGradient>
      {glow && <filter id="sunGlow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
    </defs>
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <line key={i}
        x1={32 + Math.cos(deg*Math.PI/180)*14} y1={32 + Math.sin(deg*Math.PI/180)*14}
        x2={32 + Math.cos(deg*Math.PI/180)*23} y2={32 + Math.sin(deg*Math.PI/180)*23}
        stroke="#FFD84D" strokeWidth={i%2===0?2.5:1.5} strokeLinecap="round" opacity={i%2===0?1:0.6}
      />
    ))}
    <circle cx="32" cy="32" r="11" fill="url(#sunCore)" filter={glow?"url(#sunGlow)":undefined}/>
    <circle cx="32" cy="32" r="11" fill="none" stroke="#FFF5C0" strokeWidth="1" opacity="0.4"/>
  </svg>
);

const CloudIcon = ({ size = 56, color = "#C8D8E8", opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id={`cloudGrad${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="1"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.7"/>
      </linearGradient>
    </defs>
    <path d="M14 40 Q10 40 10 34 Q10 26 18 25 Q19 17 28 17 Q36 17 38 24 Q44 22 48 28 Q54 28 54 35 Q54 40 48 40 Z"
      fill={`url(#cloudGrad${color.replace('#','')})`} opacity={opacity}/>
    <path d="M14 40 Q10 40 10 34 Q10 26 18 25 Q19 17 28 17 Q36 17 38 24 Q44 22 48 28 Q54 28 54 35 Q54 40 48 40 Z"
      fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
  </svg>
);

const RainIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="rainCloud" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7090B0"/>
        <stop offset="100%" stopColor="#4A6A90"/>
      </linearGradient>
    </defs>
    <path d="M10 30 Q8 30 8 25 Q8 18 15 17 Q16 10 24 10 Q31 10 33 16 Q38 14 42 19 Q47 19 47 25 Q47 30 42 30 Z"
      fill="url(#rainCloud)"/>
    {[[16,34,20,42],[24,36,22,46],[32,34,30,44],[40,36,38,46],[22,40,19,50]].map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#7EC8E3" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
    ))}
  </svg>
);

const StormIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="stormCloud" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2A2A3E"/>
        <stop offset="100%" stopColor="#1A1A2A"/>
      </linearGradient>
    </defs>
    <path d="M8 28 Q6 28 6 22 Q6 14 14 13 Q15 6 24 6 Q32 6 34 12 Q40 10 45 16 Q51 16 51 23 Q51 28 45 28 Z"
      fill="url(#stormCloud)"/>
    <path d="M31 30 L24 42 L30 42 L23 56 L38 38 L30 38 L37 30 Z"
      fill="#FFE44D" stroke="#FFC107" strokeWidth="0.5"/>
  </svg>
);

const SnowIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="snowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8F4FC"/>
        <stop offset="100%" stopColor="#B8D4E8"/>
      </linearGradient>
    </defs>
    <line x1="32" y1="8" x2="32" y2="56" stroke="url(#snowGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="8" y1="32" x2="56" y2="32" stroke="url(#snowGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="15" y1="15" x2="49" y2="49" stroke="url(#snowGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="49" y1="15" x2="15" y2="49" stroke="url(#snowGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    {[[32,8],[32,56],[8,32],[56,32],[15,15],[49,49],[15,49],[49,15]].map(([x,y],i)=>
      <circle key={i} cx={x} cy={y} r="3" fill="#E8F4FC" opacity="0.9"/>
    )}
    <circle cx="32" cy="32" r="5" fill="white" opacity="0.95"/>
  </svg>
);

const FogIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {[[10,18,54,4],[6,28,58,4],[12,38,50,4],[8,48,46,4]].map(([x,y,w,h],i)=>(
      <rect key={i} x={x} y={y} width={w} height={h} rx="2"
        fill="white" opacity={0.12 + i*0.04}/>
    ))}
    {[[10,20,54],[6,30,58],[12,40,50],[8,50,46]].map(([x,y,w],i)=>(
      <line key={i} x1={x} y1={y} x2={x+w} y2={y}
        stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity={0.25 + i*0.07}/>
    ))}
  </svg>
);

const RainbowIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {[
      ["#FF4444",28],["#FF8C00",24],["#FFD700",20],
      ["#44CC44",16],["#4499FF",12],["#8844FF",8]
    ].map(([color, r], i) => (
      <path key={i}
        d={`M ${32-r} 50 A ${r} ${r} 0 0 1 ${32+r} 50`}
        stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.9"/>
    ))}
  </svg>
);

const WindIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#90E8D8" stopOpacity="0"/>
        <stop offset="50%" stopColor="#90E8D8" stopOpacity="1"/>
        <stop offset="100%" stopColor="#90E8D8" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    {[
      [8,20,44,20,52,14],
      [6,32,50,32],
      [10,44,40,44,46,50],
    ].map((pts, i) => pts.length === 5 ? (
      <path key={i} d={`M${pts[0]} ${pts[1]} Q${pts[2]} ${pts[3]} ${pts[4]} ${pts[2]}`}
        stroke="url(#windGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8"/>
    ) : (
      <line key={i} x1={pts[0]} y1={pts[1]} x2={pts[2]} y2={pts[3]}
        stroke="url(#windGrad)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
    ))}
    {[8,6,10].map((x,i)=>(
      <line key={`w${i}`} x1={x} y1={20+i*12} x2={x+36+i*8} y2={20+i*12}
        stroke="#90E8D8" strokeWidth="2" strokeLinecap="round" opacity={0.6-i*0.1}/>
    ))}
  </svg>
);

const MoonIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="moonGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F5E6C8"/>
        <stop offset="70%" stopColor="#D4A84B"/>
        <stop offset="100%" stopColor="#A07830"/>
      </radialGradient>
    </defs>
    <path d="M36 10 Q20 16 20 32 Q20 48 36 54 Q16 54 12 38 Q8 22 24 12 Z"
      fill="url(#moonGrad)"/>
    <circle cx="28" cy="22" r="2.5" fill="#F5E6C8" opacity="0.4"/>
    <circle cx="22" cy="36" r="1.5" fill="#F5E6C8" opacity="0.3"/>
  </svg>
);

const StarIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFCE0"/>
        <stop offset="60%" stopColor="#FFE566"/>
        <stop offset="100%" stopColor="#FFB800"/>
      </radialGradient>
    </defs>
    <polygon points="32,6 38,24 57,24 42,36 48,54 32,42 16,54 22,36 7,24 26,24"
      fill="url(#starGrad)" stroke="#FFE566" strokeWidth="0.5"/>
    <circle cx="32" cy="32" r="4" fill="white" opacity="0.5"/>
  </svg>
);

const HazeIcon = ({ size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <defs>
      <radialGradient id="hazeGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFB347" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.2"/>
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="22" fill="url(#hazeGrad)"/>
    {[0,45,90,135,180,225,270,315].map((deg,i)=>(
      <line key={i}
        x1={32+Math.cos(deg*Math.PI/180)*10} y1={32+Math.sin(deg*Math.PI/180)*10}
        x2={32+Math.cos(deg*Math.PI/180)*18} y2={32+Math.sin(deg*Math.PI/180)*18}
        stroke="#FFD084" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    ))}
    <circle cx="32" cy="32" r="8" fill="#FFE0A0" opacity="0.7"/>
  </svg>
);

const ELEMENTS = [
  { id:"sun",     label:"Sunshine",  Icon:SunIcon,     bg:["#1a0f00","#4a2800","#ff9b1a"],  meaning:"Joy · clarity · warmth",    particle:"glow" },
  { id:"cloud",   label:"Cloud",     Icon:CloudIcon,   bg:["#1a2030","#354050","#8eb5cc"],  meaning:"Calm · neutral · drifting", particle:"none" },
  { id:"rain",    label:"Rain",      Icon:RainIcon,    bg:["#0d1520","#1a2840","#5b8db8"],  meaning:"Grief · release · longing", particle:"rain" },
  { id:"storm",   label:"Storm",     Icon:StormIcon,   bg:["#07070f","#141425","#2a2a3e"],  meaning:"Anxiety · rage · chaos",    particle:"lightning" },
  { id:"snow",    label:"Snow",      Icon:SnowIcon,    bg:["#0f1a24","#c8dce8","#eef5fa"],  meaning:"Stillness · numb · peace",  particle:"snow" },
  { id:"fog",     label:"Fog",       Icon:FogIcon,     bg:["#1a1a1a","#4a4a4a","#909090"],  meaning:"Confusion · lost · muted",  particle:"fog" },
  { id:"rainbow", label:"Rainbow",   Icon:RainbowIcon, bg:["#0d1520","#1a3050","#74b9ff"],  meaning:"Hope · transition · beauty",particle:"none" },
  { id:"wind",    label:"Wind",      Icon:WindIcon,    bg:["#0a1828","#1a3040","#4a90d9"],  meaning:"Restless · change · free",  particle:"wind" },
  { id:"moon",    label:"Moon",      Icon:MoonIcon,    bg:["#050510","#0d0d2b","#1a1a3e"],  meaning:"Introspective · dreaming",  particle:"stars" },
  { id:"haze",    label:"Haze",      Icon:HazeIcon,    bg:["#1a0a00","#301800","#7a4a00"],  meaning:"Overwhelmed · heavy · dull",particle:"none" },
];

/* ─── SKY GRADIENT from active elements ─── */
const getSky = (elements) => {
  if (!elements.length) return { top:"#0d1117", mid:"#161b27", bot:"#1f2b40" };
  const last = elements[elements.length - 1];
  const el = ELEMENTS.find(e => e.id === last.id);
  return el ? { top: el.bg[0], mid: el.bg[1], bot: el.bg[2] } : { top:"#0d1117", mid:"#161b27", bot:"#1f2b40" };
};

/* ─── PARTICLE SYSTEMS ─── */
function Particles({ elements }) {
  const types = elements.map(e => e.particle || "none");
  const hasRain = types.includes("rain");
  const hasSnow = types.includes("snow");
  const hasLightning = types.includes("lightning");
  const hasStars = types.includes("stars");
  const hasGlow = types.includes("glow");
  const hasWind = types.includes("wind");

  const rainDrops = useMemo(() => Array.from({length:40},(_,i)=>({
    id:i, left:`${Math.random()*110-5}%`,
    delay:`${Math.random()*1.5}s`, dur:`${0.5+Math.random()*0.4}s`,
    opacity: 0.4+Math.random()*0.5
  })),[]);

  const snowFlakes = useMemo(() => Array.from({length:30},(_,i)=>({
    id:i, left:`${Math.random()*100}%`, size: 2+Math.random()*4,
    delay:`${Math.random()*4}s`, dur:`${3+Math.random()*3}s`,
    drift: (Math.random()-0.5)*40
  })),[]);

  const stars = useMemo(() => Array.from({length:60},(_,i)=>({
    id:i, left:`${Math.random()*100}%`, top:`${Math.random()*70}%`,
    size: 1+Math.random()*2.5, delay:`${Math.random()*3}s`
  })),[]);

  const windStreaks = useMemo(() => Array.from({length:12},(_,i)=>({
    id:i, top:`${10+Math.random()*80}%`, width:`${30+Math.random()*50}%`,
    delay:`${Math.random()*2}s`, dur:`${1.5+Math.random()}s`, opacity:0.1+Math.random()*0.2
  })),[]);

  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
      {hasGlow && (
        <div style={{
          position:"absolute", top:"10%", left:"20%",
          width:200, height:200,
          background:"radial-gradient(circle, rgba(255,180,50,0.18) 0%, transparent 70%)",
          animation:"glow-pulse 3s ease-in-out infinite",
          borderRadius:"50%"
        }}/>
      )}
      {hasStars && stars.map(s=>(
        <div key={s.id} style={{
          position:"absolute", left:s.left, top:s.top,
          width:s.size, height:s.size, borderRadius:"50%",
          background:"white", opacity:0.7,
          animation:`star-twinkle ${1.5+Math.random()*2}s ease-in-out ${s.delay} infinite alternate`
        }}/>
      ))}
      {hasRain && rainDrops.map(d=>(
        <div key={d.id} style={{
          position:"absolute", left:d.left, top:-20,
          width:1.5, height:18, borderRadius:2,
          background:"linear-gradient(180deg, transparent, rgba(130,190,255,0.8))",
          animation:`rain-fall ${d.dur} linear ${d.delay} infinite`,
          opacity:d.opacity
        }}/>
      ))}
      {hasSnow && snowFlakes.map(f=>(
        <div key={f.id} style={{
          position:"absolute", left:f.left, top:-10,
          width:f.size, height:f.size, borderRadius:"50%",
          background:"rgba(220,240,255,0.9)",
          animation:`snow-fall ${f.dur} ease-in ${f.delay} infinite`,
          filter:"blur(0.3px)"
        }}/>
      ))}
      {hasLightning && (
        <div style={{
          position:"absolute", inset:0,
          animation:"lightning-flash 5s ease-in-out infinite",
          background:"rgba(200,200,255,0)",
        }}/>
      )}
      {hasWind && windStreaks.map(w=>(
        <div key={w.id} style={{
          position:"absolute", top:w.top, left:"-10%",
          width:w.width, height:1.5, borderRadius:2,
          background:"linear-gradient(90deg, transparent, rgba(144,220,220,0.5), transparent)",
          animation:`wind-streak ${w.dur} ease-in-out ${w.delay} infinite`,
          opacity:w.opacity
        }}/>
      ))}
    </div>
  );
}

/* ─── DRAGGABLE WEATHER ELEMENT ─── */
function WeatherPiece({ el, onRemove }) {
  const [pos, setPos] = useState({ x: el.x, y: el.y });
  const dragging = useRef(false);
  const offset = useRef({x:0,y:0});
  const elRef = useRef(null);
  const El = ELEMENTS.find(e=>e.id===el.id);

  const onMouseDown = (e) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    e.preventDefault();
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;
      setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, []);

  return (
    <div
      ref={elRef}
      onMouseDown={onMouseDown}
      onDoubleClick={() => onRemove(el.uid)}
      title="Double-click to remove"
      style={{
        position:"absolute", left:pos.x, top:pos.y,
        cursor:"grab", userSelect:"none",
        animation:`float-piece-${el.uid%4} ${3.5+(el.uid%3)*0.8}s ease-in-out infinite`,
        filter:"drop-shadow(0 6px 20px rgba(0,0,0,0.35))",
        transition:"filter 0.2s",
        zIndex:20,
      }}
    >
      {El && <El.Icon size={60} glow />}
    </div>
  );
}

/* ─── WEEK STRIP ─── */
const MOCK_HISTORY = (() => {
  const h = {};
  const today = new Date();
  const patterns = [["sun"],["cloud","rain"],["storm"],["fog"],["snow"],["sun","rainbow"],[]];
  for (let i=6;i>=0;i--) {
    const d = new Date(today); d.setDate(d.getDate()-i);
    const key = d.toISOString().split("T")[0];
    h[key] = { elements: patterns[6-i].map(id=>ELEMENTS.find(e=>e.id===id)).filter(Boolean) };
  }
  return h;
})();

function WeekDay({ entry, label, isToday }) {
  const sky = getSky(entry?.elements || []);
  const dominant = entry?.elements?.[0];
  const El = dominant ? ELEMENTS.find(e=>e.id===dominant.id) : null;
  return (
    <div style={{
      flex:1, borderRadius:16, overflow:"hidden",
      border: isToday ? "1.5px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.07)",
      boxShadow: isToday ? "0 0 20px rgba(255,255,255,0.05)" : "none",
    }}>
      <div style={{
        height:64,
        background:`linear-gradient(180deg, ${sky.top} 0%, ${sky.bot} 100%)`,
        position:"relative", overflow:"hidden", transition:"background 0.8s ease",
        display:"flex", alignItems:"center", justifyContent:"center",
      }}>
        {El && <div style={{opacity:0.85, transform:"scale(0.55)", transformOrigin:"center"}}><El.Icon size={60}/></div>}
        {!El && <div style={{opacity:0.15, fontSize:12, color:"white", fontFamily:"'Outfit',sans-serif"}}>—</div>}
      </div>
      <div style={{
        padding:"5px 0", textAlign:"center",
        fontFamily:"'Outfit',sans-serif", fontSize:10, letterSpacing:"0.15em",
        color: isToday ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
        background:"rgba(0,0,0,0.4)",
        fontWeight: isToday ? 400 : 200,
      }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function MoodWeather() {
  const [pieces, setPieces] = useState([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [activeEl, setActiveEl] = useState(null);
  const canvasRef = useRef(null);
  const uid = useRef(0);

  const sky = getSky(pieces);

  const addElement = (el) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = 40 + Math.random() * (rect.width - 140);
    const y = 30 + Math.random() * (rect.height - 120);
    setPieces(prev => [...prev, { ...el, x, y, uid: uid.current++ }]);
    setSaved(false);
  };

  const removeElement = useCallback((id) => {
    setPieces(prev => prev.filter(p => p.uid !== id));
  }, []);

  const dominant = pieces.length > 0
    ? ELEMENTS.find(e => e.id === pieces.reduce((acc, p) => {
        acc[p.id] = (acc[p.id]||0)+1; return acc;
      }, {})[Object.keys(pieces.reduce((acc,p)=>{acc[p.id]=(acc[p.id]||0)+1;return acc},{})).sort((a,b)=>pieces.filter(p=>p.id===b).length-pieces.filter(p=>p.id===a).length)[0]])
    : null;

  const today = new Date();
  const weekDays = Array.from({length:7},(_,i)=>{
    const d = new Date(today); d.setDate(d.getDate()-(6-i));
    return { key:d.toISOString().split("T")[0], label:["SUN","MON","TUE","WED","THU","FRI","SAT"][d.getDay()], isToday:i===6 };
  });

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#080c14;color:#fff;min-height:100vh;overflow-x:hidden;}
        ::selection{background:rgba(180,220,255,0.2);}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px;}

        @keyframes rain-fall{
          0%{transform:translateY(0) rotate(8deg);opacity:0;}
          8%{opacity:1;}
          100%{transform:translateY(430px) rotate(8deg);opacity:0;}
        }
        @keyframes snow-fall{
          0%{transform:translateY(0) translateX(0);opacity:0;}
          10%{opacity:0.9;}
          90%{opacity:0.7;}
          100%{transform:translateY(420px) translateX(30px);opacity:0;}
        }
        @keyframes lightning-flash{
          0%,88%,92%,96%,100%{background:rgba(180,180,255,0);}
          89%{background:rgba(180,180,255,0.12);}
          90%{background:rgba(180,180,255,0.06);}
          94%{background:rgba(180,180,255,0.08);}
        }
        @keyframes wind-streak{
          0%{transform:translateX(-120%);}
          100%{transform:translateX(200%);}
        }
        @keyframes star-twinkle{
          from{opacity:0.15;transform:scale(0.7);}
          to{opacity:0.9;transform:scale(1.3);}
        }
        @keyframes glow-pulse{
          0%,100%{transform:scale(1);opacity:0.8;}
          50%{transform:scale(1.3);opacity:1;}
        }
        @keyframes float-piece-0{0%,100%{transform:translateY(0px);}50%{transform:translateY(-10px);}}
        @keyframes float-piece-1{0%,100%{transform:translateY(0px) rotate(-1deg);}50%{transform:translateY(-14px) rotate(1deg);}}
        @keyframes float-piece-2{0%,100%{transform:translateY(0px) translateX(0);}50%{transform:translateY(-8px) translateX(5px);}}
        @keyframes float-piece-3{0%,100%{transform:translateY(0px) rotate(1deg);}50%{transform:translateY(-12px) rotate(-1deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:none;}}
        @keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}

        .palette-btn{
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          cursor:pointer;
        }
        .palette-btn:hover{
          transform:translateY(-4px) scale(1.05);
          background:rgba(255,255,255,0.09) !important;
        }
        textarea:focus{outline:none;}
        textarea::placeholder{color:rgba(255,255,255,0.2);}
      `}</style>

      <div style={{
        maxWidth:820, margin:"0 auto", padding:"48px 24px 100px",
        animation:"fadeUp 0.9s ease both"
      }}>

        {/* HEADER */}
        <div style={{textAlign:"center", marginBottom:44}}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            fontFamily:"'Outfit',sans-serif", fontWeight:200,
            fontSize:11, letterSpacing:"0.35em", color:"rgba(255,255,255,0.3)",
            marginBottom:16, textTransform:"uppercase"
          }}>
            <span style={{
              width:6, height:6, borderRadius:"50%", background:"#90D8C8",
              animation:"pulse-dot 2.5s ease-in-out infinite", display:"inline-block"
            }}/>
            Mood Weather
          </div>
          <h1 style={{
            fontFamily:"'Cormorant Garamond',serif", fontWeight:300,
            fontSize:"clamp(38px, 6vw, 62px)", lineHeight:1.05,
            letterSpacing:"-0.01em", color:"rgba(255,255,255,0.92)",
          }}>
            How's your sky<br/>
            <em style={{fontStyle:"italic", color:"rgba(255,255,255,0.5)"}}>today?</em>
          </h1>
          <p style={{
            marginTop:14, fontFamily:"'Outfit',sans-serif", fontWeight:200,
            fontSize:14, color:"rgba(255,255,255,0.3)", letterSpacing:"0.04em"
          }}>
            No sliders. No numbers. Just weather.
          </p>
        </div>

        {/* SKY CANVAS */}
        <div
          ref={canvasRef}
          style={{
            position:"relative", width:"100%", height:340,
            borderRadius:28, overflow:"hidden", marginBottom:20,
            background:`linear-gradient(180deg, ${sky.top} 0%, ${sky.mid} 55%, ${sky.bot} 100%)`,
            transition:"background 1.8s cubic-bezier(0.25,0.46,0.45,0.94)",
            boxShadow:"0 2px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            border:"1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Particles elements={pieces}/>

          {pieces.length === 0 && (
            <div style={{
              position:"absolute", inset:0, display:"flex",
              flexDirection:"column", alignItems:"center", justifyContent:"center",
              pointerEvents:"none", gap:12,
            }}>
              <div style={{
                fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                fontSize:20, color:"rgba(255,255,255,0.18)", fontWeight:300,
              }}>
                your sky is empty
              </div>
              <div style={{
                fontFamily:"'Outfit',sans-serif", fontWeight:200,
                fontSize:12, color:"rgba(255,255,255,0.12)", letterSpacing:"0.12em"
              }}>
                ADD WEATHER BELOW
              </div>
            </div>
          )}

          {pieces.map(p => <WeatherPiece key={p.uid} el={p} onRemove={removeElement}/>)}

          {/* corner hint */}
          {pieces.length > 0 && (
            <div style={{
              position:"absolute", bottom:12, right:16,
              fontFamily:"'Outfit',sans-serif", fontWeight:200,
              fontSize:10, color:"rgba(255,255,255,0.2)", letterSpacing:"0.1em"
            }}>
              DOUBLE-CLICK TO REMOVE
            </div>
          )}
        </div>

        {/* DOMINANT MOOD READING */}
        {dominant && (
          <div style={{
            marginBottom:20, padding:"14px 20px",
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:16, display:"flex", alignItems:"center", gap:14,
            animation:"fadeUp 0.4s ease both",
          }}>
            <div style={{flexShrink:0, transform:"scale(0.65)", transformOrigin:"left center", width:42}}>
              <dominant.Icon size={60}/>
            </div>
            <div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:200,fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,0.3)",marginBottom:4}}>
                DOMINANT WEATHER
              </div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:400}}>
                {dominant.label}
                <span style={{color:"rgba(255,255,255,0.4)",fontStyle:"italic",fontWeight:300,marginLeft:10}}>
                  — {dominant.meaning}
                </span>
              </div>
            </div>
            <div style={{marginLeft:"auto",fontFamily:"'Outfit',sans-serif",fontWeight:200,fontSize:11,color:"rgba(255,255,255,0.2)"}}>
              {pieces.length} piece{pieces.length!==1?"s":""}
            </div>
          </div>
        )}

        {/* WEATHER PALETTE */}
        <div style={{marginBottom:32}}>
          <div style={{
            fontFamily:"'Outfit',sans-serif", fontWeight:200,
            fontSize:10, letterSpacing:"0.25em", color:"rgba(255,255,255,0.25)",
            marginBottom:14, textTransform:"uppercase"
          }}>
            Place in your sky
          </div>
          <div style={{display:"flex", flexWrap:"wrap", gap:10}}>
            {ELEMENTS.map(el => {
              const isHov = hovered === el.id;
              return (
                <button
                  key={el.id}
                  className="palette-btn"
                  onClick={() => addElement(el)}
                  onMouseEnter={() => setHovered(el.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isHov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                    border:`1px solid ${isHov ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)"}`,
                    borderRadius:14, padding:"10px 16px",
                    display:"flex", alignItems:"center", gap:10,
                    color:"#fff", flexDirection:"column",
                    minWidth:80,
                    boxShadow: isHov ? "0 8px 30px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  <div style={{transform:"scale(0.7)", transformOrigin:"center", height:42, width:42, display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <el.Icon size={60}/>
                  </div>
                  <span style={{
                    fontFamily:"'Outfit',sans-serif", fontWeight:300,
                    fontSize:11, color:"rgba(255,255,255,0.55)",
                    letterSpacing:"0.06em"
                  }}>
                    {el.label}
                  </span>
                </button>
              );
            })}
          </div>
          {hovered && (
            <div style={{
              marginTop:10, fontFamily:"'Cormorant Garamond',serif",
              fontStyle:"italic", fontSize:14,
              color:"rgba(255,255,255,0.3)", transition:"opacity 0.2s"
            }}>
              {ELEMENTS.find(e=>e.id===hovered)?.meaning}
            </div>
          )}
        </div>

        {/* NOTE */}
        <div style={{marginBottom:24}}>
          <div style={{
            fontFamily:"'Outfit',sans-serif", fontWeight:200,
            fontSize:10, letterSpacing:"0.25em", color:"rgba(255,255,255,0.25)",
            marginBottom:10, textTransform:"uppercase"
          }}>
            A word to yourself
          </div>
          <textarea
            value={note}
            onChange={e=>{setNote(e.target.value);setSaved(false);}}
            placeholder="what's making this weather…"
            rows={3}
            style={{
              width:"100%",
              background:"rgba(255,255,255,0.025)",
              border:"1px solid rgba(255,255,255,0.08)",
              borderRadius:16, padding:"16px 18px",
              color:"rgba(255,255,255,0.7)",
              fontFamily:"'Cormorant Garamond',serif",
              fontStyle:"italic", fontWeight:300, fontSize:17,
              resize:"none", lineHeight:1.7,
              transition:"border-color 0.2s",
            }}
            onFocus={e=>e.target.style.borderColor="rgba(255,255,255,0.2)"}
            onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.08)"}
          />
        </div>

        {/* SAVE */}
        <div style={{display:"flex", justifyContent:"flex-end", marginBottom:52}}>
          <button
            onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);}}
            style={{
              background: saved ? "rgba(100,220,160,0.1)" : "rgba(255,255,255,0.06)",
              border:`1px solid ${saved ? "rgba(100,220,160,0.35)" : "rgba(255,255,255,0.12)"}`,
              color: saved ? "#78DFA0" : "rgba(255,255,255,0.55)",
              fontFamily:"'Outfit',sans-serif", fontWeight:300,
              fontSize:12, letterSpacing:"0.2em",
              padding:"12px 28px", borderRadius:10, cursor:"pointer",
              transition:"all 0.35s ease", textTransform:"uppercase",
            }}
          >
            {saved ? "✓  Logged" : "Log today's weather"}
          </button>
        </div>

        {/* WEEK STRIP */}
        <div>
          <div style={{
            fontFamily:"'Outfit',sans-serif", fontWeight:200,
            fontSize:10, letterSpacing:"0.25em", color:"rgba(255,255,255,0.25)",
            marginBottom:14, textTransform:"uppercase"
          }}>
            Your week's climate
          </div>
          <div style={{display:"flex", gap:8}}>
            {weekDays.map(({key,label,isToday})=>(
              <WeekDay key={key} entry={MOCK_HISTORY[key]} label={label} isToday={isToday}/>
            ))}
          </div>
        </div>

        {/* FOOTER QUOTE */}
        <div style={{
          marginTop:52, textAlign:"center",
          fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
          fontWeight:300, fontSize:16,
          color:"rgba(255,255,255,0.18)", lineHeight:1.9,
        }}>
          "We don't always have words for how we feel.<br/>
          But we always know if it's raining inside."
        </div>

      </div>
    </>
  );
}
