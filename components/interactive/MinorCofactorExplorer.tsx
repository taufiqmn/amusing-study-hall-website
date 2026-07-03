'use client'

import { useState } from 'react'
import MatrixDisplay from '@/components/MatrixDisplay'

function det2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

function det3(m: number[][]): number {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  )
}

function getMinorMatrix(A: number[][], i: number, j: number): number[][] {
  return A.filter((_, r) => r !== i).map(row => row.filter((_, c) => c !== j))
}

function getMinorValue(A: number[][], i: number, j: number): number {
  const m = getMinorMatrix(A, i, j)
  return m.length === 2 ? det2(m) : det3(m)
}

function getCofactor(A: number[][], i: number, j: number): number {
  return Math.pow(-1, i + j) * getMinorValue(A, i, j)
}

function buildCofactorMatrix(A: number[][]): number[][] {
  return A.map((row, i) => row.map((_, j) => getCofactor(A, i, j)))
}

function transposeMatrix(A: number[][]): number[][] {
  return A[0].map((_, j) => A.map(row => row[j]))
}

const DEFAULT_3X3 = [[2, 3, 1], [4, 5, 6], [1, 2, 3]]
const DEFAULT_2X2 = [[3, 2], [1, 4]]
const DEFAULT_4X4 = [[2, 1, 0, 3], [1, 3, 2, 0], [0, 2, 1, 4], [3, 0, 1, 2]]

