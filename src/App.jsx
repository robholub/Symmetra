import React, { useState, useRef, useEffect } from 'react';
import { Download, RotateCcw, Palette, Eraser, ChevronLeft, Play, Sparkles, Undo2, Trash2, X, Clock } from 'lucide-react';

// --- COLOR PALETTE ---
const COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', 
  '#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0', 
  '#F94144', '#F3722C', '#F8961E', '#90BE6D', '#43AA8B', '#111827'
];

// --- PROCEDURAL GENERATOR ---
const PREFIXES = ['Mystic', 'Solar', 'Lunar', 'Cosmic', 'Sacred', 'Astral', 'Ethereal', 'Crystal', 'Zen', 'Spirit'];
const SUFFIXES = ['Bloom', 'Crown', 'Star', 'Lotus', 'Nova', 'Harmony', 'Aura', 'Pulse', 'Crest', 'Eye'];

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const generateRecipe = () => {
  const name = `${PREFIXES[Math.floor(Math.random() * PREFIXES.length)]} ${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}`;
  const id = generateId();
  const layers = [];
  
  const layerConfigs = [
    { r: 190, size: 60 },
    { r: 150, size: 55 },
    { r: 110, size: 50 },
    { r: 70, size: 40 },
    { r: 30, size: 25 }
  ];

  const shapeTypes = ['petal', 'pointy', 'circle', 'triangle', 'chevron', 'dome', 'diamond'];

  layerConfigs.forEach((config, idx) => {
    const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const hasDot = Math.random() > 0.4;
    
    let possibleCounts = [8, 12, 16];
    if (config.r < 80) possibleCounts = [4, 8];
    if (config.r >= 150) possibleCounts = [12, 16, 24];
    
    const count = possibleCounts[Math.floor(Math.random() * possibleCounts.length)];
    
    layers.push({
      id: `${id}-layer-${idx}`,
      r: config.r,
      size: config.size,
      type,
      count,
      hasDot
    });
  });

  return { id, name, layers };
};

