'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { LogOut, User, Settings, Shield, Building2, GraduationCap } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { ClusterUiSelect } from './cluster/cluster-ui'
import { WalletButton } from '@/components/solana/solana-provider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserRole } from '@/models/User'
import { signOut } from '@/app/lib/actions'

export function AppHeader({ links = [], role }: { links: { label: string; path: string }[], role: UserRole | null }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)




  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/auth/signin';
  }

  const getNavigationLinks = () => {
    if (!role) return []

    switch (role) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <Shield className="h-4 w-4" /> },
          // { label: 'Organizations', path: '/admin/organizations', icon: <Building2 className="h-4 w-4" /> },
        ]
      case 'organization':
        return [
          { label: 'Dashboard', path: '/dashboard', icon: <Building2 className="h-4 w-4" /> },
          // { label: 'Courses', path: '/organization/courses', icon: <GraduationCap className="h-4 w-4" /> },
        ]
      case 'learner':
        return [
          { label: 'Dashboard', path: '/learner-dashboard', icon: <GraduationCap className="h-4 w-4" /> },
          // { label: 'Certificates', path: '/learner/certificates', icon: <Shield className="h-4 w-4" /> },
        ]
      default:
        return [

        ]
    }
  }

  const navigationLinks = getNavigationLinks()

  if (!role) {
    return (
      <header className="fixed top-0 w-full bg-surface/70 backdrop-blur-md border-b border-white/10 shadow-sm z-50">
        <div className="flex justify-between items-center h-16 px-md max-w-container-max mx-auto">
          <Link href="/" className="font-headline-md text-headline-md font-bold text-on-surface">
            VerifyCertify
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/#features"
              className={`font-body-md text-body-md transition-colors ${isActive('/#features') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'
                }`}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className={`font-body-md text-body-md transition-colors ${isActive('/#how-it-works') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'
                }`}
            >
              How It Works
            </Link>
            <Link
              href="/public/course/demo/learner/demo"
              className={`font-body-md text-body-md transition-colors ${isActive('/public/course/demo/learner/demo') ? 'text-primary font-bold border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary'
                }`}
            >
              Demo
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSelect />
            <Link href="/auth/signin">
              <button className="bg-primary text-on-primary font-label-caps text-label-caps px-md py-xs rounded-full active:opacity-80 transition-all hover:scale-105">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 bg-surface/50 backdrop-blur-lg border-b border-outline-variant/30 flex justify-between items-center w-full px-md py-base transition-all duration-300">
      <div className="flex items-center gap-base">
        <button className="lg:hidden text-on-surface" onClick={() => setShowMenu(!showMenu)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link href="/" className="font-headline-md text-headline-md font-bold text-on-surface">
          VerifyCertify
        </Link>
        <div className="hidden lg:flex items-center space-x-md ml-lg">
          {navigationLinks.map(({ label, path }) => (
            <Link
              key={path}
              className={`font-body-md text-body-md transition-colors ${isActive(path) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              href={path}
            >
              {label}
            </Link>
          ))}
          {links.map(({ label, path }) => (
            <Link
              key={path}
              className={`font-body-md text-body-md transition-colors ${isActive(path) ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                }`}
              href={path}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center gap-md">
        <div className="flex items-center gap-xs px-sm py-1 bg-surface-container-high rounded-full border border-outline-variant/30">
          <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#4edea3]"></div>
          <span className="font-label-caps text-[10px] text-secondary">Devnet Active</span>
        </div>

        {role === 'organization' && (
          <div className="flex items-center gap-sm">
            <WalletButton />
          </div>
        )}

        {process.env.NODE_ENV !== 'production' && (
          <ClusterUiSelect />
        )}

        <ThemeSelect />

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-bright rounded-full">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-surface border border-white/10 text-on-surface">
            <div className="px-3 py-2 border-b border-white/5">
              <p className="text-sm font-bold capitalize">{role} Account</p>
              <p className="text-[10px] text-on-surface-variant font-label-caps">Manage profile</p>
            </div>
            <DropdownMenuItem className="flex items-center space-x-2 hover:bg-white/5 cursor-pointer">
              <User className="h-4 w-4 text-primary" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center space-x-2 hover:bg-white/5 cursor-pointer">
              <Settings className="h-4 w-4 text-primary" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-400 focus:text-red-400 hover:bg-white/5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-surface-container border-b border-outline-variant/30 shadow-lg z-50 p-md space-y-md">
          <nav className="flex flex-col space-y-md">
            {navigationLinks.map(({ label, path }) => (
              <Link
                key={path}
                className={`font-body-md text-body-md transition-colors ${isActive(path) ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                href={path}
                onClick={() => setShowMenu(false)}
              >
                {label}
              </Link>
            ))}
            {links.map(({ label, path }) => (
              <Link
                key={path}
                className={`font-body-md text-body-md transition-colors ${isActive(path) ? 'text-primary font-bold' : 'text-on-surface-variant'
                  }`}
                href={path}
                onClick={() => setShowMenu(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-sm pt-md border-t border-white/5">
            {role === 'organization' && <WalletButton />}
            <div className="flex justify-between items-center">
              <ClusterUiSelect />
              <ThemeSelect />
              <button
                onClick={handleLogout}
                className="flex items-center gap-xs text-red-400 hover:text-red-300 font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}