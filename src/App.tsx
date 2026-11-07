import { useMemo, useState } from 'react';
import {
  Atom,
  Check,
  ChevronRight,
  CircleAlert,
  FlaskConical,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
  Box,
  Code2,
  BarChart3,
} from 'lucide-react';

type Tab = 'overview' | 'smiles' | 'visualizer' | 'descriptors' | 'colour-id' | 'spot-error';
type ColourOption = 'red' | 'blue' | 'white' | 'green' | 'black';

type Molecule = {
  name: string;
  formula: string;
  description: string;
  atomCount: number;
  colors: { label: string; color: string; hex: string }[];
};

const molecules: Molecule[] = [
  {
    name: 'Water',
    formula: 'H₂O',
    description: 'A bent molecule with two hydrogen atoms bonded to oxygen.',
    atomCount: 3,
    colors: [
      { label: 'Oxygen', color: 'red', hex: '#ef4444' },
      { label: 'Hydrogen', color: 'white', hex: '#f8fafc' },
    ],
  },
  {
    name: 'Methane',
    formula: 'CH₄',
    description: 'A tetrahedral molecule with a carbon atom at its centre.',
    atomCount: 5,
    colors: [
      { label: 'Carbon', color: 'black', hex: '#1f2937' },
      { label: 'Hydrogen', color: 'white', hex: '#f8fafc' },
    ],
  },
  {
    name: 'Ammonia',
    formula: 'NH₃',
    description: 'A pyramidal molecule containing one nitrogen and three hydrogens.',
    atomCount: 4,
    colors: [
      { label: 'Nitrogen', color: 'blue', hex: '#2563eb' },
      { label: 'Hydrogen', color: 'white', hex: '#f8fafc' },
    ],
  },
];

const errorQuestions = [
  {
    statement: 'Oxygen atoms are commonly represented by red spheres in standard molecular models.',
    answer: true,
    explanation: 'Correct. Red is the standard CPK colour used for oxygen.',
  },
  {
    statement: 'Carbon atoms are conventionally represented by bright green spheres.',
    answer: false,
    explanation: 'Spot on. Carbon is conventionally represented by black or dark grey spheres.',
  },
  {
    statement: 'Hydrogen is usually displayed as a small white sphere.',
    answer: true,
    explanation: 'Correct. Hydrogen is represented as white in the CPK colour system.',
  },
  {
    statement: 'Nitrogen atoms are conventionally represented by yellow spheres.',
    answer: false,
    explanation: 'Not quite. Nitrogen is conventionally represented by blue spheres.',
  },
];

