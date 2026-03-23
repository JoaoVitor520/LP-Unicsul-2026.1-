/// <reference types="vite/client" />
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
  BarChart3,
  FlaskConical,
  Gavel,
  Leaf,
  Lightbulb,
  TrendingUp,
  MonitorSmartphone,
  Globe,
  Dna,
  Gamepad2,
  Database,
  Cloud,
  Truck,
  MapPin,
  Video,
  Music,
  Radio,
  Eye,
  Mic,
  Camera,
  Scissors,
  Package,
  Trophy,
  Settings,
  Rocket,
  Handshake,
  ClipboardList,
  Calendar,
  ShoppingBag,
  MousePointer,
  UtensilsCrossed,
  Home,
  HeartPulse,
  Wifi,
  Film,
  Theater,
  BookHeart,
  ChefHat,
  Smile,
  Clapperboard,
  BadgeCheck,
  Bot,
  Pill,
  Plane,
  Network,
  Target,
  Dumbbell,
  ShieldCheck,
  Siren,
  Footprints,
  Wheat,
  Tractor,
  Factory,
  Server,
  Layers,
  Lock,
  PieChart,
  Monitor,
  Cog,
  Binary,
  Router,
  HardDrive,
  Wrench,
  Ruler,
  Flower,
  Wind,
  BookMarked,
  BookCopy,
  PersonStanding,
  ShieldAlert,
  Key,
  Newspaper,
  ScanFace,
  Shirt,
  Banknote,
  Calculator,
  Coins,
  Ticket,
  HeartHandshake,
  Accessibility,
  TreePine,
  TrafficCone,
  HardHat,
  Pen,
  PenTool,
  Star,
  Vote,
  UserCheck,
  GlobeLock,
  Tv,
  Compass,
  Sigma,
  Atom,
  Construction,
  Beef,
  Mic2,
  GitMerge,
  Presentation,
  HandHeart,
  Puzzle,
  HandHelping,
  Hand,
  MessagesSquare
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
  flagEmoji?: string; // Bandeira do país para cursos de Letras
}

// --- Supabase Config ---
// Nota: O usuário precisa criar o arquivo .env na raiz (ex: .env) com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

import { FIXED_COURSES } from './data/courses';

