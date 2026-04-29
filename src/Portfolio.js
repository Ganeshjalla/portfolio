import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:       #0a0f1e;
    --navy2:      #0d1526;
    --navy3:      #111e35;
    --card:       #131f38;
    --card2:      #162240;
    --border:     #1e3055;
    --border2:    #254070;
    --gold:       #f4c542;
    --gold2:      #e6a817;
    --cyan:       #38bdf8;
    --cyan2:      #0ea5e9;
    --silver:     #94a3b8;
    --text:       #e8eef8;
    --muted:      #64748b;
    --display:    'Syne', sans-serif;
    --body:       'Inter', sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--navy); color: var(--text); font-family: var(--body); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  /* subtle grid */
  body::before {
    content: '';
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* orb glows */
  .orb1 {
    position: fixed; top: -180px; right: -180px; width: 500px; height: 500px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%);
    animation: breathe 8s ease-in-out infinite;
  }
  .orb2 {
    position: fixed; bottom: -200px; left: -100px; width: 450px; height: 450px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(244,197,66,0.06) 0%, transparent 70%);
    animation: breathe 8s ease-in-out infinite 4s;
  }
  @keyframes breathe { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.6;transform:scale(1.1);} }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.1rem 5rem;
    background: rgba(10,15,30,0.88);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: var(--display); font-size: 1.35rem; font-weight: 800;
    letter-spacing: -0.02em; color: var(--text);
  }
  .nav-logo span { color: var(--gold); }
  nav ul { list-style: none; display: flex; gap: 2.2rem; }
  nav a {
    color: var(--silver); text-decoration: none; font-size: 0.82rem;
    font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase;
    transition: color .2s; position: relative;
  }
  nav a::after {
    content:''; position:absolute; bottom:-4px; left:0;
    width:0; height:1.5px; background:var(--gold); transition:width .3s;
  }
  nav a:hover { color: var(--gold); }
  nav a:hover::after { width: 100%; }

  /* REVEAL */
  .reveal { opacity:0; transform:translateY(26px); transition:opacity .65s,transform .65s; }
  .reveal.visible { opacity:1; transform:translateY(0); }

  section { position: relative; z-index: 1; }
  .section-inner { max-width: 1080px; margin: 0 auto; padding: 6rem 2rem; }

  .section-eyebrow {
    display: inline-flex; align-items: center; gap: .5rem;
    font-size: 0.7rem; letter-spacing: .18em; text-transform: uppercase;
    color: var(--gold); font-weight: 600; margin-bottom: .9rem;
  }
  .section-eyebrow::before {
    content:''; width:24px; height:1.5px; background:var(--gold); display:inline-block;
  }
  h2 {
    font-family: var(--display);
    font-size: clamp(2rem,5vw,3.5rem); font-weight: 800;
    letter-spacing: -0.03em; line-height: 1.05;
    margin-bottom: 3.5rem; color: var(--text);
  }

  /* HERO */
  .hero-wrap {
    min-height: 100vh; display: grid;
    grid-template-columns: 1fr 340px;
    align-items: center; gap: 3rem;
    padding: 8rem 5rem 4rem;
    max-width: 1280px; margin: 0 auto;
    position: relative; z-index: 1;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: .6rem;
    background: rgba(244,197,66,0.1); border: 1px solid rgba(244,197,66,0.3);
    padding: .38rem 1rem; border-radius: 100px;
    font-size: .75rem; font-weight: 600; color: var(--gold);
    letter-spacing: .06em; text-transform: uppercase;
    margin-bottom: 1.6rem;
    opacity:0; animation: fadeUp .6s .2s forwards;
  }
  .hero-badge-dot { width:7px;height:7px;border-radius:50%;background:var(--gold);animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(244,197,66,.5);} 50%{box-shadow:0 0 0 6px rgba(244,197,66,0);} }

  .hero h1 {
    font-family: var(--display);
    font-size: clamp(3.5rem,8vw,7.5rem); font-weight: 800;
    letter-spacing: -.04em; line-height: .9; margin-bottom: 1.6rem;
    opacity:0; animation: fadeUp .7s .4s forwards;
  }
  .hero h1 .name-accent {
    display: block;
    -webkit-text-stroke: 2px var(--gold);
    color: transparent;
  }
  .hero-sub {
    font-size: 1rem; line-height: 1.8; color: var(--silver);
    max-width: 480px; margin-bottom: 2.5rem;
    opacity:0; animation: fadeUp .7s .6s forwards;
  }
  .hero-cta {
    display: flex; gap: 1rem; flex-wrap: wrap;
    opacity:0; animation: fadeUp .7s .8s forwards;
  }
  .btn-gold {
    display: inline-flex; align-items: center; gap:.5rem;
    background: var(--gold); color: var(--navy);
    padding: .85rem 2rem; border-radius: 6px;
    font-weight: 700; font-size: .85rem; letter-spacing:.05em;
    text-transform: uppercase; text-decoration: none; border:none; cursor:pointer;
    transition: all .2s;
  }
  .btn-gold:hover { background: var(--gold2); transform:translateY(-2px); box-shadow: 0 10px 28px rgba(244,197,66,.25); }
  .btn-ghost {
    display: inline-flex; align-items: center; gap:.5rem;
    border: 1.5px solid var(--border2); color: var(--text);
    padding: .85rem 2rem; border-radius: 6px;
    font-weight: 600; font-size: .85rem; letter-spacing:.05em;
    text-transform: uppercase; text-decoration: none; cursor:pointer;
    background: transparent; transition: all .2s;
  }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); transform:translateY(-2px); }

  /* HERO CARD */
  .hero-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 18px; padding: 2rem;
    box-shadow: 0 24px 60px rgba(0,0,0,.5);
    opacity:0; animation: fadeIn .8s 1.1s forwards;
    position: relative; overflow: hidden;
  }
  .hero-card::before {
    content:''; position:absolute; top:0;left:0;right:0; height:2px;
    background: linear-gradient(90deg, var(--gold), var(--cyan));
  }
  .avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--cyan2) 100%);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--display); font-size: 1.6rem; font-weight: 800; color: var(--navy);
    margin-bottom: 1rem; box-shadow: 0 0 0 4px rgba(244,197,66,.15);
  }
  .card-name { font-family: var(--display); font-size: 1.1rem; font-weight: 800; margin-bottom: .2rem; }
  .card-role { font-size: .75rem; color: var(--silver); letter-spacing:.06em; text-transform:uppercase; margin-bottom:1.2rem; }
  .card-divider { height:1px; background:var(--border); margin:.9rem 0; }
  .stat-row { display:grid; grid-template-columns:1fr 1fr; gap:.7rem; margin-bottom:.7rem; }
  .stat-box { background:var(--navy3); border:1px solid var(--border); border-radius:10px; padding:.9rem; text-align:center; }
  .stat-n { font-family:var(--display); font-size:1.6rem; font-weight:800; color:var(--gold); line-height:1; }
  .stat-l { font-size:.65rem; color:var(--silver); text-transform:uppercase; letter-spacing:.08em; margin-top:.25rem; }
  .card-chips { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:1rem; }
  .chip {
    padding:.28rem .65rem; border-radius:100px;
    background:rgba(56,189,248,.08); border:1px solid rgba(56,189,248,.2);
    font-size:.7rem; font-weight:600; color:var(--cyan);
  }
  .progress-wrap { background:var(--navy3); border:1px solid var(--border); border-radius:10px; padding:.9rem; margin-top:.7rem; }
  .progress-label { font-size:.65rem; color:var(--silver); text-transform:uppercase; letter-spacing:.08em; margin-bottom:.5rem; }
  .progress-bar { height:5px; background:var(--border); border-radius:10px; overflow:hidden; margin-bottom:.4rem; }
  .progress-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--cyan)); border-radius:10px; transition:width .05s; }
  .progress-val { font-size:.8rem; font-weight:700; color:var(--gold); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }

  /* SKILLS */
  .skills-bg { background: var(--navy2); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .skills-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:1.2rem; }
  .skill-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:14px; padding:1.75rem; transition:all .25s; position:relative; overflow:hidden;
  }
  .skill-card::after {
    content:''; position:absolute; top:0;left:0;right:0; height:2px;
    background:linear-gradient(90deg,var(--gold),var(--cyan));
    transform:scaleX(0); transform-origin:left; transition:transform .3s;
    border-radius:14px 14px 0 0;
  }
  .skill-card:hover { border-color:var(--border2); transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.4); }
  .skill-card:hover::after { transform:scaleX(1); }
  .skill-icon { font-size:1.8rem; margin-bottom:1rem; }
  .skill-title { font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:var(--silver); margin-bottom:.85rem; font-weight:600; }
  .tags { display:flex; flex-wrap:wrap; gap:.45rem; }
  .tag {
    padding:.3rem .75rem; border-radius:100px; font-size:.74rem; font-weight:500;
    transition:all .15s;
  }
  .tag.gold { background:rgba(244,197,66,.1); border:1px solid rgba(244,197,66,.25); color:var(--gold); }
  .tag.cyan { background:rgba(56,189,248,.08); border:1px solid rgba(56,189,248,.2); color:var(--cyan); }
  .tag.silver { background:rgba(148,163,184,.08); border:1px solid rgba(148,163,184,.18); color:var(--silver); }
  .tag.gold:hover { background:rgba(244,197,66,.2); }
  .tag.cyan:hover { background:rgba(56,189,248,.16); }

  /* PROJECTS */
  .projects-grid { display:flex; flex-direction:column; gap:1.6rem; }
  .project-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:16px; padding:2.25rem 2.5rem;
    display:grid; grid-template-columns:1fr auto;
    gap:2rem; align-items:start;
    transition:all .25s; position:relative; overflow:hidden;
  }
  .project-card::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    background:linear-gradient(180deg,var(--gold),var(--cyan));
    border-radius:16px 0 0 16px;
    transform:scaleY(0); transform-origin:top; transition:transform .35s;
  }
  .project-card:hover { border-color:var(--border2); box-shadow:0 20px 50px rgba(0,0,0,.5); transform:translateX(4px); }
  .project-card:hover::before { transform:scaleY(1); }
  .proj-num {
    display:inline-flex; align-items:center; justify-content:center;
    width:2rem; height:2rem; border-radius:8px;
    background:rgba(244,197,66,.1); border:1px solid rgba(244,197,66,.25);
    font-size:.72rem; font-weight:700; color:var(--gold); margin-bottom:.9rem;
  }
  .proj-title { font-family:var(--display); font-size:1.5rem; font-weight:800; margin-bottom:1rem; color:var(--text); }
  .proj-bullets { list-style:none; margin-bottom:1.25rem; }
  .proj-bullets li {
    color:var(--silver); font-size:.88rem; line-height:1.65;
    padding-left:1.3rem; position:relative; margin-bottom:.4rem;
  }
  .proj-bullets li::before { content:'▹'; position:absolute; left:0; color:var(--gold); font-size:.7rem; top:.35rem; }
  .proj-year { font-size:.75rem; color:var(--muted); white-space:nowrap; }

  /* EDUCATION */
  .edu-bg { background:var(--navy2); border-top:1px solid var(--border); }
  .edu-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; margin-bottom:3.5rem; }
  .edu-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:14px; padding:2rem; transition:all .25s; position:relative; overflow:hidden;
  }
  .edu-card::before {
    content:''; position:absolute; top:0;left:0;right:0; height:2px;
    background:linear-gradient(90deg,var(--gold),var(--cyan));
  }
  .edu-card:hover { border-color:var(--border2); transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.4); }
  .edu-year { font-size:.7rem; color:var(--gold); font-weight:600; letter-spacing:.1em; text-transform:uppercase; margin-bottom:.6rem; }
  .edu-school { font-family:var(--display); font-size:1.1rem; font-weight:800; margin-bottom:.3rem; }
  .edu-degree { font-size:.86rem; color:var(--silver); margin-bottom:.9rem; }
  .edu-badge {
    display:inline-flex; padding:.3rem .85rem; border-radius:100px;
    background:rgba(244,197,66,.1); border:1px solid rgba(244,197,66,.25);
    font-size:.76rem; font-weight:600; color:var(--gold);
  }
  .certs-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1rem; }
  .cert-card {
    background:var(--card); border:1px solid var(--border);
    border-radius:12px; padding:1.35rem;
    display:flex; align-items:flex-start; gap:1rem; transition:all .25s;
  }
  .cert-card:hover { border-color:rgba(56,189,248,.3); transform:translateY(-3px); box-shadow:0 10px 28px rgba(0,0,0,.4); }
  .cert-icon {
    width:42px; height:42px; border-radius:10px; flex-shrink:0;
    background:rgba(56,189,248,.08); border:1px solid rgba(56,189,248,.15);
    display:flex; align-items:center; justify-content:center; font-size:1.25rem;
  }
  .cert-name { font-size:.87rem; font-weight:600; line-height:1.4; margin-bottom:.2rem; }
  .cert-issuer { font-size:.73rem; color:var(--silver); }

  /* CONTACT */
  .contact-bg { border-top:1px solid var(--border); }
  .contact-wrap {
    max-width:1080px; margin:0 auto; padding:6rem 2rem;
    display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:start;
  }
  .contact-headline {
    font-family:var(--display); font-size:clamp(2.5rem,6vw,4.5rem);
    font-weight:800; letter-spacing:-.04em; line-height:.95; margin-bottom:1.25rem;
  }
  .contact-headline em { font-style:normal; color:var(--gold); }
  .contact-sub { color:var(--silver); line-height:1.75; margin-bottom:2rem; font-size:.93rem; }
  .contact-links { display:flex; flex-direction:column; gap:.8rem; }
  .c-link {
    display:flex; align-items:center; gap:1rem;
    color:var(--text); text-decoration:none; font-size:.88rem; font-weight:500;
    padding:.95rem 1.25rem; background:var(--card);
    border:1px solid var(--border); border-radius:10px; transition:all .2s;
  }
  .c-link:hover { border-color:rgba(244,197,66,.4); color:var(--gold); transform:translateX(4px); box-shadow:0 4px 20px rgba(0,0,0,.4); }
  .c-icon {
    width:36px;height:36px;border-radius:8px;flex-shrink:0;
    background:rgba(244,197,66,.08);border:1px solid rgba(244,197,66,.2);
    display:flex;align-items:center;justify-content:center;font-size:.95rem;
  }
  .info-panel {
    background:var(--card); border:1px solid var(--border);
    border-radius:16px; overflow:hidden;
    box-shadow:0 12px 40px rgba(0,0,0,.4);
  }
  .info-panel-header {
    padding:1.25rem 1.75rem;
    background:linear-gradient(135deg,rgba(244,197,66,.12),rgba(56,189,248,.08));
    border-bottom:1px solid var(--border);
    font-family:var(--display); font-size:.95rem; font-weight:800;
    display:flex; align-items:center; gap:.6rem;
  }
  .info-panel-header span { color:var(--gold); }
  .info-rows { padding:1.25rem 1.75rem; }
  .info-row { display:flex; justify-content:space-between; align-items:center; padding:.65rem 0; border-bottom:1px solid var(--border); font-size:.85rem; }
  .info-row:last-child { border-bottom:none; }
  .i-label { color:var(--silver); font-weight:400; }
  .i-val { color:var(--text); font-weight:600; }
  .status-dot { display:inline-block; width:7px;height:7px;border-radius:50%; background:#22c55e; margin-right:.4rem; animation:pulse2 2s infinite; }
  @keyframes pulse2 { 0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.5);} 50%{box-shadow:0 0 0 5px rgba(34,197,94,0);} }

  footer {
    text-align:center; padding:2rem;
    border-top:1px solid var(--border);
    font-size:.76rem; color:var(--muted); position:relative; z-index:1;
  }
  footer span { color:var(--gold); font-weight:600; }

  @media (max-width:768px) {
    nav { padding:1rem 1.5rem; }
    nav ul { display:none; }
    .hero-wrap { grid-template-columns:1fr; padding:6rem 1.5rem 3rem; }
    .hero-card { display:none; }
    .section-inner { padding:4rem 1.5rem; }
    .edu-grid { grid-template-columns:1fr; }
    .project-card { grid-template-columns:1fr; }
    .contact-wrap { grid-template-columns:1fr; gap:3rem; }
  }
