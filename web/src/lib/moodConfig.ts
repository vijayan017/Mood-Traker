export interface MoodDefinition {
  type: string
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}

export const MOOD_DEFINITIONS: Record<string, MoodDefinition> = {
  Happy: {
    type: 'Happy',
    label: 'Happy',
    color: '#22C55E',
    bgColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    icon: '😊',
  },
  Calm: {
    type: 'Calm',
    label: 'Calm',
    color: '#0EA5E9',
    bgColor: 'rgba(14, 165, 233, 0.15)',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    icon: '🌿',
  },
  Anxious: {
    type: 'Anxious',
    label: 'Anxious',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    icon: '⚡',
  },
  Sad: {
    type: 'Sad',
    label: 'Sad',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    icon: '🌧️',
  },
  Overwhelmed: {
    type: 'Overwhelmed',
    label: 'Overwhelmed',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    icon: '🔥',
  },
  Energetic: {
    type: 'Energetic',
    label: 'Energetic',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    icon: '✨',
  },
}
