"use client"

import { useState, useEffect } from "react";
import { Github, Mail, Code, User, Award, GraduationCap, Phone, MapPin, MessageSquare, Send, ExternalLink, Settings } from "lucide-react";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home")
  const [activePortfolioTab, setActivePortfolioTab] = useState("projects")

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
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
      {/* Fixed Navigation */}
      <nav className="bg-navy-950/90 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-yellow-400 mr-2" />
              <span className="text-white font-bold text-xl">Kenan Ben G. Polgo</span>
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
      <section id="home" className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <img
                src="/placeholder.svg?height=200&width=200"
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
      <section id="about" className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="text-yellow-400">Me</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Passionate Computer Science student dedicated to learning and creating innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
                <div className="text-center mb-6">
                  <img
                    src="/placeholder.svg?height=150&width=150"
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
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
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

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20">
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
}