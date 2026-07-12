"use client";

import Link from "next/link";
import { Youtube, Instagram, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black/20 border-t border-white/5 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Kishan Kumar</h3>
            <p className="text-gray-400">
              Video Editor and Motion Graphics Designer passionate about creating visual stories with style, precision, and cinematic magic.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/skills" className="text-gray-400 hover:text-white transition-colors">Skills</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect With Me</h4>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/@vfxlyrical" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-white"><Youtube /></a>
              <a href="https://www.instagram.com/kishan0_o" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white"><Instagram /></a>
              <a href="https://www.linkedin.com/in/kishan--/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-white"><Linkedin /></a>
              <a href="mailto:098kishan@gmail.com" aria-label="Email" className="text-gray-400 hover:text-white"><Mail /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-500">
          <p>© 2026 Kishan Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
