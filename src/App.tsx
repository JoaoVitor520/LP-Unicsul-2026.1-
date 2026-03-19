/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Terminal,
  Shield,
  Stethoscope,
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
  BarChart3,
  Loader2
} from 'lucide-react';
import { supabase } from './lib/supabase';

// --- Types ---

interface Course {
  id: number;
  title: string;
  category: string;
  modality: 'Digital' | 'Semipresencial';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

// --- Icon mapping by title keyword ---

function getCourseIcon(title: string, grau: string): { icon: React.ElementType; iconBg: string; iconColor: string } {
  const t = title.toLowerCase();
  if (t.includes('administração 2.0')) return { icon: Zap, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-500' };
  if (t.includes('administração')) return { icon: Briefcase, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' };
  if (t.includes('agro')) return { icon: Sprout, iconBg: 'bg-green-500/10', iconColor: 'text-green-500' };
  if (t.includes('arquitetura')) return { icon: Building2, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' };
  if (t.includes('biomedicina')) return { icon: Microscope, iconBg: 'bg-purple-500/10', iconColor: 'text-purple-500' };
  if (t.includes('computação') || t.includes('sistemas de informação')) return { icon: Terminal, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-500' };
  if (t.includes('contábeis') || t.includes('contab')) return { icon: BarChart3, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' };
  if (t.includes('direito')) return { icon: Scale, iconBg: 'bg-slate-500/10', iconColor: 'text-slate-500' };
  if (t.includes('enfermagem')) return { icon: Heart, iconBg: 'bg-red-500/10', iconColor: 'text-red-500' };
  if (t.includes('engenharia civil')) return { icon: Building2, iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-500' };
  if (t.includes('engenharia')) return { icon: Building2, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500' };
  if (t.includes('farmácia') || t.includes('farmacia')) return { icon: Stethoscope, iconBg: 'bg-teal-500/10', iconColor: 'text-teal-500' };
  if (t.includes('fisioterapia')) return { icon: Activity, iconBg: 'bg-rose-500/10', iconColor: 'text-rose-500' };
  if (t.includes('nutrição') || t.includes('nutri')) return { icon: Apple, iconBg: 'bg-lime-500/10', iconColor: 'text-lime-500' };
  if (t.includes('pedagogia')) return { icon: BookOpen, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' };
  if (t.includes('psicologia')) return { icon: Brain, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-500' };
  if (t.includes('análise') || t.includes('analise') || t.includes('desenv')) return { icon: Terminal, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' };
  if (t.includes('marketing')) return { icon: Megaphone, iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-500' };
  if (t.includes('recursos humanos') || t.includes('gestão de rh') || t.includes('rh')) return { icon: Users, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' };
  if (t.includes('cibersegurança') || t.includes('segurança')) return { icon: Shield, iconBg: 'bg-red-500/10', iconColor: 'text-red-500' };
  if (t.includes('medicina')) return { icon: Stethoscope, iconBg: 'bg-rose-500/10', iconColor: 'text-rose-500' };
  if (grau.toLowerCase().includes('licenciatura')) return { icon: BookOpen, iconBg: 'bg-violet-500/10', iconColor: 'text-violet-500' };
  if (grau.toLowerCase().includes('tecnólogo') || grau.toLowerCase().includes('tecnologo')) return { icon: Code2, iconBg: 'bg-sky-500/10', iconColor: 'text-sky-500' };
  return { icon: GraduationCap, iconBg: 'bg-primary/10', iconColor: 'text-primary' };
}

const CATEGORIES = ['Todos', 'Bacharelado', 'Bacharelado 2.0', 'Licenciatura', 'Licenciatura 2.0', 'Tecnólogo'];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-lg shadow-xl py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl md:text-2xl font-extrabold tracking-tighter text-primary">
          Cruzeiro do Sul Virtual
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-headline font-bold tracking-wide uppercase text-xs">
          <a href="#" className="text-cta-yellow border-b-2 border-cta-yellow pb-1">Cursos</a>
          <a href="#beneficios" className="text-primary hover:text-aqua transition-colors">Benefícios</a>
          <a href="#sorteio" className="text-primary hover:text-aqua transition-colors">Sorteio</a>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="#inscricao" 
            className="hidden sm:block bg-cta-yellow text-background px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 cta-glow shimmer"
          >
            Inscreva-se
          </a>
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-primary p-2 hover:bg-white/5 rounded-lg transition-colors"
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
            className="absolute top-full left-0 w-full bg-surface-container-high/95 backdrop-blur-xl border-b border-white/10 overflow-hidden md:hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              <a href="#" className="text-cta-yellow font-bold uppercase text-sm tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Cursos</a>
              <a href="#beneficios" className="text-on-surface font-bold uppercase text-sm tracking-widest hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Benefícios</a>
              <a href="#sorteio" className="text-on-surface font-bold uppercase text-sm tracking-widest hover:text-primary transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Sorteio</a>
              <a 
                href="#inscricao" 
                className="bg-cta-yellow text-background text-center py-4 rounded-2xl font-bold uppercase text-sm tracking-widest"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Garantir minha bolsa
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 left-8 z-50 p-4 rounded-full bg-primary text-on-primary shadow-2xl hover:scale-110 active:scale-90 transition-all"
          >
            <ChevronDown size={24} className="rotate-180" />
          </motion.button>
        )}
      </AnimatePresence>
    </nav>
  );
};

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  const Icon = course.icon;
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -12 }}
      className="group relative glass p-6 rounded-[2.5rem] border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-xl overflow-hidden"
    >
      {/* Hover Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 rounded-2xl ${course.iconBg} ${course.iconColor} shadow-inner`}>
            <Icon size={28} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${course.modality === 'Digital' ? 'bg-aqua/10 text-aqua border border-aqua/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
            {course.modality}
          </span>
        </div>
        
        <h3 className="font-headline font-bold text-xl mb-2 group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
        <p className="text-sm text-on-surface-variant/80 mb-8 font-medium">{course.category} • {course.duration}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant/40 font-bold mb-0.5">Sorteio</span>
            <span className="text-tertiary font-extrabold text-sm tracking-tight">BOLSA 85%</span>
          </div>
          <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
            <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
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

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState('');

  // Form fields
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cursoInteresse, setCursoInteresse] = useState('');

  // Courses from Supabase
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from('cursos')
        .select('id, title, category, modality')
        .order('title');
      if (!error && data) {
        const mapped: Course[] = data.map((row: { id: number; title: string; category: string; modality: string }) => ({
          id: row.id,
          title: row.title,
          category: row.category,
          modality: row.modality as 'Digital' | 'Semipresencial',
          ...getCourseIcon(row.title, row.category),
        }));
        setCourses(mapped);
      }
      setLoadingCourses(false);
    }
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, searchQuery, activeCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormError('');
    const { error } = await supabase.from('leads').insert({
      nome,
      email,
      whatsapp,
      curso: cursoInteresse,
    });
    if (error) {
      setFormError('Erro ao enviar. Tente novamente.');
      setFormStatus('error');
    } else {
      setFormStatus('success');
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
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
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto glass p-2.5 rounded-full flex flex-col sm:flex-row items-center shadow-2xl border border-white/10 gap-2"
          >
            <div className="flex-1 flex items-center w-full px-4">
              <Search size={20} className="text-primary/60 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Qual curso você está procurando hoje?"
                className="bg-transparent border-none focus:ring-0 text-on-surface w-full px-4 placeholder:text-on-surface-variant/40 font-medium text-sm md:text-base"
              />
            </div>
            <button className="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-full font-bold hover:brightness-110 transition-all whitespace-nowrap active:scale-95">
              Buscar Agora
            </button>
          </motion.div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="py-24 px-6 bg-surface-container-low/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-3">Explore por Categoria</h2>
              <p className="text-on-surface-variant text-lg">São centenas de opções para você decolar.</p>
            </div>
            
            {/* Categories Tabs */}
            <div className="flex overflow-x-auto pb-4 lg:pb-0 gap-3 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-7 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Grid */}
          {loadingCourses ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 size={48} className="text-primary animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </AnimatePresence>
              </div>
              {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-on-surface-variant text-lg">Nenhum curso encontrado para sua busca.</p>
                </div>
              )}
            </>
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
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-xl">
                <Sparkles size={18} className="text-cta-yellow" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface">Bolsas liberadas esta semana</span>
              </div>
              
              <h2 className="font-headline text-4xl md:text-7xl font-extrabold mb-8 leading-[1.1]">
                Sua Bolsa de <span className="text-tertiary">85%</span> <br className="hidden md:block"/> está te esperando!
              </h2>
              
              <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl mb-14 leading-relaxed">
                Participe do sorteio exclusivo e transforme seu futuro. São centenas de bolsas contempladas mensalmente! Não deixe sua carreira para depois.
              </p>

              <div className="flex flex-col items-center gap-4 mb-14">
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/60 font-bold">O próximo sorteio encerra em:</span>
                <CountdownTimer />
              </div>

              <button className="bg-cta-yellow text-background px-14 py-6 rounded-full font-black text-xl uppercase tracking-wider hover:scale-105 transition-all duration-300 active:scale-95 cta-glow animate-glow-pulse">
                QUERO CONCORRER À BOLSA
              </button>
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
          <div className="lg:w-1/2 w-full max-w-xl">
            <div className="bg-gradient-to-br from-surface-container-highest to-background p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/10 relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-aqua/10 rounded-full blur-[100px]"></div>
              
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 ml-1">Nome Completo</label>
                  <input
                    required
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-aqua focus:border-transparent transition-all text-on-surface placeholder:text-white/20 outline-none"
                    placeholder="Seu nome aqui"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 ml-1">E-mail</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-aqua focus:border-transparent transition-all text-on-surface placeholder:text-white/20 outline-none"
                      placeholder="exemplo@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 ml-1">WhatsApp</label>
                    <input
                      required
                      type="tel"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-aqua focus:border-transparent transition-all text-on-surface placeholder:text-white/20 outline-none"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 ml-1">Curso de interesse</label>
                  <div className="relative">
                    <select
                      required
                      value={cursoInteresse}
                      onChange={e => setCursoInteresse(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-aqua focus:border-transparent transition-all text-on-surface appearance-none cursor-pointer outline-none"
                    >
                      <option className="bg-background" value="" disabled>Escolha um curso...</option>
                      {courses.map(c => (
                        <option key={c.id} className="bg-background" value={c.title}>{c.title}</option>
                      ))}
                    </select>
                    <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary/60" />
                  </div>
                </div>

                {formError && (
                  <p className="text-center text-sm text-red-400">{formError}</p>
                )}

                <button
                  disabled={formStatus === 'loading' || formStatus === 'success'}
                  className="w-full bg-cta-yellow text-background py-5 rounded-2xl font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all cta-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'idle' && 'GARANTIR MINHA CHANCE'}
                  {formStatus === 'loading' && 'PROCESSANDO...'}
                  {formStatus === 'success' && 'INSCRITO COM SUCESSO!'}
                  {formStatus === 'error' && 'TENTAR NOVAMENTE'}
                </button>

                <p className="text-center text-[10px] text-white/30 uppercase tracking-widest">
                  Seus dados estão seguros conosco.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background w-full py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-2xl font-extrabold tracking-tighter text-primary">
            Cruzeiro do Sul Virtual
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
            <a href="#" className="hover:text-cta-yellow transition-colors">Privacidade</a>
            <a href="#" className="hover:text-cta-yellow transition-colors">Termos</a>
            <a href="#" className="hover:text-cta-yellow transition-colors">Regulamento</a>
            <a href="#" className="hover:text-cta-yellow transition-colors">Contato</a>
          </div>
          
          <div className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest text-center md:text-right">
            © 2026 Cruzeiro do Sul Virtual. <br className="md:hidden"/> Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Floating Alert */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="fixed bottom-8 right-8 z-40 hidden lg:block"
      >
        <div className="glass p-5 rounded-3xl border border-tertiary/20 shadow-2xl max-w-[280px]">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-tertiary/20 text-tertiary">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="font-bold text-sm text-on-surface mb-1">Sorteio Ativo!</p>
              <p className="text-xs text-on-surface-variant leading-relaxed">Bolsas de até 85% para novos alunos. Não perca!</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
