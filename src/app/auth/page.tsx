'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';  
import { useState, ChangeEvent, FormEvent } from 'react';

type Role = 'organization' ;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState<{ username: string; password: string; role: Role, organizationName: string }>({
    username: '',
    password: '',
    organizationName: '',
    role: 'organization', // Default to organization for sign up
  });
  const [msg, setMsg] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if(data.message == 'User created') {
      setMsg('Sign up request sent. Please wait for approval.');
      return;
    }
    setMsg(data.message || '');
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      console.log(data.role === 'organization');
      console.log(data.role);
      // Optionally redirect based on role
      if (data.role === 'organization') {
        window.location.href = '/dashboard';
        return; 
      } if (data.role === 'admin') {
        window.location.href = '/admin/dashboard'; 
        return;
      }else {
        window.location.href = '/learner-dashboard'; // Redirect to home for learners
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <h2
      className='text-2xl font-bold mb-4'
      >{isLogin ? 'Login' : 'Organization Sign Up Request'}</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col  gap-4 p-8 rounded shadow w-[70%] md:w-[40%]   my-8"
      >
        {!isLogin && (
          <Input
          type="text"
          name="organizationName"
          placeholder="Organization Name"
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        <Input
          name="username"
          placeholder="Username"
          type={isLogin ? 'text':'email'}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Button
          variant={isLogin ? 'default' : 'secondary'}
          type="submit"
          className="w-full"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
      </form>
      <Button
      variant={'link'}
      onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Organization Sign Up' : 'Switch to Login'}
      </Button>
      {!isLogin && 
      <div 
      className='text-sm text-gray-500 mt-2'
      >Note: Organization sign up requests are subject to approval.
      <br />
      <br />
      <span className='font-bold'>For Learner Credentials Contact Your Organization</span>
      </div>}
      <div
      className='mt-4 text-red-500'
      >{msg}</div>
    </div>
  );
}