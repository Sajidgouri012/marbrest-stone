export async function adminApi(action: string, table: string, data?: any, id?: string) {
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, table, data, id }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'API request failed')
  }

  return result.data
}