const navItems: { id: Tab; label: string; icon: typeof Atom }[] = [
  { id: 'overview', label: 'Lab overview', icon: FlaskConical },
  { id: 'smiles', label: 'SMILES toolkit', icon: Code2 },
  { id: 'visualizer', label: '2D / 3D visualizer', icon: Box },
  { id: 'descriptors', label: 'Molecular descriptors', icon: BarChart3 },
  { id: 'colour-id', label: 'Molecule colour ID', icon: Atom },
  { id: 'spot-error', label: 'Spot the error', icon: Gamepad2 },
];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [colourAnswers, setColourAnswers] = useState<Record<string, ColourOption>>({});
  const [colourSubmitted, setColourSubmitted] = useState(false);
  const [errorIndex, setErrorIndex] = useState(0);
  const [errorScore, setErrorScore] = useState(0);
  const [errorAnswered, setErrorAnswered] = useState<boolean | null>(null);
  const [smiles, setSmiles] = useState('CCO');
  const [visualMolecule, setVisualMolecule] = useState('Ethanol');
  const [visualMode, setVisualMode] = useState<'2D' | '3D'>('2D');

  const colourScore = useMemo(
    () => molecules.reduce((score, molecule) => score + molecule.colors.filter((item) => colourAnswers[`${molecule.name}-${item.label}`] === item.color).length, 0),
    [colourAnswers],
  );
  const colourTotal = molecules.reduce((sum, molecule) => sum + molecule.colors.length, 0);
  const currentError = errorQuestions[errorIndex];
  const completedQuestions = errorAnswered === null ? errorIndex : errorIndex + 1;

  const resetColourQuiz = () => {
    setColourAnswers({});
    setColourSubmitted(false);
  };

  const chooseErrorAnswer = (answer: boolean) => {
    if (errorAnswered !== null) return;
    setErrorAnswered(answer);
    if (answer === currentError.answer) setErrorScore((score) => score + 1);
  };

  const nextErrorQuestion = () => {
    setErrorIndex((index) => (index + 1) % errorQuestions.length);
    setErrorAnswered(null);
  };

  const resetErrorGame = () => {
    setErrorIndex(0);
    setErrorScore(0);
    setErrorAnswered(null);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#050505] text-slate-100 selection:bg-cyan-300 selection:text-black">
      <div className="pointer-events-none fixed inset-0 opacity-60 [background-image:radial-gradient(circle_at_15%_15%,rgba(8,145,178,0.12),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(22,163,74,0.07),transparent_24%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col lg:flex-row">
        <aside className="border-b border-white/10 bg-black/40 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[285px] lg:flex-col lg:border-b-0 lg:border-r lg:px-7 lg:py-8">
          <div className="flex items-center gap-3">
            <img src="/srm_logo.jpeg" alt="SRM Institute of Science and Technology" className="h-12 w-12 rounded-xl object-cover ring-1 ring-white/20" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300">Virtual laboratory</p>
              <p className="mt-1 text-sm font-semibold text-white">Cheminformatics</p>
            </div>
          </div>

          <div className="mt-10 hidden lg:block">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
            <nav className="space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activeTab === id ? 'bg-cyan-300 text-slate-950 shadow-[0_8px_24px_rgba(103,232,249,0.12)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <Icon size={17} className={activeTab === id ? 'text-slate-950' : 'text-slate-500 group-hover:text-cyan-300'} />
                  <span className="font-medium">{label}</span>
                  {activeTab === id && <ChevronRight size={15} className="ml-auto" />}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:block">
            <div className="mb-3 flex items-center gap-2 text-cyan-300"><GraduationCap size={17} /><span className="text-xs font-semibold">Student profile</span></div>
            <p className="text-sm font-semibold text-white">KOTHALA D V V DEEPTHI MAHI</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">RA2611030050077<br />CSE W/S Cyber Security · Section B</p>
          </div>
        </aside>

        <main className="relative flex-1 px-5 pb-10 pt-7 sm:px-8 lg:px-14 lg:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex items-start justify-between gap-5">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Session active · Practical 01</div>
                <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl">Explore the language <span className="text-cyan-300">of molecules.</span></h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Represent, identify, and understand chemical structures through an interactive visual lab.</p>
              </div>
              <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-right sm:block"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Progress</p><p className="mt-1 text-xl font-bold text-white">{activeTab === 'spot-error' ? `${errorScore}/4` : `${colourScore}/${colourTotal}`}</p></div>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 lg:hidden">
              {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveTab(id)} className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${activeTab === id ? 'bg-cyan-300 text-black' : 'text-slate-400'}`}><Icon size={14} />{label}</button>)}
            </div>

            {activeTab === 'overview' && <Overview onStart={(tab) => setActiveTab(tab)} />}
            {activeTab === 'smiles' && <SmilesToolkit smiles={smiles} onSmilesChange={setSmiles} onOpenVisualizer={() => setActiveTab('visualizer')} />}
            {activeTab === 'visualizer' && <Visualizer molecule={visualMolecule} mode={visualMode} onMoleculeChange={setVisualMolecule} onModeChange={setVisualMode} />}
            {activeTab === 'descriptors' && <Descriptors smiles={smiles} />}
            {activeTab === 'colour-id' && <ColourId answers={colourAnswers} onAnswer={(key, value) => setColourAnswers((current) => ({ ...current, [key]: value }))} submitted={colourSubmitted} score={colourScore} total={colourTotal} onSubmit={() => setColourSubmitted(true)} onReset={resetColourQuiz} />}
            {activeTab === 'spot-error' && <SpotError question={currentError} index={errorIndex} score={errorScore} answered={errorAnswered} completed={completedQuestions} onAnswer={chooseErrorAnswer} onNext={nextErrorQuestion} onReset={resetErrorGame} />}

            <footer className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>Built for focused scientific learning</span><span>Developer · KOTHALA D V V DEEPTHI MAHI</span></footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function Overview({ onStart }: { onStart: (tab: Tab) => void }) {
  return <div className="space-y-5">
    <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-slate-950 to-slate-950 p-7 sm:p-9"><div className="absolute -right-10 -top-12 text-cyan-300/10"><Atom size={220} strokeWidth={1} /></div><div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.17em] text-cyan-300"><Sparkles size={12} /> Learning objective</span><h2 className="mt-6 max-w-lg text-2xl font-semibold text-white sm:text-3xl">See chemistry in a new dimension.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">Use visual patterns to recognise atoms, decode molecule colours, and sharpen your scientific eye.</p><button onClick={() => onStart('smiles')} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Open SMILES toolkit <ChevronRight size={16} /></button></div></div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7"><div className="flex items-center justify-between"><div className="rounded-xl bg-emerald-400/10 p-3 text-emerald-300"><Trophy size={19} /></div><span className="text-xs text-slate-500">Today’s lab</span></div><p className="mt-8 text-4xl font-bold text-white">02</p><p className="mt-1 text-sm text-slate-400">interactive activities</p><div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/3 rounded-full bg-emerald-400" /></div><p className="mt-3 text-xs text-slate-500">Start with the colour system, then test your eye.</p></div>
    </section>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[['01','SMILES toolkit','Convert a compact chemical string into a readable formula and structure summary.','smiles'],['02','2D / 3D visualizer','Inspect familiar molecules in a clean visual model.','visualizer'],['03','Molecular descriptors','Review weight, LogP, TPSA, donors, acceptors, rotatable bonds, and rings.','descriptors'],['04','Molecular colour ID','Learn the standard CPK colours used to represent atoms.','colour-id'],['05','Spot the error','Decide whether each chemistry statement is accurate.','spot-error'],['06','Build confidence','Review your score and strengthen your visual memory.','colour-id']].map(([number, title, text, tab]) => <button key={number} onClick={() => onStart(tab as Tab)} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05]"><span className="text-xs font-bold tracking-[0.2em] text-cyan-300">{number}</span><h3 className="mt-7 text-base font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-5 text-slate-500">{text}</p><ChevronRight size={16} className="mt-5 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-300" /></button>)}</section>
  </div>;
}

const descriptorSets: Record<string, { name: string; formula: string; weight: string; logP: string; tpsa: string; donors: string; acceptors: string; rotatable: string; rings: string }> = {
  CCO: { name: 'Ethanol', formula: 'C₂H₆O', weight: '46.07 g/mol', logP: '-0.31', tpsa: '20.23 Å²', donors: '1', acceptors: '1', rotatable: '0', rings: '0' },
  'c1ccccc1': { name: 'Benzene', formula: 'C₆H₆', weight: '78.11 g/mol', logP: '1.69', tpsa: '0.00 Å²', donors: '0', acceptors: '0', rotatable: '0', rings: '1' },
  C: { name: 'Methane', formula: 'CH₄', weight: '16.04 g/mol', logP: '0.64', tpsa: '0.00 Å²', donors: '0', acceptors: '0', rotatable: '0', rings: '0' },
};

function getDescriptorSet(smiles: string) {
  return descriptorSets[smiles] ?? { name: 'Custom molecule', formula: '—', weight: 'Pending', logP: 'Pending', tpsa: 'Pending', donors: 'Pending', acceptors: 'Pending', rotatable: 'Pending', rings: 'Pending' };
}

function SmilesToolkit({ smiles, onSmilesChange, onOpenVisualizer }: { smiles: string; onSmilesChange: (value: string) => void; onOpenVisualizer: () => void }) {
  const molecule = getDescriptorSet(smiles);
  const valid = /^[A-Za-z0-9@+\-\[\]()=#\\/.]+$/.test(smiles);
  return <div><div className="mb-7"><span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Core tool 01</span><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">SMILES toolkit</h2><p className="mt-2 max-w-xl text-sm text-slate-500">Convert a molecular line notation into a friendly structure summary.</p></div><div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><label className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500" htmlFor="smiles-input">Enter SMILES notation</label><div className="mt-3 flex gap-2"><input id="smiles-input" value={smiles} onChange={(event) => onSmilesChange(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-cyan-200 outline-none transition focus:border-cyan-300/60" placeholder="Example: CCO" /><button onClick={onOpenVisualizer} className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-black hover:bg-cyan-200">Visualize</button></div><div className="mt-4 flex flex-wrap gap-2">{['CCO', 'c1ccccc1', 'C'].map((example) => <button key={example} onClick={() => onSmilesChange(example)} className="rounded-lg border border-white/10 px-3 py-1.5 font-mono text-xs text-slate-400 transition hover:border-cyan-300/40 hover:text-cyan-200">{example}</button>)}</div><p className={`mt-5 text-xs ${valid ? 'text-emerald-300' : 'text-red-300'}`}>{valid ? 'Notation accepted · ready for interpretation' : 'Use standard SMILES characters to continue'}</p></section><section className="rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.05] p-6 sm:p-8"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Interpretation</span><Code2 size={18} className="text-cyan-300/60" /></div><p className="mt-8 text-3xl font-bold text-white">{molecule.name}</p><p className="mt-2 font-mono text-sm text-cyan-200">{molecule.formula}</p><div className="mt-8 grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="text-slate-500">Input string</p><p className="mt-1 font-mono text-white">{smiles || '—'}</p></div><div className="rounded-xl border border-white/10 bg-black/20 p-3"><p className="text-slate-500">Next step</p><p className="mt-1 text-white">2D structure view</p></div></div></section></div></div>;
}

function Visualizer({ molecule, mode, onMoleculeChange, onModeChange }: { molecule: string; mode: '2D' | '3D'; onMoleculeChange: (value: string) => void; onModeChange: (value: '2D' | '3D') => void }) {
  const atomMap: Record<string, { formula: string; atoms: { label: string; color: string; x: string; y: string }[] }> = { Ethanol: { formula: 'C₂H₆O', atoms: [{ label: 'C', color: '#334155', x: '32%', y: '51%' }, { label: 'C', color: '#334155', x: '53%', y: '51%' }, { label: 'O', color: '#ef4444', x: '73%', y: '51%' }, { label: 'H', color: '#f8fafc', x: '21%', y: '30%' }, { label: 'H', color: '#f8fafc', x: '42%', y: '72%' }, { label: 'H', color: '#f8fafc', x: '63%', y: '30%' }] }, Benzene: { formula: 'C₆H₆', atoms: [{ label: 'C', color: '#334155', x: '30%', y: '35%' }, { label: 'C', color: '#334155', x: '70%', y: '35%' }, { label: 'C', color: '#334155', x: '80%', y: '65%' }, { label: 'C', color: '#334155', x: '50%', y: '82%' }, { label: 'C', color: '#334155', x: '20%', y: '65%' }, { label: 'C', color: '#334155', x: '50%', y: '18%' }] }, Methane: { formula: 'CH₄', atoms: [{ label: 'C', color: '#334155', x: '50%', y: '50%' }, { label: 'H', color: '#f8fafc', x: '50%', y: '17%' }, { label: 'H', color: '#f8fafc', x: '50%', y: '83%' }, { label: 'H', color: '#f8fafc', x: '20%', y: '50%' }, { label: 'H', color: '#f8fafc', x: '80%', y: '50%' }] } };
  const model = atomMap[molecule];
  return <div><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Core tool 02</span><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">2D / 3D visualizer</h2><p className="mt-2 text-sm text-slate-500">Explore how atoms arrange themselves inside familiar molecules.</p></div><select value={molecule} onChange={(event) => onMoleculeChange(event.target.value)} className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none"><option>Ethanol</option><option>Benzene</option><option>Methane</option></select></div><div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f12]"><div className="flex items-center justify-between border-b border-white/10 p-4"><div><p className="font-semibold text-white">{molecule} <span className="ml-2 font-mono text-xs text-cyan-300">{model.formula}</span></p><p className="mt-1 text-xs text-slate-500">Interactive molecular model</p></div><div className="flex rounded-lg border border-white/10 p-1">{(['2D', '3D'] as const).map((item) => <button key={item} onClick={() => onModeChange(item)} className={`rounded-md px-3 py-1.5 text-xs font-bold ${mode === item ? 'bg-cyan-300 text-black' : 'text-slate-500'}`}>{item}</button>)}</div></div><div className={`relative h-[380px] overflow-hidden bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.09),transparent_45%)] ${mode === '3D' ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}`}><div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:40px_40px]" />{model.atoms.map((atom, index) => <div key={`${atom.label}-${index}`} className="absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/40 text-sm font-bold text-slate-900 shadow-[0_0_28px_rgba(103,232,249,0.25)] transition-all duration-700" style={{ left: atom.x, top: atom.y, backgroundColor: atom.color, transform: `${mode === '3D' ? `translate(-50%, -50%) scale(${index % 2 ? 0.82 : 1.08}) rotate(${index * 7}deg)` : 'translate(-50%, -50%)'}` }}>{atom.label}</div>)}{model.atoms.slice(0, -1).map((_, index) => <div key={`bond-${index}`} className="absolute left-[30%] top-1/2 h-px w-[40%] bg-cyan-200/30" style={{ transform: `rotate(${index * 9 - 15}deg)` }} />)}<p className="absolute bottom-5 left-5 text-xs text-slate-600">{mode === '3D' ? 'Depth preview · rotate model conceptually' : '2D ball-and-stick preview'}</p></div></div></div>;
}

function Descriptors({ smiles }: { smiles: string }) {
  const molecule = getDescriptorSet(smiles);
  const values = [['Molecular weight', molecule.weight], ['LogP', molecule.logP], ['TPSA', molecule.tpsa], ['H-bond donors', molecule.donors], ['H-bond acceptors', molecule.acceptors], ['Rotatable bonds', molecule.rotatable], ['Ring count', molecule.rings]];
  return <div><div className="mb-7"><span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Core tool 03</span><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Molecular descriptors</h2><p className="mt-2 text-sm text-slate-500">Read the properties that help describe a molecule’s behaviour.</p></div><div className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:flex-row sm:items-center"><div><p className="text-xs uppercase tracking-[0.15em] text-slate-500">Current molecule</p><p className="mt-1 text-lg font-semibold text-white">{molecule.name} <span className="ml-2 font-mono text-xs text-cyan-300">{molecule.formula}</span></p></div><p className="font-mono text-xs text-slate-500">SMILES · {smiles || '—'}</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{values.map(([label, value], index) => <div key={label} className={`rounded-2xl border border-white/10 bg-white/[0.035] p-5 ${index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}`}><p className="text-xs text-slate-500">{label}</p><p className="mt-3 text-2xl font-bold text-white">{value}</p><div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300/60" style={{ width: value === 'Pending' ? '15%' : `${35 + index * 8}%` }} /></div></div>)}</div></div>;
}

function ColourId({ answers, onAnswer, submitted, score, total, onSubmit, onReset }: { answers: Record<string, ColourOption>; onAnswer: (key: string, value: ColourOption) => void; submitted: boolean; score: number; total: number; onSubmit: () => void; onReset: () => void }) {
  const options: { value: ColourOption; label: string; swatch: string }[] = [{ value: 'red', label: 'Red', swatch: '#ef4444' }, { value: 'blue', label: 'Blue', swatch: '#2563eb' }, { value: 'white', label: 'White', swatch: '#f8fafc' }, { value: 'green', label: 'Green', swatch: '#22c55e' }, { value: 'black', label: 'Black', swatch: '#1f2937' }];
  return <div><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Activity 01</span><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Molecule colour ID</h2><p className="mt-2 text-sm text-slate-500">Match each atom to its standard molecular model colour.</p></div><button onClick={onReset} className="inline-flex items-center gap-2 self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"><RotateCcw size={14} /> Reset</button></div><div className="space-y-4">{molecules.map((molecule) => <div key={molecule.name} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex-1"><div className="flex items-baseline gap-3"><h3 className="text-lg font-semibold text-white">{molecule.name}</h3><span className="font-mono text-xs text-cyan-300">{molecule.formula}</span></div><p className="mt-2 text-sm leading-5 text-slate-500">{molecule.description}</p><div className="mt-4 flex -space-x-2">{molecule.colors.map((atom) => <span key={atom.label} className="h-7 w-7 rounded-full border-2 border-[#111]" style={{ backgroundColor: atom.hex }} title={atom.label} />)}</div></div><div className="grid flex-1 gap-3 sm:max-w-[390px]">{molecule.colors.map((atom) => { const key = `${molecule.name}-${atom.label}`; const selected = answers[key]; const correct = selected === atom.color; return <div key={atom.label} className="flex items-center gap-3"><span className="w-20 text-xs font-medium text-slate-400">{atom.label}</span><div className="flex flex-1 gap-1.5">{options.map((option) => <button key={option.value} aria-label={`${atom.label}: ${option.label}`} onClick={() => onAnswer(key, option.value)} className={`h-8 flex-1 rounded-lg border transition ${selected === option.value ? 'border-cyan-300 ring-2 ring-cyan-300/20' : 'border-white/10 hover:border-white/30'} ${submitted && selected === option.value ? (correct ? 'border-emerald-400' : 'border-red-400') : ''}`} style={{ backgroundColor: option.swatch }} />)}</div>{submitted && (correct ? <Check size={15} className="text-emerald-400" /> : <X size={15} className="text-red-400" />)}</div>; })}</div></div></div>)}</div><div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-white">Ready to check your answers?</p><p className="mt-1 text-xs text-slate-500">Identify all {total} atoms to complete this activity.</p></div><button onClick={onSubmit} disabled={Object.keys(answers).length !== total} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-30">{submitted ? `Score ${score}/${total}` : 'Check answers'}</button></div></div>;
}

function SpotError({ question, index, score, answered, completed, onAnswer, onNext, onReset }: { question: typeof errorQuestions[number]; index: number; score: number; answered: boolean | null; completed: number; onAnswer: (answer: boolean) => void; onNext: () => void; onReset: () => void }) {
  return <div><div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">Activity 02</span><h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Spot the error</h2><p className="mt-2 text-sm text-slate-500">Trust your chemistry instincts. Is the statement true or false?</p></div><button onClick={onReset} className="inline-flex items-center gap-2 self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white"><RotateCcw size={14} /> Restart</button></div><div className="rounded-3xl border border-emerald-300/20 bg-gradient-to-br from-emerald-300/[0.09] to-slate-950 p-6 sm:p-10"><div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-semibold text-emerald-300"><CircleAlert size={16} /> Question {index + 1} of {errorQuestions.length}</div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">Score {score}</span></div><div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-300 transition-all" style={{ width: `${(completed / errorQuestions.length) * 100}%` }} /></div><h3 className="mx-auto mt-12 max-w-2xl text-center text-2xl font-semibold leading-9 text-white sm:text-4xl sm:leading-[1.25]">“{question.statement}”</h3><div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-3"><button onClick={() => onAnswer(true)} className={`rounded-xl border px-4 py-4 text-sm font-bold transition ${answered === true ? (question.answer ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300' : 'border-red-400 bg-red-400/15 text-red-300') : 'border-white/10 bg-white/5 text-slate-300 hover:border-emerald-300/50 hover:text-white'}`}>True</button><button onClick={() => onAnswer(false)} className={`rounded-xl border px-4 py-4 text-sm font-bold transition ${answered === false ? (!question.answer ? 'border-emerald-400 bg-emerald-400/15 text-emerald-300' : 'border-red-400 bg-red-400/15 text-red-300') : 'border-white/10 bg-white/5 text-slate-300 hover:border-red-300/50 hover:text-white'}`}>False</button></div>{answered !== null && <div className={`mx-auto mt-6 max-w-md rounded-xl border p-4 text-center text-sm ${answered === question.answer ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300' : 'border-red-400/20 bg-red-400/10 text-red-300'}`}><p className="font-semibold">{answered === question.answer ? 'Correct call.' : 'Look closely.'}</p><p className="mt-1 text-xs opacity-80">{question.explanation}</p></div>} {answered !== null && <button onClick={onNext} className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200">{index === errorQuestions.length - 1 ? 'Play again' : 'Next question'} <ChevronRight size={16} /></button>}</div><div className="mt-5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-slate-500"><Lightbulb size={16} className="mt-0.5 shrink-0 text-amber-300" /><p>The CPK colour system is a convention used to make molecular models easy to read across chemistry software and textbooks.</p></div></div>;
}

export default App;
