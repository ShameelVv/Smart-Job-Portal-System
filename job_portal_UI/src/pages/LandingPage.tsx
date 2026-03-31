import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Company {
  name: string
  logo: string
  color: string
  bg: string
}

interface Category {
  name: string
  icon: string
  count: string
}

interface Stat {
  value: string
  label: string
}

interface Testimonial {
  name: string
  role: string
  text: string
  avatar: string
}

interface Step {
  step: string
  title: string
  desc: string
  icon: string
}

interface FooterColumn {
  title: string
  links: string[]
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NAV_LINKS: string[] = ["Career Fair", "Skill Tests", "Resume Builder", "Services"]

const COMPANIES: Company[] = [
  { name: "Google",    logo: "G",  color: "text-blue-500",   bg: "bg-blue-50"   },
  { name: "Microsoft", logo: "M",  color: "text-sky-500",    bg: "bg-sky-50"    },
  { name: "Amazon",    logo: "A",  color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Meta",      logo: "f",  color: "text-blue-600",   bg: "bg-blue-50"   },
  { name: "Netflix",   logo: "N",  color: "text-red-500",    bg: "bg-red-50"    },
  { name: "Spotify",   logo: "S",  color: "text-green-500",  bg: "bg-green-50"  },
  { name: "Apple",     logo: "",   color: "text-gray-600",   bg: "bg-gray-50"   },
  { name: "Adobe",     logo: "Ae", color: "text-red-600",    bg: "bg-red-50"    },
]

const CATEGORIES: Category[] = [
  { name: "Software Dev", icon: "💻", count: "1,240 jobs" },
  { name: "Design & UX",  icon: "🎨", count: "850 jobs"  },
  { name: "Marketing",    icon: "📢", count: "620 jobs"  },
  { name: "Finance",      icon: "📊", count: "430 jobs"  },
  { name: "Healthcare",   icon: "🏥", count: "380 jobs"  },
  { name: "Education",    icon: "📚", count: "290 jobs"  },
  { name: "Engineering",  icon: "⚙️", count: "710 jobs"  },
  { name: "Sales",        icon: "🤝", count: "540 jobs"  },
]

const STATS: Stat[] = [
  { value: "50K+", label: "Active Jobs"  },
  { value: "12K+", label: "Companies"    },
  { value: "2M+",  label: "Job Seekers"  },
  { value: "98%",  label: "Success Rate" },
]

const TESTIMONIALS: Testimonial[] = [
  {
    name:   "Arjun Sharma",
    role:   "Software Engineer @ Google",
    text:   "Found my dream job within 3 weeks. The AI matching is incredibly accurate.",
    avatar: "AS",
  },
  {
    name:   "Priya Menon",
    role:   "UX Designer @ Adobe",
    text:   "The resume builder helped me stand out. Got 5 interview calls in a week!",
    avatar: "PM",
  },
  {
    name:   "Rahul Nair",
    role:   "Data Analyst @ Amazon",
    text:   "Best job portal I've used. Clean interface and relevant job suggestions always.",
    avatar: "RN",
  },
]

const STEPS: Step[] = [
  { step: "01", title: "Create Profile", desc: "Sign up and build your professional profile in minutes",   icon: "👤" },
  { step: "02", title: "Get Matched",    desc: "Our AI finds jobs that match your skills and preferences", icon: "🤖" },
  { step: "03", title: "Get Hired",      desc: "Apply with one click and land your dream job",             icon: "🎉" },
]

const FOOTER_COLS: FooterColumn[] = [
  { title: "For Job Seekers", links: ["Browse Jobs", "Resume Builder", "Career Advice", "Skill Tests"]  },
  { title: "For Employers",   links: ["Post a Job", "Search Resumes", "Pricing Plans", "Recruitment"]   },
  { title: "Company",         links: ["About Us", "Blog", "Press", "Contact"]                           },
]

const POPULAR_TAGS: string[] = ["React Developer", "UI Designer", "Data Analyst", "DevOps"]
const SOCIAL_ICONS: string[] = ["𝕏", "in", "f", "▶"]
const FOOTER_LEGAL: string[] = ["Privacy Policy", "Terms of Service", "Cookie Policy"]

// ─── COMPONENT ────────────────────────────────────────────────────────────────

const LandingPage: React.FC = () => {
  const [position, setPosition] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
    
    <div className="font-sans text-gray-900 overflow-x-hidden">

      {/* Fonts + custom animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Sora', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .animate-float  { animation: float 4s ease-in-out infinite; }
        .animate-fadeup { animation: fadeUp 0.6s ease both; }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.35s; }
        .delay-4 { animation-delay: 0.5s; }
      `}</style>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-16 transition-all duration-300
        ${scrolled ? "py-3 bg-white/95 backdrop-blur-md shadow-lg shadow-violet-100" : "py-5 bg-transparent"}`}
      >
        <span className="text-2xl font-extrabold text-violet-700 tracking-tight">Jobify</span>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l: string) => (
            <a key={l} href="#"
              className="text-sm font-medium text-gray-600 hover:text-violet-700 transition-colors">
              {l}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login"
            className="text-sm font-medium text-gray-600 hover:text-violet-700 px-4 py-2 transition-colors">
            Login
          </Link>
          <Link to="/register"
            className="text-sm font-semibold text-violet-700 border-2 border-violet-700 px-4 py-2 rounded-lg hover:bg-violet-50 transition-all">
            Register
          </Link>
          <Link to="/jobs"
            className="text-sm font-semibold text-white bg-violet-700 px-5 py-2 rounded-lg hover:bg-violet-800 transition-all shadow-md shadow-violet-200">
            Apply for Jobs
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 flex items-center px-16 pt-28 pb-20 relative overflow-hidden gap-16">

        {/* Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-24 w-72 h-72 rounded-full bg-purple-300/25 blur-3xl pointer-events-none" />

        {/* Left */}
        <div className="flex-1 max-w-2xl z-10">
          <div className="animate-fadeup delay-1 inline-block bg-violet-100 text-violet-700 border border-violet-200 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
            ✨ #1 Job Portal in India
          </div>

          <h1 className="animate-fadeup delay-2 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 mb-5">
            Career Adventures Await,{" "}
            <span className="text-gray-900">Discover</span>
            <br />
            Your Perfect <span className="text-violet-700">Job Match</span>
          </h1>

          <p className="animate-fadeup delay-3 text-base leading-relaxed text-gray-500 mb-10 max-w-lg" style={{ fontFamily: "Inter, sans-serif" }}>
            Explore a vast array of job listings from various industries.
            Whether you're a seasoned professional or just starting your career
            journey, we have opportunities for everyone.
          </p>

          {/* CTA card */}
          <div className="animate-fadeup delay-4 bg-white/70 backdrop-blur-md rounded-2xl p-7 border border-white/80 shadow-xl shadow-violet-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Find your <span className="text-violet-700">new job</span> today
            </h2>
            <p className="text-sm text-gray-400 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Thousands of jobs in computer, engineering and technology sectors are waiting for you.
            </p>

            {/* Search bar */}
            <div className="flex items-center bg-white rounded-xl px-4 py-1.5 border border-gray-200 shadow-sm gap-2 mb-4">
              <span className="text-gray-400">🔍</span>
              <input
                className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-2 placeholder-gray-400"
                style={{ fontFamily: "Inter, sans-serif" }}
                placeholder="What position are you looking for?"
                value={position}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPosition(e.target.value)}
              />
              <div className="w-px h-6 bg-gray-200 mx-1" />
              <span className="text-gray-400">📍</span>
              <input
                className="flex-1 border-none outline-none text-sm text-gray-700 bg-transparent py-2 placeholder-gray-400"
                style={{ fontFamily: "Inter, sans-serif" }}
                placeholder="Location"
                value={location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
              />
              <Link to="/jobs"
                className="bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-violet-800 transition-all whitespace-nowrap ml-1">
                Apply here
              </Link>
            </div>

            {/* Popular tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>Popular:</span>
              {POPULAR_TAGS.map((t: string) => (
                <span key={t}
                  className="bg-violet-50 text-violet-700 border border-violet-100 text-xs font-medium px-3 py-1 rounded-md cursor-pointer hover:bg-violet-100 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right illustration */}
        <div className="hidden lg:flex flex-shrink-0 w-80 items-center justify-center z-10">
          <div className="animate-float relative w-72 h-80 bg-gradient-to-br from-violet-700 to-purple-400 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-300">
            <div className="w-40 h-40 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-8xl">👨‍💼</span>
            </div>
            <div className="absolute -top-4 -right-8 bg-white rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
              ✅ Profile 92% complete
            </div>
            <div className="absolute bottom-16 -right-10 bg-white rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
              🚀 3 new matches!
            </div>
            <div className="absolute -bottom-4 -left-8 bg-violet-700 text-white rounded-xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs font-semibold whitespace-nowrap" style={{ fontFamily: "Inter, sans-serif" }}>
              💼 12,400 new jobs today
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────────── */}
      <section className="bg-violet-700 py-8">
        <div className="flex justify-center">
          {STATS.map((s: Stat, i: number) => (
            <div key={s.label}
              className={`flex flex-col items-center px-12 ${i < STATS.length - 1 ? "border-r border-white/20" : ""}`}>
              <span className="text-3xl font-extrabold text-white tracking-tight">{s.value}</span>
              <span className="text-sm text-violet-200 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Companies ───────────────────────────────────────────────────── */}
      <section className="py-20 px-16 bg-white">
        <div className="text-center mb-12">
          <span className="inline-block bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Trusted By
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Top Companies Hiring Now</h2>
          <p className="text-gray-400 text-base" style={{ fontFamily: "Inter, sans-serif" }}>
            Join thousands of professionals hired by world-class companies
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5 max-w-3xl mx-auto">
          {COMPANIES.map((c: Company) => (
            <div key={c.name}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-3 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300">
              <div className={`w-14 h-14 rounded-2xl ${c.bg} ${c.color} flex items-center justify-center text-xl font-extrabold`}>
                {c.logo}
              </div>
              <span className="text-sm font-bold text-gray-800">{c.name}</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-0.5 rounded-full" style={{ fontFamily: "Inter, sans-serif" }}>
                Hiring
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────────────────── */}
      <section className="py-20 px-16 bg-violet-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-white text-violet-700 border border-violet-100 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Explore
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Browse by Job Category</h2>
          <p className="text-gray-400 text-base" style={{ fontFamily: "Inter, sans-serif" }}>
            Find your perfect role across all major industries
          </p>
        </div>

        <div className="grid grid-cols-4 gap-5 max-w-4xl mx-auto">
          {CATEGORIES.map((cat: Category) => (
            <Link to="/jobs" key={cat.name}
              className="relative bg-white border border-violet-100 rounded-2xl p-7 flex flex-col gap-2 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-100 hover:border-violet-400 transition-all duration-300 group">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-base font-bold text-gray-800">{cat.name}</span>
              <span className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>{cat.count}</span>
              <span className="absolute top-6 right-5 text-violet-300 text-lg font-bold group-hover:text-violet-600 transition-colors">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────── */}
      <section className="py-20 px-16 bg-white">
        <div className="text-center mb-12">
          <span className="inline-block bg-violet-50 text-violet-700 border border-violet-100 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Simple Process
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Get Hired in 3 Easy Steps</h2>
        </div>

        <div className="flex justify-center items-center max-w-3xl mx-auto">
          {STEPS.map((s: Step, i: number) => (
            <div key={s.step} className="relative flex-1">
              <div className="text-center p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 mx-2">
                <div className="text-5xl font-black text-violet-100 leading-none mb-2 tracking-tighter">{s.step}</div>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>{s.desc}</p>
              </div>
              {i < 2 && (
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-2xl text-violet-300 font-bold z-10">→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-20 px-16 bg-violet-50">
        <div className="text-center mb-12">
          <span className="inline-block bg-white text-violet-700 border border-violet-100 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider mb-3">
            Success Stories
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
          {TESTIMONIALS.map((t: Testimonial) => (
            <div key={t.name}
              className="bg-white rounded-2xl p-7 shadow-lg shadow-violet-50 border border-violet-50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <p className="text-base text-gray-500 leading-relaxed italic mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-700 to-purple-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-r from-violet-900 via-violet-700 to-purple-500 py-20 px-16 text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <h2 className="relative text-4xl font-extrabold text-white tracking-tight mb-4">
          Ready to Start Your Career Journey?
        </h2>
        <p className="relative text-lg text-violet-200 mb-10" style={{ fontFamily: "Inter, sans-serif" }}>
          Join over 2 million job seekers who found their dream jobs on Jobify
        </p>
        <div className="relative flex justify-center gap-4">
          <Link to="/register"
            className="bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition-all shadow-xl shadow-violet-900/30 text-base">
            Get Started Free
          </Link>
          <Link to="/jobs"
            className="bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all backdrop-blur-sm text-base">
            Browse Jobs →
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 px-16 pt-16 pb-8">
        <div className="grid grid-cols-4 gap-12 mb-12 pb-12 border-b border-white/10">

          {/* Brand */}
          <div>
            <span className="text-2xl font-extrabold text-white block mb-4">Jobify</span>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs" style={{ fontFamily: "Inter, sans-serif" }}>
              Connecting talent with opportunity. Your career journey starts here.
            </p>
            <div className="flex gap-2">
              {SOCIAL_ICONS.map((s: string) => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 text-sm hover:bg-violet-700 hover:text-white hover:border-violet-700 transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {FOOTER_COLS.map((col: FooterColumn) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-sm mb-4">{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map((l: string) => (
                  <a key={l} href="#"
                    className="text-sm text-gray-500 hover:text-violet-400 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center text-xs text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
          <span>© 2026 Jobify. All rights reserved.</span>
          <div className="flex gap-6">
            {FOOTER_LEGAL.map((l: string) => (
              <a key={l} href="#" className="hover:text-gray-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
    </>
  )
}

export default LandingPage
