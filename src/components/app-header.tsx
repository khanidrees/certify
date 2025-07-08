'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, LogOut, User, Settings, Shield, Building2, GraduationCap, Home, Bell } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletButton } from '@/components/solana/solana-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    let storedToken = localStorage.getItem('token')
    let storedRole = localStorage.getItem('role')
    setToken(storedToken)
    setRole(storedRole)
  }, [])

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    setToken(null)
    setRole(null)
    window.location.href = '/'
  }

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'organization':
        return <Building2 className="h-4 w-4" />
      case 'learner':
        return <GraduationCap className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'admin':
        return 'text-red-600 dark:text-red-400'
      case 'organization':
        return 'text-blue-600 dark:text-blue-400'
      case 'learner':
        return 'text-green-600 dark:text-green-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getNavigationLinks = () => {
    if (!token) return []
    
    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <Shield className="h-4 w-4" /> },
          { label: 'Organizations', path: '/admin/organizations', icon: <Building2 className="h-4 w-4" /> },
        ]
      case 'organization':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <Building2 className="h-4 w-4" /> },
          { label: 'Courses', path: '/organization/courses', icon: <GraduationCap className="h-4 w-4" /> },
        ]
      case 'learner':
        return [
          { label: 'Dashboard', path: '/learner-dashboard', icon: <GraduationCap className="h-4 w-4" /> },
          { label: 'Certificates', path: '/learner/certificates', icon: <Shield className="h-4 w-4" /> },
        ]
      default:
        return []
    }
  }

  const navigationLinks = getNavigationLinks()

  if (!token) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link className="flex items-center space-x-3 group" href="/">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-white font-bold text-lg">VC</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VerifyCertify
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Blockchain Certificates
                </p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/#features"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="/public/course/demo/learner/demo"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Demo
              </Link>
            </nav>
            
            <ThemeSelect />
            
            <Link href="/auth/signin">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <Link className="flex items-center space-x-3 group" href="/">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-lg">VC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VerifyCertify
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Blockchain Certificates
              </p>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationLinks.map(({ label, path, icon }) => (
              <Link
                key={path}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  isActive(path) 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                href={path}
              >
                {icon}
                {label}
              </Link>
            ))}
            
            {/* Additional navigation from props */}
            {links.map(({ label, path }) => (
              <Link
                key={path}
                className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                  isActive(path) 
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                href={path}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setShowMenu(!showMenu)}
        >
          {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {role === 'organization' && (
            <div className="flex items-center space-x-3">
              <WalletButton />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            </div>
          )}
          
          <ClusterUiSelect />
          <ThemeSelect />
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
          </Button>
          
          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 px-3 py-2 h-10">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                  role === 'admin' ? 'from-red-500 to-red-600' :
                  role === 'organization' ? 'from-blue-500 to-blue-600' :
                  'from-green-500 to-green-600'
                } flex items-center justify-center text-white text-sm font-medium`}>
                  {getRoleIcon(role || '')}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {role} Account
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Manage your account
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                    role === 'admin' ? 'from-red-500 to-red-600' :
                    role === 'organization' ? 'from-blue-500 to-blue-600' :
                    'from-green-500 to-green-600'
                  } flex items-center justify-center text-white text-sm`}>
                    {getRoleIcon(role || '')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {role} Account
                    </p>
                    <p className={`text-xs ${getRoleColor(role || '')}`}>
                      {role === 'admin' ? 'System Administrator' :
                       role === 'organization' ? 'Organization Manager' :
                       'Student Account'}
                    </p>
                  </div>
                </div>
              </div>
              
              <DropdownMenuItem className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
            <div className="flex flex-col p-4 space-y-4">
              {/* Mobile navigation */}
              <nav className="flex flex-col space-y-2">
                {navigationLinks.map(({ label, path, icon }) => (
                  <Link
                    key={path}
                    className={`flex items-center gap-3 text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                      isActive(path) 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    href={path}
                    onClick={() => setShowMenu(false)}
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
                
                {links.map(({ label, path }) => (
                  <Link
                    key={path}
                    className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                      isActive(path) 
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    href={path}
                    onClick={() => setShowMenu(false)}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile actions */}
              <div className="flex flex-col space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {role === 'organization' && (
                  <div className="space-y-3">
                    <WalletButton />
                    <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ClusterUiSelect />
                    <ThemeSelect />
                  </div>
                  
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>
                </div>
                
                {/* Mobile user info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${
                      role === 'admin' ? 'from-red-500 to-red-600' :
                      role === 'organization' ? 'from-blue-500 to-blue-600' :
                      'from-green-500 to-green-600'
                    } flex items-center justify-center text-white`}>
                      {getRoleIcon(role || '')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {role} Account
                      </p>
                      <p className={`text-xs ${getRoleColor(role || '')}`}>
                        {role === 'admin' ? 'System Administrator' :
                         role === 'organization' ? 'Organization Manager' :
                         'Student Account'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}