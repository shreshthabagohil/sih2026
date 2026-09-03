const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export async function getAdvisory(payload) {
  const res = await fetch(`${API_BASE}/advisory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed (${res.status}): ${text}`)
  }
  return res.json()
}
