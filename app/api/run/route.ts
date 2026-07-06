import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy to the free Piston API. Running from the server
// avoids the browser CORS / CSP problems that made the compiler fail.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'compiler_unreachable' }, { status: 502 })
  }
}
