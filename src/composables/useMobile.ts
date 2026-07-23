import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'

function useMobile () {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  return breakpoints.smaller('md')
}

export { useMobile }
