// hooks/use-favoritedata.js
'use client'

import { useState, useEffect } from 'react'

export default function useFavoriteData(memberId) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!memberId) return

    const controller = new AbortController()
    const { signal } = controller

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/favorites/${memberId}`, { signal })

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

        const data = await res.json()
        setFavorites(data || [])
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()

    return () => {
      controller.abort()
    }
  }, [memberId])

  return { favorites, loading, error }
}