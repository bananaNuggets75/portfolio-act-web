import Link from "next/link"
import { Github, Mail, Code, GraduationCap, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
      {/* Navigation */}
      <nav className="bg-navy-950/90 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-yellow-400 mr-2" />
              <span className="text-white font-bold text-xl">Kenan Ben G. Polgo</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/"
                  className="text-yellow-400 hover:text-yellow-300 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-yellow-400"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  About Me
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
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
              <Link
                href="/about"
                className="bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
              >
                Learn More About Me
              </Link>
              <Link
                href="/contact"
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-navy-900 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Education Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Education</h3>
            </div>
            <p className="text-blue-100 mb-2">Bachelor of Science in Computer Science</p>
            <p className="text-yellow-400 font-semibold">Central Philippine University</p>
            <p className="text-blue-200 text-sm mt-2">
              Currently pursuing degree with focus on software development and emerging technologies
            </p>
          </div>

          {/* Skills Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Skills</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-100">JavaScript</span>
                <span className="text-yellow-400">85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Python</span>
                <span className="text-yellow-400">80%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">React</span>
                <span className="text-yellow-400">75%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Java</span>
                <span className="text-yellow-400">70%</span>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20 hover:border-yellow-400/40 transition-all">
            <div className="flex items-center mb-4">
              <User className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Recent Projects</h3>
            </div>
            <div className="space-y-3">
              <div className="border-l-2 border-yellow-400 pl-3">
                <h4 className="text-blue-100 font-semibold">E-Commerce Website</h4>
                <p className="text-blue-200 text-sm">Full-stack web application</p>
              </div>
              <div className="border-l-2 border-yellow-400 pl-3">
                <h4 className="text-blue-100 font-semibold">Mobile App UI</h4>
                <p className="text-blue-200 text-sm">React Native application</p>
              </div>
              <div className="border-l-2 border-yellow-400 pl-3">
                <h4 className="text-blue-100 font-semibold">Data Analysis Tool</h4>
                <p className="text-blue-200 text-sm">Python-based analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-400/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Let's Connect</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            I'm always interested in new opportunities and collaborations. Feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/kenanbpolgo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              GitHub Profile
            </a>
            <a
              href="mailto:kenan.polgo@cpu.edu.ph"
              className="flex items-center justify-center border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-navy-900 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send Email
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-blue-200">© 2024 Kenan Ben G. Polgo. All rights reserved.</p>
            <p className="text-blue-300 text-sm mt-2">Central Philippine University - Computer Science Student</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
