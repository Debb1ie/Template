import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Work", "About", "Skills", "Contact"];

const PROJECTS = [
  {
    id: 1,
    title: "Orbital Analytics",
    tag: "Dashboard · SaaS",
    year: "2024",
    desc: "Real-time data visualization platform processing 4M+ events/day with live anomaly detection.",
    accent: "#00FFC2",
    bg: "#0a0f1e",
  },
  {
    id: 2,
    title: "Helio Commerce",
    tag: "E-Commerce · Mobile",
    year: "2024",
    desc: "Full-stack marketplace with AI-powered recommendations driving 38% higher AOV.",
    accent: "#FF6B6B",
    bg: "#1a0a0a",
  },
  {
    id: 3,
    title: "Synapse AI",
    tag: "ML · API",
    year: "2023",
    desc: "Natural language interface that reduced ops team query time from 45 min to under 90 seconds.",
    accent: "#A78BFA",
    bg: "#0d0a1a",
  },
];

const SKILLS = [
  { name: "TypeScript", level: 95 },
  { name: "React / Next.js", level: 93 },
  { name: "Node.js", level: 88 },
  { name: "PostgreSQL", level: 82 },
  { name: "Python / ML", level: 79 },
  { name: "Docker / K8s", level: 74 },
];

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
`;

function useTyping(words, speed = 90, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(word.slice(0, charIdx + 1));
        if (charIdx + 1 === word.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplay(word.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, words, speed, pause]);

  return display;
}

function SkillBar({ name, level, delay }) {
  const [filled, setFilled] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setFilled(level), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [level, delay]);

  return (
    <div ref={ref} style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#ccc", letterSpacing: "0.05em" }}>{name}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#00FFC2" }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${filled}%`,
            background: "linear-gradient(90deg, #00FFC2, #00b4d8)",
            borderRadius: 2,
            transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? project.bg : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? project.accent + "44" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 20,
        padding: "36px 40px",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? `0 24px 60px ${project.accent}18` : "none",
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <span
          style={{
            background: project.accent + "18",
            color: project.accent,
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            padding: "5px 12px",
            borderRadius: 20,
            letterSpacing: "0.08em",
            border: `1px solid ${project.accent}30`,
          }}
        >
          {project.tag}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{project.year}</span>
      </div>
      <h3
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 28,
          fontWeight: 800,
          color: hovered ? project.accent : "#fff",
          marginBottom: 14,
          transition: "color 0.3s ease",
          lineHeight: 1.2,
        }}
      >
        {project.title}
      </h3>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
        {project.desc}
      </p>
      <div
        style={{
          marginTop: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: project.accent,
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          transition: "all 0.3s ease",
        }}
      >
        VIEW CASE STUDY →
      </div>
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const typed = useTyping(["Full-Stack Dev", "React Specialist", "TypeScript Nerd", "UI Craftsperson"]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <style>{FONT}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080c14; color: #fff; }
        ::selection { background: #00FFC244; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080c14; }
        ::-webkit-scrollbar-thumb { background: #00FFC255; border-radius: 2px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 40px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrollY > 40 ? "rgba(8,12,20,0.85)" : "transparent",
          backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
          borderBottom: scrollY > 40 ? "1px solid rgba(255,255,255,0.05)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            color: "#fff",
          }}
          onClick={() => scrollTo("hero")}
        >
          JS<span style={{ color: "#00FFC2" }}>.</span>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link.toLowerCase())}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                cursor: "pointer",
                padding: 0,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#00FFC2")}
              onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.6)")}
            >
              {link.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={() => scrollTo("contact")}
          style={{
            background: "transparent",
            border: "1px solid #00FFC2",
            color: "#00FFC2",
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "9px 20px",
            borderRadius: 6,
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#00FFC2";
            e.target.style.color = "#080c14";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#00FFC2";
          }}
        >
          HIRE ME
        </button>
      </nav>

      {/* HERO */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 40px",
          maxWidth: 1200,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,255,194,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,194,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Glow orb */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-10%",
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(0,255,194,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="fade-up"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: "#00FFC2",
              letterSpacing: "0.2em",
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: "#00FFC2",
                borderRadius: "50%",
                display: "inline-block",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            AVAILABLE FOR WORK
          </div>

          <h1
            className="fade-up"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(52px, 8vw, 108px)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              marginBottom: 24,
              animationDelay: "0.1s",
            }}
          >
            Jordan<br />
            <span style={{ color: "#00FFC2" }}>Silva</span>
          </h1>

          <div
            className="fade-up"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(16px, 2.5vw, 22px)",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 48,
              animationDelay: "0.2s",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
            {typed}
            <span style={{ animation: "pulse 1s step-end infinite", color: "#00FFC2" }}>|</span>
          </div>

          <div className="fade-up" style={{ display: "flex", gap: 16, animationDelay: "0.3s" }}>
            <button
              onClick={() => scrollTo("work")}
              style={{
                background: "#00FFC2",
                color: "#080c14",
                border: "none",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                padding: "16px 36px",
                borderRadius: 8,
                cursor: "pointer",
                letterSpacing: "0.05em",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              VIEW WORK
            </button>
            <button
              onClick={() => scrollTo("about")}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                padding: "16px 36px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.4)";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
                e.target.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              ABOUT ME
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="fade-up"
          style={{
            position: "absolute",
            bottom: 60,
            left: 40,
            display: "flex",
            gap: 60,
            animationDelay: "0.5s",
          }}
        >
          {[["7+", "Years XP"], ["34", "Projects"], ["12", "Happy Clients"]].map(([num, label]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {num}
              </div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 64 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00FFC2", letterSpacing: "0.2em" }}>02</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Selected Work
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 40 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00FFC2", letterSpacing: "0.2em" }}>03</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 4vw, 54px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                About Me
              </h2>
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 24 }}>
              I'm a full-stack engineer who obsesses over the intersection of performance and craft. I write TypeScript by day and argue about design systems by night.
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: 40 }}>
              Previously at Stripe, Vercel, and two YC startups. I believe great software should feel inevitable — like it couldn't have been built any other way.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["GitHub", "LinkedIn", "Dribbble"].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    textDecoration: "none",
                    letterSpacing: "0.1em",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "8px 16px",
                    borderRadius: 6,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "#00FFC2";
                    e.target.style.borderColor = "#00FFC244";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "rgba(255,255,255,0.5)";
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 24,
              padding: 48,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00FFC2, #00b4d8)",
                marginBottom: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              👨‍💻
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Jordan Silva</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00FFC2", letterSpacing: "0.08em", marginBottom: 28 }}>
              San Francisco, CA
            </div>
            {[["⚡", "Open to remote roles"], ["🎯", "TypeScript + React focused"], ["📦", "Loves shipping products"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginBottom: 64 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00FFC2", letterSpacing: "0.2em" }}>04</span>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Tech Stack
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 80px" }}>
          <div>
            {SKILLS.slice(0, 3).map((s, i) => (
              <SkillBar key={s.name} {...s} delay={i * 150} />
            ))}
          </div>
          <div>
            {SKILLS.slice(3).map((s, i) => (
              <SkillBar key={s.name} {...s} delay={i * 150 + 100} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: 64, display: "flex", flexWrap: "wrap", gap: 12 }}>
          {["Next.js", "GraphQL", "tRPC", "Prisma", "Redis", "AWS", "Figma", "Vitest", "Tailwind", "Storybook"].map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "7px 16px",
                borderRadius: 20,
                letterSpacing: "0.08em",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        style={{
          padding: "120px 40px 160px",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse, rgba(0,255,194,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00FFC2", letterSpacing: "0.2em" }}>05 — CONTACT</span>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(42px, 7vw, 90px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "24px 0 20px",
            lineHeight: 1,
          }}
        >
          Let's Build<br />
          <span style={{ color: "#00FFC2" }}>Something</span>
        </h2>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>
          Got a project in mind? I'm all ears.
        </p>
        <a
          href="mailto:jordan@example.com"
          style={{
            display: "inline-block",
            background: "#00FFC2",
            color: "#080c14",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            padding: "20px 52px",
            borderRadius: 10,
            textDecoration: "none",
            letterSpacing: "0.05em",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          SAY HELLO →
        </a>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
          © 2025 JORDAN SILVA
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>
          BUILT WITH REACT + TSX
        </span>
      </footer>
    </>
  );
}
