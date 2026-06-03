"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CatMood } from "@/lib/types"

interface CatAvatarProps {
  mood: CatMood
  isCritical: boolean
}

export function CatAvatar({ mood, isCritical }: CatAvatarProps) {
  const [blink, setBlink] = useState(false)

  // Natural blinking effect for happy/awake cat
  useEffect(() => {
    if (mood === "sleeping") return
    
    const interval = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 150)
    }, 4000)

    return () => clearInterval(interval)
  }, [mood])

  // Breathing speed based on mood
  const breathingDuration = mood === "sleeping" ? 4 : mood === "sad" ? 3 : 2

  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      
      {/* Background Glow */}
      <div className={`absolute inset-0 rounded-[3rem] filter blur-xl opacity-25 transition-all duration-700 ${
        isCritical 
          ? "bg-red-500 scale-95" 
          : mood === "happy" 
          ? "bg-peach-400 scale-100" 
          : "bg-blue-300 scale-95"
      }`} />

      {/* Main Cat SVG Container */}
      <motion.svg
        viewBox="0 0 200 200"
        className="w-48 h-48 drop-shadow-xl z-10"
        animate={{
          y: mood === "happy" ? [0, -4, 0] : 0,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Tail */}
        <motion.path
          d="M 50 140 C 30 140, 20 120, 25 100 C 27 90, 37 90, 35 100 C 32 112, 38 125, 50 125 Z"
          fill="#FB923C" // Ginger Orange
          style={{ transformOrigin: "50px 140px" }}
          animate={{
            rotate: mood === "happy" ? [-10, 15, -10] : mood === "sleeping" ? [-2, 2, -2] : [-5, 5, -5],
          }}
          transition={{
            duration: mood === "happy" ? 1.2 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Body (Breathes up and down) */}
        <motion.ellipse
          cx="100"
          cy="135"
          rx="55"
          ry="45"
          fill="#FDBA74" // Orange-200
          animate={{
            scaleY: [1, 1.04, 1],
            y: [0, -2, 0]
          }}
          transition={{
            duration: breathingDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Back Stripes */}
        <path d="M 100 95 L 100 115 M 85 100 L 90 115 M 115 100 L 110 115" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" opacity="0.3" />

        {/* Back Feet */}
        <circle cx="65" cy="175" r="14" fill="#FB923C" />
        <circle cx="135" cy="175" r="14" fill="#FB923C" />

        {/* Front Paws */}
        <motion.circle 
          cx="85" 
          cy="172" 
          r="12" 
          fill="#FDBA74"
          animate={{
            y: mood === "happy" ? [0, -3, 0] : 0
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle 
          cx="115" 
          cy="172" 
          r="12" 
          fill="#FDBA74"
          animate={{
            y: mood === "happy" ? [-3, 0, -3] : 0
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Left Ear */}
        <motion.path
          d="M 55 75 L 35 30 L 75 50 Z"
          fill="#FB923C"
          style={{ transformOrigin: "55px 75px" }}
          animate={{
            rotate: mood === "happy" ? [0, -4, 2, 0] : mood === "sad" ? [-8, -8] : 0,
          }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
        />
        <path d="M 52 70 L 42 40 L 65 53 Z" fill="#FDA4AF" /> {/* Ear Inside */}

        {/* Right Ear */}
        <motion.path
          d="M 145 75 L 165 30 L 125 50 Z"
          fill="#FB923C"
          style={{ transformOrigin: "145px 75px" }}
          animate={{
            rotate: mood === "happy" ? [0, 4, -2, 0] : mood === "sad" ? [8, 8] : 0,
          }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 2.5 }}
        />
        <path d="M 148 70 L 158 40 L 135 53 Z" fill="#FDA4AF" /> {/* Ear Inside */}

        {/* Head */}
        <motion.ellipse
          cx="100"
          cy="85"
          rx="52"
          ry="40"
          fill="#FDBA74"
          animate={{
            y: [0, -1.5, 0]
          }}
          transition={{
            duration: breathingDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Head Stripes */}
        <path d="M 100 47 L 100 57 M 90 49 L 93 57 M 110 49 L 107 57" stroke="#EA580C" strokeWidth="3" strokeLinecap="round" opacity="0.3" />

        {/* Cheeks (Pink blush) */}
        {mood !== "sleeping" && (
          <>
            <circle cx="68" cy="98" r="7" fill="#F43F5E" opacity="0.18" />
            <circle cx="132" cy="98" r="7" fill="#F43F5E" opacity="0.18" />
          </>
        )}

        {/* Whiskers */}
        <g stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" opacity="0.6">
          {/* Left Whiskers */}
          <motion.line 
            x1="55" y1="95" x2="30" y2="92" 
            animate={{ rotate: mood === "happy" ? [0, 3, 0] : 0 }} 
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.line 
            x1="55" y1="101" x2="28" y2="101" 
            animate={{ rotate: mood === "happy" ? [0, -2, 0] : 0 }} 
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          {/* Right Whiskers */}
          <motion.line 
            x1="145" y1="95" x2="170" y2="92" 
            animate={{ rotate: mood === "happy" ? [0, -3, 0] : 0 }} 
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.line 
            x1="145" y1="101" x2="172" y2="101" 
            animate={{ rotate: mood === "happy" ? [0, 2, 0] : 0 }} 
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </g>

        {/* Eyes & Expressions */}
        <g>
          {mood === "happy" && (
            <>
              {blink ? (
                // Blinking State
                <>
                  <line x1="72" y1="88" x2="88" y2="88" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="112" y1="88" x2="128" y2="88" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
                </>
              ) : (
                // Open Happy Eyes (Smiling Arcs ^ ^)
                <>
                  <path d="M 72 90 Q 80 78, 88 90" fill="none" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M 112 90 Q 120 78, 128 90" fill="none" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
                </>
              )}
            </>
          )}

          {mood === "sad" && (
            <>
              {/* Sad Droopy Eyes */}
              <path d="M 72 84 Q 80 94, 88 84" fill="none" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 112 84 Q 120 94, 128 84" fill="none" stroke="#374151" strokeWidth="3.5" strokeLinecap="round" />
              
              {/* Tear Droplets */}
              <motion.path 
                d="M 80 92 C 80 96, 77 98, 75 98 C 73 98, 70 96, 70 92 C 70 88, 75 85, 75 85 C 75 85, 80 88, 80 92 Z" 
                fill="#60A5FA" 
                animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.path 
                d="M 120 92 C 120 96, 123 98, 125 98 C 127 98, 130 96, 130 92 C 130 88, 125 85, 125 85 C 125 85, 120 88, 120 92 Z" 
                fill="#60A5FA" 
                animate={{ y: [0, 8, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
              />
            </>
          )}

          {mood === "sleeping" && (
            <>
              {/* Closed Sleepy Eyes (- -) */}
              <line x1="71" y1="88" x2="87" y2="88" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="113" y1="88" x2="129" y2="88" stroke="#4B5563" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Nose (Pink triangle) */}
        <polygon points="97,97 103,97 100,100" fill="#F43F5E" />

        {/* Mouth */}
        <g stroke="#374151" strokeWidth="2" strokeLinecap="round" fill="none">
          {mood === "sleeping" ? (
            // Tiny sleeping mouth
            <path d="M 97 104 Q 100 106, 103 104" />
          ) : mood === "sad" ? (
            // Sad curved mouth
            <path d="M 95 108 Q 100 102, 105 108" />
          ) : (
            // Cute cat mouth (3 shape)
            <>
              <path d="M 95 103 Q 97.5 107, 100 103" />
              <path d="M 100 103 Q 102.5 107, 105 103" />
            </>
          )}
        </g>
      </motion.svg>

      {/* Floating Zzz bubbles for sleeping cat */}
      <AnimatePresence>
        {mood === "sleeping" && (
          <>
            <motion.span
              key="z1"
              className="absolute text-xl font-bold font-mono text-peach-400 select-none pointer-events-none"
              style={{ top: "30%", right: "12%" }}
              initial={{ opacity: 0, scale: 0.5, y: 10, rotate: -15 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.8], y: -30, rotate: [-15, -5, -20] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            >
              z
            </motion.span>
            <motion.span
              key="z2"
              className="absolute text-2xl font-bold font-mono text-peach-500 select-none pointer-events-none"
              style={{ top: "20%", right: "5%" }}
              initial={{ opacity: 0, scale: 0.5, y: 15, rotate: 10 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.9], y: -45, rotate: [10, 20, 5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1, ease: "easeOut" }}
            >
              Z
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Critical Health Warning Badge */}
      {isCritical && (
        <motion.div
          className="absolute -bottom-2 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs px-3.5 py-1.5 rounded-full font-bold shadow-lg shadow-red-500/30 flex items-center gap-1.5 z-20"
          animate={{ 
            scale: [1, 1.06, 1],
            y: [0, -2, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>¡Necesita Mimos!</span>
        </motion.div>
      )}
    </div>
  )
}
