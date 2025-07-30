"use client";

import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, User, Calendar, Loader2, AlertCircle } from "lucide-react"
import { FaDatabase, FaShieldAlt, FaCertificate, FaCode, FaTools } from 'react-icons/fa';
import { SiTensorflow, SiCisco, SiJavascript, SiOracle } from 'react-icons/si';

import { supabase } from '../lib/supabaseClient';



// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  type Comment = {
    id: string;
    name: string;
    message: string;
    created_at: string;
    is_pinned: boolean;
  };
  
  // 2. Add these state variables inside your Portfolio component (after your existing useState declarations)
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
  
  // 3. Add these functions inside your Portfolio component (after your existing functions)
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
    link: string;
    github: string;
    icon: string;
    image: string;
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
    image: string;
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
      title: 'CPU-SHS Research Archive',
      description: 'Full-stack web system for managing research papers and academic documents *Note: The UI was designed based on the client\'s preferences.*',
      fullDescription: 'A comprehensive research archive system built for Central Philippine University Senior High School. This platform allows students and faculty to upload, manage, and search through academic research papers with advanced filtering and categorization features.  *Note: The UI was designed based on the client\'s preferences.*',
      tech: ['React', 'Node.js', 'Cloudinary', 'Firebase', 'TypeScript', 'Next.js'],
      link: 'https://cpu-research-archive.vercel.app/',
      github: 'https://github.com/bananaNuggets75/cpu-research-archive',
      icon: '📚',
      image: '/cpu-shs.png',
      features: [
        'Advanced search and filtering system',
        'User authentication and authorization',
        'Document upload and management',
        'Real-time notifications',
        'Admin dashboard for content moderation'
      ],
      stats: [
        { label: 'Technologies Used', value: '6' },
        { label: 'Active Users', value: '500+' },
        { label: 'Documents Stored', value: '1000+' }
      ]
    },
    {
      id: '2',
      title: 'E-Voting Blockchain',
      description: 'Django-based secure e-voting platform using blockchain principles',
      fullDescription: 'A blockchain-inspired e-voting system built with Django, designed to improve transparency and security in student council elections. Developed in response to issues encountered with previous platforms like Canvas.',
      tech: ['Django', 'PostgreSQL', 'Python', 'CSS'],
      link: '#',
      github: 'https://github.com/bananaNuggets75/thesis-platform',
      icon: '🗳️',
      image: '/warn.png',
      features: [
        'Secure vote submission with encryption',
        'Tamper-proof voting records',
        'Voter authentication system',
        'Real-time results dashboard',
        'Admin panel for election setup and management'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Students Helped', value: '200+' },
        { label: 'Thesis Completed', value: '150+' }
      ]
    },
    {
      id: '3',
      title: 'Traffic Management System',
      description: 'React-TypeScript application for traffic flow optimization',
      fullDescription: 'An intelligent traffic management system that uses real-time data analysis to optimize traffic flow in urban areas. Features interactive dashboards and predictive analytics.',
      tech: ['React', 'TypeScript', 'Chart.js', 'Firebase', 'Node.js', 'Next.js'],
      link: 'https://traffic-management-system-cyan.vercel.app/',
      github: 'https://github.com/bananaNuggets75/traffic-management-system',
      icon: '🚦',
      image: '/traffic.png',
      features: [
        'Real-time traffic monitoring',
        'Predictive traffic analysis',
        'Interactive data visualization',
        'Alert system for congestion',
        'Historical data analysis'
      ],
      stats: [
        { label: 'Technologies Used', value: '6' },
        { label: 'Traffic Points', value: '50+' },
        { label: 'Data Points/Day', value: '10K+' }
      ]
    },
    {
      id: '4',
      title: 'Food Delivery Web App',
      description: 'Full-stack food delivery web app eclusive in CPU campus *Note: The UI was designed based on the client\'s preferences.*',
      fullDescription: 'A full-stack food delivery web application designed exclusively for the CPU campus community. It features real-time order tracking, secure payment options, and a robust admin dashboard for managing menus, orders, and customer feedback. *Note: The UI was designed based on the client\'s preferences.*',
      tech: ['Next.js', 'Firebase', 'Node.js', 'React', 'TypeScript'],
      link: 'https://online-ordering-system-ochre.vercel.app/menu',
      github: 'https://github.com/bananaNuggets75/online-ordering-system',
      icon: '🛍️',
      image: '/food-delivery.png',
      features: [
        'Campus-exclusive delivery system',
        'Real-time order tracking',
        'Secure payment integration (GCash & Cash on Delivery)',
        'Customizable menu and categories',
        'Responsive admin dashboard for order management',
        'Customer order history and nickname-based tracking',
        'Delivery or pickup options with location input',
        'Status updates with live notifications'
      ],      
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Orders Processed', value: '200+' },
        { label: 'Revenue Generated', value: '10k+' }
      ]
    },
    {
      id: '5',
      title: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates',
      fullDescription: 'A comprehensive task management application that enables teams to collaborate effectively with real-time updates, file sharing, and progress tracking.',
      tech: ['React', 'Socket.io', 'Express', 'MongoDB', 'JWT'],
      link: '#',
      github: 'https://github.com/bananaNuggets75/task-manager',
      icon: '',
      image: '/warn.png',
      features: [
        'Real-time collaboration',
        'Task assignment and tracking',
        'File attachment system',
        'Team chat integration',
        'Progress analytics'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Active Teams', value: '100+' },
        { label: 'Tasks Completed', value: '5000+' }
      ]
    },
    {
      id: '6',
      title: 'QuickShop',
      description: 'A B2B Wholesale E-Commerce Platform',
      fullDescription: 'QuickShop is a B2B wholesale e-commerce platform designed to streamline bulk ordering between retailers and suppliers. It features user-friendly product browsing, tiered pricing, and a secure order management system built for scalability.',
      tech: ['Vue.js', 'Node.js', 'MongoDB', 'Express.js', 'Tailwind CSS'],
      link: '#',
      github: 'https://github.com/bananaNuggets75/quickshop',
      icon: '🏪',
      image: '/warn.png',
      features: [
        'Bulk ordering system with tiered pricing',
        'Supplier and retailer role management',
        'Order tracking and status updates',
        'Inventory and stock level management',
        'Secure checkout and invoice generation',
        'Responsive UI with mobile support',
        'Admin dashboard for analytics and reporting'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Registered Suppliers', value: '120+' },
        { label: 'Bulk Orders Processed', value: '5K+' }
      ]
    }
  ];

  const certificates: Certificate[] = [
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
      credentialId: 'DEVCON-2024-RU'
    },
    {
      id: '3',
      title: 'Introduction to CyberSecurity',
      issuer: 'Cisco Networking Academy',
      date: 'July 2025',
      description: 'Vulnerabilities, how you protect your network, and cyber attacks',
      icon: <FaShieldAlt className="text-xl text-red-500" />,
      image: '/_certificate_kenanben-polgo-21-cpu-edu-ph_0a42e4b9-d53d-4f9e-a44e-4a28ebdaf58b.jpg',
      credentialId: 'GDSC-2023-ACTIVE'
    },
    {
      id: '4',
      title: '[Beta] Data Science Essentials with Python',
      issuer: 'Cisco Networking Academy',
      date: 'July 2025',
      description: 'Manipulation and analysis of data using Python',
      icon: <FaCertificate className="text-xl text-purple-600" />,
      image: '/_certificate_kenanben-polgo-21-cpu-edu-ph_2597ce24-e6bf-4aef-8117-9b7010eb1443.jpg',
      credentialId: 'FCC-JS-2023-001',
      verifyLink: 'https://freecodecamp.org/certification/verify/js-cert'
    },
    {
      id: '5',
      title: 'JavaScript Basics',
      issuer: 'HackerRank',
      date: 'July 2025',
      description: 'Basic JavaScript Certificate',
      icon: <SiJavascript className="text-xl text-yellow-400" />,
      image: '/javascript_basic certificate.jpg',
      credentialId: 'COURSERA-REACT-2023',
      verifyLink: 'https://coursera.org/verify/react-cert'
    },
    {
      id: '6',
      title: 'Database Design',
      issuer: 'Oracle Academy',
      date: '2024',
      description: 'Database design and SQL optimization certification',
      icon: <FaDatabase className="text-xl text-sky-700" />,
      image: '/api/placeholder/400/300',
      credentialId: 'ORACLE-DB-2024-001'
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
  
    // 🛢️ Databases
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
    { name: 'SQL Server', icon: 'https://api.iconify.design/tabler:database.svg?color=%23CC2927    ' },
  
    // 🔧 Platforms & Misc
    { name: '.NET', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-plain.svg' },
    { name: 'Arduino', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
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
  const generateBubbles = (count: number) => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        className="bubble"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 20}s`,
          animationDuration: `${15 + Math.random() * 10}s`
        }}
      ></div>
    ));
  };

  return (
    <div className="portfolio">
      {/* Floating bubbles background */}
      <div className="bubbles-container">
        {generateBubbles(20)}
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
        <div className="portfolio-container"> </div>
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
                    <img src={project.image} alt={project.title} />
                    <div className="project-overlay">
                      <div className="project-links-updated">
                        <a 
                          href={project.link} 
                          className="project-link-demo"
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Demo
                        </a>
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
                    <h3 className="project-title">{project.title}</h3>
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
                    <img src={cert.image} alt={cert.title} />
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
        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(51, 65, 85, 0.3)', borderRadius: '1rem', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle className="w-5 h-5" style={{ color: '#a855f7' }} />
            Leave a Comment
          </h3>
          
          {success && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#4ade80' }}>
              ✅ Comment posted successfully!
            </div>
          )}
          
          {error && (
            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                    backgroundColor: 'rgba(51, 65, 85, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white',
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
                    backgroundColor: 'rgba(51, 65, 85, 0.5)',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '0.5rem',
                    color: 'white',
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
                  backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '0.5rem',
                  color: 'white',
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
                  ? 'linear-gradient(to right, #6b7280, #6b7280)' 
                  : 'linear-gradient(to right, #9333ea, #ec4899)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                fontWeight: '600',
                cursor: submitting || !formData.name.trim() || !formData.message.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
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
    <div style={{ backgroundColor: 'rgba(51, 65, 85, 0.3)', borderRadius: '1rem', padding: '2rem', border: '1px solid rgba(148, 163, 184, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageCircle className="w-6 h-6" style={{ color: '#a855f7' }} />
          Comments ({comments.length})
        </h3>
        <button
          onClick={fetchComments}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(51, 65, 85, 0.5)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.875rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '↻ Refresh'}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: '#9ca3af' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading comments...</span>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <MessageCircle className="w-12 h-12" style={{ color: '#6b7280', margin: '0 auto 1rem' }} />
          <p style={{ color: '#9ca3af' }}>No comments yet. Be the first to leave a comment!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '24rem', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: comment.is_pinned 
                ? '1px solid rgba(168, 85, 247, 0.3)' 
                : '1px solid rgba(148, 163, 184, 0.2)',
              backgroundColor: comment.is_pinned 
                ? 'rgba(147, 51, 234, 0.2)' 
                : 'rgba(51, 65, 85, 0.3)',
              transition: 'all 0.3s',
              boxShadow: comment.is_pinned ? '0 10px 25px rgba(168, 85, 247, 0.1)' : 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(to bottom right, #9333ea, #ec4899)',
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
                    <h4 style={{ fontWeight: '600', color: 'white' }}>{comment.name}</h4>
                    {comment.is_pinned && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'rgba(168, 85, 247, 0.2)',
                        color: '#c4b5fd',
                        fontSize: '0.75rem',
                        borderRadius: '9999px',
                        fontWeight: '500'
                      }}>
                        PINNED
                      </span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#9ca3af', fontSize: '0.875rem' }}>
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
                  <div className="project-image-large">
                    <img src={selectedProject.image} alt={selectedProject.title} />
                  </div>
                  <div className="project-stats">
                    {selectedProject.stats.map((stat, index) => (
                      <div key={index} className="stat-item">
                        <div className="stat-icon">{index === 0 ? '💻' : index === 1 ? '👥' : '📊'}</div>
                        <div className="stat-content">
                          <div className="stat-value">{stat.value}</div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="project-actions">
                    <a href={selectedProject.link} className="action-btn primary" target="_blank" rel="noopener noreferrer">
                      🔗 Live Demo
                    </a>
                    <a href={selectedProject.github} className="action-btn secondary" target="_blank" rel="noopener noreferrer">
                      💻 GitHub
                    </a>
                  </div>
                </div>
                <div className="project-detail-sidebar">
                  <div className="detail-section">
                    <h3 className="detail-section-title">✨ Key Features</h3>
                    <ul className="feature-list">
                      {selectedProject.features.map((feature, index) => (
                        <li key={index} className="feature-item">{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h3 className="detail-section-title">🛠️ Technologies Used</h3>
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

      {/* Certificate Detail Modal */}
      {selectedCertificate && (
        <div className="modal-overlay" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content certificate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCertificate(null)}>×</button>
            <div className="certificate-detail">
              <div className="certificate-image-container">
                <img src={selectedCertificate.image} alt={selectedCertificate.title} className="certificate-image-large" />
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
    </div>
    
  );
};

export default Portfolio;