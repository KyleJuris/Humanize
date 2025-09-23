"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const checkSupabase = async () => {
      const info: any = {
        hasSupabaseClient: !!supabase,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        currentUrl: window.location.href,
        urlParams: Object.fromEntries(new URLSearchParams(window.location.search)),
      }

      if (supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession()
          info.session = {
            hasSession: !!session,
            userId: session?.user?.id,
            email: session?.user?.email,
            error: error?.message
          }
        } catch (err) {
          info.sessionError = (err as any)?.message
        }
      }

      setDebugInfo(info)
    }

    checkSupabase()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}


