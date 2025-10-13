export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Shivengroup</h3>
            <p className="mt-2 text-sm">Address line 1, City, State</p>
          </div>

          <div className="mt-6 md:mt-0 text-sm flex flex-col md:flex-row md:gap-6">
            <p>Phone: +91-XXXXXXXXXX</p>
            <p>Email: info@shivengroup.com</p>
            <a
              href="/admin/login"
              className="mt-2 md:mt-0 text-blue-400 hover:text-blue-500"
            >
              Admin Login
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs">
          © {new Date().getFullYear()} Shivengroup. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