export default function MinorCofactorExplorer() {
  const [size, setSize] = useState<2 | 3 | 4>(3)
  const [selectedI, setSelectedI] = useState<number | null>(null)
  const [selectedJ, setSelectedJ] = useState<number | null>(null)
  const [showFull, setShowFull] = useState(false)

  const matrix = size === 2 ? DEFAULT_2X2 : size === 3 ? DEFAULT_3X3 : DEFAULT_4X4
  const n = matrix.length

  const handleCell = (i: number, j: number) => {
    setSelectedI(i)
    setSelectedJ(j)
    setShowFull(false)
  }

  const submatrix = selectedI !== null && selectedJ !== null
    ? getMinorMatrix(matrix, selectedI, selectedJ)
    : null

  const minorVal = selectedI !== null && selectedJ !== null
    ? getMinorValue(matrix, selectedI, selectedJ)
    : null

  const cofactorVal = selectedI !== null && selectedJ !== null
    ? getCofactor(matrix, selectedI, selectedJ)
    : null

  const sign = selectedI !== null && selectedJ !== null
    ? Math.pow(-1, selectedI + selectedJ)
    : null

  const cofactorMatrix = buildCofactorMatrix(matrix)
  const adjugate = transposeMatrix(cofactorMatrix)

  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, padding: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>🔬 Interactive Minor & Cofactor Explorer</p>
      <p style={{ fontSize: 12, opacity: 0.65, marginBottom: 14 }}>Click any cell to see its minor and cofactor calculated step by step</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([2, 3, 4] as const).map(s => (
          <button
            key={s}
            onClick={() => { setSize(s); setSelectedI(null); setSelectedJ(null); setShowFull(false) }}
            style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', background: size === s ? 'var(--accent-gradient)' : 'var(--background)', color: size === s ? 'white' : 'var(--foreground)' }}
          >
            {s}×{s}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.6, margin: '0 0 8px', textTransform: 'uppercase' }}>Matrix A — click a cell</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 48px)`, gap: 4 }}>
            {matrix.map((row, i) =>
              row.map((val, j) => {
                const isSelected = i === selectedI && j === selectedJ
                const isCrossed = i === selectedI || j === selectedJ
                return (
                  <div
                    key={`${i}-${j}`}
                    onClick={() => handleCell(i, j)}
                    style={{
                      width: 48, height: 48, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isSelected ? 'rgba(124,77,255,0.35)' : isCrossed && selectedI !== null ? 'rgba(226,92,92,0.2)' : 'var(--background)',
                      border: `2px solid ${isSelected ? '#7c4dff' : isCrossed && selectedI !== null ? '#e25c5c' : 'var(--card-border)'}`,
                      color: isSelected ? '#f5f3ff' : isCrossed && selectedI !== null ? '#e25c5c' : 'var(--foreground)',
                      textDecoration: isCrossed && selectedI !== null && !isSelected ? 'line-through' : 'none',
                      opacity: isCrossed && selectedI !== null && !isSelected ? 0.6 : 1,
                    }}
                  >
                    {val}
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', opacity: 0.6, margin: '0 0 8px', textTransform: 'uppercase' }}>Sign pattern</p>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 48px)`, gap: 4 }}>
            {matrix.map((row, i) =>
              row.map((_, j) => {
                const positive = (i + j) % 2 === 0
                const isHighlighted = i === selectedI && j === selectedJ
                return (
                  <div
                    key={`sign-${i}-${j}`}
                    style={{
                      width: 48, height: 48, borderRadius: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 800,
                      background: isHighlighted ? (positive ? 'rgba(79,195,161,0.25)' : 'rgba(226,92,92,0.25)') : 'var(--background)',
                      border: `2px solid ${isHighlighted ? (positive ? '#4FC3A1' : '#e25c5c') : 'var(--card-border)'}`,
                      color: positive ? '#4FC3A1' : '#e25c5c',
                      transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {positive ? '+' : '−'}
                  </div>
                )
              })
            )}
          </div>
          <p style={{ fontSize: 10, opacity: 0.55, margin: '8px 0 0' }}>Even (i+j) = + · Odd (i+j) = −</p>
        </div>
      </div>

      {selectedI !== null && selectedJ !== null && submatrix && (
        <div style={{ background: 'var(--background)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 12px' }}>
            Position ({selectedI + 1},{selectedJ + 1}) — step by step
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 11, opacity: 0.65, margin: '0 0 6px' }}>After deleting row {selectedI + 1} & col {selectedJ + 1}:</p>
              <MatrixDisplay data={submatrix} label={`Submatrix for M${selectedI + 1}${selectedJ + 1}`} />
            </div>
          </div>

          <div style={{ fontSize: 13, lineHeight: 1.8 }}>
            <p>
              <strong>Minor M{selectedI + 1}{selectedJ + 1}</strong> = det(submatrix) = <span style={{ color: '#F3CB4B', fontWeight: 800 }}>{minorVal}</span>
            </p>
            <p>
              Sign = (−1)^({selectedI + 1}+{selectedJ + 1}) = (−1)^{selectedI + selectedJ + 2} = <span style={{ color: sign! >= 0 ? '#4FC3A1' : '#e25c5c', fontWeight: 700 }}>{sign! >= 0 ? '+1' : '−1'}</span>
            </p>
            <p>
              <strong>Cofactor C{selectedI + 1}{selectedJ + 1}</strong> = {sign! >= 0 ? '+1' : '−1'} × {minorVal} = <span style={{ color: cofactorVal! >= 0 ? '#4FC3A1' : '#e25c5c', fontWeight: 800, fontSize: 15 }}>{cofactorVal}</span>
            </p>
            <p style={{ fontSize: 11, opacity: 0.65 }}>
              {selectedI + 1}+{selectedJ + 1}={selectedI + selectedJ + 2} → {(selectedI + selectedJ) % 2 === 0 ? 'even → positive ✓' : 'odd → negative ✓'}
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowFull(!showFull)}
        style={{ fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'var(--accent-gradient)', color: 'white', cursor: 'pointer', marginBottom: showFull ? 16 : 0 }}
      >
        {showFull ? 'Hide' : 'Show'} full cofactor matrix & adjugate
      </button>

      {showFull && (
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cofactor matrix</p>
            <MatrixDisplay data={cofactorMatrix} label="All cofactors Cᵢⱼ" />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, opacity: 0.7, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Adjugate adj(A)</p>
            <MatrixDisplay data={adjugate} label="Transpose of cofactor matrix" />
          </div>
        </div>
      )}
    </div>
  )
}