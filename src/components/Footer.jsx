export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section */}
        
        {/* Divider */}
        <div className="border-t border-gray-700 mt-6"></div>

        {/* Bottom Section */}
        <div className="mt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-medium">Shivengroup</span>. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
