function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold italic">
            🛍️ <span className="text-blue-400">Store</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Apki apni dukan jahan sab kuch milta hai. Behtreen quality aur kam
            qeemat hamari pehchan hai.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-blue-400 cursor-pointer transition">
              Home
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition">
              Shop All
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition">
              Categories
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition">
              Contact Us
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Help & Support
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-blue-400 cursor-pointer transition">
              Shipping Policy
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition">
              Returns & Refunds
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition">
              FAQs
            </li>
            <li className="hover:text-blue-400 cursor-pointer transition">
              Privacy Policy
            </li>
          </ul>
        </div>

        {/* Newsletter / Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">
            Stay Updated
          </h3>
          <p className="text-gray-400 text-xs mb-4">
            Latest deals ke liye apna email likhen.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Your email..."
              className="bg-slate-800 text-white px-3 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button className="bg-blue-600 px-4 py-2 rounded-r-md hover:bg-blue-700 transition font-bold text-sm">
              OK
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-800 mt-12 pt-8 text-center text-gray-500 text-xs">
        <p>
          &copy; 2026 Store. All Rights Reserved --Developed by official-ahmad
        </p>
      </div>
    </footer>
  );
}

export default Footer;
