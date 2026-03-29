
{/* TopNavBar */}
<header className="fixed top-0 left-0 right-0 z-50 flex justify-center items-center w-full">
<nav className="bg-white/5 backdrop-blur-xl rounded-full mt-6 max-w-fit mx-auto border border-white/10 px-6 py-2 shadow-[0_0_15px_rgba(99,247,255,0.05)] flex items-center gap-8">
<div className="text-xl font-bold tracking-tighter text-white font-headline">CareerAI</div>
<div className="hidden md:flex items-center gap-6">
<a className="font-['Plus_Jakarta_Sans'] tracking-tight text-sm md:text-base text-white font-semibold hover:text-cyan-400 transition-colors duration-200" href="#">Home</a>
<a className="font-['Plus_Jakarta_Sans'] tracking-tight text-sm md:text-base text-zinc-400 hover:text-cyan-400 transition-colors duration-200" href="#">Features</a>
<a className="font-['Plus_Jakarta_Sans'] tracking-tight text-sm md:text-base text-zinc-400 hover:text-cyan-400 transition-colors duration-200" href="#">Pricing</a>
</div>
<button className="bg-primary text-on-primary px-5 py-1.5 rounded-full text-sm font-semibold scale-95 active:scale-90 transition-transform">Create Account</button>
</nav>
</header>
<main className="relative min-h-screen pt-32 technical-grid">
{/* Hero Background Visuals */}
<div className="absolute inset-0 pointer-events-none overflow-hidden">
<div className="luminous-glow absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px]"></div>
{/* Abstract Precision Elements */}
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
<div className="w-[600px] h-[600px] border border-secondary/10 rounded-full animate-pulse"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-secondary/20 rounded-full"></div>
{/* Data Pills */}
<div className="absolute -top-10 -left-20 glass-pill px-4 py-2 rounded-full flex items-center gap-2 border-secondary/30">
<span className="material-symbols-outlined text-secondary text-sm">add</span>
<span className="text-xs font-label tracking-widest uppercase text-white">+ 95% Match Score</span>
</div>
<div className="absolute bottom-10 -right-24 glass-pill px-4 py-2 rounded-full flex items-center gap-2 border-secondary/30">
<span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
<span className="text-xs font-label tracking-widest uppercase text-white">+ Resume Opt</span>
</div>
</div>
</div>
{/* Hero Content */}
<section className="relative container mx-auto px-6 text-center pt-24 pb-48">
<h1 className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter text-white mb-8 leading-[0.9]">
                One-click for<br/>Career Defense
            </h1>
<p className="max-w-2xl mx-auto text-[#A0A0A0] text-lg md:text-xl font-light mb-12 leading-relaxed">
                Precision engineering for the modern professional. Protect your trajectory with AI-driven market intelligence and skill synchronization.
            </p>
<div className="flex flex-col md:flex-row items-center justify-center gap-4">
<button className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                    Launch App
                </button>
<button className="glass-pill px-10 py-4 rounded-full font-bold text-lg text-white hover:bg-white/10 transition-all">
                    Discover More
                </button>
