// Arc UI motion constants (calm motion)
export const spring = {
  responsive: { type: 'spring', stiffness: 520, damping: 38, mass: 1 },
  gentle:     { type: 'spring', stiffness: 340, damping: 34, mass: 1 },
  snappy:     { type: 'spring', stiffness: 450, damping: 35, mass: 1 },
} as const

export const ease = {
  enter:    [0.16, 1, 0.3, 1] as const,
  standard: [0.22, 1, 0.36, 1] as const,
}

// Entrada de sección: fundido con desenfoque suave
export const sectionEnter = {
  initial: { opacity: 0, y: 6, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.32, ease: ease.enter },
}
