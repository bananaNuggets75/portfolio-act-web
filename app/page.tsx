"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Github,
  Mail,
  Code,
  GraduationCap,
  User,
  Award,
  Instagram,
  Phone,
  MapPin,
  MessageSquare,
  Send,
  ExternalLink,
  Settings,
} from "lucide-react"
import { useInView } from "@/hooks/use-in-view" 

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home")
  const [activePortfolioTab, setActivePortfolioTab] = useState("projects")

  // Refs for sections to observe visibility
  const [homeRef, homeInView] = useInView({ threshold: 0.3 })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3 })
  const [portfolioRef, portfolioInView] = useInView({ threshold: 0.3 })
  const [contactRef, contactInView] = useInView({ threshold: 0.3 })

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "portfolio", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ]

  const portfolioTabs = [
    { id: "projects", label: "Projects", icon: Code },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "techstack", label: "Tech Stack", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 parallax-bg">
      {/* Fixed Navigation */}
      <nav className="bg-navy-950/90 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-yellow-400 mr-2" />
              <span className="text-white font-bold text-xl">keibee</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-white hover:text-yellow-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" ref={homeRef} className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-on-scroll" data-in-view={homeInView}>
          <div className="text-center">
            <div className="mb-8">
              <img
                src="/profile.png?height=200&width=200"
                alt="Kenan Ben G. Polgo"
                className="w-48 h-48 rounded-full mx-auto border-4 border-yellow-400 shadow-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Kenan Ben G. <span className="text-yellow-400">Polgo</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Computer Science Student at Central Philippine University
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              Passionate about software development, web technologies, and creating innovative solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("about")}
                className="bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                Learn More About Me
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-navy-900 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll" data-in-view={aboutInView}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-yellow-400">Me</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Passionate Computer Science student dedicated to learning and creating innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div
              className="lg:col-span-1 animate-on-scroll"
              data-in-view={aboutInView}
              style={{ "--animation-delay": "0.1s" } as React.CSSProperties}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
                <div className="text-center mb-6">
                  <img
                    src="/profile.png?height=150&width=150"
                    alt="Kenan Ben G. Polgo"
                    className="w-32 h-32 rounded-full mx-auto border-4 border-yellow-400 shadow-lg mb-4"
                  />
                  <h3 className="text-2xl font-bold text-white">Kenan Ben G. Polgo</h3>
                  <p className="text-yellow-400 font-semibold">Computer Science Student</p>
                  <p className="text-blue-200 text-sm mt-2">Central Philippine University</p>
                </div>
              </div>
            </div>

            {/* Bio & Education */}
            <div className="lg:col-span-2 space-y-8">
              <div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20 animate-on-scroll"
                data-in-view={aboutInView}
                style={{ "--animation-delay": "0.2s" } as React.CSSProperties}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <User className="h-6 w-6 text-yellow-400 mr-3" />
                  My Story
                </h3>
                <div className="space-y-4 text-blue-100 leading-relaxed">
                  <p>
                    Hello! I'm Kenan Ben G. Polgo, a dedicated Computer Science student at Central Philippine
                    University. My journey in technology began with a curiosity about how software works and has evolved
                    into a passion for creating innovative solutions that can make a difference.
                  </p>
                  <p>
                    Currently in my third year of studies, I've been focusing on web development, software engineering,
                    and data structures. I believe in the power of technology to solve real-world problems and am
                    constantly learning new skills to stay current with industry trends.
                  </p>
                </div>
              </div>

              <div
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20 animate-on-scroll"
                data-in-view={aboutInView}
                style={{ "--animation-delay": "0.3s" } as React.CSSProperties}
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <GraduationCap className="h-6 w-6 text-yellow-400 mr-3" />
                  Education
                </h3>
                <div className="space-y-6">
                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h4 className="text-xl font-semibold text-white">Bachelor of Science in Computer Science</h4>
                    <p className="text-yellow-400 font-medium">Central Philippine University</p>
                    <p className="text-blue-200">2022 - Present (Expected 2026)</p>
                    <p className="text-blue-100 mt-2">
                      Relevant Coursework: Data Structures & Algorithms, Web Development, Database Systems, Software
                      Engineering, Object-Oriented Programming, Computer Networks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" ref={portfolioRef} className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll" data-in-view={portfolioInView}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Portfolio <span className="text-yellow-400">Showcase</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore my journey through projects, certifications, and technical expertise. Each section represents a
              milestone in my continuous learning path.
            </p>
          </div>

          {/* Portfolio Navigation Tabs */}
          <div
            className="flex justify-center mb-12 animate-on-scroll"
            data-in-view={portfolioInView}
            style={{ "--animation-delay": "0.1s" } as React.CSSProperties}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-yellow-400/20">
              <div className="flex space-x-2">
                {portfolioTabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActivePortfolioTab(tab.id)}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                        activePortfolioTab === tab.id
                          ? "bg-yellow-400 text-navy-900"
                          : "text-blue-100 hover:text-yellow-400 hover:bg-white/10"
                      }`}
                    >
                      <IconComponent className="h-5 w-5 mr-2" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Portfolio Content */}
          <div className="min-h-[600px]">
            {/* Projects Tab */}
            {activePortfolioTab === "projects" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "CPU-SHS Research Archive",
                    description: "Full-stack web system for managing research papers and academic documents",
                    tech: ["React", "Node.js", "MongoDB"],
                    image: "/placeholder.svg?height=200&width=300&text=Research+Archive",
                    link: "https://cpu-research-archive.vercel.app/",
                  },
                  {
                    title: "CPU-SHS Thesis Platform",
                    description: "React Native application built with NextJS for thesis management",
                    tech: ["Next.js", "React Native", "TypeScript"],
                    image: "/placeholder.svg?height=200&width=300&text=Thesis+Platform",
                    link: "#",
                  },
                  {
                    title: "Traffic Management System",
                    description: "React-TypeScript application for traffic flow optimization",
                    tech: ["React", "TypeScript", "Chart.js"],
                    image: "/placeholder.svg?height=200&width=300&text=Traffic+System",
                    link: "https://traffic-management-system-cyan.vercel.app/",
                  },
                  {
                    title: "E-Commerce Platform",
                    description: "Full-stack e-commerce solution with payment integration",
                    tech: ["Next.js", "Stripe", "PostgreSQL"],
                    image: "/placeholder.svg?height=200&width=300&text=E-Commerce",
                    link: "https://online-ordering-system-ochre.vercel.app/",
                  },
                  {
                    title: "Task Management App",
                    description: "Collaborative task management tool with real-time updates",
                    tech: ["React", "Socket.io", "Express"],
                    image: "/placeholder.svg?height=200&width=300&text=Task+Manager",
                    link: "#",
                  },
                  {
                    title: "Weather Dashboard",
                    description: "Real-time weather monitoring dashboard with data visualization",
                    tech: ["Vue.js", "D3.js", "Weather API"],
                    image: "/placeholder.svg?height=200&width=300&text=Weather+App",
                    link: "#",
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-yellow-400/20 hover:border-yellow-400/40 transition-all group animate-on-scroll"
                    data-in-view={portfolioInView}
                    style={{ "--animation-delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-4">
                          <a
                            href={project.link}
                            className="bg-yellow-400 text-navy-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Live Demo
                          </a>
                          <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                      <p className="text-blue-100 mb-4 text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Certificates Tab */}
            {activePortfolioTab === "certificates" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "Dean's List",
                    issuer: "Central Philippine University",
                    date: "Academic Year 2023-2024",
                    description: "Maintained high academic standing with GPA above 3.5",
                    image: "/placeholder.svg?height=150&width=200&text=Dean's+List",
                  },
                  {
                    title: "DevCon Runner Up",
                    issuer: "Regional Programming Competition",
                    date: "2024",
                    description: "Game Development competition - Second place finish",
                    image: "/placeholder.svg?height=150&width=200&text=DevCon+Award",
                  },
                  {
                    title: "Google Developer Student Club",
                    issuer: "Google Developers",
                    date: "2023 - Present",
                    description: "Active participant in hackathons and tech events",
                    image: "/placeholder.svg?height=150&width=200&text=GDSC+Member",
                  },
                  {
                    title: "JavaScript Fundamentals",
                    issuer: "FreeCodeCamp",
                    date: "2023",
                    description: "Completed comprehensive JavaScript programming course",
                    image: "/placeholder.svg?height=150&width=200&text=JS+Certificate",
                  },
                  {
                    title: "React Development",
                    issuer: "Coursera",
                    date: "2023",
                    description: "Advanced React.js development certification",
                    image: "/placeholder.svg?height=150&width=200&text=React+Cert",
                  },
                  {
                    title: "Database Design",
                    issuer: "Oracle Academy",
                    date: "2024",
                    description: "Database design and SQL optimization certification",
                    image: "/placeholder.svg?height=150&width=200&text=Database+Cert",
                  },
                ].map((cert, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all group animate-on-scroll"
                    data-in-view={portfolioInView}
                    style={{ "--animation-delay": `${0.2 + index * 0.1}s` } as React.CSSProperties}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={cert.image || "/placeholder.svg"}
                          alt={cert.title}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-yellow-400/30"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Award className="h-6 w-6 text-yellow-400 mr-2" />
                          <h3 className="text-xl font-bold text-white">{cert.title}</h3>
                        </div>
                        <p className="text-yellow-400 font-medium mb-1">{cert.issuer}</p>
                        <p className="text-blue-200 text-sm mb-2">{cert.date}</p>
                        <p className="text-blue-100 text-sm">{cert.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack Tab */}
            {activePortfolioTab === "techstack" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20 animate-on-scroll"
                  data-in-view={portfolioInView}
                  style={{ "--animation-delay": "0.2s" } as React.CSSProperties}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Code className="h-6 w-6 text-yellow-400 mr-3" />
                    Programming Languages
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: "JavaScript", level: 85 },
                      { name: "Python", level: 80 },
                      { name: "TypeScript", level: 75 },
                      { name: "C#", level: 70 },
                      { name: "SQL", level: 65 },
                    ].map((skill, index) => (
                      <div
                        key={skill.name}
                        className="animate-on-scroll"
                        data-in-view={portfolioInView}
                        style={{ "--animation-delay": `${0.3 + index * 0.05}s` } as React.CSSProperties}
                      >
                        <div className="flex justify-between text-blue-100 mb-2">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-navy-800 rounded-full h-3">
                          <div
                            className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20 animate-on-scroll"
                  data-in-view={portfolioInView}
                  style={{ "--animation-delay": "0.2s" } as React.CSSProperties}
                >
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Settings className="h-6 w-6 text-yellow-400 mr-3" />
                    Frameworks & Tools
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: "React/Next.js", level: 80 },
                      { name: "Node.js", level: 75 },
                      { name: "MySQL/PostgreSQL", level: 70 },
                      { name: "Git/GitHub", level: 85 },
                      { name: "Tailwind CSS", level: 90 },
                    ].map((skill, index) => (
                      <div
                        key={skill.name}
                        className="animate-on-scroll"
                        data-in-view={portfolioInView}
                        style={{ "--animation-delay": `${0.3 + index * 0.05}s` } as React.CSSProperties}
                      >
                        <div className="flex justify-between text-blue-100 mb-2">
                          <span>{skill.name}</span>
                          <span>{skill.level}%</span>
                        </div>
                        <div className="w-full bg-navy-800 rounded-full h-3">
                          <div
                            className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll" data-in-view={contactInView}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Contact <span className="text-yellow-400">Me</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Let's connect! I'm always open to discussing new opportunities, collaborations, or just having a chat
              about technology.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div
              className="space-y-8 animate-on-scroll"
              data-in-view={contactInView}
              style={{ "--animation-delay": "0.1s" } as React.CSSProperties}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <MessageSquare className="h-6 w-6 text-yellow-400 mr-3" />
                  Get In Touch
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-400 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Email</h4>
                      <p className="text-blue-200">kenanben.polgo-21@cpu.edu.ph</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-400 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Phone</h4>
                      <p className="text-blue-200">+63 917 185 8427</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-400 p-3 rounded-lg">
                      <Github className="h-6 w-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">GitHub</h4>
                      <p className="text-blue-200">github.com/bananaNuggets75</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow-400 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-navy-900" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Location</h4>
                      <p className="text-blue-200">Iloilo City, Philippines</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
                <h3 className="text-xl font-bold text-white mb-6">Connect With Me</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://github.com/bananaNuggets75"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Github className="h-5 w-5 mr-2" />
                    GitHub
                  </a>
                  <a
                    href="mailto:kenanben.polgo-21@cpu.edu.ph"
                    className="flex items-center border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-navy-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email
                  </a>
                  <a
                    href="https://www.instagram.com/keenaniganss/"
                    className="flex items-center bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20 animate-on-scroll"
              data-in-view={contactInView}
              style={{ "--animation-delay": "0.2s" } as React.CSSProperties}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Send className="h-6 w-6 text-yellow-400 mr-3" />
                Send a Message
              </h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 bg-navy-800/50 border border-navy-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 bg-navy-800/50 border border-navy-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-blue-100 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-navy-800/50 border border-navy-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-yellow-400/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-blue-200">© 2024 Kenan Ben G. Polgo. All rights reserved.</p>
            <p className="text-blue-300 text-sm mt-2">Central Philippine University - Computer Science Student</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