export const getAreaVisuals = (title: string, _area: string) => {
  const t = title.toLowerCase();

  // ── TECNOLOGIA ────────────────────────────────────────────────
  if (t.includes('inteligência artificial'))     return { icon: Bot,           iconBg: 'bg-purple-500/10',  iconColor: 'text-purple-400' }; // robô = IA
  if (t.includes('jogos digitais'))              return { icon: Gamepad2,      iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // controle
  if (t.includes('cibersegurança'))              return { icon: ShieldCheck,   iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // escudo digital
  if (t.includes('segurança da informação'))     return { icon: Lock,          iconBg: 'bg-blue-600/10',    iconColor: 'text-blue-300' };   // cadeado
  if (t.includes('internet das coisas'))         return { icon: Wifi,          iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // wireless = IoT
  if (t.includes('banco de dados'))              return { icon: Database,      iconBg: 'bg-sky-500/10',     iconColor: 'text-sky-400' };    // cilindro DB
  if (t.includes('ciência de dados'))            return { icon: PieChart,      iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // gráfico pizza
  if (t.includes('análise de dados'))            return { icon: BarChart3,     iconBg: 'bg-sky-600/10',     iconColor: 'text-sky-300' };    // barras
  if (t.includes('computação em nuvem'))         return { icon: Cloud,         iconBg: 'bg-sky-500/10',     iconColor: 'text-sky-400' };    // nuvem
  if (t.includes('desenvolvimento back-end'))    return { icon: Server,        iconBg: 'bg-green-600/10',   iconColor: 'text-green-300' };  // servidor
  if (t.includes('desenvolvimento full stack'))  return { icon: Layers,        iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // camadas
  if (t.includes('desenvolvimento mobile'))      return { icon: Smartphone,    iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' }; // celular
  if (t.includes('coding'))                      return { icon: Terminal,      iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // terminal
  if (t.includes('redes de computadores'))       return { icon: Router,        iconBg: 'bg-sky-500/10',     iconColor: 'text-sky-400' };    // roteador
  if (t.includes('sistemas para internet'))      return { icon: Globe,         iconBg: 'bg-sky-600/10',     iconColor: 'text-sky-300' };    // globo web
  if (t.includes('sistemas de informação'))      return { icon: HardDrive,     iconBg: 'bg-slate-500/10',   iconColor: 'text-slate-400' };  // HD
  if (t.includes('análise e desenvolvimento'))   return { icon: Code2,         iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // código
  if (t.includes('tecnologia da informação'))    return { icon: Monitor,       iconBg: 'bg-sky-500/10',     iconColor: 'text-sky-400' };    // tela
  if (t.includes('ciência da computação'))       return { icon: Cpu,           iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // chip
  if (t.includes('engenharia de computação'))    return { icon: Binary,        iconBg: 'bg-violet-600/10',  iconColor: 'text-violet-300' }; // binário
  if (t.includes('engenharia de software'))      return { icon: GitMerge,      iconBg: 'bg-green-600/10',   iconColor: 'text-green-300' };  // merge = conexão de código

  // ── SEGURANÇA ────────────────────────────────────────────────
  if (t.includes('segurança privada'))           return { icon: Siren,         iconBg: 'bg-red-500/10',     iconColor: 'text-red-400' };    // sirene
  if (t.includes('segurança pública'))           return { icon: BadgeCheck,    iconBg: 'bg-red-600/10',     iconColor: 'text-red-300' };    // distintivo
  if (t.includes('segurança no trabalho'))       return { icon: HardHat,       iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // capacete
  if (t.includes('segurança no trânsito'))       return { icon: TrafficCone,   iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400' };  // cone de trânsito
  if (t.includes('serviços penais'))             return { icon: Shield,        iconBg: 'bg-red-700/10',     iconColor: 'text-red-500' };    // escudo penal

  // ── SAÚDE ────────────────────────────────────────────────────
  if (t.includes('estética e cosmética'))        return { icon: ScanFace,      iconBg: 'bg-pink-500/10',    iconColor: 'text-pink-400' };   // rosto/scan facial
  if (t.includes('radiologia'))                  return { icon: Activity,      iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // ondas/scan
  if (t.includes('podologia'))                   return { icon: Footprints,    iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // pegadas/pés
  if (t.includes('gerontologia'))                return { icon: PersonStanding,iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // pessoa idosa
  if (t.includes('terapias integrativas'))       return { icon: Flower,        iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // flor/natureza
  if (t.includes('naturologia'))                 return { icon: Wind,          iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // vento/natural
  if (t.includes('biomedicina'))                 return { icon: Microscope,    iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // microscópio
  if (t.includes('farmácia'))                    return { icon: Pill,          iconBg: 'bg-cyan-600/10',    iconColor: 'text-cyan-300' };   // comprimido
  if (t.includes('nutrição'))                    return { icon: Apple,         iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // maçã
  if (t.includes('óptica e optometria'))         return { icon: Eye,           iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // olho
  if (t.includes('fonoaudiologia'))              return { icon: Mic,           iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // microfone/fala
  if (t.includes('fisioterapia'))                return { icon: Dumbbell,      iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // haltere/reabilitação
  if (t.includes('gestão hospitalar'))           return { icon: Stethoscope,   iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // estetoscópio
  if (t.includes('gestão da saúde pública'))     return { icon: HeartPulse,    iconBg: 'bg-rose-600/10',    iconColor: 'text-rose-300' };   // pulsação
  if (t.includes('psicopedagogia'))              return { icon: Lightbulb,     iconBg: 'bg-pink-500/10',    iconColor: 'text-pink-400' };   // luz/aprendizado
  if (t.includes('psicolog') || t.includes('psicanál') || t.includes('teóricos psicanalíticos')) return { icon: Brain, iconBg: 'bg-pink-500/10', iconColor: 'text-pink-400' }; // cérebro
  if (t.includes('ciências biológicas'))         return { icon: Dna,           iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // DNA
  if (t.includes('enfermagem'))                  return { icon: HeartPulse,    iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // monitoramento

  // ── COMUNICAÇÃO E DESIGN ─────────────────────────────────────
  if (t.includes('influenciador digital'))       return { icon: Smartphone,    iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // celular/stories
  if (t.includes('marketing digital'))           return { icon: TrendingUp,    iconBg: 'bg-rose-600/10',    iconColor: 'text-rose-300' };   // crescimento digital
  if (t.includes('marketing'))                   return { icon: Megaphone,     iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // megafone
  if (t.includes('publicidade'))                 return { icon: Star,          iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400' };  // estrela/destaque
  if (t.includes('jornalismo'))                  return { icon: Mic2,          iconBg: 'bg-slate-500/10',   iconColor: 'text-slate-400' };  // microfone de repórter
  if (t.includes('relações públicas'))           return { icon: Presentation,  iconBg: 'bg-rose-500/10',    iconColor: 'text-rose-400' };   // apresentação/coletiva
  if (t.includes('produção audiovisual'))        return { icon: Clapperboard,  iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-400' }; // claquete
  if (t.includes('produção cultural'))           return { icon: Theater,       iconBg: 'bg-purple-500/10',  iconColor: 'text-purple-400' }; // máscaras teatro
  if (t.includes('produção midiática'))          return { icon: Tv,            iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-400' }; // televisão
  if (t.includes('fotografia'))                  return { icon: Camera,        iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-400' }; // câmera
  if (t.includes('design de animação'))          return { icon: Film,          iconBg: 'bg-purple-500/10',  iconColor: 'text-purple-400' }; // filme
  if (t.includes('design de experiência'))       return { icon: MousePointer,  iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-400' }; // cursor UX
  if (t.includes('design de interiores'))        return { icon: Home,          iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // casa
  if (t.includes('design de moda'))              return { icon: Shirt,         iconBg: 'bg-pink-500/10',    iconColor: 'text-pink-400' };   // camiseta/moda
  if (t.includes('design gráfico'))              return { icon: Palette,       iconBg: 'bg-fuchsia-500/10', iconColor: 'text-fuchsia-400' }; // paleta
  if (t.includes('design de produto'))           return { icon: Package,       iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // caixa/produto
  if (t.includes('artes visuais'))               return { icon: PenTool,       iconBg: 'bg-fuchsia-600/10', iconColor: 'text-fuchsia-300' }; // caneta artística

  // ── NEGÓCIOS E GESTÃO ─────────────────────────────────────────
  if (t.includes('gestão financeira'))           return { icon: Banknote,      iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' }; // cédula
  if (t.includes('contábeis'))                   return { icon: Calculator,    iconBg: 'bg-emerald-600/10', iconColor: 'text-emerald-300' }; // calculadora
  if (t.includes('econôm'))                      return { icon: Coins,         iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' }; // moedas
  if (t.includes('gastronomia'))                 return { icon: ChefHat,       iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // chapéu chef
  if (t.includes('turismo'))                     return { icon: Plane,         iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // avião
  if (t.includes('negócios imobiliários'))       return { icon: Building2,     iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // prédio
  if (t.includes('logística'))                   return { icon: Truck,         iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // caminhão
  if (t.includes('recursos humanos'))            return { icon: Users,         iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // grupo/pessoas
  if (t.includes('coaching e mentoring'))        return { icon: Target,        iconBg: 'bg-yellow-500/10',  iconColor: 'text-yellow-400' }; // alvo/objetivo
  if (t.includes('comércio exterior'))           return { icon: Globe,         iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // globo comércio
  if (t.includes('relações internacionais'))     return { icon: GlobeLock,     iconBg: 'bg-cyan-600/10',    iconColor: 'text-cyan-300' };   // globo diplomacia
  if (t.includes('empreendedorismo'))            return { icon: Rocket,        iconBg: 'bg-yellow-500/10',  iconColor: 'text-yellow-400' }; // foguete startup
  if (t.includes('eventos'))                     return { icon: Ticket,        iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // ingresso
  if (t.includes('secretariado'))                return { icon: ClipboardList, iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // prancheta
  if (t.includes('cooperativas'))                return { icon: Handshake,     iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // aperto de mão
  if (t.includes('terceiro setor'))              return { icon: HeartHandshake,iconBg: 'bg-pink-500/10',    iconColor: 'text-pink-400' };   // coração+mão ONG
  if (t.includes('desportiva e de lazer'))       return { icon: Trophy,        iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400' };  // troféu
  if (t.includes('educação física'))             return { icon: Dumbbell,      iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400' };  // haltere/esporte
  if (t.includes('gestão comercial'))            return { icon: ShoppingBag,   iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // sacola compras
  if (t.includes('gestão ambiental'))            return { icon: Leaf,          iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // folha ambiente
  if (t.includes('produção industrial'))         return { icon: Factory,       iconBg: 'bg-slate-500/10',   iconColor: 'text-slate-400' };  // fábrica
  if (t.includes('gestão da qualidade'))         return { icon: CheckCircle,   iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // check qualidade
  if (t.includes('processos gerenciais'))        return { icon: Cog,           iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // engrenagem processo
  if (t.includes('terapia ocupacional'))         return { icon: Puzzle,        iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // atividades/reabilitação
  if (t.includes('serviço social'))              return { icon: HandHeart,     iconBg: 'bg-pink-500/10',    iconColor: 'text-pink-400' };   // mão+coração = assistência social
  if (t.includes('gestão pública') || t.includes('administração pública')) return { icon: Vote, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' }; // voto/civismo

  // ── DIREITO E CIÊNCIAS JURÍDICAS ─────────────────────────────
  if (t.includes('conciliação') || t.includes('mediação') || t.includes('arbitragem')) return { icon: Scale, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' }; // balança
  if (t.includes('perícia judicial'))            return { icon: Microscope,    iconBg: 'bg-amber-600/10',   iconColor: 'text-amber-500' };  // pericia forense
  if (t.includes('serviços jurídicos'))          return { icon: Pen,           iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400' };  // assinar documentos
  if (t.includes('criminologia'))                return { icon: Search,        iconBg: 'bg-amber-600/10',   iconColor: 'text-amber-500' };  // lupa investigação
  if (t.includes('direito'))                     return { icon: Gavel,         iconBg: 'bg-amber-600/10',   iconColor: 'text-amber-500' };  // martelo tribunal

  // ── AGRÁRIAS E MEIO AMBIENTE ─────────────────────────────────
  if (t.includes('agronomia'))                   return { icon: Wheat,         iconBg: 'bg-yellow-500/10',  iconColor: 'text-yellow-400' }; // trigo/grão
  if (t.includes('gestão do agronegócio'))       return { icon: Tractor,       iconBg: 'bg-yellow-600/10',  iconColor: 'text-yellow-300' }; // trator
  if (t.includes('engenharia ambiental'))        return { icon: TreePine,      iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };  // pinheiro/natureza
  if (t.includes('zootecnia'))                   return { icon: Beef,          iconBg: 'bg-yellow-600/10',  iconColor: 'text-yellow-300' }; // vaca = zootecnia
  if (t.includes('florestal') || t.includes('rural')) return { icon: Sprout,  iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };

  // ── ENGENHARIAS ───────────────────────────────────────────────
  if (t.includes('engenharia elétrica'))         return { icon: Zap,           iconBg: 'bg-yellow-500/10',  iconColor: 'text-yellow-400' }; // raio elétrico
  if (t.includes('engenharia mecânica'))         return { icon: Wrench,        iconBg: 'bg-slate-500/10',   iconColor: 'text-slate-400' };  // chave inglesa
  if (t.includes('mecatrônica'))                 return { icon: Cog,           iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // engrenagem
  if (t.includes('engenharia de produção'))      return { icon: Factory,       iconBg: 'bg-violet-600/10',  iconColor: 'text-violet-300' }; // fábrica
  if (t.includes('engenharia civil'))            return { icon: Construction,  iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // obra/construção
  if (t.includes('arquitetura e urbanismo'))     return { icon: Ruler,         iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // régua/projeto
  if (t.includes('engenh'))                      return { icon: Wrench,        iconBg: 'bg-violet-500/10',  iconColor: 'text-violet-400' }; // fallback engenharias

  // ── EDUCAÇÃO ─────────────────────────────────────────────────
  if (t.includes('teologia'))                    return { icon: BookHeart,     iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // livro com coração
  if (t.includes('pedagogia') || t.includes('educação especial')) return { icon: GraduationCap, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-400' }; // capelo
  // Letras — ícone de comunicação (duas pessoas se comunicando)
  if (t.includes('letras') && t.includes('libras'))    return { icon: Hand,           iconBg: 'bg-teal-600/10',    iconColor: 'text-teal-300' };    // gesto de libras
  if (t.includes('letras') && t.includes('japonês'))   return { icon: MessagesSquare, iconBg: 'bg-red-500/10',     iconColor: 'text-red-400' };     // comunicação — japonês
  if (t.includes('letras') && t.includes('inglês'))    return { icon: MessagesSquare, iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };    // comunicação — inglês
  if (t.includes('letras') && t.includes('espanhol'))  return { icon: MessagesSquare, iconBg: 'bg-red-600/10',     iconColor: 'text-red-300' };     // comunicação — espanhol
  if (t.includes('letras') && t.includes('francês'))   return { icon: MessagesSquare, iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' };  // comunicação — francês
  if (t.includes('letras') && t.includes('alemão'))    return { icon: MessagesSquare, iconBg: 'bg-yellow-600/10',  iconColor: 'text-yellow-300' };  // comunicação — alemão
  if (t.includes('letras') && t.includes('italiano'))  return { icon: MessagesSquare, iconBg: 'bg-green-500/10',   iconColor: 'text-green-400' };   // comunicação — italiano
  if (t.includes('letras') && t.includes('chinês'))    return { icon: MessagesSquare, iconBg: 'bg-red-500/10',     iconColor: 'text-red-400' };     // comunicação — chinês
  if (t.includes('letras'))                             return { icon: MessagesSquare, iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' };  // comunicação — genérico
  if (t.includes('história'))                    return { icon: BookOpen,      iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-400' };  // livro aberto
  if (t.includes('filosofia'))                   return { icon: BookMarked,    iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // livro marcado
  if (t.includes('geografia'))                   return { icon: MapPin,        iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' }; // pino de mapa
  if (t.includes('matemática'))                  return { icon: Sigma,         iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // sigma/somatório
  if (t.includes('física'))                      return { icon: Atom,          iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // átomo/física
  if (t.includes('química'))                     return { icon: FlaskConical,  iconBg: 'bg-cyan-500/10',    iconColor: 'text-cyan-400' };   // frasco/química
  if (t.includes('humanidades'))                 return { icon: BookOpen,      iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-400' };
  if (t.includes('ciências biológicas'))         return { icon: Dna,           iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-400' };   // DNA biologia

  // ── CIÊNCIAS SOCIAIS E POLÍTICAS ─────────────────────────────
  if (t.includes('ciências sociais'))            return { icon: Users,         iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // grupo social
  if (t.includes('ciência política'))            return { icon: Landmark,      iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // monumento/estado
  if (t.includes('relações públicas'))           return { icon: UserCheck,     iconBg: 'bg-indigo-500/10',  iconColor: 'text-indigo-400' }; // pessoa aprovada

  // ── ADMINISTRAÇÃO ────────────────────────────────────────────
  if (t.includes('administração'))               return { icon: Briefcase,     iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-400' };   // pasta executivo

  // Fallback hash-based
  const icons = [Award, Activity, GraduationCap, Lightbulb, Cpu, Sparkles];
  const colors = [
    { bg: 'bg-violet-500/10', c: 'text-violet-400' },
    { bg: 'bg-cyan-500/10',   c: 'text-cyan-400' },
    { bg: 'bg-rose-500/10',   c: 'text-rose-400' },
    { bg: 'bg-amber-500/10',  c: 'text-amber-400' },
    { bg: 'bg-sky-500/10',    c: 'text-sky-400' },
  ];
  const hash = t.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return { icon: icons[hash % icons.length], iconBg: colors[hash % colors.length].bg, iconColor: colors[hash % colors.length].c };
};

// --- Default Courses (Fallback) ---
const INITIAL_COURSES: Course[] = FIXED_COURSES
  .filter((item: any) => !item.title.toLowerCase().includes('formação pedagog') && !item.title.toLowerCase().includes('formacao pedagog'))
  .map((item: any) => ({
    ...item,
    ...getAreaVisuals(item.title, item.area)
  }));

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

// Helper: converte "X semestres" em uma string amigável "X sem. · Y anos"
const formatDuration = (raw: string) => {
  if (!raw) return '4 anos';
  const match = raw.match(/(\d+)/);
  if (match) {
    const semesters = parseInt(match[1]);
    const years = (semesters / 2);
    const yearsStr = years % 1 === 0 ? `${years}` : `${years.toFixed(1).replace('.', ',')}`;
    return `${semesters} sem. · ${yearsStr} ${years === 1 ? 'ano' : 'anos'}`;
  }
  return raw;
};

const CourseCard: React.FC<{ course: Course, onSelect?: (course: Course) => void }> = ({ course, onSelect }) => {
  const Icon = course.icon || BookOpen;
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCardClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    if (onSelect) {
      onSelect(course);
    }
  };

  // Extract a base color from iconColor for the glow effect
  const glowColor = course.iconColor?.replace('text-', '') || 'blue-500';
  const isDigital = course.modality === 'Digital';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onClick={handleCardClick}
      className="card-shine group relative bg-gradient-to-b from-[#111a3e] to-[#0a1028] p-6 rounded-3xl border border-white/[0.07] hover:border-white/[0.15] transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="relative z-10 flex flex-col h-full gap-5">
        {/* Header: Icon + Modality Badge */}
        <div className="flex justify-between items-start">
          <div className={`relative p-3.5 rounded-2xl ${course.iconBg || 'bg-[#18234e]'} shadow-lg`}>
            <div className={`absolute inset-0 rounded-2xl opacity-30 blur-md ${course.iconBg || 'bg-blue-500/10'}`}></div>
            {course.flagEmoji
              ? <span className="relative z-10 text-xl leading-none select-none" role="img" aria-label="bandeira">{course.flagEmoji}</span>
              : <Icon size={22} className={`relative z-10 ${course.iconColor || 'text-[#849bf2]'}`} strokeWidth={1.75} />
            }
          </div>
          <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
            isDigital
              ? 'text-[#00e5ff] border border-[#00e5ff]/25 bg-[#00e5ff]/[0.07]'
              : 'text-[#c4b5fd] border border-[#c4b5fd]/25 bg-[#c4b5fd]/[0.07]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDigital ? 'bg-[#00e5ff] badge-digital' : 'bg-[#c4b5fd]'}`}></span>
            {course.modality}
          </span>
        </div>

        {/* Course Title */}
        <div>
          <h3 className="font-headline font-bold text-[1.05rem] text-white leading-snug group-hover:text-[#e0e8ff] transition-colors duration-200 min-h-[2.8rem] flex items-center">
            {course.title}
          </h3>
        </div>

        {/* Meta Info */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="text-[11px] text-[#6b7fc0] font-semibold">{course.category}</span>
            {course.category.includes('2.0') && (
              <span className="bg-[#cbd6ff]/10 text-[#cbd6ff] border border-[#cbd6ff]/20 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                Para Formados
              </span>
            )}
            <span className="text-[#3a4a7a] text-[11px]">·</span>
            <span className="text-[11px] text-[#6b7fc0] font-semibold">{formatDuration(course.duration)}</span>
          </div>
          {course.area && (
            <span className="text-[10px] text-[#4a5a8a] font-medium">{course.area}</span>
          )}
        </div>

        {/* Bottom: Scholarship + CTA */}
        <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[8.5px] uppercase tracking-[0.18em] text-[#4a5a8a] font-bold">Sorteio de bolsa</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-[#a0b0e0] font-semibold">até</span>
              <span className="text-[#e6ff1b] font-black text-sm tracking-tight drop-shadow-[0_0_8px_rgba(230,255,27,0.4)]">85%</span>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute bottom-full right-0 mb-3 bg-[#e6ff1b] text-[#0e1645] text-[9.5px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl whitespace-nowrap shadow-[0_4px_20px_rgba(230,255,27,0.35)] z-50"
                >
                  Participe do Sorteio! 🎓
                  <div className="absolute top-full right-4 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#e6ff1b]"></div>
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleArrowClick}
              className={`group/btn flex items-center justify-center w-10 h-10 rounded-2xl border transition-all duration-300 cursor-pointer ${
                showTooltip
                  ? 'bg-[#e6ff1b]/20 border-[#e6ff1b]/50 text-[#e6ff1b]'
                  : 'border-white/[0.08] text-[#5a6fa0] hover:bg-[#e6ff1b]/10 hover:border-[#e6ff1b]/30 hover:text-[#e6ff1b] bg-white/[0.03]'
              }`}
            >
              <ArrowRight size={16} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>
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
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeArea, setActiveArea] = useState('Todas');
  const [visibleCount, setVisibleCount] = useState(8);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [showFriendForm, setShowFriendForm] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ name: '', lastName: '', email: '', phone: '', course: '', friendName: '', friendPhone: '', friendCourse: '' });

  // Fetch Supabase Data
  useEffect(() => {
    const fetchCoursesFromSupabase = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase.from('cursos').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
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

          // Sort alphabetically just in case
          formattedData.sort((a, b) => a.title.localeCompare(b.title));
          setCourses(formattedData);
        }
      } catch (err) {
        console.error("Erro ao puxar dados do Supabase:", err);
      }
    };

    fetchCoursesFromSupabase();
  }, []);

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})\d+?$/, '$1-$2');
  };

  // Fuzzy search: tolera erros de digitação e acentuação
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const levenshtein = (a: string, b: string): number => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[a.length][b.length];
  };

  const fuzzyMatch = useCallback((query: string, title: string, area?: string): boolean => {
    if (!query.trim()) return true;
    const nq = normalize(query);
    const targets = [normalize(title), normalize(area || '')];
    // Busca direta
    if (targets.some(t => t.includes(nq))) return true;
    // Busca por palavras com tolerância a erros de digitação
    const queryWords = nq.split(/\s+/).filter(Boolean);
    return queryWords.every(qw => {
      if (targets.some(t => t.includes(qw))) return true;
      // Tolerância: até 2 erros p/ palavras longas, 1 p/ médias
      const maxDist = qw.length >= 6 ? 2 : qw.length >= 4 ? 1 : 0;
      const allWords = targets.flatMap(t => t.split(/\s+/).filter(Boolean));
      return allWords.some(tw => levenshtein(qw, tw) <= maxDist || tw.startsWith(qw));
    });
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const t = course.title.toLowerCase();
      if (t.includes('formação pedagog') || t.includes('formacao pedagog')) return false;
      const matchesSearch = fuzzyMatch(searchQuery, course.title, course.area);
      const matchesArea = activeArea === 'Todas' || course.area === activeArea;
      return matchesSearch && matchesArea;
    });
  }, [courses, searchQuery, activeArea, fuzzyMatch]);

  // Sugestões rápidas enquanto o usuário digita (máx 6)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    return courses
      .filter(c => {
        const t = c.title.toLowerCase();
        if (t.includes('formação pedagog') || t.includes('formacao pedagog')) return false;
        return fuzzyMatch(searchQuery, c.title, c.area);
      })
      .slice(0, 6);
  }, [courses, searchQuery, fuzzyMatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');

    if (supabase) {
      const leadPayload: Record<string, string | null> = {
        nome: formData.name,
        sobrenome: formData.lastName,
        email: formData.email,
        whatsapp: formData.phone,
        curso: formData.course,
        indicacao: showFriendForm && formData.friendName ? 'sim' : 'nao',
        amigo_nome: formData.friendName || null,
        amigo_whatsapp: formData.friendPhone || null,
      };

      const { error } = await supabase.from('leads').insert([leadPayload]);

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
            Encontre o curso que vai <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-aqua block sm:inline-block mt-2 sm:mt-0 whitespace-nowrap">mudar sua vida.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-on-surface-variant text-lg md:text-xl mb-14 leading-relaxed text-balance"
          >
            Descubra o curso ideal para você e participe do <span className="text-tertiary font-bold">SORTEIO DE BOLSAS DE <span className="whitespace-nowrap">ATÉ 85%</span></span>. Transforme seu potencial em uma carreira de sucesso hoje mesmo.
          </motion.p>

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto relative"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                searchInputRef.current?.blur();
                setShowSuggestions(false);
                setTimeout(() => document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' }), 80);
              }}
              className="bg-[#0a1236]/90 p-2 sm:p-2.5 rounded-[2rem] sm:rounded-full flex flex-col sm:flex-row items-center shadow-2xl border border-white/10 gap-3 sm:gap-2"
            >
              <div className="flex-1 flex items-center w-full px-4 pt-3 sm:pt-0 pb-1 sm:pb-0 relative">
                <label htmlFor="searchQuery" className="sr-only">Procurar curso</label>
                <Search size={22} className="text-[#849bf2] shrink-0" />
                <input
                  ref={searchInputRef}
                  id="searchQuery"
                  name="searchQuery"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
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
                      onClick={() => { setSearchQuery(''); setShowSuggestions(false); searchInputRef.current?.focus(); }}
                      className="absolute right-4 text-[#6a7fc8] hover:text-white transition-colors bg-white/5 p-1 rounded-full backdrop-blur-md"
                      title="Limpar pesquisa"
                    >
                      <X size={16} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-[#b6c6ff] text-[#0e1645] px-10 py-4 sm:py-5 rounded-[1.5rem] sm:rounded-full font-bold sm:text-lg hover:brightness-110 transition-all whitespace-nowrap active:scale-95 shadow-[0_4px_20px_rgba(182,198,255,0.2)]">
                Buscar Agora
              </button>
            </form>

            {/* Suggestions dropdown */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-3 bg-[#0d1640]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-3 py-2 border-b border-white/[0.05]">
                    <span className="text-[9px] uppercase tracking-widest text-[#4a5a8a] font-bold">Sugestões</span>
                  </div>
                  {searchSuggestions.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onMouseDown={() => {
                        setSearchQuery(course.title);
                        setShowSuggestions(false);
                        searchInputRef.current?.blur();
                        setTimeout(() => document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' }), 80);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left group"
                    >
                      <Search size={13} className="text-[#4a5a8a] shrink-0" />
                      <span className="text-[13px] text-[#c7d5fa] font-medium truncate">{course.title}</span>
                      <span className="text-[10px] text-[#3a4a7a] ml-auto shrink-0">{course.area}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="cursos" className="py-24 px-6 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,195,255,0.04)_0%,_transparent_60%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(1,236,208,0.03)_0%,_transparent_60%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="mb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row lg:items-end justify-between gap-8"
            >
              <div>
                <div className="inline-flex items-center gap-2 mb-4 bg-[#111a3e] border border-white/[0.07] rounded-full px-4 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#01ecd0] animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6b8fff]">{courses.length}+ cursos disponíveis</span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-extrabold text-white leading-tight">
                  Explore por <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8c3ff] to-[#01ecd0]">Área</span>
                </h2>
                <p className="text-[#5a6fa0] text-base mt-3 font-medium">Centenas de opções para você decolar — digital ou semipresencial.</p>
              </div>

              {/* Stats strip */}
              <div className="flex gap-5 shrink-0">
                {[
                  { value: '152', label: 'Cursos' },
                  { value: '8', label: 'Áreas' },
                  { value: '85%', label: 'Bolsa máx.' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center bg-[#111a3e] border border-white/[0.07] rounded-2xl px-5 py-3">
                    <div className="font-headline font-black text-xl text-white">{stat.value}</div>
                    <div className="text-[10px] text-[#4a5a8a] uppercase tracking-widest font-bold mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Area Filter Tabs */}
          <div className="mb-10 overflow-x-auto scrollbar-hide -mx-6 px-6">
            <div className="flex gap-2 pb-1 min-w-max">
              {['Todas', ...Array.from(new Set(courses.map(c => c.area))).filter(Boolean).sort()].map(area => (
                <button
                  key={area as string}
                  onClick={() => { setActiveArea(area as string); setVisibleCount(8); }}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all duration-200 border ${
                    activeArea === area
                      ? 'bg-gradient-to-r from-[#b8c3ff] to-[#a0b4ff] border-transparent text-[#070f2e] shadow-[0_4px_16px_rgba(184,195,255,0.25)]'
                      : 'bg-[#0c1530]/60 border-white/[0.06] text-[#6b7fc0] hover:bg-[#141f45] hover:text-[#aebef0] hover:border-white/10'
                  }`}
                >
                  {area as string}
                </button>
              ))}
            </div>
          </div>

          {/* Course Count for filtered state */}
          {activeArea !== 'Todas' && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-[#4a5a8a] font-bold uppercase tracking-widest mb-8"
            >
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} em <span className="text-[#b8c3ff]">{activeArea}</span>
            </motion.p>
          )}

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredCourses.slice(0, visibleCount).map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={(selectedCourse) => {
                    setFormData(prev => ({ ...prev, course: selectedCourse.title }));
                    document.getElementById('inscricao')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}
            </AnimatePresence>
          </div>

          {visibleCount < filteredCourses.length && (
            <div className="flex justify-center mt-12 w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-white/[0.1] bg-[#0c1530]/60 text-[#8a9ed4] font-bold text-sm hover:bg-[#141f45] hover:text-white hover:border-white/20 transition-all"
              >
                Ver mais cursos
                <ChevronDown size={15} className="group-hover:translate-y-0.5 transition-transform" />
              </motion.button>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <Search size={36} className="text-[#2a3560] mx-auto mb-4" />
              <p className="text-[#4a5a8a] font-semibold text-base">Nenhum curso encontrado.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveArea('Todas'); }}
                className="mt-4 text-[#b8c3ff] text-sm font-bold underline underline-offset-2 hover:text-white transition-colors"
              >
                Limpar filtros
              </button>
            </motion.div>
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
                Sua Bolsa de <span className="text-tertiary">até 85%</span> <br className="hidden md:block" /> está te esperando!
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
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold mb-8 leading-tight">Inscreva-se e <br /> mude seu destino</h2>
              <p className="text-on-surface-variant text-xl mb-12 leading-relaxed">
                Não perca a chance de transformar sua carreira com uma <span className="text-tertiary font-bold">BOLSA DE ATÉ 85%</span>. Conte com acompanhamento próximo, professores mestres e doutores e a melhor tecnologia do mundo.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="studentName" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Nome</label>
                        <input
                          id="studentName"
                          name="studentName"
                          autoComplete="given-name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none shadow-inner"
                          placeholder="Seu nome"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="studentLastName" className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#869bea] ml-1">Sobrenome</label>
                        <input
                          id="studentLastName"
                          name="studentLastName"
                          autoComplete="family-name"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none shadow-inner"
                          placeholder="Seu sobrenome"
                        />
                      </div>
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
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                          type="tel"
                          className="w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all text-[#c7d5fa] placeholder:text-[#425492] outline-none shadow-inner"
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                        />
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
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                          className={`w-full bg-[#18234e] border border-white/10 rounded-2xl py-4 flex-1 px-5 focus:ring-2 focus:ring-[#849bf2] focus:border-transparent transition-all outline-none appearance-none cursor-pointer shadow-inner ${formData.course ? 'text-[#c7d5fa]' : 'text-[#425492]'}`}
                        >
                          <option className="bg-[#121c43] text-white/50" value="" disabled>Escolha seu curso...</option>

                          {/* Renderiza dinamicamente os cursos agrupados por Área */}
                          {Array.from(new Set(courses.map(c => c.area))).filter(Boolean).sort().map(area => (
                            <optgroup key={`area_${area}`} className="bg-[#121c43] text-[#aebef0]" label={`── ${area} ──`}>
                              {courses.filter(c => c.area === area).sort((a, b) => a.title.localeCompare(b.title)).map(course => (
                                <option key={`course_${course.id}_${course.modality}`} value={course.title}>
                                  {course.title} ({course.modality})
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
                                  onChange={(e) => setFormData({ ...formData, friendName: e.target.value })}
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
                                  onChange={(e) => setFormData({ ...formData, friendPhone: maskPhone(e.target.value) })}
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


          <div className="text-[10px] text-[#121c43]/40 uppercase tracking-widest text-center md:text-right font-bold">
            © 2026 Cruzeiro do Sul Virtual. <br className="md:hidden" /> Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Remover o Sorteio Ativo Alert Flutuante - Lixeira! */}
      <ScrollToTopButton />
    </div>
  );
}
