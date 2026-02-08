import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background py-12 mt-16">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Home className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">PataNyumba</span>
          </div>
          <p className="text-sm opacity-70">
            Kenya's trusted platform for finding and listing vacant houses. Making house hunting simple.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <Link to="/browse" className="hover:opacity-100 transition-opacity">Browse Houses</Link>
            <Link to="/post" className="hover:opacity-100 transition-opacity">Post a House</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <span>info@patanyumba.co.ke</span>
            <span>+254 700 000 000</span>
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </div>
      <div className="border-t border-background/20 mt-8 pt-6 text-center text-sm opacity-50">
        © 2026 PataNyumba. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
