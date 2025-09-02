'use client'

import React, { useState } from 'react'
import DualPanelEditor from './DualPanelEditor'
import { type PortableTextBlock } from '@portabletext/react'

// Example usage component
export default function DualPanelEditorExample() {
  const [sgfContent, setSgfContent] = useState(`(;FF[4]GM[1]SZ[19]AP[SGFC:1.17]

GN[Example Game]
PB[Black Player]
PW[White Player]
KM[6.5]
RE[B+2.5]

;B[pd];W[dd];B[pq];W[dp];B[fq];W[cn];B[jp];W[qf]
;B[nc];W[rd];B[qc];W[qi];B[qk];W[oi];B[ok];W[mi]
;B[mk];W[ki];B[ik];W[ii];B[gk];W[gi];B[ek];W[ci]
;B[cg];W[ei];B[bg];W[bi];B[dg];W[fg];B[ff];W[gg]
;B[gf];W[hf];B[he];W[if];B[ie];W[je];B[jd];W[ke])`)

  const [portableTextContent] = useState<PortableTextBlock[]>([
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'This is an example Go game demonstrating a complex middle game position.',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'Key points to analyze:',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [
        {
          _type: 'span',
          text: 'The black group on the right side is still not completely secure',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [
        {
          _type: 'span',
          text: 'White has built a strong influence in the center',
        },
      ],
    },
    {
      _type: 'block',
      listItem: 'bullet',
      children: [
        {
          _type: 'span',
          text: 'The bottom left corner still has potential for expansion',
        },
      ],
    },
    {
      _type: 'block',
      children: [
        {
          _type: 'span',
          text: 'This position demonstrates the importance of balancing territory and influence in Go.',
        },
      ],
    },
  ])

  const handleSgfChange = (newSgf: string) => {
    setSgfContent(newSgf)
    console.log('SGF updated:', newSgf)
  }

  const handlePortableTextChange = (newContent: PortableTextBlock[]) => {
    console.log('Portable Text updated:', newContent)
    // In a real application, you would update the content state here
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Dual Panel Editor Demo</h1>

      <div style={{ marginBottom: '20px' }}>
        <h2>Default Configuration</h2>
        <DualPanelEditor
          sgfContent={sgfContent}
          portableTextContent={portableTextContent}
          title="Example Go Game Analysis"
          onSgfChange={handleSgfChange}
          onPortableTextChange={handlePortableTextChange}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Minimal Configuration (No Header, No Labels)</h2>
        <DualPanelEditor
          sgfContent={sgfContent}
          portableTextContent={portableTextContent}
          showHeader={false}
          showLabels={false}
          minHeight="300px"
          allowLayoutToggle={false}
          defaultLayout="sgf-right"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Read-Only Configuration</h2>
        <DualPanelEditor
          sgfContent={sgfContent}
          portableTextContent={portableTextContent}
          title="Read-Only Game Analysis"
          // No onChange handlers = read-only mode
        />
      </div>
    </div>
  )
}
