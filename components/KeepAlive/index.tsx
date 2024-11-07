'use client'

import { useEffect, useState } from 'react'

export default function KeepAlive() {
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const keepAlive = () => {
      // Realizar uma ação simples para manter a TV ativa
      console.log('Keeping TV alive:', new Date().toISOString())
      setLastActivity(Date.now())

      // Mover o cursor para uma posição aleatória na tela
      const x = Math.floor(Math.random() * window.innerWidth)
      const y = Math.floor(Math.random() * window.innerHeight)
      const event = new MouseEvent('mousemove', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
      })
      document.dispatchEvent(event)
    }

    const interval = setInterval(keepAlive, 60000) // Executar a cada minuto

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-0 right-0 p-2 text-xs text-gray-500">
      Última atividade: {new Date(lastActivity).toLocaleTimeString()}
    </div>
  )
}