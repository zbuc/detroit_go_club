'use client'

import { useEffect, useRef } from 'react'
import type { BesogoInstance } from '../types/besogo'

interface SGFViewerProps {
  sgfContent: string
  title?: string
  boardSize?: string
  customSize?: string
  showControls?: boolean
  showCoordinates?: boolean
  showVariants?: boolean | number // true = 0 (child variants), false = 2 (hidden), or specific 0-3 value
  className?: string
}

export default function SGFViewer({
  sgfContent,
  title,
  boardSize = '19',
  customSize,
  showControls = true,
  showCoordinates = true,
  showVariants = true, // Enable variant display by default
  className = '',
}: SGFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const besogoRef = useRef<BesogoInstance | null>(null)

  useEffect(() => {
    const loadBesoGo = async () => {
      if (!containerRef.current) return

      // Clear previous instance
      if (besogoRef.current) {
        besogoRef.current.destroy?.()
      }

      // Clear container
      containerRef.current.innerHTML = ''

      try {
        // Load BesoGo from CDN (since npm package is empty)
        await loadFromCDN()

        // Now initialize with the loaded library
        initializeBesoGo()
      } catch (error) {
        console.error('Failed to load BesoGo:', error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="sgf-error p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p class="font-semibold">Failed to load SGF viewer</p>
              <p class="text-sm mt-1">BesoGo library could not be loaded.</p>
              <details class="mt-2">
                <summary class="cursor-pointer text-sm">View SGF Content</summary>
                <pre class="text-xs bg-gray-100 p-2 mt-1 rounded overflow-x-auto">${sgfContent}</pre>
              </details>
            </div>
          `
        }
      }
    }

    const initializeBesoGo = () => {
      if (!containerRef.current) return

      const size = boardSize === 'custom' && customSize ? customSize : boardSize
      // Configure panels for viewing mode (no editing tools)
      const panels: string[] = []
      if (showControls) panels.push('control') // Navigation controls
      panels.push('names') // Player names
      panels.push('comment') // Move comments
      const coord = showCoordinates ? 'western' : 'none'

      // Convert showVariants prop to BesoGo variant style
      const variantStyle =
        typeof showVariants === 'number'
          ? showVariants
          : showVariants === true
            ? 0 // Show child variants with auto-markup
            : 2 // Hide auto-markup for child variants

      console.log('Initializing BesoGo with config:', {
        size: size || '19',
        coord,
        panels: panels.join(' '),
        variantStyle,
        sgfLength: sgfContent.length,
        sgfContent: sgfContent.substring(0, 100) + '...', // Show first 100 chars
      })

      console.log('Using direct container ref approach')

      // Clear the container and use it directly
      containerRef.current.innerHTML = ''
      containerRef.current.style.width = '100%'
      containerRef.current.style.minHeight = '400px'

      // BesoGo seems very picky about container elements. Let's go back to basics and use the blob URL approach with autoInit
      // since we know that works but we had the wrong approach before

      // Debug the SGF content first
      console.log('Raw SGF content received:')
      console.log(sgfContent)
      console.log('SGF content type:', typeof sgfContent)
      console.log('SGF content length:', sgfContent?.length)

      // Validate SGF format
      if (!sgfContent || typeof sgfContent !== 'string') {
        console.error('Invalid SGF content - not a string or empty')
        containerRef.current.innerHTML =
          '<div class="p-4 bg-red-50 text-red-700">Invalid SGF content</div>'
        return
      }

      // Keep SGF as-is since it comes from BesoGo docs and should work
      const cleanedSgf = sgfContent.trim()

      console.log('Cleaned SGF:')
      console.log(cleanedSgf)

      // Use autoInit approach as primary method since direct create has issues
      console.log('Using autoInit approach as primary method')

      // Clear container and create a simple div for BesoGo
      containerRef.current.innerHTML = ''
      containerRef.current.style.width = '100%'
      containerRef.current.style.minHeight = '400px'

      // Use BesoGo's direct embedding approach as documented
      if (window.besogo?.autoInit) {
        console.log('Using direct embedding with besogo-diagram class')
        const uniqueId = `besogo-${Date.now()}`

        // Escape HTML entities in SGF content for direct embedding
        const escapedSgf = cleanedSgf
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')

        console.log('Escaped SGF for direct embedding:', escapedSgf.substring(0, 100) + '...')

        // Note: sgfDataUri could be used for besogo-viewer approach if needed
        // const sgfDataUri = `data:application/x-go-sgf;charset=utf-8,${encodeURIComponent(cleanedSgf)}`

        // Use besogo-diagram as per docs - try with CSS stones first
        containerRef.current.innerHTML = `
          <div id="${uniqueId}-diagram" 
               class="besogo-diagram"
               realstones="false"
               panels="${panels.join(' ')}"
               size="${size || '19'}"
               coord="${coord}"
               theme="wood"
               variants="${variantStyle}"
               style="width: 100%; min-height: 400px; margin-top: 10px;">
            ${escapedSgf}
          </div>
        `

        setTimeout(() => {
          console.log('Calling window.besogo.autoInit()')
          window.besogo?.autoInit?.()

          // Check if the board was created successfully in either approach
          setTimeout(() => {
            const viewerBoardElement = document.querySelector(`#${uniqueId}-viewer .besogo-board`)
            const diagramBoardElement = document.querySelector(`#${uniqueId}-diagram .besogo-board`)
            const viewerStoneElements = document.querySelectorAll(
              `#${uniqueId}-viewer .besogo-stone`
            )
            const diagramStoneElements = document.querySelectorAll(
              `#${uniqueId}-diagram .besogo-stone`
            )

            console.log('After autoInit:')
            console.log('- Viewer board:', viewerBoardElement)
            console.log('- Viewer stones:', viewerStoneElements.length)
            console.log('- Diagram board:', diagramBoardElement)
            console.log('- Diagram stones:', diagramStoneElements.length)

            const totalStones = viewerStoneElements.length + diagramStoneElements.length
            const hasBoard = viewerBoardElement || diagramBoardElement

            if (hasBoard && totalStones > 0) {
              console.log('✅ SGF viewer loaded successfully with', totalStones, 'stones')
              if (viewerStoneElements.length > 0) {
                console.log('  → Viewer approach worked!')
              }
              if (diagramStoneElements.length > 0) {
                console.log('  → Diagram approach worked!')
              }
            } else if (hasBoard && totalStones === 0) {
              console.log('⚠️ Board created but no stones visible - SGF parsing may have failed')
              console.log('Raw SGF being used:', cleanedSgf.substring(0, 200) + '...')
            } else {
              console.log('❌ No board elements created - autoInit may have failed')
            }
          }, 1000)
        }, 200)
      } else {
        console.error('window.besogo.autoInit not available - cannot display SGF')
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 rounded text-red-700">
              <p><strong>SGF Viewer Error:</strong></p>
              <p class="text-sm mt-1">BesoGo autoInit method not available.</p>
            </div>
          `
        }
      }
    }

    const loadFromCDN = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.besogo) {
          resolve()
          return
        }

        // Load CSS first - including stone images CSS
        const cssFiles = [
          'https://cdn.jsdelivr.net/npm/besogo@latest/css/besogo.css',
          'https://cdn.jsdelivr.net/npm/besogo@latest/css/board-wood.css',
        ]

        const cssPromises = cssFiles.map((href) => {
          return new Promise<void>((resolveCss, rejectCss) => {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = href
            link.onload = () => resolveCss()
            link.onerror = () => rejectCss(new Error(`Failed to load CSS: ${href}`))
            document.head.appendChild(link)
          })
        })

        Promise.all(cssPromises)
          .then(() => {
            // Load JavaScript with correct jsdelivr URL
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/besogo@latest/besogo.all.js'
            script.onload = () => {
              console.log('BesoGo loaded from jsdelivr CDN')
              console.log('window.besogo available:', !!window.besogo)
              if (window.besogo) {
                console.log('window.besogo methods:', Object.keys(window.besogo))

                // Debug BesoGo's stone functions to understand their signatures
                if (window.besogo?.realStone) {
                  console.log('realStone function:', window.besogo.realStone.toString())
                }
                if (window.besogo?.svgStone) {
                  console.log('svgStone function:', window.besogo.svgStone.toString())
                }

                // Check BesoGo constants
                if (window.besogo && 'BLACK_STONES' in window.besogo) {
                  console.log(
                    'BesoGo BLACK_STONES:',
                    (window.besogo as unknown as { BLACK_STONES: unknown }).BLACK_STONES
                  )
                }
                if (window.besogo && 'WHITE_STONES' in window.besogo) {
                  console.log(
                    'BesoGo WHITE_STONES:',
                    (window.besogo as unknown as { WHITE_STONES: unknown }).WHITE_STONES
                  )
                }

                // Try multiple approaches to fix image loading

                // 1. Set BesoGo's global image path to CDN
                if (window.besogo && 'imgDir' in window.besogo) {
                  ;(window.besogo as unknown as { imgDir: string }).imgDir =
                    'https://cdn.jsdelivr.net/npm/besogo@latest/img/'
                  console.log('Set BesoGo imgDir to CDN')
                }
                if (window.besogo && 'imagesPath' in window.besogo) {
                  ;(window.besogo as unknown as { imagesPath: string }).imagesPath =
                    'https://cdn.jsdelivr.net/npm/besogo@latest/img/'
                  console.log('Set BesoGo imagesPath to CDN')
                }

                // BesoGo is ignoring realstones="false" - need to override realStone to use svgStone
                if (window.besogo?.realStone && window.besogo?.svgStone) {
                  console.log(
                    'Overriding realStone to use svgStone since realstones="false" is ignored'
                  )
                  window.besogo.realStone = window.besogo.svgStone
                  console.log('Set realStone = svgStone')
                }

                // Add CSS for BesoGo's SVG stone classes
                const styleOverride = document.createElement('style')
                styleOverride.textContent = `
                  /* Hide any broken image stones */
                  .besogo-board img[src*="black"],
                  .besogo-board img[src*="white"] {
                    display: none !important;
                  }
                  
                  /* Style BesoGo's SVG stone classes */
                  .besogo-svg-blackStone {
                    fill: #000000 !important;
                    stroke: #333333 !important;
                    stroke-width: 1 !important;
                  }
                  
                  .besogo-svg-whiteStone {
                    fill: #ffffff !important;
                    stroke: #000000 !important;
                    stroke-width: 2 !important;
                  }
                  
                  .besogo-svg-greyStone {
                    fill: #808080 !important;
                    stroke: #000000 !important;
                    stroke-width: 1 !important;
                  }
                `
                document.head.appendChild(styleOverride)
                console.log('Added minimal CSS to hide broken image stones')
              }
              resolve()
            }
            script.onerror = () => reject(new Error('Failed to load BesoGo JS from jsdelivr'))
            document.head.appendChild(script)
          })
          .catch(reject)
      })
    }

    loadBesoGo()

    return () => {
      const besogoInstance = besogoRef.current
      if (besogoInstance) {
        besogoInstance.destroy?.()
      }
    }
  }, [sgfContent, boardSize, customSize, showControls, showCoordinates, showVariants])

  if (!sgfContent) {
    return (
      <div className="sgf-error p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        <p>No SGF content provided</p>
      </div>
    )
  }

  return (
    <div className={`sgf-viewer-wrapper ${className}`}>
      {title && <h3 className="sgf-title text-lg font-semibold mb-4 text-gray-800">{title}</h3>}
      <div
        ref={containerRef}
        className={`sgf-container overflow-hidden bg-white shadow-sm ${className.includes('h-full') ? 'h-full' : ''}`}
        style={className.includes('h-full') ? { height: '100%' } : { minHeight: '400px' }}
      />
    </div>
  )
}
