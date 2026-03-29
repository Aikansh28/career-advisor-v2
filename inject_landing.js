const fs = require('fs');

const jsxStr = fs.readFileSync('.stitch/designs/LandingPage-JSX.tsx', 'utf8');

const targetPath = 'frontend/src/components/LandingPage.tsx';

let finalCode = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

interface LandingPageProps {
  isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0c1324] text-[#dce1fb] font-manrope selection:bg-secondary/30 selection:text-white antialiased overflow-x-hidden">
        ${jsxStr}
    </div>
  );
}
`;

// Now let's inject some logic
finalCode = finalCode.replace(
  /<button className="px-10 py-4 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform active:scale-95">Get Started Now<\/button>/,
  '<button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="px-10 py-4 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform active:scale-95">Get Started Now</button>'
);

finalCode = finalCode.replace(
  /<button className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-bold hover:scale-105 transition-all active:scale-95 duration-150 shadow-\[0_0_15px_rgba\(65,228,192,0\.4\)\]">Start Free<\/button>/,
  '<button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-bold hover:scale-105 transition-all active:scale-95 duration-150 shadow-[0_0_15px_rgba(65,228,192,0.4)]">{isLoggedIn ? "Dashboard" : "Start Free"}</button>'
);

finalCode = finalCode.replace(
  /<button className="text-on-surface font-medium hover:text-secondary transition-colors">Login<\/button>/,
  '{!isLoggedIn && <button onClick={() => navigate("/login")} className="text-on-surface font-medium hover:text-secondary transition-colors">Login</button>}\n<div className="hidden sm:block ml-2"><ThemeSwitcher /></div>'
);

finalCode = finalCode.replace(
  /<button className="bg-secondary text-on-secondary px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95 glow-pulse">Initialize Your Career AI<\/button>/,
  '<button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-secondary text-on-secondary px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95 glow-pulse">Initialize Your Career AI</button>'
);

// fix the "class" that might be a problem if it's there
finalCode = finalCode.replace(/class=/g, 'className=');

fs.writeFileSync(targetPath, finalCode);
console.log('Successfully wrote LandingPage.tsx');
