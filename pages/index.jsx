import Head from 'next/head';
import Link from 'next/link';
import {
  Zap,
  Target,
  LineChart,
  Share2,
  ChevronDown,
  Plus,
  CheckCircle2,
  ArrowRight,
  Layout,
  Smartphone
} from 'lucide-react';
import { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-zinc-200">{question}</span>
        <ChevronDown className={`h-5 w-5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-2 text-zinc-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      <Head>
        <title>Siiday - Aesthetic Habit Tracking</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Build consistency with the most aesthetic habit tracker on the web." />
      </Head>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/logo-siiday.png" alt="Siiday Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-black tracking-tight tracking-[-0.04em]">SIIDAY.</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How it Works</a>
            <a href="#faq" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        {/* Background Gradients */}
        <div className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[120px]" />

        <div className="relative z-10 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400/80">Launch Edition</span>
          </div>
          <h1 className="mb-6 max-w-4xl text-4xl font-black leading-[1.1] tracking-[-0.05em] sm:text-7xl md:text-8xl">
            Build Consistency,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              Beautifully.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed sm:text-xl">
            Siiday is a minimalist habit tracker designed for high performers.
            Track your progress, visualize your momentum, and share your wins flawlessly.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/10"
            >
              Start Your Streak
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Dashboard Preview Placeholder (Clean UI mockup) */}
        <div className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-zinc-900/50 p-4 shadow-2xl backdrop-blur-sm">
          <div className="aspect-[16/9] w-full rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[size:40px_40px]" />
            <img src="dashboard.webp" className='m-10 rounded-xl' alt="" />
          </div>
          <p className="text-sm font-bold text-zinc-600 text-center uppercase tracking-widest">Minimalist Dashboard</p>
        </div>

      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-indigo-500">What is Siiday?</h2>
              <h3 className="mb-8 text-4xl font-black leading-tight sm:text-5xl">
                The anti-distraction<br />habit tracker.
              </h3>
              <p className="mb-8 text-lg text-zinc-400 leading-relaxed">
                We believe that building a habit is hard enough without fighting a cluttered UI.
                Siiday (inspired by "Sii-day" or your day) stripped away everything but the essentials.
                No complex sub-tasks, no intrusive notifications—just you and your daily commitment.
              </p>
              <div className="space-y-4">
                {[
                  "Check habits only for today",
                  "Monitor weekly velocity",
                  "Visualize streak momentum"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-bold text-zinc-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8">
                  <Zap className="h-10 w-10 text-orange-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Fast Tracking</h4>
                  <p className="text-sm text-zinc-500">Record completions in under a second.</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8">
                  <Share2 className="h-10 w-10 text-emerald-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Share Wins</h4>
                  <p className="text-sm text-zinc-500">Generate aesthetic cards for social media.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8">
                  <LineChart className="h-10 w-10 text-indigo-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Real Data</h4>
                  <p className="text-sm text-zinc-500">Deep dive into your weekly consistency.</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-zinc-900/50 p-8">
                  <Target className="h-10 w-10 text-purple-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Clear Goals</h4>
                  <p className="text-sm text-zinc-500">Zero-fluff objective focus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-zinc-950 py-32 px-6">
        <div className="mx-auto max-w-4xl text-center mb-20">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-emerald-500">The Workflow</h2>
          <h3 className="text-4xl font-black sm:text-5xl">Simple enough to keep doing.</h3>
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative rounded-3xl border border-white/5 bg-zinc-900/30 p-10 group overflow-hidden">
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
                <Plus className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold mb-4">1. Plant Habits</h4>
              <p className="text-zinc-400 leading-relaxed">Add the habits you want to cultivate. Give them colors that resonate with your goals.</p>
            </div>

            <div className="relative rounded-3xl border border-white/5 bg-zinc-900/30 p-10 group overflow-hidden">
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold mb-4">2. Mark Progress</h4>
              <p className="text-zinc-400 leading-relaxed">Focus strictly on today. Complete your tasks and watch your daily momentum grow.</p>
            </div>

            <div className="relative rounded-3xl border border-white/5 bg-zinc-900/30 p-10 group overflow-hidden">
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                <Share2 className="h-8 w-8" />
              </div>
              <h4 className="text-2xl font-bold mb-4">3. Share the Win</h4>
              <p className="text-zinc-400 leading-relaxed">Export a high-quality summary card. Inspire your community with your weekly recap.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">FAQ</h2>
            <h3 className="text-4xl font-black sm:text-5xl">Got questions?</h3>
          </div>
          <div className="space-y-2">
            <FAQItem
              question="Why can I only check habits for today?"
              answer="Siiday focuses on 'The Now'. Restricting interaction to today prevents cheating and encourages you to stay present with your commitments."
            />
            <FAQItem
              question="Is it free to use?"
              answer="Absolutely. Siiday is currently free for all users to track habits, view statistics, and generate shareable cards."
            />
            <FAQItem
              question="Can I use it on my phone?"
              answer="Yes! Siiday is a Progressive Web App (PWA) compatible site. You can open it in any mobile browser and it will work beautifully."
            />
            <FAQItem
              question="What happens if I miss a day?"
              answer="Consistency isn't about being perfect; it's about not giving up. If you miss a day, your streak resets, but your weekly momentum continues to track your overall progress."
            />
            <FAQItem
              question="How do I share my progress?"
              answer="Simply go to your dashboard, and on the right side, you'll see your Weekly Recap card. Click 'Save Story' to download an aesthetic image ready for social media."
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-white/5 py-20 px-6">
        <div className="mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-white/5 shadow-xl shadow-indigo-600/5 overflow-hidden">
            <img src="/logo-siiday.png" alt="Siiday Logo" className="h-8 w-8 object-contain" />
          </div>
          <h2 className="mb-8 text-4xl font-black">Ready to build your new life?</h2>
          <Link
            href="/login"
            className="rounded-full bg-white px-10 py-4 text-lg font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/10"
          >
            Get Started for Free
          </Link>
          <div className="mt-20 flex flex-col items-center gap-8 border-t border-white/5 pt-10 w-full md:flex-row md:justify-between">
            <p className="text-sm text-zinc-500">© 2026 SIIDAY. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="text-sm text-zinc-500">Privacy</span>
              <span className="text-sm text-zinc-500">Terms</span>
              <span className="text-sm text-zinc-500">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