// Component to Render a Procedural Recipe safely
const RenderRecipe = ({ recipe, fills = {}, onColor }) => {
  if (!recipe || !recipe.layers) return null;

  return (
    <>
      <circle cx="250" cy="250" r="240" fill={fills['base'] || '#FFFFFF'} stroke="#1e293b" strokeWidth="3" onClick={() => onColor && onColor('base')} className={onColor ? "cursor-pointer hover:brightness-95 transition-all" : ""} />
      {recipe.layers.map((layer) => {
        const angles = Array.from({ length: layer.count }, (_, i) => (360 / layer.count) * i);
        return (
          <g key={layer.id}>
            {angles.map((angle, i) => {
              const shapeId = `${layer.id}-shape-${i}`;
              const dotId = `${layer.id}-dot-${i}`;
              const y = 250 - layer.r;
              const s = layer.size;
              
              let pathD = '';
              let isCircle = false;
              let cx, cy, r;

              switch(layer.type) {
                case 'petal': pathD = `M 250 ${y} Q ${250+s*0.6} ${y-s*0.5} 250 ${y-s} Q ${250-s*0.6} ${y-s*0.5} 250 ${y}`; break;
                case 'pointy': pathD = `M 250 ${y} L ${250+s*0.4} ${y-s*0.5} L 250 ${y-s} L ${250-s*0.4} ${y-s*0.5} Z`; break;
                case 'circle': isCircle = true; cx = 250; cy = y - s/2; r = s/2; break;
                case 'triangle': pathD = `M ${250-s*0.5} ${y} L ${250+s*0.5} ${y} L 250 ${y-s} Z`; break;
                case 'chevron': pathD = `M ${250-s*0.5} ${y} L 250 ${y-s} L ${250+s*0.5} ${y} L 250 ${y-s*0.3} Z`; break;
                case 'dome': pathD = `M ${250-s*0.5} ${y} A ${s*0.5} ${s*0.5} 0 0 1 ${250+s*0.5} ${y} Z`; break;
                case 'diamond': pathD = `M 250 ${y} L ${250+s*0.3} ${y-s*0.3} L 250 ${y-s} L ${250-s*0.3} ${y-s*0.3} Z`; break;
                default: pathD = `M 250 ${y} L ${250+s*0.4} ${y-s*0.5} L 250 ${y-s} L ${250-s*0.4} ${y-s*0.5} Z`;
              }

              return (
                <g key={shapeId} transform={`rotate(${angle} 250 250)`}>
                  {isCircle ? (
                    <circle cx={cx} cy={cy} r={r} fill={fills[shapeId] || '#FFFFFF'} stroke="#1e293b" strokeWidth="3" onClick={() => onColor && onColor(shapeId)} className={onColor ? "cursor-pointer hover:brightness-95 transition-all" : ""} />
                  ) : (
                    <path d={pathD} fill={fills[shapeId] || '#FFFFFF'} stroke="#1e293b" strokeWidth="3" strokeLinejoin="round" onClick={() => onColor && onColor(shapeId)} className={onColor ? "cursor-pointer hover:brightness-95 transition-all" : ""} />
                  )}
                  {layer.hasDot && (
                    <circle cx="250" cy={y - s - 8} r={s * 0.1} fill={fills[dotId] || '#FFFFFF'} stroke="#1e293b" strokeWidth="3" onClick={() => onColor && onColor(dotId)} className={onColor ? "cursor-pointer hover:brightness-95 transition-all" : ""} />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
      <circle cx="250" cy="250" r="12" fill={fills['center-core'] || '#1e293b'} stroke="#1e293b" strokeWidth="3" onClick={() => onColor && onColor('center-core')} className={onColor ? "cursor-pointer hover:brightness-95 transition-all" : ""} />
    </>
  );
};

// --- MAIN APP ---
export default function App() {
  const [loadingSession, setLoadingSession] = useState(true);
  
  const [view, setView] = useState('menu');
  const [activeRecipe, setActiveRecipe] = useState(null);
  
  // State for Colors & History
  const [fills, setFills] = useState({});
  const [history, setHistory] = useState([]);
  
  // Modal States
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [exportDataUrl, setExportDataUrl] = useState(null);

  // Gallery Data
  const [savedMandalas, setSavedMandalas] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const svgRef = useRef(null);

  // 1. Initialize Options and Load Gallery from Local Storage
  useEffect(() => {
    setOptions([generateRecipe(), generateRecipe(), generateRecipe(), generateRecipe()]);
    
    // Load offline gallery from device storage
    try {
      const storedData = localStorage.getItem('symmetra_gallery');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setSavedMandalas(parsedData);
      }
    } catch (e) {
      console.error("Failed to load gallery", e);
    }
    
    setLoadingSession(false);
  }, []);

  // 2. Auto-save Active Mandala to Local Storage
  useEffect(() => {
    if (view !== 'drawing' || !activeRecipe) return;
    
    const timer = setTimeout(() => {
      setSavedMandalas(prev => {
        const existingIndex = prev.findIndex(m => m.id === activeRecipe.id);
        const newGallery = [...prev];
        const newData = {
          id: activeRecipe.id,
          recipe: activeRecipe,
          fills: fills,
          updatedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
          newGallery[existingIndex] = newData;
        } else {
          newGallery.push(newData);
        }
        
        // Sort newest first
        newGallery.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        
        // Save to device
        localStorage.setItem('symmetra_gallery', JSON.stringify(newGallery));
        return newGallery;
      });
    }, 1000); // Wait 1 second after last interaction to save
    
    return () => clearTimeout(timer);
  }, [fills, activeRecipe, view]);

  // --- ACTIONS ---
  
  const handleColor = (id) => {
    if (view === 'drawing') {
      setHistory(prev => [...prev, fills]);
      setFills(prev => ({ ...prev, [id]: selectedColor }));
    }
  };

  const handleUndo = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousState = newHistory.pop();
      setFills(previousState);
      return newHistory;
    });
  };

  const startNew = (recipe) => {
    setActiveRecipe(recipe);
    setFills({});
    setHistory([]);
    setView('drawing');
  };

  const continueSession = (savedItem) => {
    if (savedItem && savedItem.recipe) {
      setActiveRecipe(savedItem.recipe);
      setFills(savedItem.fills || {});
      setHistory([]);
      setView('drawing');
    }
  };

  const deleteMandala = (e, id) => {
    e.stopPropagation(); // Prevent opening the mandala
    if (window.confirm("Delete this mandala permanently?")) {
      setSavedMandalas(prev => {
        const newGallery = prev.filter(m => m.id !== id);
        localStorage.setItem('symmetra_gallery', JSON.stringify(newGallery));
        return newGallery;
      });
    }
  };

  const performClear = () => {
    setHistory(prev => [...prev, fills]);
    setFills({});
    setShowConfirmReset(false);
  };

  const generateAndExport = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 1200;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL('image/png');
      setExportDataUrl(pngUrl);
      
      try {
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `symmetra-${activeRecipe.name.replace(' ', '-').toLowerCase()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch(err) {
        console.warn("Auto-download blocked, displaying manual save modal instead.");
      }
    };
    img.src = url;
  };

  const mostRecentSave = savedMandalas.length > 0 ? savedMandalas[0] : null;
  const galleryMandalas = savedMandalas.length > 1 ? savedMandalas.slice(1) : [];

  // --- RENDERERS ---

  const renderMenu = () => (
    <div className="flex-1 w-full overflow-y-auto bg-slate-50 relative">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-100 rounded-2xl mb-2 shadow-inner">
            <Palette className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Symmetra</h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">Infinite mandalas, infinite fun.</p>
        </header>

        {loadingSession ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
        ) : (
          <div className="space-y-12">
            
            {/* Quick Continue Banner */}
            {mostRecentSave && mostRecentSave.recipe && (
              <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                    <Clock className="w-6 h-6 text-indigo-500" />
                    Jump Back In
                  </h2>
                  <p className="text-slate-600">Continue coloring your masterpiece: <b>{mostRecentSave.recipe.name}</b></p>
                  <button onClick={() => continueSession(mostRecentSave)} className="mt-4 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all active:scale-95">
                    Continue Coloring
                  </button>
                </div>
                <div className="w-48 h-48 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shadow-inner p-2 pointer-events-none flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 540 540" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <RenderRecipe recipe={mostRecentSave.recipe} fills={mostRecentSave.fills} />
                  </svg>
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {galleryMandalas.length > 0 && (
              <section className="space-y-6">
                <div className="flex items-center gap-2 px-2 border-b border-slate-200 pb-4">
                  <Play className="w-6 h-6 text-indigo-500" fill="currentColor" />
                  <h2 className="text-2xl font-bold text-slate-800">Your Gallery</h2>
                  <span className="ml-auto text-sm font-medium text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                    {galleryMandalas.length} Saved
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {galleryMandalas.map(savedItem => (
                    <div 
                      key={savedItem.id} 
                      onClick={() => continueSession(savedItem)}
                      className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-md border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer relative flex flex-col"
                    >
                      <div className="w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 p-2 mb-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 540 540" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                          <RenderRecipe recipe={savedItem.recipe} fills={savedItem.fills} />
                        </svg>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-sm text-slate-700 truncate pr-2 group-hover:text-indigo-600 transition-colors">
                          {savedItem.recipe?.name || 'Untitled'}
                        </span>
                        <button 
                          onClick={(e) => deleteMandala(e, savedItem.id)}
                          className="p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors opacity-0 group-hover:opacity-100 flex-none"
                          title="Delete Mandala"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Generator Section */}
            <section className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" /> Start a New Design
                </h2>
                <button onClick={() => setOptions([generateRecipe(), generateRecipe(), generateRecipe(), generateRecipe()])} className="text-indigo-600 font-semibold hover:bg-indigo-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 justify-center">
                  <RotateCcw className="w-4 h-4" /> Shuffle
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {options.map(recipe => (
                  <button key={recipe.id} onClick={() => startNew(recipe)} className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-md border border-slate-200 hover:border-indigo-300 transition-all text-left flex flex-col items-center">
                    <div className="w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 p-3 mb-4 pointer-events-none group-hover:scale-[1.02] transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 540 540" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                        <RenderRecipe recipe={recipe} fills={{}} />
                      </svg>
                    </div>
                    <span className="font-bold text-md text-slate-700 text-center w-full truncate group-hover:text-indigo-600 transition-colors">{recipe.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );

  const renderWorkspace = () => (
    <div className="h-full flex flex-col relative z-10">
      
      {/* HEADER */}
      <header className="h-16 md:h-20 flex-none flex items-center justify-between px-4 md:px-8 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-1 md:gap-4">
          <button onClick={() => setView('menu')} className="flex items-center justify-center p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
            <span className="hidden md:block font-medium">Back</span>
          </button>
          <div className="w-px h-6 bg-slate-200 hidden md:block mx-2"></div>
          <h2 className="text-lg font-bold text-slate-800 hidden sm:block truncate max-w-[150px] md:max-w-[300px]">{activeRecipe?.name}</h2>
        </div>

        <div className="flex items-center gap-1 md:gap-3">
          <button onClick={handleUndo} disabled={history.length === 0} className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${history.length === 0 ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`} title="Undo Last Color">
            <Undo2 className="w-5 h-5" />
          </button>
          <button onClick={() => setShowConfirmReset(true)} className="p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors" title="Clear Canvas">
            <Trash2 className="w-5 h-5" />
          </button>
          <button onClick={generateAndExport} className="ml-2 flex items-center p-2 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            <span className="hidden md:block ml-2 font-medium">Export</span>
          </button>
        </div>
      </header>

      {/* CANVAS */}
      <main className="flex-1 min-h-0 flex items-center justify-center p-4 md:p-8 bg-slate-50 bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:24px_24px]">
        <div className="w-full h-full max-w-[750px] flex items-center justify-center transition-transform duration-300">
          <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 540 540" className="w-full h-full max-h-full" preserveAspectRatio="xMidYMid meet">
            <RenderRecipe recipe={activeRecipe} fills={fills} onColor={handleColor} />
          </svg>
        </div>
      </main>

      {/* TOOLS / COLORS */}
      <footer className="h-24 md:h-28 flex-none bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <div className="h-full w-full max-w-5xl mx-auto flex items-center px-4 md:px-8 gap-4 overflow-x-auto no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
          
          <button onClick={() => setSelectedColor('#FFFFFF')} className={`flex-none w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-200 ${selectedColor === '#FFFFFF' ? 'ring-4 ring-indigo-500 ring-offset-2 scale-110 bg-slate-100' : 'ring-1 ring-slate-300 bg-white hover:bg-slate-50'}`}>
            <Eraser className={`w-6 h-6 ${selectedColor === '#FFFFFF' ? 'text-indigo-600' : 'text-slate-500'}`} />
          </button>
          <div className="w-px h-10 bg-slate-200 flex-none mx-2"></div>
          {COLORS.map((color) => (
            <button key={color} onClick={() => setSelectedColor(color)} className={`flex-none w-12 h-12 md:w-14 md:h-14 rounded-full transition-transform duration-200 ${selectedColor === color ? 'ring-4 ring-indigo-500 ring-offset-2 scale-110 shadow-lg' : 'ring-1 ring-black/10 shadow-sm hover:scale-105'}`} style={{ backgroundColor: color }} />
          ))}
          <div className="flex-none w-4 h-full"></div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden font-sans text-slate-800">
      {view === 'menu' ? renderMenu() : renderWorkspace()}

      {/* UI Modal: Confirm Reset */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Clear Canvas?</h3>
            <p className="text-slate-500 mb-8">This will erase all colors on your current mandala. You can undo this action if needed.</p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowConfirmReset(false)} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancel</button>
              <button onClick={performClear} className="flex-1 py-3 px-4 rounded-xl font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">Clear All</button>
            </div>
          </div>
        </div>
      )}

      {/* UI Modal: Image Export */}
      {exportDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Your Masterpiece</h3>
              <button onClick={() => setExportDataUrl(null)} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6 flex flex-col items-center">
              <img src={exportDataUrl} alt="Exported Mandala" className="w-full max-w-[300px] h-auto border border-slate-200 rounded-xl shadow-sm mb-6 bg-white" />
              <div className="bg-indigo-50 text-indigo-800 px-4 py-3 rounded-xl text-sm font-medium text-center w-full">
                <strong>Right-Click</strong> (or <strong>Long-Press</strong> on mobile) the image above and select "Save Image" to download it to your device!
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setExportDataUrl(null)} className="py-2 px-6 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
