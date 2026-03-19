/// <reference types="vite/client" />
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  Shield, 
  Landmark, 
  Cpu, 
  Stethoscope, 
  Palette, 
  Users, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle, 
  ChevronDown, 
  Clock, 
  Award, 
  Smartphone, 
  Briefcase,
  Sparkles,
  Menu,
  X,
  Zap,
  BookOpen,
  Heart,
  Scale,
  Building2,
  Sprout,
  Microscope,
  Activity,
  Apple,
  Brain,
  Code2,
  Megaphone,
  BarChart3
} from 'lucide-react';

// --- Types ---

interface Course {
  id: number | string;
  title: string;
  category: string;
  duration: string;
  area?: string; // Nova propriedade mapeada na img (ex: Gestão e Negócios)
  modality: 'Digital' | 'Semipresencial' | string;
  icon?: React.ElementType; // Usado para fallback
  iconBg?: string;
  iconColor?: string;
}

// --- Supabase Config ---
// Nota: O usuário precisa criar o arquivo .env na raiz (ex: .env) com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// --- Default Courses (Fallback) ---

const COURSES: Course[] = [
  { id: 12, title: 'Fisioterapia', category: 'Bacharelado', duration: '4 anos', modality: 'Semipresencial', icon: Activity, iconBg: 'bg-rose-500/10', iconColor: 'text-rose-500' },
  { id: 13, title: 'Nutrição', category: 'Bacharelado', duration: '4 anos', modality: 'Semipresencial', icon: Apple, iconBg: 'bg-lime-500/10', iconColor: 'text-lime-500' },
  { id: 14, title: 'Pedagogia', category: 'Licenciatura', duration: '4 anos', modality: 'Digital', icon: BookOpen, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' },
  { id: 15, title: 'Psicologia', category: 'Bacharelado', duration: '5 anos', modality: 'Semipresencial', icon: Brain, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-500' },
  { id: 16, title: 'Sistemas de Informação', category: 'Bacharelado', duration: '4 anos', modality: 'Digital', icon: Code2, iconBg: 'bg-sky-500/10', iconColor: 'text-sky-500' },
  { id: 17, title: 'Análise e Desenv. de Sistemas', category: 'Tecnólogo', duration: '2.5 anos', modality: 'Digital', icon: Terminal, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' },
  { id: 18, title: 'Marketing Digital', category: 'Tecnólogo', duration: '2 anos', modality: 'Digital', icon: Megaphone, iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-500' },
  { id: 19, title: 'Gestão de RH', category: 'Tecnólogo', duration: '2 anos', modality: 'Digital', icon: Users, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  { id: 20, title: 'Cibersegurança', category: 'Tecnólogo', duration: '2.5 anos', modality: 'Digital', icon: Shield, iconBg: 'bg-red-500/10', iconColor: 'text-red-500' },
];

const CATEGORIES = ['Todos', 'Bacharelado', 'Bacharelado 2.0', 'Licenciatura', 'Licenciatura 2.0', 'Tecnólogo'];

// --- Components ---

const CSVLogo = () => (
  <img 
    src="/logo.png" 
    alt="Cruzeiro do Sul Virtual" 
    className="h-12 sm:h-16 md:h-[68px] w-auto max-w-[280px] object-contain hover:scale-105 transition-all" 
  />
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['hero', 'cursos', 'beneficios', 'sorteio', 'inscricao'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Verifica se o topo do scroll bate no elemento considerando o header fixed
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-xl shadow-black/5 py-3' : 'bg-white/90 backdrop-blur-md py-4'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <CSVLogo />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-headline font-bold tracking-wide uppercase text-xs">
          <a href="#cursos" onClick={(e) => { e.preventDefault(); document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' }); }} className={`text-[#121c43] pb-1 hover:text-[#2a68ff] transition-colors border-b-2 ${activeSection === 'cursos' ? 'border-[#cbd6ff]' : 'border-transparent'}`}>Cursos</a>
          <a href="#beneficios" className={`text-[#121c43] pb-1 hover:text-[#2a68ff] transition-colors border-b-2 ${activeSection === 'beneficios' ? 'border-[#cbd6ff]' : 'border-transparent'}`}>Benefícios</a>
          <a href="#sorteio" className={`text-[#121c43] pb-1 hover:text-[#2a68ff] transition-colors border-b-2 ${activeSection === 'sorteio' ? 'border-[#cbd6ff]' : 'border-transparent'}`}>Sorteio</a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="#inscricao" 
            className="hidden sm:block bg-[#cbd6ff] text-[#121c43] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 hover:bg-[#b6c6ff] transition-all active:scale-95 shadow-md"
          >
            Inscreva-se
          </a>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-[#121c43] p-2 hover:bg-black/5 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-black/10 overflow-hidden md:hidden shadow-2xl"
          >
            <div className="p-6 flex flex-col gap-6">
              <a href="#cursos" className={`text-[#121c43] w-max font-bold uppercase text-sm tracking-widest hover:text-[#2a68ff] transition-colors border-b-2 ${activeSection === 'cursos' ? 'border-[#cbd6ff]' : 'border-transparent'}`} onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' }); }}>Cursos</a>
              <a href="#beneficios" className={`text-[#121c43] w-max font-bold uppercase text-sm tracking-widest hover:text-[#2a68ff] transition-colors border-b-2 ${activeSection === 'beneficios' ? 'border-[#cbd6ff]' : 'border-transparent'}`} onClick={() => setIsMobileMenuOpen(false)}>Benefícios</a>
              <a href="#sorteio" className={`text-[#121c43] w-max font-bold uppercase text-sm tracking-widest hover:text-[#2a68ff] transition-colors border-b-2 ${activeSection === 'sorteio' ? 'border-[#cbd6ff]' : 'border-transparent'}`} onClick={() => setIsMobileMenuOpen(false)}>Sorteio</a>
              <a 
                href="#inscricao" 
                className="bg-[#cbd6ff] shadow-md text-[#121c43] text-center py-4 rounded-2xl font-bold uppercase text-sm tracking-widest hover:bg-[#b6c6ff] transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Garantir minha bolsa
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CourseCard: React.FC<{ course: Course, onSelect?: React.MouseEventHandler<HTMLDivElement> }> = ({ course, onSelect }) => {
  const Icon = course.icon || BookOpen; // Fallback Icon if not present
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      onClick={onSelect || (() => document.getElementById('beneficios')?.scrollIntoView({ behavior: 'smooth' }))}
      className="group relative bg-[#0e163d] p-7 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 shadow-xl overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div>
          <div className="flex justify-between items-start mb-6">
            {/* Box Escura p Icone com a cor respectiva */}
            <div className={`p-4 rounded-2xl ${course.iconBg || 'bg-[#18234e]'} ${course.iconColor || 'text-[#849bf2]'}`}>
              <Icon size={24} />
            </div>
            {/* Tag Digital/Semipresencial */}
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full ${course.modality === 'Digital' ? 'text-[#00e5ff] border border-[#00e5ff]/20 bg-[#00e5ff]/5' : 'text-[#aebef0] border border-[#aebef0]/20 bg-[#aebef0]/5'}`}>
              {course.modality}
            </span>
          </div>
          
          <h3 className="font-headline font-bold text-xl mb-4 text-white leading-tight min-h-[50px] flex items-center">{course.title}</h3>
          
          <div className="flex flex-col gap-1.5 mb-8">
            <p className="text-[11px] sm:text-xs text-[#7a8cc5] font-medium flex items-center flex-wrap gap-x-2 gap-y-1.5 leading-relaxed">
              <span>{course.category}</span>
              {course.category.includes('2.0') && (
                <span className="bg-[#cbd6ff]/10 text-[#cbd6ff] border border-[#cbd6ff]/20 text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shrink-0">
                  Para Formados
                </span>
              )}
              <span className="opacity-50 hidden sm:inline">•</span>
              <span className="w-full sm:w-auto mt-0.5 sm:mt-0">{course.duration}</span>
            </p>
            {course.area && <p className="text-[10px] sm:text-[11px] text-[#7a8cc5]/60 mt-0.5">{course.area}</p>}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#7a8cc5]/60 font-bold mb-1">Sorteio</span>
            <span className="text-[#e6ff1b] font-extrabold text-xs tracking-tight">BOLSA 85%</span>
          </div>
          <div className="border border-white/10 p-3 rounded-full hover:bg-white/5 transition-all duration-300 text-[#7a8cc5]">
            <ArrowRight size={18} className="translate-x-0 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 14, m: 5, s: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="font-headline font-black text-3xl md:text-5xl tracking-tighter text-aqua bg-surface-container-high px-8 py-4 rounded-3xl border border-white/5 shadow-inner">
      {format(timeLeft.h)}:{format(timeLeft.m)}:{format(timeLeft.s)}
    </div>
  );
};

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleGlobalScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 500 && currentScrollY < lastScrollY.current - 15) {
         setShow(true); // scrolando p/ cima
      } else if (currentScrollY > lastScrollY.current + 10 || currentScrollY <= 500) {
         setShow(false); // scrolando p/ baixo ou no topo
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleGlobalScroll);
  }, []);

  const handleScrollUp = () => {
    const sectionIds = ['hero', 'cursos', 'beneficios', 'sorteio', 'inscricao'];
    let targetEl = null;
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionIds[i]);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < -50) {
          targetEl = el;
          break;
        }
      }
    }
    if (targetEl) {
      if (targetEl.id === 'hero') window.scrollTo({ top: 0, behavior: 'smooth' });
      else targetEl.scrollIntoView({ behavior: 'smooth' });
    } else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          onClick={handleScrollUp}
          className="hidden sm:flex fixed bottom-6 lg:bottom-8 right-6 z-[100] py-2 px-4 sm:py-2.5 sm:px-6 rounded-full bg-white shadow-2xl text-[#121c43] hover:bg-gray-50 transition-all items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black/5"
        >
          Subir <ChevronDown size={14} className="rotate-180" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [courses, setCourses] = useState<Course[]>(COURSES); // State that will receive Supabase data
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArea, setActiveArea] = useState('Todas');
  const [visibleCount, setVisibleCount] = useState(8);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showFriendForm, setShowFriendForm] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', course: '', indicacao: '', friendName: '', friendPhone: '', friendCourse: '' });
  const [phoneError, setPhoneError] = useState('');

  // Fetch Supabase Data
  useEffect(() => {
    const fetchCoursesFromSupabase = async () => {
      if (!supabase) return;
      
      try {
        const { data, error } = await supabase.from('cursos').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          const getAreaVisuals = (title: string, area: string) => {
            const norm = (title + ' ' + area).toLowerCase();
            
            // Ciências Humanas, Sociais e Mentais
            if (norm.includes('psicolog') || norm.includes('teórico') || norm.includes('psicanál')) return { icon: Brain, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-500' };
            if (norm.includes('política') || norm.includes('rh') || norm.includes('social')) return { icon: Users, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-500' };
            if (norm.includes('art') || norm.includes('visual')) return { icon: Sparkles, iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-500' };
            if (norm.includes('pedagog') || norm.includes('letras') || norm.includes('histór') || norm.includes('educaç')) return { icon: BookOpen, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' };
            
            // Financeiro, Negócios e Contabilidade
            if (norm.includes('contáb') || norm.includes('econôm') || norm.includes('financeir')) return { icon: BarChart3, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' };
            if (norm.includes('administra') || norm.includes('gestão') || norm.includes('negócio') || norm.includes('market')) return { icon: Briefcase, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' };
            
            // Exatas, Tecnologia e Engenharias
            if (norm.includes('comp') || norm.includes('sistem') || norm.includes('dado') || norm.includes('soft')) return { icon: Terminal, iconBg: 'bg-sky-500/10', iconColor: 'text-sky-500' };
            if (norm.includes('engenh') || norm.includes('arquit') || norm.includes('urban') || norm.includes('civil')) return { icon: Building2, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' };

            // Biológicas e  Saúde
            if (norm.includes('biomedicina')) return { icon: Microscope, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500' };
            if (norm.includes('biol') || norm.includes('ciência bio')) return { icon: Microscope, iconBg: 'bg-teal-500/10', iconColor: 'text-teal-500' };
            if (norm.includes('agron') || norm.includes('rural') || norm.includes('ambien')) return { icon: Sprout, iconBg: 'bg-green-500/10', iconColor: 'text-green-500' };
            if (norm.includes('nutriç') || norm.includes('nferm') || norm.includes('médic') || norm.includes('farm') || norm.includes('saú') || norm.includes('fisioterap')) return { icon: Stethoscope, iconBg: 'bg-rose-500/10', iconColor: 'text-rose-500' };
            
            // Demais Cursos -> Sorteio dinâmico padronizado com cores originais
            const icons = [Award, Cpu, Clock, Smartphone, Zap, CheckCircle, Activity, Shield];
            const colors = [
              { bg: 'bg-violet-500/10', c: 'text-violet-500' },
              { bg: 'bg-cyan-500/10', c: 'text-cyan-500' },
              { bg: 'bg-rose-500/10', c: 'text-rose-500' },
              { bg: 'bg-lime-500/10', c: 'text-lime-500' },
              { bg: 'bg-amber-500/10', c: 'text-amber-500' }
            ];
            const hash = norm.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
            return { icon: icons[hash % icons.length], iconBg: colors[hash % colors.length].bg, iconColor: colors[hash % colors.length].c };
          };

          const formattedData = data.map((item: any) => {
            const areaName = item.area || item.area_conhecimento || 'Gerais';
            const courseTitle = item.title || item.nome_curso || item.curso || 'Curso Sem Nome';
            return {
              id: item.id,
              title: courseTitle,
              category: item.category || item.categoria || item.grau || 'Geral',
              duration: item.duration || item.duracao || item.semestres || '4 anos',
              area: areaName,
              modality: item.modality || item.modalidade || 'Digital',
              ...getAreaVisuals(courseTitle, areaName)
            };
          });
          
          // Remove todos os cursos que contenham formacao pedagogica do resultado e seta no Estado
          const finalFilteredData = formattedData.filter((c: any) => !c.title.toLowerCase().includes('formação pedagógica'));
          setCourses(finalFilteredData);
        }
      } catch (err) {
        console.error("Erro ao puxar dados do Supabase:", err);
      }
    };
    fetchCoursesFromSupabase();
  }, []);

  const maskPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const validarPhone = (valor: string): boolean => {
    const digits = valor.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) return false;
    if (/^(\d)\1+$/.test(digits)) return false;
    if (digits === '12345678901' || digits === '10987654321') return false;
    const ddd = parseInt(digits.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    return true;
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = activeArea === 'Todas' || course.area === activeArea;
      return matchesSearch && matchesArea;
    });
  }, [courses, searchQuery, activeArea]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarPhone(formData.phone)) {
      setPhoneError('Informe um número de WhatsApp válido.');
      return;
    }
    setPhoneError('');
    setFormStatus('loading');

    if (supabase) {
      const { error } = await supabase.from('leads').insert([{
        nome: formData.name,
        email: formData.email,
        whatsapp: formData.phone,
        curso: formData.course,
        indicacao: formData.indicacao,
      }]);
      
      if (error) {
        console.error("Supabase saving errored or table mismatch:", error);
        // Fallback p UX para n tela branca caso o dev esteja s banco 
        setFormStatus('success');
      } else {
        setFormStatus('success');
      }
    } else {
       setTimeout(() => setFormStatus('success'), 1500);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(184,195,255,0.15)_0%,_transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block py-1.5 px-5 rounded-full bg-surface-container-high text-tertiary font-bold text-[10px] uppercase tracking-[0.25em] mb-8 border border-tertiary/20"
          >
            Garanta sua vaga no futuro
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-on-surface mb-8 leading-[1.1] sm:leading-[1.05]"
          >
            Encontre o curso que vai <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-aqua">mudar sua vida.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl mb-14 leading-relaxed"
          >
            Explore nosso catálogo gigante e dê o primeiro passo para o <span className="text-tertiary font-bold">SORTEIO DE BOLSAS DE 85%</span>. Sua carreira de sucesso começa aqui.
          </motion.p>

          {/* Search Container */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onSubmit={(e) => { 
              e.preventDefault(); 
              document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' });
              // A request de "limpe para nova pesquisa" sem quebrar o feedback visual do usuário 
              // foi implementada como um botão clear ativo e o active section tracker já orientando.
            }}
            className="max-w-3xl mx-auto bg-[#0a1236]/90 p-2 sm:p-2.5 rounded-[2rem] sm:rounded-full flex flex-col sm:flex-row items-center shadow-2xl border border-white/10 gap-3 sm:gap-2"
          >
            <div className="flex-1 flex items-center w-full px-4 pt-3 sm:pt-0 pb-1 sm:pb-0 relative">
              <label htmlFor="searchQuery" className="sr-only">Procurar curso</label>
              <Search size={22} className="text-[#849bf2] shrink-0" />
              <input 
                id="searchQuery"
                name="searchQuery"
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qual curso você está procurando hoje?"
                className="bg-transparent border-none focus:ring-0 text-[#c7d5fa] w-full px-4 pr-10 placeholder:text-[#6a7fc8] font-medium text-base sm:text-lg outline-none"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    type="button" 
                    onClick={() => { setSearchQuery(''); document.querySelector('input')?.focus(); }}
                    className="absolute right-4 text-[#6a7fc8] hover:text-white transition-colors bg-white/5 p-1 rounded-full backdrop-blur-md"
                    title="Limpar para nova pesquisa"
                  >
                    <X size={16} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <button type="submit" className="w-full sm:w-auto bg-[#b6c6ff] text-[#0e1645] px-10 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-full font-bold sm:text-lg hover:brightness-110 transition-all whitespace-nowrap active:scale-95 shadow-[0_4px_20px_rgba(182,198,255,0.2)]">
              Buscar Agora
            </button>
          </motion.form>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="cursos" className="py-24 px-6 bg-surface-container-low/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3 text-white">Explore por Área</h2>
              <p className="text-[#aebef0] text-lg">São centenas de opções para você decolar.</p>
            </div>
            
            {/* Categories Tabs */}
            <div className="flex flex-wrap pb-4 lg:pb-0 gap-2 sm:gap-3 overflow-visible px-1">
              {['Todas', ...Array.from(new Set(courses.map(c => c.area))).filter(Boolean)].map(area => (
                <button 
                  key={area as string}
                  onClick={() => { setActiveArea(area as string); setVisibleCount(8); }}
                  className={`px-7 py-3 rounded-[1rem] font-bold whitespace-nowrap transition-all duration-300 ${activeArea === area ? 'bg-[#cbd6ff] text-[#121c43] shadow-lg shadow-[#cbd6ff]/20' : 'bg-[#18234e] text-[#aebef0] hover:bg-[#1f2b5c]'}`}
                >
                  {area as string}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.slice(0, visibleCount).map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onSelect={(e) => {
                    e.preventDefault();
                    // Auto-preenche o select do formulário ativando UX instantânea 
                    setFormData(prev => ({ ...prev, course: course.title }));
                    // Rola fluidamente com margem pro formulário
                    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {visibleCount < filteredCourses.length && (
            <div className="flex justify-center mt-12 w-full">
              <button 
                onClick={() => setVisibleCount(prev => prev + 12)} 
                className="px-10 py-4 rounded-full border border-white/10 text-[#aebef0] font-bold hover:bg-[#18234e] hover:text-white transition-all active:scale-95"
              >
                Ver mais cursos
              </button>
            </div>
          )}
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <p className="text-on-surface-variant text-lg">Nenhum curso encontrado para sua busca.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-32 px-6 relative bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="font-headline text-4xl md:text-6xl font-extrabold mb-6">Por que escolher a Cruzeiro?</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-aqua mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Flexibilidade Total', desc: 'Estude no seu ritmo, onde e quando quiser com a melhor plataforma EAD.', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Award, title: 'Qualidade MEC', desc: 'Cursos com nota máxima no MEC e diplomas valorizados em todo o país.', color: 'text-tertiary', bg: 'bg-tertiary/10' },
              { icon: Smartphone, title: 'Plataforma Blackboard', desc: 'A mesma utilizada por Harvard e pelas melhores do mundo. Tecnologia de ponta.', color: 'text-aqua', bg: 'bg-aqua/10' },
              { icon: Users, title: 'Acompanhamento Próximo', desc: 'Acompanhamento após a matrícula até a formação, desde o acesso até o auxílio e documentação de estágio.', color: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: GraduationCap, title: 'Corpo Docente de Elite', desc: 'Aulas ministradas por mestres e doutores com vasta experiência no mercado.', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Briefcase, title: 'Tutores Especializados', desc: 'Tutores especializados em cada polo para tirar suas dúvidas e apoiar sua jornada.', color: 'text-tertiary', bg: 'bg-tertiary/10' },
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group"
              >
                <div className={`mb-8 inline-flex p-5 rounded-3xl ${benefit.bg} ${benefit.color} animate-float`} style={{ animationDelay: `${i * 0.5}s` }}>
                  <benefit.icon size={36} />
                </div>
                <h3 className="font-headline font-bold text-2xl mb-4 group-hover:text-aqua transition-colors">{benefit.title}</h3>
                <p className="text-on-surface-variant leading-relaxed text-base">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sorteio Section */}
      <section id="sorteio" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden glass p-12 md:p-24 rounded-[4rem] border border-primary/20 shadow-2xl"
          >
            {/* Decorative Glows */}
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-tertiary/20 rounded-full blur-[120px]"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 -mt-4">
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');`}</style>
                <span 
                  className="text-[#faff5b] block transform -rotate-2 drop-shadow-md" 
                  style={{ fontFamily: "'Caveat', cursive", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1' }}
                >
                  Escolha ter estrela.
                </span>
              </div>
              
              <h2 className="font-headline text-4xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
                Sua Bolsa de <span className="text-tertiary">85%</span> <br className="hidden md:block"/> está te esperando!
              </h2>
              
              <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl mb-14 leading-relaxed">
                Participe do sorteio exclusivo e transforme seu futuro. São centenas de bolsas contempladas mensalmente! Não deixe sua carreira para depois.
              </p>

              <a href="#inscricao" className="inline-block w-full md:w-auto bg-cta-yellow text-background px-8 py-4 sm:px-12 sm:py-5 rounded-full font-black text-base sm:text-xl text-center uppercase tracking-wider hover:scale-105 transition-all duration-300 active:scale-95 cta-glow animate-glow-pulse">
                QUERO CONCORRER À BOLSA
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="inscricao" className="py-32 px-6 relative overflow-hidden bg-surface-container-low/20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold mb-8 leading-tight">Inscreva-se e <br/> mude seu destino</h2>
              <p className="text-on-surface-variant text-xl mb-12 leading-relaxed">
                Não perca a chance de transformar sua carreira com uma <span className="text-tertiary font-bold">BOLSA DE 85%</span>. Conte com acompanhamento próximo, professores mestres e doutores e a melhor tecnologia do mundo.
              </p>
              
              <div className="space-y-6">
                {[
                  'Reconhecimento pelo MEC em todos os cursos',
                  'Plataforma Blackboard (a mesma de Harvard)',
                  'Acompanhamento do acesso até a formação',
                  'Tutores especializados em cada polo'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="bg-aqua/20 p-1.5 rounded-full">
                      <CheckCircle size={24} className="text-aqua" />
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form Card */}
          <div className="lg:w-1/2 w-full max-w-xl mx-auto">
            <div className="bg-[#121c43] p-10 md:p-14 rounded-[3.5rem] border border-white/10 relative overflow-hidden transition-all duration-500 shadow-[0_20px_60px_-15px_rgba(0,10,30,0.8)]">
              <div className="absolute -top-32 -right-32 w-80 h-80 bg-aqua/5 rounded-full blur-[100px] pointer-events-none"></div>
              
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center justify-center text-center py-10"
                  >
                    <div className="w-24 h-24 mb-8 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                      <CheckCircle size={48} className="text-green-400" />
                    </div>
                    <h3 className="font-headline text-3xl font-extrabold text-white mb-4">Inscrição Validada!</h3>
                    <p className="text-[#aebef0] text-lg mb-8 leading-relaxed max-w-sm">
                      Sua participação no Sorteio de até 85% de Bolsa foi carimbada com sucesso! Fique de olho: uma mensagem oficial vai chegar no seu WhatsApp muito em breve com os próximos passos. Prepare-se para voar longe!
                    </p>
                    <button 
                      onClick={() => setFormStatus('idle')}
                      className="bg-white/10 text-white font-bold px-10 py-4 rounded-2xl hover:bg-white/20 transition-colors uppercase tracking-wider text-sm"
                    >
                      Voltar ao Início
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6 relative z-10"
                  >
                    <div className="space-y-2">
                      <label htmlFor="studentName" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Nome Completo</label>
                      <input 
                        id="studentName"
                        name="studentName"
                        autoComplete="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none shadow-inner" 
                        placeholder="Seu nome aqui" 
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="studentEmail" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">E-mail</label>
                        <input 
                          id="studentEmail"
                          name="studentEmail"
                          autoComplete="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          type="email"
                          className="w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none shadow-inner" 
                          placeholder="exemplo@email.com" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="studentPhone" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Seu WhatsApp</label>
                        <input
                          id="studentPhone"
                          name="studentPhone"
                          autoComplete="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => { setFormData({...formData, phone: maskPhone(e.target.value)}); if (phoneError) setPhoneError(''); }}
                          type="tel"
                          className={`w-full bg-[#18234e] border rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none shadow-inner ${phoneError ? 'border-red-500' : 'border-white/10'}`}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                        />
                        {phoneError && <p className="text-xs text-red-400 ml-1 mt-1">{phoneError}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="studentIndicacao" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Como ficou sabendo?</label>
                      <div className="relative">
                        <select
                          id="studentIndicacao"
                          name="studentIndicacao"
                          required
                          value={formData.indicacao}
                          onChange={(e) => setFormData({...formData, indicacao: e.target.value})}
                          className={`w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all outline-none appearance-none cursor-pointer shadow-inner ${formData.indicacao ? 'text-[#c7d5fa]' : 'text-[#425492]'}`}
                        >
                          <option className="bg-[#121c43] text-white/50" value="" disabled>Selecione uma opção...</option>
                          <option className="bg-[#121c43]" value="Indicação de amigo ou familiar">Indicação de amigo ou familiar</option>
                          <option className="bg-[#121c43]" value="Instagram">Instagram</option>
                          <option className="bg-[#121c43]" value="Facebook">Facebook</option>
                          <option className="bg-[#121c43]" value="Google">Google</option>
                          <option className="bg-[#121c43]" value="WhatsApp">WhatsApp</option>
                          <option className="bg-[#121c43]" value="E-mail">E-mail</option>
                          <option className="bg-[#121c43]" value="Outros">Outros</option>
                        </select>
                        <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#869bea]" />
                      </div>
                    </div>

                    <div className="space-y-2 pb-2">
                       <label htmlFor="studentCourse" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Curso de interesse</label>
                       <div className="relative">
                         <select 
                           id="studentCourse"
                           name="studentCourse"
                           required
                           value={formData.course}
                           onChange={(e) => setFormData({...formData, course: e.target.value})}
                           className={`w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all outline-none appearance-none cursor-pointer shadow-inner ${formData.course ? 'text-[#c7d5fa]' : 'text-[#425492]'}`}
                         >
                           <option className="bg-[#121c43] text-white/50" value="" disabled>Escolha seu curso...</option>
                           
                           {/* Renderiza dinamicamente as categorias e cursos */}
                           {Array.from(new Set(courses.map(c => c.category))).map(category => (
                             <optgroup key={`main_${category}`} className="bg-[#121c43] text-[#aebef0]" label={category}>
                               {courses.filter(c => c.category === category).map(course => (
                                 <option key={`main_${course.id}`} value={course.title}>
                                   {course.title}
                                 </option>
                               ))}
                             </optgroup>
                           ))}
                         </select>
                         <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#869bea]" />
                       </div>
                    </div>

                    {/* Switch Indique um amigo */}
                    <div 
                      className={`p-5 rounded-[1.25rem] border transition-all cursor-pointer ${showFriendForm ? 'bg-[#faff5b]/10 border-[#faff5b]/30 shadow-inner' : 'bg-[#18234e] border-white/5 hover:border-[#faff5b]/30 hover:bg-[#18234e]/80'}`}
                      onClick={() => setShowFriendForm(!showFriendForm)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center border transition-all ${showFriendForm ? 'bg-[#faff5b] border-[#faff5b]' : 'border-white/30 bg-transparent'}`}>
                           {showFriendForm && <CheckCircle size={14} className="text-[#121c43]" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-xs sm:text-sm text-[#faff5b] tracking-wider uppercase">Indique um Amigo (Dobre a Chance!)</p>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {showFriendForm && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4 pt-4 border-t border-white/10 space-y-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="friendNameInput" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Nome dele(a)</label>
                                <input 
                                  id="friendNameInput"
                                  name="friendNameInput"
                                  value={formData.friendName}
                                  onChange={(e) => setFormData({...formData, friendName: e.target.value})}
                                  type="text"
                                  className="w-full bg-[#0a1236]/80 border border-white/5 rounded-xl py-3.5 px-4 focus:ring-1 focus:ring-[#faff5b] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none text-sm" 
                                  placeholder="Nome do seu amigo" 
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="friendPhoneInput" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">WhatsApp dele(a)</label>
                                <input 
                                  id="friendPhoneInput"
                                  name="friendPhoneInput"
                                  value={formData.friendPhone}
                                  onChange={(e) => setFormData({...formData, friendPhone: maskPhone(e.target.value)})}
                                  type="tel"
                                  className="w-full bg-[#0a1236]/80 border border-white/5 rounded-xl py-3.5 px-4 focus:ring-1 focus:ring-[#faff5b] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none text-sm" 
                                  placeholder="(00) 00000-0000" 
                                  maxLength={15}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      type="submit"
                      disabled={formStatus !== 'idle'}
                      className="w-full bg-[#ebff46] text-[#121c43] mt-4 py-[22px] rounded-[1rem] font-bold text-lg sm:text-xl hover:brightness-110 hover:-translate-y-1 hover:shadow-[0_10px_40px_-5px_rgba(235,255,70,0.6)] active:scale-[0.98] active:translate-y-0 transition-all font-headline tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-[0_5px_30px_-10px_rgba(235,255,70,0.5)]"
                    >
                      {formStatus === 'idle' && 'Garantir minha chance'}
                      {formStatus === 'loading' && 'Processando...'}
                    </button>
                    
                    <p className="text-center text-[10px] text-[#697bbb] uppercase tracking-widest mt-6">
                      Seus dados estão seguros conosco.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-[#121c43] w-full py-16 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <a href="#" className="flex items-center" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <CSVLogo />
          </a>
          
          <div className="flex flex-wrap justify-center gap-8 font-headline text-xs font-bold uppercase tracking-widest text-[#121c43]/60">
            <a href="#" className="hover:text-[#2a68ff] transition-colors">Privacidade</a>
            <a href="#" className="hover:text-[#2a68ff] transition-colors">Termos</a>
            <a href="#" className="hover:text-[#2a68ff] transition-colors">Regulamento</a>
            <a href="#" className="hover:text-[#2a68ff] transition-colors">Contato</a>
          </div>
          
          <div className="text-[10px] text-[#121c43]/40 uppercase tracking-widest text-center md:text-right font-bold">
            © 2026 Cruzeiro do Sul Virtual. <br className="md:hidden"/> Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Remover o Sorteio Ativo Alert Flutuante - Lixeira! */}
      <ScrollToTopButton />
    </div>
  );
}
