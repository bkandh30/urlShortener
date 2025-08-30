import axios from "axios";
import type { AxiosResponse } from "axios";
import { LinkResponse, StatsResponse } from "@bkandh30/common-url-shortener";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface LocalLink extends LinkResponse {
    shortUrl: string
}

export async function createLink(longUrl: string): Promise<LocalLink> {
    try {
        const response: AxiosResponse<LinkResponse> = await api.post<LinkResponse>('/api/links', { longUrl })
        return {
            ...response.data,
            shortUrl: `${API_URL}/${response.data.shortId}`
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
            throw new Error(error.response.data.error.message);
        }
        throw new Error('Failed to create Link')
    }
}

export async function getStats(shortId: string): Promise<StatsResponse> {
    try {
        const response: AxiosResponse<StatsResponse> = await api.get<StatsResponse>(`/api/links/${shortId}`)
        return response.data
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            throw new Error('Link not found')
        }
        throw new Error('Failed to fetch stats')
    }
}

export function getQrUrl(shortId: string, format: 'png' | 'svg' = 'png', size: number = 256): string {
    return `${API_URL}/api/links/${shortId}/qr?fmt=${format}&size=${size}`
}

export function getShortUrl(shortId: string): string {
    return `${API_URL}/${shortId}`
}