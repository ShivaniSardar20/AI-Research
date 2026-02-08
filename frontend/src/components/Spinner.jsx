import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default function Spinner({ size = 28 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress size={size} thickness={4} sx={{ color: 'primary.main' }} />
    </Box>
  )
}
