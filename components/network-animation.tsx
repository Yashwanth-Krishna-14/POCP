"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  connections: number[]
  alpha: number
  targetAlpha: number
  life: number
  maxLife: number
}

export function NetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    let mouseX = 0
    let mouseY = 0
    let isMouseMoving = false
    let lastMouseMoveTime = 0

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * pixelRatio
      canvas.height = Math.min(window.innerHeight * 0.7, 800) * pixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${Math.min(window.innerHeight * 0.7, 800)}px`
      ctx.scale(pixelRatio, pixelRatio)
    }

    const createParticles = () => {
      particles = []
      const particleCount = Math.min(Math.floor(window.innerWidth / 20), 100)

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1
        const maxLife = Math.random() * 300 + 200

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius,
          connections: [],
          alpha: 0,
          targetAlpha: Math.random() * 0.5 + 0.1,
          life: 0,
          maxLife,
        })
      }
    }

    const drawParticle = (particle: Particle) => {
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)

      const primaryColor = theme === "dark" ? "rgba(124, 58, 237, " : "rgba(79, 70, 229, "
      ctx.fillStyle = `${primaryColor}${particle.alpha})`
      ctx.fill()
    }

    const drawConnections = () => {
      const connectionDistance = Math.min(window.innerWidth / 8, 150)

      // Clear previous connections
      particles.forEach((p) => {
        p.connections = []
      })

      // Find connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance) {
            particles[i].connections.push(j)
            particles[j].connections.push(i)

            const opacity = (1 - distance / connectionDistance) * 0.5 * particles[i].alpha * particles[j].alpha

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            const lineColor = theme === "dark" ? "rgba(124, 58, 237, " : "rgba(79, 70, 229, "
            ctx.strokeStyle = `${lineColor}${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    const updateParticles = () => {
      const currentTime = Date.now()
      const mouseInactive = currentTime - lastMouseMoveTime > 2000

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width / (window.devicePixelRatio || 1)) {
          particle.vx *= -1
        }

        if (particle.y < 0 || particle.y > canvas.height / (window.devicePixelRatio || 1)) {
          particle.vy *= -1
        }

        // Update life
        particle.life += 1

        // Fade in/out based on life
        if (particle.life < 60) {
          particle.alpha = (particle.life / 60) * particle.targetAlpha
        } else if (particle.life > particle.maxLife - 60) {
          particle.alpha = ((particle.maxLife - particle.life) / 60) * particle.targetAlpha
        } else {
          particle.alpha = particle.targetAlpha
        }

        // Reset particle if it's reached its max life
        if (particle.life >= particle.maxLife) {
          particle.life = 0
          particle.x = (Math.random() * canvas.width) / (window.devicePixelRatio || 1)
          particle.y = (Math.random() * canvas.height) / (window.devicePixelRatio || 1)
          particle.targetAlpha = Math.random() * 0.5 + 0.1
        }

        // Attract to mouse if it's moving
        if (isMouseMoving && !mouseInactive) {
          const dx = mouseX - particle.x
          const dy = mouseY - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            const force = 0.02
            particle.vx += (dx / distance) * force
            particle.vy += (dy / distance) * force
          }
        }

        // Apply some friction
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Limit velocity
        const maxVelocity = 2
        const velocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        if (velocity > maxVelocity) {
          particle.vx = (particle.vx / velocity) * maxVelocity
          particle.vy = (particle.vy / velocity) * maxVelocity
        }
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      updateParticles()
      drawConnections()

      particles.forEach((particle) => {
        drawParticle(particle)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      isMouseMoving = true
      lastMouseMoveTime = Date.now()
    }

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    window.addEventListener("resize", handleResize)
    canvas.addEventListener("mousemove", handleMouseMove)

    resizeCanvas()
    createParticles()
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
}

