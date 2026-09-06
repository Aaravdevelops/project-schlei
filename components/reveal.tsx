'use client'

import { useEffect, useRef } from 'react'

export function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { node.classList.add('is-visible'); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      node.style.setProperty('--reveal-delay', `${delay}ms`)
      node.classList.add('is-visible')
      observer.disconnect()
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}
