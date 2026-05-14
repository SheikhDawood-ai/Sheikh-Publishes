import React from 'react';
import { useTheme, Theme } from '../context/ThemeContext';
import { Check, Palette } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

export default function ThemeCustomizer() {
  const { themes, currentTheme, setTheme } = useTheme();

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-zinc-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest dark:text-white">Workspace Themes</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(themes).map(([key, theme]: [string, Theme]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                currentTheme.name === theme.name 
                  ? 'border-amber-500 bg-amber-500/5' 
                  : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: theme.primary }}
                />
                <span className="text-xs font-bold uppercase tracking-tight dark:text-white">{theme.name}</span>
              </div>
              {currentTheme.name === theme.name && <Check className="w-3 h-3 text-amber-500" />}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest text-center">
            Agency tier supports custom hex values.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
