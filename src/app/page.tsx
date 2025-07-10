import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Award, Users, CheckCircle, ArrowRight, Globe, Lock, Zap } from 'lucide-react'

export default function Home() {
  

  return (
    <div className="flex-grow min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                VerifyCertify
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Secure, blockchain-powered certificate verification system. 
                Issue, verify, and manage digital certificates with complete transparency and trust.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" className="px-8 py-3 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/public/course/demo/learner/demo">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg font-medium rounded-xl border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300">
                  View Demo Certificate
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <div className="text-gray-600 dark:text-gray-400">Secure & Tamper-Proof</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-indigo-600">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">Global Verification</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">∞</div>
                <div className="text-gray-600 dark:text-gray-400">Permanent Storage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose VerifyCertify?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built on Solana blockchain for maximum security, speed, and cost-effectiveness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Certificates are stored on Solana blockchain, making them immutable and tamper-proof with cryptographic verification.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Easy Issuance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Organizations can easily create courses, add learners, and issue certificates with just a few clicks.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Global Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Anyone, anywhere can verify certificate authenticity instantly using our public verification system.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Multi-Role System</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Separate dashboards for administrators, organizations, and learners with role-based access control.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Built on Solana for high-speed transactions with minimal fees and instant confirmation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Privacy Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                  Only necessary information is stored on-chain while maintaining complete privacy and data protection.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, secure, and transparent certificate management in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Create & Enroll</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organizations create courses and enroll learners. Admin approval ensures only verified institutions participate.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Issue Certificates</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upon course completion, organizations issue blockchain certificates that are permanently stored and verifiable.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Verify & Share</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learners can share their certificates globally. Anyone can verify authenticity instantly using our public verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join the future of digital certification. Secure, transparent, and globally verifiable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="px-8 py-3 text-lg font-medium bg-white text-blue-600 hover:bg-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Issuing Certificates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">VerifyCertify</h3>
              <p className="text-gray-400">
                Blockchain-powered certificate verification for the digital age.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Technology</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Solana Blockchain</li>
                <li>Next.js Frontend</li>
                <li>MongoDB Database</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Contact Support</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VerifyCertify.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}