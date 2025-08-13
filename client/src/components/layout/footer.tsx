import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" data-testid="footer-brand">KareerAI</h3>
            <p className="text-neutral-300 mb-4">
              Pakistan's first AI-powered job platform helping you find the perfect career match.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white" data-testid="social-facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white" data-testid="social-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white" data-testid="social-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white" data-testid="social-instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <a href="/jobs" className="hover:text-white" data-testid="footer-browse-jobs">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-ai-resume">
                  AI Resume Builder
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-career-advice">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-salary-guide">
                  Salary Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-interview-tips">
                  Interview Tips
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-post-jobs">
                  Post Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-find-candidates">
                  Find Candidates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-pricing">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-recruitment-tools">
                  Recruitment Tools
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-company-branding">
                  Company Branding
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-300">
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-help-center">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-contact">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white" data-testid="footer-about">
                  About Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-neutral-400" data-testid="footer-copyright">
            © 2024 KareerAI. All rights reserved.
          </p>
          <p className="text-neutral-400 mt-4 sm:mt-0" data-testid="footer-made-with-love">
            Made with ❤️ for Pakistani job seekers
          </p>
        </div>
      </div>
    </footer>
  );
}
