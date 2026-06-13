"use client";

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, User, Calendar, Loader2, AlertCircle } from "lucide-react"
import {
  FaDatabase, FaShieldAlt, FaCertificate, FaCode, FaTools,
  FaTrafficLight, FaUtensils, FaBook, FaVoteYea, FaWarehouse, FaBrain, FaChartLine, FaBolt,
  FaLock, FaGithub, FaExternalLinkAlt, FaStar, FaListUl, FaChevronLeft, FaChevronRight, FaTimes,
  FaNetworkWired, FaGamepad,
} from 'react-icons/fa';
import { SiTensorflow, SiCisco, SiJavascript, SiOracle, SiOpenai } from 'react-icons/si';
import { supabase } from '../lib/supabaseClient';

interface Bubble {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
}



// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  const stepLightbox = (delta: number) =>
    setLightbox((lb) =>
      lb ? { ...lb, index: (lb.index + delta + lb.images.length) % lb.images.length } : lb
    );

  // Keyboard navigation for the gallery lightbox
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  type Comment = {
    id: string;
    name: string;
    message: string;
    created_at: string;
    is_pinned: boolean;
  };
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
  
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
      // Demo comment for testing
      setComments([
        {
          id: 'demo',
          name: "Demo User",
          message: "Connect your Supabase database to see real comments!",
          created_at: new Date().toISOString(),
          is_pinned: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  
  const postComment = async (commentData: { name: string; email: string; message: string }) => {
    try {
      setSubmitting(true);
      setError(null);
  
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            name: commentData.name.trim(),
            email: commentData.email?.trim() || null,
            message: commentData.message.trim(),
          }
        ])
        .select();
  
      if (error) throw error;
  
      // Add new comment to the top of the list
      setComments(prev => [data[0], ...prev]);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error posting comment:', err.message);
      } else {
        console.error('Unknown error posting comment:', JSON.stringify(err));
      }      
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return '1 day ago';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    if (diffInHours < 720) return `${Math.floor(diffInHours / 168)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
  
    await postComment(formData);
  };
  
  useEffect(() => {
    fetchComments();
  }, []);
  
  const portfolioTabs = [
    { name: 'Projects', icon: <FaCode />, key: 'projects' },
    { name: 'Certificates', icon: <FaCertificate />, key: 'certificates' },
    { name: 'Tech Stack', icon: <FaTools />, key: 'skills' },
  ];
  
  // Types
  interface Project {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    tech: string[];
    link: string;        // '#' when there is no live demo
    github: string;      // '' when the repo is private/unavailable
    icon: ReactElement;
    image: string;       // cover image
    images?: string[];   // optional gallery (defaults to [image])
    badge?: string;      // e.g. 'Live' | 'Private' | 'Academic' | 'Hackathon'
    isPrivate?: boolean; // hides demo/github, shows a "demo unavailable" state
    features: string[];
    stats: { label: string; value: string }[];
  }
  
  interface Certificate {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description: string;
    icon?: ReactElement;
    image?: string;   // optional — renders a placeholder card when absent
    credentialId?: string;
    verifyLink?: string;
  }
  
  interface TechItem {
    name: string;
    icon: string;
    level: number;
    color: string;
  }
  
  interface SkillCategory {
    title: string;
    icon: string;
    techs: TechItem[];
  }
  
  // Custom hook for intersection observer with animation types
  const useInView = (threshold: number = 0.1, animationType: string = 'fadeInUp') => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        },
        { threshold }
      );
  
      if (ref.current) {
        observer.observe(ref.current);
      }
  
      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [threshold]);
  
    return [ref, isInView, animationType] as const;
  };
  
  // Typing animation hook
  const useTypingAnimation = (texts: string[], speed: number = 100) => {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        const currentText = texts[textIndex];
        
        if (!isDeleting && charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else if (isDeleting && charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else if (!isDeleting && charIndex === currentText.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }, isDeleting ? speed / 2 : speed);
  
      return () => clearTimeout(timeout);
    }, [texts, textIndex, charIndex, isDeleting, speed]);
  
    return displayText;
  };

  // Typing animation texts
  const typingTexts = [
    "Full-Stack Developer",
    "Blockchain", 
    "Machine Learning",
    "Problem Solver"
  ];
  const typedText = useTypingAnimation(typingTexts, 150);

  // Data
  const projects: Project[] = [
    {
      id: '1',
      title: 'SafeDrive — Traffic Management System',
      description: 'Real-time traffic violation management system for a city traffic department.',
      fullDescription: 'A web-based platform that helps a traffic regulatory department record, manage, and monitor road traffic violations. Built around a real-time data layer with Firebase, every violation reported, paid, or updated is reflected instantly across the analytics dashboard, payment desk, and driver history. Built with a team of four.',
      tech: ['Next.js', 'React', 'TypeScript', 'Firebase', 'Chart.js', 'Tailwind CSS'],
      link: 'https://traffic-management-system-cyan.vercel.app/',
      github: 'https://github.com/bananaNuggets75/traffic-management-system',
      icon: <FaTrafficLight />,
      image: '/traffic.png',
      badge: 'Live',
      features: [
        'Real-time violation sync via Firebase',
        'Analytics dashboard with yearly and type charts',
        'Fine management and payment tracking',
        'Driver profiles with full violation history',
        'Status workflow (Pending / Paid)'
      ],
      stats: [
        { label: 'Status', value: 'Live' },
        { label: 'Team', value: '4 devs' },
        { label: 'Data layer', value: 'Realtime' }
      ]
    },
    {
      id: '2',
      title: 'Campus Food Ordering System',
      description: 'Full-stack food ordering web app built for the CPU campus community.',
      fullDescription: 'A full-stack online ordering platform for browsing a menu, placing orders, and tracking them in real time, with a separate admin area for managing menu items and incoming orders. Features cart persistence, an order confirmation and tracking flow, account management, and role-based admin access through Firebase Auth. Note: the UI was designed to the client\'s preferences.',
      tech: ['Next.js', 'React', 'TypeScript', 'Firebase', 'Cloudinary'],
      link: 'https://online-ordering-system-ochre.vercel.app/menu',
      github: 'https://github.com/bananaNuggets75/online-ordering-system',
      icon: <FaUtensils />,
      image: '/food-delivery.png',
      badge: 'Live',
      features: [
        'Menu browsing with sizes and flavors',
        'Cart that persists across reloads',
        'Checkout and real-time order tracking',
        'Admin dashboard for menu and orders',
        'Role-based access via Firebase Auth'
      ],
      stats: [
        { label: 'Status', value: 'Live' },
        { label: 'Client', value: 'CPU SHS Students' },
        { label: 'Role', value: 'Full-stack' }
      ]
    },
    {
      id: '3',
      title: 'CPU-SHS Research Archive',
      description: 'Research paper archive and management system for CPU Senior High School.',
      fullDescription: 'A research archive built for Central Philippine University Senior High School, letting students and faculty upload, manage, and search academic research papers with filtering and categorization. Includes authentication, document management, and an admin dashboard for content moderation. Note: the UI was designed to the client\'s preferences.',
      tech: ['Next.js', 'React', 'TypeScript', 'Firebase', 'Cloudinary', 'Node.js'],
      link: 'https://cpu-research-archive.vercel.app/',
      github: 'https://github.com/bananaNuggets75/cpu-research-archive',
      icon: <FaBook />,
      image: '/cpu-shs.png',
      badge: 'Live',
      features: [
        'Advanced search and filtering',
        'Document upload and management',
        'User authentication and roles',
        'Admin dashboard for moderation'
      ],
      stats: [
        { label: 'Status', value: 'Live' },
        { label: 'Client', value: 'CPU SHS' },
        { label: 'Role', value: 'Full-stack' }
      ]
    },
    {
      id: '4',
      title: 'WattWise AI',
      description: 'Champion — "Hacking the Future of Energy" hackathon (CPU, 2026). AI app for smarter energy use.',
      fullDescription: 'WattWise AI won 1st place (Champion) at "Ready, Spark, Charge 2026: Hacking the Future of Energy" — a hackathon by New Energy Nexus Philippines with CPUGAD TBI and DOST Western Visayas iHubs, held at Central Philippine University. It is a web + mobile app that helps people understand and reduce their energy usage, using OCR (Gemini) to read electricity bills/meters and Supabase as the backend. Built as a hackathon prototype — the full product is still in progress.',
      tech: ['React', 'TypeScript', 'Expo', 'Supabase', 'Gemini OCR'],
      link: '#',
      github: '',
      icon: <FaBolt />,
      image: '/wattwise-1.jpg',
      images: [
        '/wattwise-1.jpg', '/wattwise-2.jpg', '/wattwise-3.jpg',
        '/wattwise-4.jpg', '/wattwise-5.jpg', '/wattwise-6.jpg',
        '/wattwise-cert-team.png', '/wattwise-cert-individual.png',
      ],
      badge: 'Champion',
      isPrivate: true,
      features: [
        'Champion (1st place) — energy hackathon at CPU',
        'Web + mobile app built with Expo',
        'OCR bill/meter reading via Gemini',
        'Supabase backend',
        'Hackathon prototype — full build in progress'
      ],
      stats: [
        { label: 'Result', value: 'Champion' },
        { label: 'Event', value: 'Hackathon' },
        { label: 'Platform', value: 'Web + Mobile' }
      ]
    },
    {
      id: '5',
      title: 'GameOn — Region 6 Delicacies Kitchen',
      description: 'Hackathon 2D cooking game (Godot) celebrating Iloilo / Region 6 delicacies.',
      fullDescription: 'A 2D cooking time-management game built in the Godot Engine that celebrates the local delicacies of Region 6 (Western Visayas), Philippines — dishes like molo soup and biscocho. Built as a hackathon project: serve customers their orders before they lose patience, through tactile drag-and-drop kitchen gameplay. Part fast-paced kitchen sim, part cultural showcase.',
      tech: ['Godot', 'GDScript'],
      link: '#',
      github: '',
      icon: <FaGamepad />,
      image: '/gameon-1.jpg',
      images: ['/gameon-1.jpg', '/gameon-2.jpg', '/gameon-3.jpg'],
      badge: 'Hackathon',
      isPrivate: true,
      features: [
        'Drag-and-drop kitchen gameplay',
        'Ingredient → dish preparation (molo soup, biscocho)',
        'Timed customer spawning + coin goal economy',
        'Region 6 culinary cultural theme'
      ],
      stats: [
        { label: 'Event', value: 'Hackathon' },
        { label: 'Engine', value: 'Godot' },
        { label: 'Theme', value: 'Region 6' }
      ]
    },
    {
      id: '6',
      title: 'Feed Mill POS & Management',
      description: 'Point-of-sale and operations system built for a feed mill business.',
      fullDescription: 'A full-stack point-of-sale and management system built for a real feed mill business, covering the operational cycle from raw-material purchasing and inventory to sales recording and financial reporting. Integrates with a POS provider to sync sales receipts automatically. Built with Next.js and Prisma on PostgreSQL. Private client project — details kept high-level.',
      tech: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      link: '#',
      github: '',
      icon: <FaWarehouse />,
      image: '/warn.png',
      badge: 'Private',
      isPrivate: true,
      features: [
        'Inventory tracking for raw materials',
        'Sales recording with invoicing',
        'Expense tracking and financial reports',
        'Automatic POS receipt sync'
      ],
      stats: [
        { label: 'Client', value: 'Real business' },
        { label: 'Stack', value: 'Next + Prisma' },
        { label: 'Access', value: 'Private' }
      ]
    },
    {
      id: '7',
      title: 'Guidance Support System (Naive Bayes)',
      description: 'Web counseling platform using Naive Bayes classification and sentiment analysis.',
      fullDescription: 'A web-based counseling platform for a university guidance office that lets students book and attend sessions privately. Two machine-learning pipelines assist counselors: a Naive Bayes classifier predicts the likely mental-health category from a pre-session intake form, and a second model runs sentiment analysis on post-session feedback to gauge effectiveness. Built with Django and scikit-learn. Capstone / thesis project.',
      tech: ['Django', 'Python', 'scikit-learn', 'NLTK', 'PostgreSQL'],
      link: '#',
      github: '',
      icon: <FaBrain />,
      image: '/warn.png',
      badge: 'Academic',
      isPrivate: true,
      features: [
        'Naive Bayes intake classification',
        'Sentiment analysis on session feedback',
        'Appointment scheduling with multiple modes',
        'Counselor documentation and reporting'
      ],
      stats: [
        { label: 'Type', value: 'Thesis' },
        { label: 'ML', value: 'Naive Bayes' },
        { label: 'Backend', value: 'Django' }
      ]
    },
    {
      id: '8',
      title: 'Baccarat Analyzer',
      description: 'Chrome extension that tracks a live baccarat shoe and runs an ML prediction model.',
      fullDescription: 'A Chrome extension that intercepts a live baccarat WebSocket stream, tracks the shoe in real time, builds the standard roads, and runs a logistic-regression model trained on session data — blended with rule-based card counting. Feature extraction is mirrored between Python (training) and TypeScript (inference) so they match exactly. Built as an honest study of where real signal exists (card composition) versus none (road patterns).',
      tech: ['TypeScript', 'React', 'Python', 'scikit-learn'],
      link: '#',
      github: '',
      icon: <FaChartLine />,
      image: '/warn.png',
      badge: 'Personal',
      isPrivate: true,
      features: [
        'Real-time WebSocket hand parsing',
        'Logistic-regression inference in TypeScript',
        'Card counting + ML blend by shoe depth',
        'Python training pipeline with holdout evaluation'
      ],
      stats: [
        { label: 'Type', value: 'ML' },
        { label: 'Surface', value: 'Extension' },
        { label: 'Lang', value: 'TS + Python' }
      ]
    },
    {
      id: '9',
      title: 'GameOn — Region 6 Delicacies Kitchen',
      description: 'Hackathon 2D cooking game (Godot) celebrating Iloilo / Region 6 delicacies.',
      fullDescription: 'A 2D cooking time-management game built in the Godot Engine that celebrates the local delicacies of Region 6 (Western Visayas), Philippines — dishes like molo soup and biscocho. Built as a hackathon project: serve customers their orders before they lose patience, through tactile drag-and-drop kitchen gameplay. Part fast-paced kitchen sim, part cultural showcase.',
      tech: ['Godot', 'GDScript'],
      link: '#',
      github: '',
      icon: <FaGamepad />,
      image: '/gameon-1.jpg',
      images: ['/gameon-1.jpg', '/gameon-2.jpg', '/gameon-3.jpg'],
      badge: 'Hackathon',
      isPrivate: true,
      features: [
        'Drag-and-drop kitchen gameplay',
        'Ingredient → dish preparation (molo soup, biscocho)',
        'Timed customer spawning + coin goal economy',
        'Region 6 culinary cultural theme'
      ],
      stats: [
        { label: 'Event', value: 'Hackathon' },
        { label: 'Engine', value: 'Godot' },
        { label: 'Theme', value: 'Region 6' }
      ]
    }
  ];

  const certificates: Certificate[] = [
    {
      id: 'hackathon',
      title: 'Hacking the Future of Energy — Hackathon',
      issuer: 'New Energy Nexus Philippines',
      date: 'May 2026',
      description: 'Participated in "Ready, Spark, Charge 2026" with team WattWise AI — an energy-focused hackathon at Central Philippine University, in partnership with CPUGAD TBI and DOST Western Visayas iHubs.',
      icon: <FaBolt className="text-xl text-yellow-500" />,
      image: '/wattwise-cert-individual.png',
      credentialId: ''
    },
    {
      id: '1',
      title: "Machine Learning with Python",
      issuer: 'freeCodeCamp',
      date: 'July 2025',
      description: 'Tensorflow and Keras for machine learning projects',
      icon: <SiTensorflow className="text-xl text-orange-500" />,
      image: '/www.freecodecamp.org_certification_fcc96ed4dd6-3f7e-4a9f-b64d-0edbb4430254_machine-learning-with-python-v7.png',
      credentialId: ''
    },
    {
      id: '2',
      title: 'Introduction to Data Science',
      issuer: 'Cisco Networking Academy',
      date: 'July 2025',
      description: 'Basics of data science, data analysis, and visualization',
      icon: <SiCisco className="text-xl text-blue-500" />,
      image: '/intro_ds_cert.png',
      credentialId: ''
    },
    {
      id: '3',
      title: 'Introduction to CyberSecurity',
      issuer: 'Cisco Networking Academy',
      date: 'July 2025',
      description: 'Vulnerabilities, how you protect your network, and cyber attacks',
      icon: <FaShieldAlt className="text-xl text-red-500" />,
      image: '/_certificate_kenanben-polgo-21-cpu-edu-ph_0a42e4b9-d53d-4f9e-a44e-4a28ebdaf58b.jpg',
      credentialId: ''
    },
    {
      id: '4',
      title: '[Beta] Data Science Essentials with Python',
      issuer: 'Cisco Networking Academy',
      date: 'July 2025',
      description: 'Manipulation and analysis of data using Python',
      icon: <FaCertificate className="text-xl text-purple-600" />,
      image: '/_certificate_kenanben-polgo-21-cpu-edu-ph_2597ce24-e6bf-4aef-8117-9b7010eb1443.jpg',
      credentialId: '',
      verifyLink: ''
    },
    {
      id: '5',
      title: 'JavaScript Basics',
      issuer: 'HackerRank',
      date: 'July 2025',
      description: 'Basic JavaScript Certificate',
      icon: <SiJavascript className="text-xl text-yellow-400" />,
      image: '/javascript_basic certificate.jpg',
      credentialId: '',
      verifyLink: ''
    },
    {
      id: '6',
      title: 'AI Fundamentals with IBM SkillsBuild',
      issuer: 'Cisco Networking Academy',
      date: 'August 2025',
      description: 'Fundamentals of artificial intelligence including machine learning, neural networks, and ethical AI practices, developed in collaboration with IBM SkillsBuild.',
      icon: <SiOpenai className="text-xl text-sky-700" />,
      credentialId: ''
    },
    {
      id: '7',
      title: 'CCNAv7: Introduction to Networks',
      issuer: 'Cisco Networking Academy',
      date: 'May 2024',
      description: 'Networking fundamentals — protocols, IP addressing, Ethernet, and network topologies. Taken at Central Philippine University.',
      icon: <FaNetworkWired className="text-xl text-green-600" />,
      credentialId: ''
    },
    {
      id: '8',
      title: 'IT Essentials: PC Hardware and Software',
      issuer: 'Cisco Networking Academy',
      date: 'July 2024',
      description: 'PC hardware, repair, and maintenance — assembling, troubleshooting, and supporting computer systems. Taken at Central Philippine University.',
      icon: <FaTools className="text-xl text-blue-500" />,
      credentialId: ''
    }
  ];

  const techStack = [
    // 🧠 Languages
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C++', icon: 'https://cdn.simpleicons.org/cplusplus/00599C' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
  
    // 🧰 Tools & IDEs
    { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Visual Studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg' },
    { name: 'PyCharm', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  
    // 🧱 Frameworks & Libraries
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
    { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
    { name: 'Pandas', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
    { name: 'NumPy', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
    { name: 'scikit-learn', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg' },
    { name: 'NestJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg' },
    { name: 'Express', icon: 'https://cdn.simpleicons.org/express/68A063' },
    { name: 'Chart.js', icon: 'https://cdn.simpleicons.org/chartdotjs/FF6384' },

    // 🛢️ Databases
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Prisma', icon: 'https://cdn.simpleicons.org/prisma/5A67D8' },
    { name: 'SQL Server', icon: 'https://api.iconify.design/tabler:database.svg?color=%23CC2927    ' },
  
    // 🔧 Platforms & Misc
    { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-plain.svg' },
    { name: 'Arduino', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
    { name: 'Godot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg' },
    { name: 'Expo', icon: 'https://cdn.simpleicons.org/expo/FFFFFF' },
    { name: 'Cloudinary', icon: 'https://cdn.simpleicons.org/cloudinary/3448C5' },
    { name: 'Vercel', icon: 'https://cdn.simpleicons.org/vercel/FFFFFF' },
    { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }
  ];
  
  
  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'portfolio', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Navbar scroll effect
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animation hooks for different sections
  const [homeRef, homeInView] = useInView(0.3, 'fadeInUp');
  const [aboutRef, aboutInView] = useInView(0.3, 'slideInLeft');
  const [portfolioRef, portfolioInView] = useInView(0.3, 'scaleIn');
  const [contactRef, contactInView] = useInView(0.3, 'slideInUp');

  // Generate floating bubbles
  useEffect(() => {
    const generateBubbles = (count: number): Bubble[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }));
    };

    setBubbles(generateBubbles(20));
  }, []);

  return (
    <div className="portfolio">
      {/* Floating bubbles background */}
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: bubble.left,
              animationDelay: bubble.animationDelay,
              animationDuration: bubble.animationDuration
            }}
          ></div>
        ))}
      </div>

      {/* Navigation */}
      <nav id="navbar" className="navbar">
        <ul className="nav-links">
          <li>
            <a
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home')}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => scrollToSection('about')}
            >
              About
            </a>
          </li>
          <li>
            <a
              className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
              onClick={() => scrollToSection('portfolio')}
            >
              Portfolio
            </a>
          </li>
          <li>
            <a
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero" ref={homeRef}>
        <div className="hero-bg"></div>
        <div className="geometric-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className={`hero-content ${homeInView ? 'animate-fadeInUp' : ''}`}>
          <p className="hero-subtitle">Welcome to my portfolio</p>
          <h1 className="hero-title">
            Hi, I'm <span className="hero-name-highlight">Kenan Ben G. Polgo</span>
          </h1>
          <div className="typing-container">
            <span className="typing-text">{typedText}</span>
            <span className="typing-cursor">|</span>
          </div>
          <p className="hero-description">
            Passionate about creating innovative web solutions and bringing ideas to life through clean code and beautiful design.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => scrollToSection('portfolio')}>
              View My Work
            </button>
            <button className="cta-secondary" onClick={() => scrollToSection('contact')}>
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section section-secondary" ref={aboutRef}>
        <div className="section-title">
          About <span className="section-title-accent">Me</span>
        </div>
        <div className={`about-grid ${aboutInView ? 'animate-slideInLeft' : ''}`}>
          <div className="profile-section">
            <div className="profile-card">
              {/* Replace emoji with image */}
              <div className="profile-avatar">
                <img 
                  src="/IMG_8515.JPG" 
                  alt="Profile" 
                  className="profile-image"
                />
              </div>
              <h2 className="profile-name">Kenan Ben G. Polgo</h2>
              <p className="profile-role">Full-Stack Developer</p>
              <p className="profile-university">Central Philippine University</p>
            </div>
          </div>
          <div className="about-content">
            <div className="about-card">
              <div className="card-header">
                <div className="card-icon">🚀</div>
                <h3 className="card-title">My Journey</h3>
              </div>
              <div className="about-text">
                <p>
                  I'm a passionate <span className="highlight">Computer Science student</span> at Central Philippine University,
                  dedicated to creating innovative web solutions that make a difference. My journey in technology
                  began with curiosity and has evolved into a deep commitment to excellence in software development.
                </p>
                <p>
                  With experience in <span className="highlight">full-stack development</span>, I enjoy tackling
                  complex problems and turning ideas into reality through clean, efficient code.
                </p>
              </div>
            </div>
            <div className="about-card">
              <div className="card-header">
                <div className="card-icon">🎓</div>
                <h3 className="card-title">Education</h3>
              </div>
              <div className="education-item">
                <h4 className="education-degree">Bachelor of Science in Computer Science</h4>
                <p className="education-school">Central Philippine University</p>
                <p className="education-period">2021 - Present</p>
                <p className="education-details">
                  Currently pursuing my degree with a focus on software engineering and web development.
                  Maintaining high academic standards while actively participating in programming competitions and tech events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="section" ref={portfolioRef}>
        <div className="portfolio-container"> 
          <div className="section-title">
            My <span className="section-title-accent">Portfolio</span>
          </div>
          <div className={`portfolio-tabs ${portfolioInView ? 'animate-scaleIn' : ''}`}>
            {portfolioTabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="mr-1">{tab.icon}</span> {tab.name}
              </button>
            ))}
            </div>
          </div>

          {/* Projects Tab */}
          <div className={`tab-content ${activeTab === 'projects' ? 'active' : ''}`}>
            <div className="projects-grid">
              {projects.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`project-card ${portfolioInView ? 'animate-slideInUp' : ''}`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image">
                    {project.images && project.images.length > 1 ? (
                      <div className={`project-collage count-${Math.min(project.images.length, 4)}`}>
                        {project.images.slice(0, 4).map((img, i) => {
                          const more = i === 3 && project.images!.length > 4;
                          return (
                            <div className="collage-tile" key={i}>
                              <img src={img} alt={`${project.title} ${i + 1}`} />
                              {more && (
                                <span className="collage-more">+{project.images!.length - 4}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <img src={project.image} alt={project.title} />
                    )}
                    {project.badge && (
                      <span className={`project-badge badge-${project.badge.toLowerCase()}`}>
                        {project.badge}
                      </span>
                    )}
                    <div className="project-overlay">
                      <div className="project-links-updated">
                        {project.link && project.link !== '#' && (
                          <a
                            href={project.link}
                            className="project-link-demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Demo
                          </a>
                        )}
                        <span
                          className="project-link-details"
                          onClick={() => setSelectedProject(project)}
                        >
                          Details
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3 className="project-title">
                      <span className="project-card-icon">{project.icon}</span>
                      {project.title}
                    </h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tags">
                      {project.tech.slice(0, 3).map((tech, index) => (
                        <span key={index} className="tag">{tech}</span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="tag">+{project.tech.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Tab */}
          <div className={`tab-content ${activeTab === 'certificates' ? 'active' : ''}`}>
            <div className="certificates-grid">
              {certificates.map((cert, index) => (
                <div 
                  key={cert.id} 
                  className={`certificate-card ${portfolioInView ? 'animate-slideInUp' : ''}`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => setSelectedCertificate(cert)}
                >
                  <div className="cert-image">
                    {cert.image ? (
                      <img src={cert.image} alt={cert.title} />
                    ) : (
                      <div className="cert-image-placeholder">
                        <span className="cert-placeholder-icon">{cert.icon}</span>
                        <span className="cert-placeholder-issuer">{cert.issuer}</span>
                      </div>
                    )}
                    <div className="cert-overlay">
                      <span className="cert-view-btn">View Certificate</span>
                    </div>
                  </div>
                  <div className="cert-header">
                    <div className="cert-icon">{cert.icon}</div>
                    <div className="cert-info">
                      <h3>{cert.title}</h3>
                      <p className="cert-issuer">{cert.issuer}</p>
                      <p className="cert-date">{cert.date}</p>
                    </div>
                  </div>
                  <p className="cert-description">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Tab - Simplified */}
          <div className={`tab-content ${activeTab === 'skills' ? 'active' : ''}`}>
            <div className="tech-stack-simple">
              {techStack.map((tech, index) => (
                <div 
                  key={index} 
                  className={`tech-item-simple ${portfolioInView ? 'animate-slideInUp' : ''}`}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <img src={tech.icon} alt={tech.name} className="tech-logo-simple" />
                  <h4 className="tech-name-simple">{tech.name}</h4>
                </div>
              ))}
            </div>
          </div>
      </section>

      <section id="contact" className="section section-secondary" ref={contactRef}>
        <div className="section-title">
          Get In <span className="section-title-accent">Touch</span>
        </div>
        <div className={`contact-grid ${contactInView ? 'animate-slideInUp' : ''}`}>
          {/* Left side - Contact Info */}
          <div className="contact-info">
            <div className="contact-card">
              <a href="mailto:kenanbenpolgo@gmail.com" className="contact-item-link">
                <div className="contact-item">
                  <div className="contact-icon"><Mail className="w-5 h-5 text-white" /></div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <span className="text-blue-500">kenanbenpolgo@gmail.com</span>
                  </div>
                </div>
              </a>
              
              <div className="contact-item">
                <div className="contact-icon"><Phone className="w-5 h-5 text-white" /></div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>+63 917 185 8427</p>
                </div>
              </div>
              
              <a 
                href="https://www.google.com/maps/place/Iloilo+City,+Philippines" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-item-link"
              >
                <div className="contact-item">
                  <div className="contact-icon"><MapPin className="w-5 h-5 text-white" /></div>
                  <div className="contact-details">
                    <h4>Location</h4>
                    <span className="text-white">Iloilo City, Philippines</span>
                  </div>
                </div>
              </a>
              
              <div className="social-links">
                <a href="https://www.linkedin.com/in/kenan-ben-polgo/" className="social-link" target="_blank" rel="noopener noreferrer">
                  <img src="https://api.iconify.design/mdi:linkedin.svg?color=%230A66C2" alt="LinkedIn" width="24" height="24" /> LinkedIn
                </a>
                <a href="https://github.com/bananaNuggets75" className="social-link" target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.simpleicons.org/github/181717" alt="GitHub" width="24" height="24" /> GitHub
                </a>
                <a href="https://www.instagram.com/keenaniganss/" className="social-link" target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="Instagram" width="24" height="24" /> Instagram
                </a>
              </div>

              {/* Comment Form */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: 'var(--card-bg)',
                borderRadius: '1rem',
                border: '1px solid var(--border-color)'
              }}>
                <h3 style={{
                  marginBottom: '1rem',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-light)'
                }}>
                  <MessageCircle className="w-5 h-5" style={{ color: 'var(--accent-color)' }} />
                  Leave a Comment
                </h3>

                {success && (
                  <div style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#4ade80'
                  }}>
                    Comment posted successfully!
                  </div>
                )}

                {error && (
                  <div style={{
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Name <span style={{ color: '#f87171' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        disabled={submitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.5rem',
                          color: 'var(--text-light)',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                        Email <span style={{ color: '#9ca3af' }}>(optional)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        disabled={submitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.5rem',
                          color: 'var(--text-light)',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Message <span style={{ color: '#f87171' }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      rows={3}
                      disabled={submitting}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        color: 'var(--text-light)',
                        fontSize: '0.875rem',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !formData.name.trim() || !formData.message.trim()}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: submitting || !formData.name.trim() || !formData.message.trim()
                        ? 'linear-gradient(to right, #c084fc, #f9a8d4)'
                        : 'linear-gradient(to right, var(--accent-dark), #ec4899)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                      fontWeight: '600',
                      cursor: submitting || !formData.name.trim() || !formData.message.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.2s',
                      fontSize: '16px'
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Post Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Comments Display */}
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              borderRadius: '1rem',
              padding: '2rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem'
              }}
            >
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <MessageCircle className="w-6 h-6" style={{ color: 'var(--accent-color)' }} />
                Comments ({comments.length})
              </h3>
              <button
                onClick={fetchComments}
                disabled={loading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'var(--glass-bg)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-light)',
                  fontSize: '0.875rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1
                }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '↻ Refresh'}
              </button>
            </div>

            {loading ? (
              <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 0',
                color: 'var(--text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading comments...</span>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <MessageCircle className="w-12 h-12" style={{ color: '#6b7280', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to leave a comment!</p>
            </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {comments.map((comment) => (
                  <div key={comment.id} style={{
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: comment.is_pinned
                      ? '1px solid var(--accent-color)'
                      : '1px solid var(--border-color)',
                    backgroundColor: comment.is_pinned ? 'rgba(139, 92, 246, 0.1)' : 'var(--card-bg)',
                    transition: 'all 0.3s',
                    boxShadow: comment.is_pinned ? '0 10px 25px rgba(168, 85, 247, 0.1)' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(to bottom right, var(--accent-dark), #ec4899)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontWeight: '600', color: 'var(--text-light)' }}>{comment.name}</h4>
                          {comment.is_pinned && (
                            <span style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: 'rgba(168, 85, 247, 0.2)',
                              color: 'var(--accent-light)',
                              fontSize: '0.75rem',
                              borderRadius: '9999px',
                              fontWeight: '500'
                            }}>
                              PINNED
                            </span>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <Calendar className="w-3 h-3" />
                            {formatTimestamp(comment.created_at)}
                          </div>
                        </div>
                        <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>{comment.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content project-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>×</button>
            <div className="modal-header">
              <div className="breadcrumb">
                <span className="breadcrumb-link" onClick={() => setSelectedProject(null)}>← Back</span>
                <span className="breadcrumb-separator">Projects</span>
                <span className="breadcrumb-current">{selectedProject.title}</span>
              </div>
            </div>
            <div className="project-detail">
              <div className="project-detail-header">
                <h1 className="project-detail-title">{selectedProject.title}</h1>
                <div className="project-detail-description">
                  {selectedProject.fullDescription}
                </div>
              </div>
              <div className="project-detail-content">
                <div className="project-detail-main">
                  <div className="project-gallery">
                    <button
                      type="button"
                      className="project-image-large"
                      onClick={() =>
                        setLightbox({
                          images: selectedProject.images?.length
                            ? selectedProject.images
                            : [selectedProject.image],
                          index: 0,
                        })
                      }
                    >
                      <img src={selectedProject.image} alt={selectedProject.title} />
                    </button>
                    {selectedProject.images && selectedProject.images.length > 1 && (
                      <div className="gallery-thumbs">
                        {selectedProject.images.slice(0, 4).map((img, i) => {
                          const more = i === 3 && selectedProject.images!.length > 4;
                          return (
                            <button
                              key={i}
                              type="button"
                              className="gallery-thumb"
                              onClick={() =>
                                setLightbox({ images: selectedProject.images!, index: i })
                              }
                            >
                              <img src={img} alt={`${selectedProject.title} ${i + 1}`} />
                              {more && (
                                <span className="gallery-thumb-more">
                                  +{selectedProject.images!.length - 4}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="project-stats">
                    {selectedProject.stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <div className="stat-icon"><FaStar /></div>
                        <div className="stat-content">
                          <div className="stat-value">{stat.value}</div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="project-actions">
                    {selectedProject.link && selectedProject.link !== '#' ? (
                      <a href={selectedProject.link} className="action-btn primary" target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    ) : (
                      <span className="action-btn disabled">
                        <FaLock /> Demo unavailable
                      </span>
                    )}
                    {selectedProject.github ? (
                      <a href={selectedProject.github} className="action-btn secondary" target="_blank" rel="noopener noreferrer">
                        <FaGithub /> GitHub
                      </a>
                    ) : (
                      <span className="action-btn disabled">
                        <FaLock /> Private repo
                      </span>
                    )}
                  </div>
                </div>
                <div className="project-detail-sidebar">
                  <div className="detail-section">
                    <h3 className="detail-section-title"><FaListUl /> Key Features</h3>
                    <ul className="feature-list">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="feature-item">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-section-title"><FaTools /> Technologies Used</h3>
                    <div className="tech-tags">
                      {selectedProject.tech.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox / Gallery */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
            <FaTimes />
          </button>
          {lightbox.images.length > 1 && (
            <button
              className="lightbox-nav prev"
              onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}
              aria-label="Previous"
            >
              <FaChevronLeft />
            </button>
          )}
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.images[lightbox.index]}
              alt={`View ${lightbox.index + 1}`}
              className="lightbox-img"
            />
            {lightbox.images.length > 1 && (
              <div className="lightbox-counter">
                {lightbox.index + 1} / {lightbox.images.length}
              </div>
            )}
          </div>
          {lightbox.images.length > 1 && (
            <button
              className="lightbox-nav next"
              onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}
              aria-label="Next"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      )}

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="modal-overlay" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content certificate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCertificate(null)}>×</button>
            <div className="certificate-detail">
              <div className="certificate-image-container">
                {selectedCertificate.image ? (
                  <img src={selectedCertificate.image} alt={selectedCertificate.title} className="certificate-image-large" />
                ) : (
                  <div className="cert-image-placeholder large">
                    <span className="cert-placeholder-icon">{selectedCertificate.icon}</span>
                    <span className="cert-placeholder-issuer">{selectedCertificate.issuer}</span>
                    <span className="cert-placeholder-note">No certificate image available</span>
                  </div>
                )}
              </div>
              <div className="certificate-info-detail">
                <div className="cert-header-detail">
                  <div className="cert-icon-large">{selectedCertificate.icon}</div>
                  <div>
                    <h2 className="cert-title-large">{selectedCertificate.title}</h2>
                    <p className="cert-issuer-large">{selectedCertificate.issuer}</p>
                    <p className="cert-date-large">{selectedCertificate.date}</p>
                  </div>
                </div>
                <p className="cert-description-large">{selectedCertificate.description}</p>
                {selectedCertificate.credentialId && (
                  <div className="credential-info">
                    <strong>Credential ID:</strong> {selectedCertificate.credentialId}
                  </div>
                )}
                {selectedCertificate.verifyLink && (
                  <div className="certificate-actions">
                    <a href={selectedCertificate.verifyLink} className="verify-btn" target="_blank" rel="noopener noreferrer">
                      🔍 Verify Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <footer>
        <div className="footer-content">
          <p>© {new Date().getFullYear()} Kenan Ben G. Polgo™. All rights reserved.</p>
        </div>
      </footer>
    </div>
    
  );
};

export default Portfolio;