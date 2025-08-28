import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-sm sm:text-xl md:text-2xl font-bold text-gray-900">
            Detroit Go Club
          </Link>

          <div className="flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/rules" className="text-gray-700 hover:text-gray-900 transition-colors">
              Rules
            </Link>
            <Link href="/calendar" className="text-gray-700 hover:text-gray-900 transition-colors">
              Calendar
            </Link>
            <a
              href="https://instagram.com/detroit_go_club"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
