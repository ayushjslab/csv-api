let trancoMap: Map<string, number> | null = null

const CSV_URL =
  'https://ayushjslab.github.io/csv-files/tranco-rank-list.csv'

async function loadTranco() {
  if (trancoMap) return trancoMap

  const res = await fetch(CSV_URL)
  const text = await res.text()

  trancoMap = new Map()

  const lines = text.split('\n')
  for (const line of lines) {
    const [rank, domain] = line.split(',')
    if (!rank || !domain) continue

    trancoMap.set(domain.trim().toLowerCase(), Number(rank))
  }

  return trancoMap
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return new Response(
      JSON.stringify({ error: 'domain query param required' }),
      { status: 400 }
    )
  }

  const map = await loadTranco()
  const rank = map.get(domain.toLowerCase())

  return Response.json(
    {
      domain,
      rank: rank ?? null,
      found: Boolean(rank)
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400'
      }
    }
  )
}
