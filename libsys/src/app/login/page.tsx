// src/app/login/page.tsx
// 'use client' — form interaction, state, router
//
// C# equivalent:
//   Views/Home/Login.cshtml
//   HomeController.Login() GET + POST
//
// Key differences from C#:
//   Captcha: fetched as SVG via API (not base64 from ViewBag)
//   Submit:  fetch POST (not form POST)
//   Error:   useState (not ModelState)
//   Redirect: router.push (not RedirectToAction)

'use client'

import { useEffect, useState } from 'react'
import { useRouter }           from 'next/navigation'
import { cancelPrefetchTask } from 'next/dist/client/components/segment-cache/scheduler'

export default function LoginPage() {
  const router = useRouter()

  // ── Form State ──────────────────────────────────────────
  const [userId,   setUserId]   = useState('')
  const [password, setPassword] = useState('')
  const [captcha,  setCaptcha]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [captchaSvg, setCaptchaSvg] = useState<string>('')
  const [captchaLoading, setCaptchaLoading] = useState(false)
  // Captcha image URL — timestamp forces browser to refetch
  // same concept as C# Cache-Control: no-cache headers
  //const [captchaTs, setCaptchaTs] = useState(Date.now())
   const loadCaptcha = async () => {
    setCaptchaLoading(true)
    try {
      const res = await fetch('/api/auth/captcha')
      const svg = await res.text()   // get SVG as text string
      setCaptchaSvg(svg)
      setCaptcha('')                 // clear input on refresh
    } finally {
      setCaptchaLoading(false)
    }
  }
  // Load on mount — client side only, no hydration issue
  useEffect(() => {
    loadCaptcha()
  }, []);
  //const captchaUrl = `/api/auth/captcha?t=${captchaTs}`


  // ── Submit Handler ───────────────────────────────────────
  // C#: [HttpPost] Login(string id, string password, string captcha)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)     // C#: globalStartProcessingAnimation()

    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId, password, captcha })
      })

      const result = await res.json()

      if (result.success) {
        // C#: return RedirectToAction("Index", "Home")
        router.push('/backend')
      } else {
        // C#: ModelState.AddModelError("", "...")
        setError(result.message || 'Login failed')
        loadCaptcha()   // always refresh captcha on failure
      }

    } catch {
      setError('Network error — please try again')
      loadCaptcha()
    } finally {
      setLoading(false)  // C#: globalStopProcessingAnimation()
    }
  }

  // ── UI ───────────────────────────────────────────────────
  return (
    // Background image + foggy overlay
    // C#: <div class="background-image"> + <div class="mask">
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/library.jpg')" }}
    >
      {/* Foggy overlay — C#: backdrop-filter: blur(5px) */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Centered form */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">

        {/* White card — C#: .login-form */}
        <div className="w-80 rounded-md bg-white p-8 shadow-2xl">

          <h2 className="mb-6 text-center text-lg font-semibold text-gray-700">
            TTCS Library System
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* User ID — C#: <input name="id"> */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">User ID:</label>
              <input
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                autoComplete="off"
                required
                disabled={loading}
                className="rounded border border-gray-300 px-3 py-2 text-sm
                           focus:border-teal-500 focus:outline-none
                           disabled:bg-gray-100"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">Password:</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="off"
                required
                disabled={loading}
                className="rounded border border-gray-300 px-3 py-2 text-sm
                           focus:border-teal-500 focus:outline-none
                           disabled:bg-gray-100"
              />
            </div>

            {/* Captcha — C#: <img src="data:image/png;base64,@ViewBag.CaptchaImage"> */}
            <div className="flex flex-col gap-1">
                {/* Captcha — inline SVG, no broken link possible */}
                <div className="flex items-center gap-2">
                  <div
                    onClick={loadCaptcha}
                    title="Click to refresh"
                    className="cursor-pointer rounded border border-gray-200 
                              flex items-center justify-center bg-white"
                    style={{ height: 50, width: 200 }}
                    dangerouslySetInnerHTML={{ __html: captchaSvg }}
                  />
                  {captchaLoading
                    ? <span className="text-xs text-gray-400">...</span>
                    : <button
                        type="button"
                        onClick={loadCaptcha}
                        className="text-sm text-teal-600 hover:underline"
                      >↻</button>
                  }
              </div>
              <input
                type="text"
                value={captcha}
                onChange={e => setCaptcha(e.target.value)}
                placeholder="Enter code above"
                required
                disabled={loading}
                className="rounded border border-gray-300 px-3 py-2 text-sm
                           focus:border-teal-500 focus:outline-none
                           disabled:bg-gray-100"
              />
            </div>

            {/* Error message — C#: ModelState errors */}
            {error && (
              <div className="rounded border border-red-400 bg-red-50
                              px-3 py-2 text-center text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit — C#: <button class="btn btn-success">Login</button> */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded bg-teal-600 py-2 text-sm font-semibold
                         text-white transition hover:bg-teal-700
                         disabled:cursor-not-allowed disabled:bg-teal-300"
            >
              {/* C#: globalStartProcessingAnimation() */}
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}