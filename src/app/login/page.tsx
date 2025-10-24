






'use client';







import { useState } from 'react';



import { useRouter } from 'next/navigation';



import ThemeSwitcher from '@/components/ThemeSwitcher';







export default function Login() {



  const [username, setUsername] = useState('');



  const [password, setPassword] = useState('');



  const [error, setError] = useState('');



  const router = useRouter();







  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {



    e.preventDefault();



    const response = await fetch('/api/auth/login', {



      method: 'POST',



      headers: {



        'Content-Type': 'application/json',



      },



      body: JSON.stringify({ username, password }),



    });







    if (response.ok) {



      router.push('/admin');



    } else {



      setError('Invalid username or password');



    }



  };







  return (



    <div className="min-h-screen flex items-center justify-center bg-background">



      <div className="glassmorphism p-8 rounded-xl shadow-2xl w-full max-w-md">



        <div className="flex justify-between items-center mb-8">



            <h1 className="text-4xl font-serif font-bold text-center text-foreground">Admin Login</h1>



            <ThemeSwitcher />



        </div>



        {error && <p className="text-red-500 text-center mb-4">{error}</p>}



        <form onSubmit={handleSubmit}>



          <div className="mb-4">



            <label className="block text-foreground text-sm font-bold mb-2" htmlFor="username">



              Username



            </label>



            <input



              id="username"



              type="text"



              value={username}



              onChange={(e) => setUsername(e.target.value)}



              className="mt-1 block w-full px-4 py-3 bg-background border-foreground/20 rounded-lg focus:ring-primary focus:border-primary transition text-foreground"



            />



          </div>



          <div className="mb-6">



            <label className="block text-foreground text-sm font-bold mb-2" htmlFor="password">



              Password



            </label>



            <input



              id="password"



              type="password"



              value={password}



              onChange={(e) => setPassword(e.target.value)}



              className="mt-1 block w-full px-4 py-3 bg-background border-foreground/20 rounded-lg focus:ring-primary focus:border-primary transition text-foreground mb-3 leading-tight focus:outline-none focus:shadow-outline"



            />



          </div>



          <div className="flex items-center justify-between">



            <button



              type="submit"



              className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition duration-300 transform hover:scale-105"



            >



              Sign In



            </button>



          </div>



        </form>



      </div>



    </div>



  );



}






