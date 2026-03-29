const fs = require('fs');

const jsxStr = fs.readFileSync('.stitch/designs/LandingPage-JSX.tsx', 'utf8');
const targetPath = 'frontend/src/components/LandingPage.tsx';

let finalCode = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';
import careerMentorImage from '../assets/career_mentor_graphic.png';

interface LandingPageProps {
  isLoggedIn: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface font-body text-on-background selection:bg-primary/30 selection:text-white antialiased overflow-x-hidden">
        ${jsxStr}
    </div>
  );
}
`;

// Replace Login button
finalCode = finalCode.replace(
  /<button className="hidden sm:block text-purple-900 font-bold hover:scale-105 transition-transform">Login<\/button>/,
  '{!isLoggedIn && <button onClick={() => navigate("/login")} className="hidden sm:block text-purple-900 font-bold hover:scale-105 transition-transform">Login</button>}\\n<div className="hidden sm:block ml-2"><ThemeSwitcher /></div>'
);

// Replace Start nav button
finalCode = finalCode.replace(
  /<button className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">Get Started<\/button>/,
  '<button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg">{isLoggedIn ? "Dashboard" : "Get Started"}</button>'
);

// Replace Hero button (Launch Your Journey)
finalCode = finalCode.replace(
  /<button className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl flex flex-col sm:flex-row items-center gap-3">/g,
  '<button onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-3">'
);
// Wait, regex might fail with whitespace. Let's do a simpler string replace for onClick addition
finalCode = finalCode.replace(
    /className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-3"/,
    'onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-3"'
);

// Replace CTA footer button (Initialize Your Journey or whatever it is called)
finalCode = finalCode.replace(
    /className="bg-primary text-on-primary px-12 py-5 rounded-full font-black text-xl hover:scale-105 hover:-translate-y-1 transition-all shadow-2xl active:scale-95"/,
    'onClick={() => navigate(isLoggedIn ? "/dashboard" : "/assessment")} className="bg-primary text-on-primary px-12 py-5 rounded-full font-black text-xl hover:scale-105 hover:-translate-y-1 transition-all shadow-2xl active:scale-95"'
);

// Replace the image src
finalCode = finalCode.replace(
    /src="\/src\/assets\/career_mentor_graphic.png"/g,
    'src={careerMentorImage}'
);

// fix any "class=" that leaked
finalCode = finalCode.replace(/class=/g, 'className=');

fs.writeFileSync(targetPath, finalCode);
console.log('Successfully wrote LandingPage.tsx');