</div>
</section>
{/* Bento Grid Section */}
<section className="container mx-auto px-6 pb-48">
<div className="grid grid-cols-1 md:grid-cols-12 gap-4">
{/* Large Feature Card */}
<div className="md:col-span-8 h-[400px] glass-pill p-10 flex flex-col justify-between relative overflow-hidden group">
<div className="relative z-10">
<span className="text-secondary text-xs font-label tracking-[0.2em] uppercase mb-4 block">Precision Analytics</span>
<h3 className="text-3xl font-headline font-bold text-white mb-4">Market Demand vs. <br/>Current Capability</h3>
</div>
<div className="relative z-10 w-full flex items-end gap-6 h-32">
{/* Technical Data Viz */}
<div className="flex-1 h-full flex items-end gap-2">
<div className="w-full bg-secondary/20 h-[40%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm"></div>
</div>
<div className="w-full bg-secondary/20 h-[65%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm opacity-60"></div>
</div>
<div className="w-full bg-secondary/20 h-[90%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm"></div>
</div>
<div className="w-full bg-secondary/20 h-[55%] rounded-sm relative">
<div className="absolute bottom-0 w-full bg-secondary h-full rounded-sm opacity-80"></div>
</div>
</div>
<div className="text-right">
<div className="text-4xl font-headline font-extrabold text-white">88%</div>
<div className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">Sync Rate</div>
</div>
</div>
<div className="absolute top-0 right-0 p-8">
<span className="material-symbols-outlined text-secondary/30 text-6xl">query_stats</span>
</div>
</div>
{/* Small Vertical Card */}
<div className="md:col-span-4 h-[400px] glass-pill p-10 flex flex-col justify-center items-center text-center">
<div className="relative w-32 h-32 mb-8">
<svg className="w-full h-full transform -rotate-90">
<circle className="text-white/10" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeWidth="2" /></circle>
<circle className="text-secondary" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" strokeDasharray="376" strokeDashoffset="100" strokeWidth="2" /></circle>
</svg>
<div className="absolute inset-0 flex items-center justify-center">
<span className="text-2xl font-bold text-white">74%</span>
</div>
</div>
<h4 className="text-xl font-headline font-bold text-white mb-2">Role Security</h4>
<p className="text-sm text-[#A0A0A0]">Probability score based on recent technical market shifts.</p>
</div>
{/* Grid Row 2 */}
<div className="md:col-span-4 h-[300px] glass-pill p-8 flex flex-col justify-between">
<span className="material-symbols-outlined text-secondary">shield_with_heart</span>
<div>
<h4 className="text-xl font-headline font-bold text-white mb-2">Trajectory Shield</h4>
<p className="text-sm text-[#A0A0A0]">Automated protection against industry obsolescence.</p>
</div>
</div>
<div className="md:col-span-8 h-[300px] bg-surface-container-low p-10 flex items-center justify-between border border-white/5">
<div className="max-w-md">
<h4 className="text-2xl font-headline font-bold text-white mb-4">Neural Resume Optimization</h4>
<p className="text-sm text-[#A0A0A0]">Our AI rewrites your professional narrative in real-time based on live hiring signals.</p>
</div>
<div className="hidden lg:block">
<img alt="AI Network" className="w-32 h-32 object-cover rounded-sm grayscale opacity-50" data-alt="Abstract 3D visualization of neural networks and data points in a monochromatic tech style with glowing cyan accents" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDwgcuMCbzXek596OyDnuSuhiQXoxYg_vNtq8NVtoMkdFH8j32sD-ghVUNZikLjB4r1ekh3O9xDiGEL_qqhheQT7W7CXJSpnlEc9eTxrEsPdLI7g0GlbCiaRvi7UaJ9VxB-grbIfeUkol8AYbbsjbe84QtSHIaEM6bP0aSn0Giit5YOU0EfXvqhhXrOHYWUKBfG163Ix1QJn_nuP8uP_hugj0Ga2rajQiL5xIpzNuZ-G6iEjdZNC_BnaO48SLl35DyhxorO4QRhlUY"/>
</div>
</div>
</div>
</section>
{/* Divider */}
<div className="container mx-auto px-6 h-px bg-gradient-to-r from-transparent via-outline-variant/20 to-transparent mb-24"></div>
{/* Footer */}
<footer className="w-full py-12 px-8 bg-[#0e0e0e] border-t border-[#474747]/20">
<div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<div className="text-zinc-200 font-bold text-xl font-headline">CareerAI</div>
<div className="flex gap-8">
<a className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors" href="#">Privacy</a>
<a className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors" href="#">Terms</a>
<a className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors" href="#">Contact</a>
</div>
<div className="font-['Inter'] text-xs uppercase tracking-widest text-zinc-500">
                    © 2024 CareerAI. Precision in every step.
                </div>
</div>
</footer>
</main>
