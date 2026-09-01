import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { ROUTES } from '@/app/router/routes'
import { Button } from '@/components/ui/button'

export interface GetStartedButtonProps {
  className?: string
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate()
  const authenticated = useAuthStore((state) => state.authenticated)
  const shouldReduceMotion = useReducedMotion()
  const isAnimated = !shouldReduceMotion

  const handleClick = () => {
    if (authenticated) {
      navigate(ROUTES.MOOD.TRACKER)
    } else {
      navigate(ROUTES.AUTH.REGISTER)
    }
  }

  return (
    <motion.div
      whileHover={isAnimated ? { scale: 1.03 } : undefined}
      whileTap={isAnimated ? { scale: 0.97 } : undefined}
      className={`inline-block ${className}`}
    >
      <Button
        onClick={handleClick}
        size="lg"
        className="h-14 px-8 bg-gradient-to-r from-sky-600 via-teal-600 to-sky-700 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-base rounded-lg shadow-xl shadow-sky-600/30 border border-sky-400/20 transition-all gap-3 cursor-pointer select-none"
      >
        <span>Get Started</span>
        <ArrowRight className="w-5 h-5 text-sky-200" />
      </Button>
    </motion.div>
  )
}

export default GetStartedButton
