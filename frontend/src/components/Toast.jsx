import { useEffect, useState } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

export default function Toast({ toasts, setToasts }) {
  const [open, setOpen] = useState(false)
  const current = toasts[0] || null

  useEffect(() => {
    setOpen(Boolean(current))
  }, [current])

  const handleClose = () => {
    setOpen(false)
    setToasts(prev => prev.slice(1))
  }

  if (!current) return null

  return (
    <Snackbar open={open} autoHideDuration={3200} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert onClose={handleClose} severity={current.type === 'error' ? 'error' : 'success'} sx={{ width: '100%' }}>
        {current.message}
      </Alert>
    </Snackbar>
  )
}
