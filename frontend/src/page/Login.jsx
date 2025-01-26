import React from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { MessageSquare, Loader2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import AuthImagePattern from '../Component/AuthImagePattern'
export default function Login() {
  const [showpassword, setshowpassword] = useState(false)
  const [EmailError, setEmailEror] = useState('')
  const [passwordError, setpasswordEror] = useState(false)
  const [formdata, setformdata] = useState({
    email: '',
    password: '',
  })

  const { login, isLoggingIn } = useAuthStore()

  const valid = () => {

    if (formdata.email === '' || formdata.password === '') {
      return toast.error("All fields are required")
    }
    if (!formdata.email.trim()) {
      return toast.error("Email is required")
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formdata.email)) {
      return toast.error("Invalid email")
    }
    if (!formdata.password.trim()) {
      return toast.error("Password is required")
    }
    return true
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = valid();
    //setCheckingAuth(formdata.fullName.trim() === '');

    if (formdata.email.trim() === '') {
      setEmailEror(true);
    } else {
      setEmailEror(false)
    }

    if (formdata.password.trim() === '') {
      setpasswordEror(true);
    }
    else {
      setpasswordEror(false)
    }
    if (isValid === true) {
      login(formdata)
      //toast.success("Login successfully")
    }

  }


  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* left */}
      <div className='flex flex-col justify-center items-center sm:p-12'>
        <div className='w-full max-w-md space-y-8' >
          {/* logo */}

          <div className='text-center mb-8'>
            <div
              className='size-12 rounded-xl bg-primary/10 flex justify-center items-center group-hover:bg-primary/20
    transition-colors'
            >
              <MessageSquare className='size-6 text-primary' />


            </div>
            <h2 className='text-3xl font-bold text-gray-900'>Log In</h2>
            <p className='text-base-content/60'>Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 ${EmailError ? 'error' : ''} `}
                  placeholder="you@example.com"
                  value={formdata.email}
                  onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
                />
              </div>
              {
                EmailError ? <p className='text-red-500 mt-2'>Email is required</p> : ''
              }
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showpassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10  ${passwordError ? 'error' : ''} } `}
                  placeholder="••••••••"
                  value={formdata.password}
                  onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setshowpassword(!showpassword)}
                >
                  {showpassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>


              </div>
              {
                passwordError ? <p className='text-red-500 mt-2'>Password is required</p> : ''
              }

            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* right side */}

      <AuthImagePattern
        title="Welcome Back"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}
