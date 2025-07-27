"use client";

import React, { useState, useEffect, useRef } from 'react';

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
  icon: string;
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

// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Typing animation texts
  const typingTexts = [
    "Full-Stack Developer",
    "React Specialist", 
    "UI/UX Enthusiast",
    "Problem Solver"
  ];
  const typedText = useTypingAnimation(typingTexts, 150);

  // Data
  const projects: Project[] = [
    {
      id: '1',
      title: 'CPU-SHS Research Archive',
      description: 'Full-stack web system for managing research papers and academic documents',
      fullDescription: 'A comprehensive research archive system built for Central Philippine University Senior High School. This platform allows students and faculty to upload, manage, and search through academic research papers with advanced filtering and categorization features.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT'],
      link: 'https://cpu-research-archive.vercel.app/',
      github: 'https://github.com/yourusername/cpu-research-archive',
      icon: '📚',
      image: '/api/placeholder/600/400',
      features: [
        'Advanced search and filtering system',
        'User authentication and authorization',
        'Document upload and management',
        'Real-time notifications',
        'Admin dashboard for content moderation'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Active Users', value: '500+' },
        { label: 'Documents Stored', value: '1000+' }
      ]
    },
    {
      id: '2',
      title: 'CPU-SHS Thesis Platform',
      description: 'React Native application built with NextJS for thesis management',
      fullDescription: 'A modern thesis management platform that streamlines the entire thesis process from proposal to defense. Built with Next.js for optimal performance and user experience.',
      tech: ['Next.js', 'React Native', 'TypeScript', 'Prisma', 'PostgreSQL'],
      link: '#',
      github: 'https://github.com/yourusername/thesis-platform',
      icon: '📝',
      image: '/api/placeholder/600/400',
      features: [
        'Thesis proposal submission system',
        'Progress tracking dashboard',
        'Advisor-student communication',
        'Document version control',
        'Defense scheduling system'
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
      tech: ['React', 'TypeScript', 'Chart.js', 'Python', 'TensorFlow'],
      link: 'https://traffic-management-system-cyan.vercel.app/',
      github: 'https://github.com/yourusername/traffic-system',
      icon: '🚦',
      image: '/api/placeholder/600/400',
      features: [
        'Real-time traffic monitoring',
        'Predictive traffic analysis',
        'Interactive data visualization',
        'Alert system for congestion',
        'Historical data analysis'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Traffic Points', value: '50+' },
        { label: 'Data Points/Day', value: '10K+' }
      ]
    },
    {
      id: '4',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      fullDescription: 'A complete e-commerce platform with modern design, secure payment processing, and comprehensive admin features. Built for scalability and performance.',
      tech: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis', 'AWS'],
      link: 'https://online-ordering-system-ochre.vercel.app/',
      github: 'https://github.com/yourusername/ecommerce-platform',
      icon: '🛍️',
      image: '/api/placeholder/600/400',
      features: [
        'Secure payment processing',
        'Inventory management system',
        'Order tracking and notifications',
        'Customer review system',
        'Analytics dashboard'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Orders Processed', value: '1000+' },
        { label: 'Revenue Generated', value: '$50K+' }
      ]
    },
    {
      id: '5',
      title: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates',
      fullDescription: 'A comprehensive task management application that enables teams to collaborate effectively with real-time updates, file sharing, and progress tracking.',
      tech: ['React', 'Socket.io', 'Express', 'MongoDB', 'JWT'],
      link: '#',
      github: 'https://github.com/yourusername/task-manager',
      icon: '✅',
      image: '/api/placeholder/600/400',
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
      title: 'Weather Dashboard',
      description: 'Real-time weather monitoring dashboard with data visualization',
      fullDescription: 'An advanced weather monitoring system with beautiful data visualizations, forecasting capabilities, and location-based weather tracking.',
      tech: ['Vue.js', 'D3.js', 'Weather API', 'Node.js', 'MongoDB'],
      link: '#',
      github: 'https://github.com/yourusername/weather-dashboard',
      icon: '🌤️',
      image: '/api/placeholder/600/400',
      features: [
        'Real-time weather data',
        'Interactive weather maps',
        '7-day forecast system',
        'Weather alerts and notifications',
        'Historical weather analysis'
      ],
      stats: [
        { label: 'Technologies Used', value: '5' },
        { label: 'Cities Covered', value: '500+' },
        { label: 'API Calls/Day', value: '10K+' }
      ]
    }
  ];

  const certificates: Certificate[] = [
    {
      id: '1',
      title: "Dean's List",
      issuer: 'Central Philippine University',
      date: 'Academic Year 2023-2024',
      description: 'Maintained high academic standing with GPA above 3.5',
      icon: '🏆',
      image: '/api/placeholder/400/300',
      credentialId: 'CPU-DL-2024-001'
    },
    {
      id: '2',
      title: 'DevCon Runner Up',
      issuer: 'Regional Programming Competition',
      date: '2024',
      description: 'Game Development competition - Second place finish',
      icon: '🥈',
      image: '/api/placeholder/400/300',
      credentialId: 'DEVCON-2024-RU'
    },
    {
      id: '3',
      title: 'Google Developer Student Club',
      issuer: 'Google Developers',
      date: '2023 - Present',
      description: 'Active participant in hackathons and tech events',
      icon: '🌟',
      image: '/api/placeholder/400/300',
      credentialId: 'GDSC-2023-ACTIVE'
    },
    {
      id: '4',
      title: 'JavaScript Fundamentals',
      issuer: 'FreeCodeCamp',
      date: '2023',
      description: 'Completed comprehensive JavaScript programming course',
      icon: '📜',
      image: '/api/placeholder/400/300',
      credentialId: 'FCC-JS-2023-001',
      verifyLink: 'https://freecodecamp.org/certification/verify/js-cert'
    },
    {
      id: '5',
      title: 'React Development',
      issuer: 'Coursera',
      date: '2023',
      description: 'Advanced React.js development certification',
      icon: '⚛️',
      image: '/api/placeholder/400/300',
      credentialId: 'COURSERA-REACT-2023',
      verifyLink: 'https://coursera.org/verify/react-cert'
    },
    {
      id: '6',
      title: 'Database Design',
      issuer: 'Oracle Academy',
      date: '2024',
      description: 'Database design and SQL optimization certification',
      icon: '🗄️',
      image: '/api/placeholder/400/300',
      credentialId: 'ORACLE-DB-2024-001'
    }
  ];

  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Technologies',
      icon: '🎨',
      techs: [
        { name: 'HTML5', icon: '/api/placeholder/60/60', level: 90, color: '#E34F26' },
        { name: 'CSS3', icon: '/api/placeholder/60/60', level: 85, color: '#1572B6' },
        { name: 'JavaScript', icon: '/api/placeholder/60/60', level: 85, color: '#F7DF1E' },
        { name: 'TypeScript', icon: '/api/placeholder/60/60', level: 80, color: '#3178C6' },
        { name: 'React', icon: '/api/placeholder/60/60', level: 90, color: '#61DAFB' },
        { name: 'Next.js', icon: '/api/placeholder/60/60', level: 85, color: '#000000' },
        { name: 'Vue.js', icon: '/api/placeholder/60/60', level: 75, color: '#4FC08D' },
        { name: 'Tailwind CSS', icon: '/api/placeholder/60/60', level: 90, color: '#06B6D4' }
      ]
    },
    {
      title: 'Backend & Database',
      icon: '⚙️',
      techs: [
        { name: 'Node.js', icon: '/api/placeholder/60/60', level: 80, color: '#339933' },
        { name: 'Express.js', icon: '/api/placeholder/60/60', level: 85, color: '#000000' },
        { name: 'Python', icon: '/api/placeholder/60/60', level: 75, color: '#3776AB' },
        { name: 'MongoDB', icon: '/api/placeholder/60/60', level: 80, color: '#47A248' },
        { name: 'PostgreSQL', icon: '/api/placeholder/60/60', level: 75, color: '#336791' },
        { name: 'MySQL', icon: '/api/placeholder/60/60', level: 70, color: '#4479A1' },
        { name: 'Firebase', icon: '/api/placeholder/60/60', level: 85, color: '#FFCA28' },
        { name: 'Redis', icon: '/api/placeholder/60/60', level: 70, color: '#DC382D' }
      ]
    },
    {
      title: 'Tools & Platforms',
      icon: '🛠️',
      techs: [
        { name: 'Git', icon: '/api/placeholder/60/60', level: 90, color: '#F05032' },
        { name: 'GitHub', icon: '/api/placeholder/60/60', level: 90, color: '#181717' },
        { name: 'VS Code', icon: '/api/placeholder/60/60', level: 95, color: '#007ACC' },
        { name: 'Docker', icon: '/api/placeholder/60/60', level: 70, color: '#2496ED' },
        { name: 'AWS', icon: '/api/placeholder/60/60', level: 65, color: '#232F3E' },
        { name: 'Vercel', icon: '/api/placeholder/60/60', level: 85, color: '#000000' },
        { name: 'Figma', icon: '/api/placeholder/60/60', level: 80, color: '#F24E1E' },
        { name: 'Postman', icon: '/api/placeholder/60/60', level: 85, color: '#FF6C37' }
      ]
    }
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
              <div className="profile-avatar">👨‍💻</div>
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
            <button
              className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              <span>💼</span> Projects
            </button>
            <button
              className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <span>🏆</span> Certificates
            </button>
            <button
              className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <span>⚡</span> Tech Stack
            </button>
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
                      <div className="project-links">
                        <span className="project-link">View Details</span>
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

          {/* Tech Stack Tab */}
          <div className={`tab-content ${activeTab === 'skills' ? 'active' : ''}`}>
            <div className="tech-categories">
              {skillCategories.map((category, index) => (
                <div 
                  key={index} 
                  className={`tech-category ${portfolioInView ? 'animate-slideInUp' : ''}`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  <div className="tech-header">
                    <div className="tech-icon">{category.icon}</div>
                    <h3 className="tech-title">{category.title}</h3>
                  </div>
                  <div className="tech-grid">
                    {category.techs.map((tech, techIndex) => (
                      <div 
                        key={techIndex} 
                        className="tech-item"
                        style={{animationDelay: `${(index * 0.2) + (techIndex * 0.1)}s`}}
                      >
                        <div className="tech-icon-container">
                          <img src={tech.icon} alt={tech.name} className="tech-logo" />
                          <div className="tech-level-ring">
                            <svg className="tech-progress-ring" width="60" height="60">
                              <circle
                                cx="30"
                                cy="30"
                                r="25"
                                stroke="rgba(139, 92, 246, 0.2)"
                                strokeWidth="4"
                                fill="transparent"
                              />
                              <circle
                                cx="30"
                                cy="30"
                                r="25"
                                stroke={tech.color}
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={`${2 * Math.PI * 25}`}
                                strokeDashoffset={`${2 * Math.PI * 25 * (1 - tech.level / 100)}`}
                                className="progress-circle"
                              />
                            </svg>
                          </div>
                        </div>
                        <h4 className="tech-name">{tech.name}</h4>
                        <div className="tech-level">{tech.level}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section section-secondary" ref={contactRef}>
        <div className="section-title">
          Get In <span className="section-title-accent">Touch</span>
        </div>
        <div className={`contact-grid ${contactInView ? 'animate-slideInUp' : ''}`}>
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>your.email@example.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>+63 123 456 7890</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>Location</h4>
                  <p>Iloilo City, Philippines</p>
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">
                  <span>💼</span> LinkedIn
                </a>
                <a href="#" className="social-link">
                  <span>💻</span> GitHub
                </a>
                <a href="#" className="social-link">
                  <span>🐦</span> Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required></textarea>
              </div>
              <button type="submit" className="cta-primary">Send Message</button>
            </form>
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