`;

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const skills = [
  { icon: "⚡", title: "Languages", tags: [["Java","gold"],["Python","gold"],["C","gold"]] },
  { icon: "🏗️", title: "Frameworks", tags: [["Spring","cyan"],["Spring Boot","cyan"]] },
  { icon: "☁️", title: "Cloud & Databases", tags: [["AWS","gold"],["Microsoft Azure","gold"],["MySQL","silver"],["SQLite","silver"]] },
  { icon: "🧩", title: "Concepts", tags: [["DSA","cyan"],["OOP","silver"],["REST APIs","cyan"],["System Design","silver"]] },
];

const projects = [
  {
    num:"01", title:"SGnexasoft", year:"2026 – Present",
    bullets:["Built a freelance platform to manage projects from posting to completion.","Created role-based dashboards for different users with secure access.","Added features for project tracking, progress updates, and payments."],
    tags:[["Spring Boot","cyan"],["MySQL","silver"],["AWS","gold"],["REST API","cyan"]],
  },
  {
    num:"02", title:"Bank Fraud Detection System", year:"2025 – 2026",
    bullets:["Designed a fraud detection system to analyze banking transactions and flag suspicious activities.","Used hash tables, trees, and heaps for optimized lookup and risk scoring.","Applied graph-based analysis to detect abnormal patterns."],
    tags:[["Java","gold"],["DSA","cyan"],["Graph Algorithms","silver"],["System Design","gold"]],
  },
  {
    num:"03", title:"AI-Powered Chatbot", year:"2025",
    bullets:["Developed an intent-based chatbot using Python.","Implemented intent recognition and response generation.","Built user interface using Streamlit and integrated APIs."],
    tags:[["Python","gold"],["Streamlit","cyan"],["NLP","silver"],["API Integration","cyan"]],
  },
];

const certs = [
  { icon:"🏦", name:"Software Engineering Virtual Experience", issuer:"JPMorgan Chase & Co. (Forage)" },
  { icon:"📊", name:"Oracle Analytics Cloud", issuer:"Oracle" },
  { icon:"🤖", name:"Generative AI", issuer:"Microsoft & LinkedIn" },
];

export default function Portfolio() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(t); return 100; } return p + 2; }), 18);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <style>{style}</style>
      <div className="orb1" /><div className="orb2" />

      {/* NAV */}
      <nav>
        <div className="nav-logo">G<span>J</span></div>
        <ul>
          {["About","Skills","Projects","Education","Contact"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
      </nav>

      {/* HERO */}
      <div id="about" style={{ position:"relative", zIndex:1 }}>
        <div className="hero-wrap">
          <div>
            <div className="hero-badge"><span className="hero-badge-dot" /> Available for Opportunities</div>
            <h1>Ganesh<br /><span className="name-accent">Jalla</span></h1>
            <p className="hero-sub">Software developer with strong foundations in Data Structures & Algorithms, backend development, and cloud deployment. Building scalable systems with Java, Python, Spring Boot & AWS.</p>
            <div className="hero-cta">
              <a href="#projects" className="btn-gold">View Projects →</a>
              <a href="#contact" className="btn-ghost">Contact Me</a>
            </div>
          </div>

          <div className="hero-card">
            <div className="avatar">GJ</div>
            <div className="card-name">Ganesh Jalla</div>
            <div className="card-role">Aspiring Software Developer</div>
            <div className="card-divider" />
            <div className="stat-row">
              <div className="stat-box"><div className="stat-n">3+</div><div className="stat-l">Projects</div></div>
              <div className="stat-box"><div className="stat-n">7.32</div><div className="stat-l">CGPA</div></div>
            </div>
            <div className="progress-wrap">
              <div className="progress-label">Profile Strength</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${pct}%` }} /></div>
              <div className="progress-val">{pct}%</div>
            </div>
            <div className="card-chips">
              {["Java","Python","AWS","Spring Boot","MySQL","DSA"].map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <section className="skills-bg" id="skills">
        <div className="section-inner">
          <Reveal><div className="section-eyebrow">Technical Arsenal</div><h2>Skills & Technologies</h2></Reveal>
          <div className="skills-grid">
            {skills.map((s,i) => (
              <Reveal key={s.title} delay={i*80}>
                <div className="skill-card">
                  <div className="skill-icon">{s.icon}</div>
                  <div className="skill-title">{s.title}</div>
                  <div className="tags">{s.tags.map(([t,v]) => <span key={t} className={`tag ${v}`}>{t}</span>)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="section-inner">
          <Reveal><div className="section-eyebrow">Selected Work</div><h2>Featured Projects</h2></Reveal>
          <div className="projects-grid">
            {projects.map((p,i) => (
              <Reveal key={p.num} delay={i*90}>
                <div className="project-card">
                  <div>
                    <div className="proj-num">{p.num}</div>
                    <div className="proj-title">{p.title}</div>
                    <ul className="proj-bullets">{p.bullets.map((b,j) => <li key={j}>{b}</li>)}</ul>
                    <div className="tags">{p.tags.map(([t,v]) => <span key={t} className={`tag ${v}`}>{t}</span>)}</div>
                  </div>
                  <div className="proj-year">{p.year}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="edu-bg" id="education">
        <div className="section-inner">
          <Reveal><div className="section-eyebrow">Academic Journey</div><h2>Education</h2></Reveal>
          <div className="edu-grid">
            <Reveal delay={80}>
              <div className="edu-card">
                <div className="edu-year">2023 – 2027</div>
                <div className="edu-school">Parul University</div>
                <div className="edu-degree">Bachelor of Technology (B.Tech)</div>
                <span className="edu-badge">CGPA: 7.32</span>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="edu-card">
                <div className="edu-year">2021 – 2023</div>
                <div className="edu-school">Sri Viswa Junior College</div>
                <div className="edu-degree">Intermediate (Class XII)</div>
                <span className="edu-badge">89%</span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={80}>
            <div className="section-eyebrow" style={{ marginBottom:"1.5rem" }}>Certifications</div>
            <div className="certs-grid">
              {certs.map((c,i) => (
                <Reveal key={i} delay={i*80}>
                  <div className="cert-card">
                    <div className="cert-icon">{c.icon}</div>
                    <div><div className="cert-name">{c.name}</div><div className="cert-issuer">{c.issuer}</div></div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-bg" id="contact">
        <div className="contact-wrap">
          <Reveal>
            <div>
              <div className="section-eyebrow" style={{ marginBottom:".9rem" }}>Get In Touch</div>
              <div className="contact-headline">Let's Build<br /><em>Together</em></div>
              <p className="contact-sub">Open to internship opportunities, collaborations, and exciting projects. Send a message — I'd love to connect.</p>
              <div className="contact-links">
                <a href="mailto:ganeshjalla05@gmail.com" className="c-link"><div className="c-icon">✉</div>ganeshjalla05@gmail.com</a>
                <a href="tel:+919346524781" className="c-link"><div className="c-icon">📞</div>+91 93465 24781</a>
                <a href="www.linkedin.com/in/
ganesh-jalla-bbbb07330
" className="c-link" target="_blank" rel="noreferrer">
  LinkedIn Profile
</a>
                <a href="https://github.com/ganeshjalla" className="c-link" target="_blank" rel="noreferrer">
  GitHub Profile
</a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div>
              <div className="section-eyebrow" style={{ marginBottom:"1.25rem" }}>Developer Profile</div>
              <div className="info-panel">
                <div className="info-panel-header">⚡ <span>Ganesh Jalla</span> — Quick Info</div>
                <div className="info-rows">
                  {[
                    ["Location","India"],
                    ["Degree","B.Tech, Parul University"],
                    ["Languages","English · Hindi · Telugu"],
                    ["Certs","3 Certifications"],
                    ["Focus","Backend & Cloud Dev"],
                  ].map(([l,v]) => (
                    <div className="info-row" key={l}>
                      <span className="i-label">{l}</span>
                      <span className="i-val">{v}</span>
                    </div>
                  ))}
                  <div className="info-row">
                    <span className="i-label">Status</span>
                    <span className="i-val"><span className="status-dot"/>Open to Hire</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer><p>Designed & Built by <span>Ganesh Jalla</span> · 2026</p></footer>
    </>
  );
}