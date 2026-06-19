import { useMemo } from 'react'

/**
 * SafeZoneOverlay Component
 * Visualizes the safe zone boundaries (5% margin from edges) on frame preview
 */
function SafeZoneOverlay({ dimensions, invalidSlots = [] }) {
  const SAFE_MARGIN = 5 // 5% margin

  // Calculate safe zone boundaries
  const safeZone = useMemo(() => ({
    left: SAFE_MARGIN,
    top: SAFE_MARGIN,
    right: 100 - SAFE_MARGIN,
    bottom: 100 - SAFE_MARGIN,
    width: 100 - (SAFE_MARGIN * 2),
    height: 100 - (SAFE_MARGIN * 2)
  }), [])

  return (
    <div style={styles.container}>
      {/* Danger zones (outside safe zone) - semi-transparent red overlay */}
      <div style={{...styles.dangerZone, ...styles.dangerZoneTop}} />
      <div style={{...styles.dangerZone, ...styles.dangerZoneBottom}} />
      <div style={{...styles.dangerZone, ...styles.dangerZoneLeft}} />
      <div style={{...styles.dangerZone, ...styles.dangerZoneRight}} />

      {/* Safe zone border */}
      <div style={{
        ...styles.safeZoneBorder,
        left: `${safeZone.left}%`,
        top: `${safeZone.top}%`,
        width: `${safeZone.width}%`,
        height: `${safeZone.height}%`
      }}>
        {/* Corner markers */}
        <div style={{...styles.cornerMarker, ...styles.cornerTopLeft}} />
        <div style={{...styles.cornerMarker, ...styles.cornerTopRight}} />
        <div style={{...styles.cornerMarker, ...styles.cornerBottomLeft}} />
        <div style={{...styles.cornerMarker, ...styles.cornerBottomRight}} />

        {/* Safe zone label */}
        <div style={styles.safeZoneLabel}>
          SAFE ZONE (5% margin)
        </div>
      </div>

      {/* Dimension labels */}
      {dimensions && (
        <>
          <div style={styles.dimensionLabel}>
            {dimensions.width} × {dimensions.height} px
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 10
  },

  dangerZone: {
    position: 'absolute',
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px dashed rgba(239, 68, 68, 0.4)',
    pointerEvents: 'none'
  },

  dangerZoneTop: {
    top: 0,
    left: 0,
    right: 0,
    height: '5%'
  },

  dangerZoneBottom: {
    bottom: 0,
    left: 0,
    right: 0,
    height: '5%'
  },

  dangerZoneLeft: {
    top: '5%',
    left: 0,
    bottom: '5%',
    width: '5%'
  },

  dangerZoneRight: {
    top: '5%',
    right: 0,
    bottom: '5%',
    width: '5%'
  },

  safeZoneBorder: {
    position: 'absolute',
    border: '2px dashed rgba(16, 185, 129, 0.6)',
    boxSizing: 'border-box',
    pointerEvents: 'none'
  },

  cornerMarker: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    border: '3px solid #10b981',
    pointerEvents: 'none'
  },

  cornerTopLeft: {
    top: '-3px',
    left: '-3px',
    borderRight: 'none',
    borderBottom: 'none'
  },

  cornerTopRight: {
    top: '-3px',
    right: '-3px',
    borderLeft: 'none',
    borderBottom: 'none'
  },

  cornerBottomLeft: {
    bottom: '-3px',
    left: '-3px',
    borderRight: 'none',
    borderTop: 'none'
  },

  cornerBottomRight: {
    bottom: '-3px',
    right: '-3px',
    borderLeft: 'none',
    borderTop: 'none'
  },

  safeZoneLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(16, 185, 129, 0.9)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    pointerEvents: 'none',
    whiteSpace: 'nowrap'
  },

  dimensionLabel: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '600',
    pointerEvents: 'none'
  }
}

export default SafeZoneOverlay
