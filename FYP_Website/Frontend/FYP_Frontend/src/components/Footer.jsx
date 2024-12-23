// import logo from "../assets/logo22.png"

function Footer() {
  return (
    <footer className="flex items-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6 shadow-lg mt-8">
       <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">About Us</h3>
            <p>
              We offer the best  products recommendations for enthusiasts and professionals alike. Analysis reviews with us for quality, reliability, and exceptional experience.
            </p>
          </div>

          
          <div>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Newsletter</h3>
            <p>Subscribe to our newsletter for the latest updates and deals.</p>
            <form className="mt-4">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-gray-300 border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full mt-2 bg-green-500 text-white py-2 rounded hover:bg-blue-500 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Social Media Links */}
          <div className="mb-4 md:mb-0">
            <span>Follow us:</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-white hover:text-white-400"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-black hover:text-blue-200"
            >
              Twitter 
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-pink-500 hover:text-pink-400"
            >
              Instagram
            </a>
          </div>

          {/* Copyright */}
          <div>
            <p>&copy; {new Date().getFullYear()} CS-Eve-24 Batch. All rights reserved.</p>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
