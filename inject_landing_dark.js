const fs = require('fs');

const jsxStrRaw = fs.readFileSync('.stitch/designs/LandingPage-JSX.tsx', 'utf8');
const targetPath = 'frontend/src/components/LandingPage.tsx';

let jsxStr = jsxStrRaw;

// Fix bad circles
jsxStr = jsxStr.replace(/><\/circle>/g, ' />');
jsxStr = jsxStr.replace(/\/><\/circle>/g, '/>');
jsxStr = jsxStr.replace(/<\/circle>/g, '');

let finalCode = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

interface LandingPageProps {
  isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0e0e0e] font-body text-on-background selection:bg-secondary/30 selection:text-black antialiased overflow-x-hidden">
        ${jsxStr}
    </div>
  );
}
`;

// Replace top right nav button 
finalCode = finalCode.replace(
  /<button className="bg-primary text-on-primary px-5 py-1.5 rounded-full text-sm font-semibold scale-95 active:scale-90 transition-transform">Create Account<\/button>/,
  '{!isLoggedIn && <button onClick={() => navigate("/login")} className="bg-primary text-on-primary px-5 py-1.5 rounded-full text-sm font-semibold scale-95 active:scale-90 hover:scale-100 transition-transform">Sign In</button>}\\n<div className="flex items-center ml-2 border-l border-white/10 pl-4"><ThemeSwitcher /></div>'
);

// Replace hero primary CTA
finalCode = finalCode.replace(
  /<button className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:shadow-\[0_0_20px_rgba\(255,255,255,0\.2\)\] transition-all">\s*Launch App\s*<\/button>/g,
  '<button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">\\n    {isLoggedIn ? "Launch Dashboard" : "Protect Trajectory"}\\n</button>'
);

// Ensure there is no stray "class="
finalCode = finalCode.replace(/class=/g, 'className=');

fs.writeFileSync(targetPath, finalCode);
console.log('Successfully wrote LandingPage.tsx with Dark Dribbble Design.');
