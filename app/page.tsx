"use client"

import React, { useState, useEffect, useRef } from 'react';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  icon: string;
}

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: string;
}

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

// Custom hook for intersection observer
const useInView = (threshold: number = 0.1) => {
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

  return [ref, isInView] as const;
};

// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('projects');

  // Data
  const projects: Project[] = [
    {
      id: '1',
      title: 'CPU-SHS Research Archive',
      description: 'Full-stack web system for managing research papers and academic documents',
      tech: ['React', 'Node.js', 'MongoDB'],
      link: 'https://cpu-research-archive.vercel.app/',
      icon: '📚'
    },
    {
      id: '2',
      title: 'CPU-SHS Thesis Platform',
      description: 'React Native application built with NextJS for thesis management',
      tech: ['Next.js', 'React Native', 'TypeScript'],
      link: '#',
      icon: '📝'
    },
    {
      id: '3',
      title: 'Traffic Management System',
      description: 'React-TypeScript application for traffic flow optimization',
      tech: ['React', 'TypeScript', 'Chart.js'],
      link: 'https://traffic-management-system-cyan.vercel.app/',
      icon: '🚦'
    },
    {
      id: '4',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      tech: ['Next.js', 'Stripe', 'PostgreSQL'],
      link: 'https://online-ordering-system-ochre.vercel.app/',
      icon: '🛍️'
    },
    {
      id: '5',
      title: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates',
      tech: ['React', 'Socket.io', 'Express'],
      link: '#',
      icon: '✅'
    },
    {
      id: '6',
      title: 'Weather Dashboard',
      description: 'Real-time weather monitoring dashboard with data visualization',
      tech: ['Vue.js', 'D3.js', 'Weather API'],
      link: '#',
      icon: '🌤️'
    }
  ];

  const certificates: Certificate[] = [
    {
      id: '1',
      title: "Dean's List",
      issuer: 'Central Philippine University',
      date: 'Academic Year 2023-2024',
      description: 'Maintained high academic standing with GPA above 3.5',
      icon: '🏆'
    },
    {
      id: '2',
      title: 'DevCon Runner Up',
      issuer: 'Regional Programming Competition',
      date: '2024',
      description: 'Game Development competition - Second place finish',
      icon: '🥈'
    },
    {
      id: '3',
      title: 'Google Developer Student Club',
      issuer: 'Google Developers',
      date: '2023 - Present',
      description: 'Active participant in hackathons and tech events',
      icon: '🌟'
    },
    {
      id: '4',
      title: 'JavaScript Fundamentals',
      issuer: 'FreeCodeCamp',
      date: '2023',
      description: 'Completed comprehensive JavaScript programming course',
      icon: '📜'
    },
    {
      id: '5',
      title: 'React Development',
      issuer: 'Coursera',
      date: '2023',
      description: 'Advanced React.js development certification',
      icon: '⚛️'
    },
    {
      id: '6',
      title: 'Database Design',
      issuer: 'Oracle Academy',
      date: '2024',
      description: 'Database design and SQL optimization certification',
      icon: '🗄️'
    }
  ];

  const skillCategories: SkillCategory[] = [
    {
      title: 'Programming Languages',
      icon: '💻',
      skills: [
        { name: 'JavaScript', level: 85 },
        { name: 'Python', level: 80 },
        { name: 'TypeScript', level: 75 },
        { name: 'C#', level: 70 },
        { name: 'SQL', level: 65 }
      ]
    },
    {
      title: 'Frameworks & Tools',
      icon: '⚙️',
      skills: [
        { name: 'React/Next.js', level: 80 },
        { name: 'Node.js', level: 75 },
        { name: 'MySQL/PostgreSQL', level: 70 },
        { name: 'Git/GitHub', level: 85 },
        { name: 'Tailwind CSS', level: 90 }
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

  // Animation hook
  const [homeRef, homeInView] = useInView(0.3);
  const [aboutRef, aboutInView] = useInView(0.3);
  const [portfolioRef, portfolioInView] = useInView(0.3);
  const [contactRef, contactInView] = useInView(0.3);

  return (
    <div className="portfolio">
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
        <div className="hero-content">
          <p className="hero-subtitle">Welcome to my portfolio</p>
          <h1 className="hero-title">
            Hi, I'm <span className="hero-name-highlight">Your Name</span>
          </h1>
          <p className="hero-description">
            Full-stack developer passionate about creating innovative web solutions
            and bringing ideas to life through code.
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
        <div className="about-grid">
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">👨‍💻</div>
              <h2 className="profile-name">Your Name</h2>
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
          <div className="portfolio-tabs">
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
              <span>⚡</span> Skills
            </button>
          </div>

          {/* Projects Tab */}
          <div className={`tab-content ${activeTab === 'projects' ? 'active' : ''}`}>
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <div className="project-image">
                    {project.icon}
                    <div className="project-overlay">
                      <div className="project-links">
                        <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                          View Live
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="project-info">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-tags">
                      {project.tech.map((tech, index) => (
                        <span key={index} className="tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates Tab */}
          <div className={`tab-content ${activeTab === 'certificates' ? 'active' : ''}`}>
            <div className="certificates-grid">
              {certificates.map((cert) => (
                <div key={cert.id} className="certificate-card">
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

          {/* Skills Tab */}
          <div className={`tab-content ${activeTab === 'skills' ? 'active' : ''}`}>
            <div className="tech-grid">
              {skillCategories.map((category, index) => (
                <div key={index} className="tech-category">
                  <div className="tech-header">
                    <div className="tech-icon">{category.icon}</div>
                    <h3 className="tech-title">{category.title}</h3>
                  </div>
                  <div className="skills-list">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skillIndex} className="skill-item">
                        <div className="skill-header">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level">{skill.level}%</span>
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-progress"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
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
        <div className="contact-grid">
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
    </div>
  );
};

export default Portfolio;