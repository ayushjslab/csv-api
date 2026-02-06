'use client'

import React, { useState, useEffect } from 'react'
import { FaSearch, FaHistory, FaTrophy, FaLink, FaArrowRight, FaTimes } from 'react-icons/fa'

interface RankResult {
    domain: string;
    rank: number | null;
    found: boolean;
}

const TrancoPage = () => {
    const [domain, setDomain] = useState('')
    const [result, setResult] = useState<RankResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [history, setHistory] = useState<string[]>([])
    const [error, setError] = useState('')

    useEffect(() => {
        const savedHistory = localStorage.getItem('tranco_history')
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory))
        }
    }, [])

    const saveToHistory = (domainName: string) => {
        const newHistory = [domainName, ...history.filter(h => h !== domainName)].slice(0, 5)
        setHistory(newHistory)
        localStorage.setItem('tranco_history', JSON.stringify(newHistory))
    }

    const handleSearch = async (targetDomain?: string) => {
        const searchDomain = (targetDomain || domain).trim().toLowerCase()
        if (!searchDomain) return

        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/api/tranco?domain=${encodeURIComponent(searchDomain)}`)
            const data = await res.json()
            setResult(data)
            if (data.found) {
                saveToHistory(searchDomain)
            }
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const clearHistory = () => {
        setHistory([])
        localStorage.removeItem('tranco_history')
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-purple-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
                {/* Hero Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4 animate-fade-in">
                        <FaTrophy className="text-xs" />
                        <span>Global Traffic Intelligence</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                        Tranco Rank <br />
                        <span className="text-purple-500">Explorer</span>
                    </h1>
                    <p className="text-lg text-white/40 max-w-lg mx-auto leading-relaxed">
                        Instantly discover the global popularity rank of any website using the industry-standard Tranco dataset.
                    </p>
                </div>

                {/* Search Interface */}
                <div className="space-y-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
                        <div className="relative flex items-center bg-[#161618] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="pl-6 text-white/30">
                                <FaSearch className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Enter domain (e.g., google.com)"
                                className="w-full bg-transparent px-4 py-6 text-xl outline-none placeholder:text-white/20"
                            />
                            <button
                                onClick={() => handleSearch()}
                                disabled={loading}
                                className="mr-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : (
                                    <>Search <FaArrowRight /></>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Results Display */}
                    {result && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {result.found ? (
                                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <FaTrophy size={120} />
                                    </div>
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-white/40 mb-1">
                                                <FaLink className="text-xs" />
                                                <span className="text-sm tracking-widest uppercase font-mono">{result.domain}</span>
                                            </div>
                                            <h2 className="text-3xl font-bold">Domain Identity Confirmed</h2>
                                        </div>
                                        <div className="text-center md:text-right">
                                            <div className="text-sm text-white/40 mb-1 font-mono uppercase tracking-widest">Tranco Rank</div>
                                            <div className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-blue-600">
                                                #{result.rank?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visual Status Bar */}
                                    <div className="mt-8 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-progress"
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 rounded-3xl bg-white/5 border border-white/10 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                                        <FaTimes size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">Domain Not Found</h3>
                                        <p className="text-white/40">This domain isn't listed in our current Tranco ranking database.</p>
                                    </div>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="text-white/40 hover:text-white transition-colors text-sm"
                                    >
                                        Clear result
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recent History */}
                    {history.length > 0 && (
                        <div className="pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2 text-white/40">
                                    <FaHistory />
                                    <span className="text-sm font-medium tracking-wide uppercase">Recent Searches</span>
                                </div>
                                <button
                                    onClick={clearHistory}
                                    className="text-xs text-white/20 hover:text-white/60 transition-colors uppercase tracking-widest"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {history.map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => {
                                            setDomain(h)
                                            handleSearch(h)
                                        }}
                                        className="p-4 text-left rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group overflow-hidden"
                                    >
                                        <div className="text-sm font-medium truncate mb-1 group-hover:text-purple-400 transition-colors">{h}</div>
                                        <div className="text-[10px] text-white/20 uppercase tracking-tighter">View Rank</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-32 text-center text-white/20 text-sm">
                    <p>© 2026 CSV API Intelligence • Powered by Tranco Ranking List</p>
                </div>
            </div>

            <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-progress { animation: progress 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
        </div>
    )
}

export default TrancoPage