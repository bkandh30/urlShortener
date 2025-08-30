'use client'

import { useState } from "react"
import { createLink, LocalLink } from "@/lib/api"
import { formatDate, getTimeUntilExpiry } from "@/lib/utils"

interface UrlFormProps {
    onLinkCreated: (link: LocalLink) => void
}

export default function UrlForm({ onLinkCreated }: UrlFormProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState<LocalLink | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(null)

        if (!url) {
            setError('Please enter a URL')
            return
        }

        setLoading(true)
        try {
            const link = await createLink(url)
            
            setSuccess(link)
            onLinkCreated(link)
            setUrl('')

            setTimeout(() => setSuccess(null), 5000)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Enter your long URL
            </label>
            <div className="flex gap-2">
                <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={loading}
                />
                <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                {loading ? 'Creating...' : 'Shorten'}
                </button>
            </div>
            </div>

            {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
            </div>
            )}

            {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium mb-2">Link created successfully!</p>
                <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600">Short URL:</span>
                    <a 
                    href={success.shortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono"
                    >
                    {success.shortUrl}
                    </a>
                </div>
                <div className="text-gray-600">
                    Expires: {formatDate(success.expiresAt)} ({getTimeUntilExpiry(success.expiresAt)})
                </div>
                </div>
            </div>
        )}
        </form>
    </div>
  )
};