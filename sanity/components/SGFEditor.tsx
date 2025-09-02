'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StringInputProps, PatchEvent, set } from 'sanity'
import { Button, Card, Flex, Stack, Text, TextArea } from '@sanity/ui'

type SGFEditorProps = StringInputProps

export default function SGFEditor(props: SGFEditorProps) {
  const { onChange, value = '', readOnly } = props
  const [viewMode, setViewMode] = useState<'text' | 'editor'>('text')
  const [besogoLoaded, setBesogoLoaded] = useState(false)
  const [loadingBesogo, setLoadingBesogo] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load BesoGo library
  const loadBesoGo = useCallback(async () => {
    if (window.besogo || loadingBesogo) {
      setBesogoLoaded(true)
      return
    }

    setLoadingBesogo(true)

    try {
      // Check if already loaded
      if (window.besogo) {
        setBesogoLoaded(true)
        setLoadingBesogo(false)
        return
      }

      // Load CSS files
      const cssFiles = [
        'https://cdn.jsdelivr.net/npm/besogo@latest/css/besogo.css',
        'https://cdn.jsdelivr.net/npm/besogo@latest/css/board-wood.css',
      ]

      await Promise.all(
        cssFiles.map((href) => {
          return new Promise((resolve, reject) => {
            const existingLink = document.querySelector(`link[href="${href}"]`)
            if (existingLink) {
              resolve(null)
              return
            }

            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = href
            link.onload = () => resolve(null)
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))
            document.head.appendChild(link)
          })
        })
      )

      // Load JavaScript
      if (!document.querySelector('script[src*="besogo.all.js"]')) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://cdn.jsdelivr.net/npm/besogo@latest/besogo.all.js'
          script.onload = () => {
            // Fix BesoGo stone rendering for SVG mode
            if (window.besogo?.realStone && window.besogo?.svgStone) {
              window.besogo.realStone = window.besogo.svgStone
            }

            // Add CSS for BesoGo's SVG stone styling
            const styleOverride = document.createElement('style')
            styleOverride.textContent = `
              /* Hide broken image stones */
              .besogo-board img[src*="black"],
              .besogo-board img[src*="white"] {
                display: none !important;
              }
              
              /* Style SVG stones */
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
            `
            document.head.appendChild(styleOverride)

            resolve(null)
          }
          script.onerror = () => reject(new Error('Failed to load BesoGo JS'))
          document.head.appendChild(script)
        })
      }

      setBesogoLoaded(true)
    } catch (error) {
      console.error('Failed to load BesoGo in Studio:', error)
    } finally {
      setLoadingBesogo(false)
    }
  }, [loadingBesogo])

  // Initialize BesoGo editor using simple approach
  const initializeBesogo = useCallback(() => {
    if (!containerRef.current || !window.besogo || !besogoLoaded) return

    // Clear container
    containerRef.current.innerHTML = ''

    try {
      const sgfContent = value && value.trim() ? value : '(;FF[4]GM[1]SZ[19])'

      // Set up container for BesoGo
      containerRef.current.innerHTML = sgfContent
      containerRef.current.className = 'besogo-editor'
      containerRef.current.setAttribute('realstones', 'false')
      containerRef.current.setAttribute('panels', 'control+comment+names+file')
      containerRef.current.setAttribute('size', '19')
      containerRef.current.setAttribute('coord', 'western')
      containerRef.current.setAttribute('tool', 'auto')
      containerRef.current.style.width = '100%'
      containerRef.current.style.minHeight = '500px'

      if (!window.besogo?.create) {
        throw new Error('BesoGo create function not available')
      }

      // Create BesoGo editor with file panel (which includes Save button)
      window.besogo.create(containerRef.current, {
        panels: 'control+comment+names+file',
        tool: 'auto',
        realstones: false,
        coord: 'western',
        size: '19',
      })
    } catch (error) {
      console.error('Failed to initialize BesoGo editor:', error)
      containerRef.current.innerHTML = `
        <div style="padding: 16px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px;">
          <strong>Editor Error:</strong> Failed to initialize BesoGo editor.
          <br><small>${error instanceof Error ? error.message : String(error)}</small>
        </div>
      `
    }
  }, [besogoLoaded, value])

  // Extract SGF by intercepting BesoGo's save function
  const extractSGF = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      if (!containerRef.current) {
        resolve(value || '(;FF[4]GM[1]SZ[19])')
        return
      }

      try {
        // Find BesoGo's built-in Save button
        const filePanel = containerRef.current.querySelector('.besogo-file')
        if (!filePanel) {
          console.warn('No file panel found - cannot extract SGF')
          resolve(value || '(;FF[4]GM[1]SZ[19])')
          return
        }

        const saveButton = filePanel.querySelector(
          'input[type="button"][value="Save"]'
        ) as HTMLInputElement
        if (!saveButton || !saveButton.onclick) {
          console.warn('No save button found - cannot extract SGF')
          resolve(value || '(;FF[4]GM[1]SZ[19])')
          return
        }

        // Override the global prompt function to capture the filename and prevent the dialog
        const originalPrompt = window.prompt
        let sgfContent: string | null = null

        // Override prompt to return a filename without showing dialog
        window.prompt = function (message?: string, defaultValue?: string) {
          return defaultValue || 'export.sgf'
        }

        // Override createElement to intercept the download link creation
        const originalCreateElement = document.createElement
        document.createElement = function (tagName: string) {
          const element = originalCreateElement.call(this, tagName)
          if (tagName.toLowerCase() === 'a') {
            // Override the click method for anchor elements
            const anchor = element as HTMLAnchorElement
            const originalAnchorClick = anchor.click
            anchor.click = function () {
              if (this.download && this.href.startsWith('blob:')) {
                // This is a download link - prevent it and capture the content
                fetch(this.href)
                  .then((response) => response.text())
                  .then((text) => {
                    sgfContent = text
                    // Clean up the blob URL
                    URL.revokeObjectURL(this.href)
                  })
                  .catch((err) => console.error('Failed to read blob:', err))
                return
              }
              return originalAnchorClick.call(this)
            }
          }
          return element
        }

        // Trigger the save button
        saveButton.click()

        // Wait a bit for any async operations to complete
        setTimeout(() => {
          // Restore original functions
          window.prompt = originalPrompt
          document.createElement = originalCreateElement
          resolve(sgfContent || value || '(;FF[4]GM[1]SZ[19])')
        }, 100)
      } catch (error) {
        console.error('Failed to extract SGF:', error)
        resolve(value || '(;FF[4]GM[1]SZ[19])')
      }
    })
  }, [value])

  // Handle view mode change
  const handleViewModeChange = async (mode: 'text' | 'editor') => {
    if (mode === 'editor' && viewMode === 'text') {
      // Switching to editor mode - load BesoGo if needed
      loadBesoGo()
    } else if (mode === 'text' && viewMode === 'editor') {
      // Switching to text mode - extract SGF if possible
      try {
        const extractedSGF = await extractSGF()

        if (extractedSGF && extractedSGF !== value) {
          onChange(PatchEvent.from(set(extractedSGF)))
        }
      } catch (error) {
        console.error('Failed to extract SGF when switching modes:', error)
      }
    }
    setViewMode(mode)
  }

  // Initialize editor when switching to editor mode
  useEffect(() => {
    if (viewMode === 'editor' && besogoLoaded) {
      // Small delay to ensure DOM is ready
      setTimeout(initializeBesogo, 100)
    }
  }, [viewMode, besogoLoaded, initializeBesogo])

  // Handle text area change
  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(PatchEvent.from(set(event.target.value)))
    },
    [onChange]
  )

  // Save SGF from editor using BesoGo's built-in save functionality
  const handleSaveFromEditor = useCallback(async () => {
    if (!containerRef.current) {
      alert('Editor not available. Please switch to Text Editor mode.')
      return
    }

    try {
      const extractedSGF = await extractSGF()

      if (extractedSGF && extractedSGF !== value) {
        onChange(PatchEvent.from(set(extractedSGF)))
        alert('SGF successfully saved from visual editor!')
      } else if (extractedSGF === value) {
        alert('No changes detected in the visual editor')
      } else {
        alert('Failed to extract valid SGF from editor')
      }
    } catch (error) {
      console.error('Error saving SGF:', error)
      alert('Error occurred while saving SGF from visual editor')
    }
  }, [extractSGF, onChange, value])

  return (
    <Stack space={3}>
      {/* Toggle buttons */}
      <Flex gap={2}>
        <Button
          mode={viewMode === 'text' ? 'default' : 'ghost'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleViewModeChange('text')
          }}
          text="Text Editor"
        />
        <Button
          mode={viewMode === 'editor' ? 'default' : 'ghost'}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleViewModeChange('editor')
          }}
          text="Visual Editor"
          disabled={readOnly}
        />
        {viewMode === 'editor' && besogoLoaded && (
          <Button
            tone="primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSaveFromEditor()
            }}
            text="Save SGF"
            disabled={readOnly}
          />
        )}
      </Flex>

      {/* Text mode */}
      {viewMode === 'text' && (
        <TextArea
          value={value}
          onChange={handleTextChange}
          placeholder="(;FF[4]GM[1]SZ[19];B[pd];W[dd])"
          rows={8}
          readOnly={readOnly}
        />
      )}

      {/* Editor mode */}
      {viewMode === 'editor' && (
        <Card padding={0} style={{ minHeight: '500px', border: '1px solid #ddd' }}>
          {loadingBesogo && (
            <Flex align="center" justify="center" style={{ height: '500px' }}>
              <Text>Loading BesoGo editor...</Text>
            </Flex>
          )}
          {!loadingBesogo && !besogoLoaded && (
            <Flex align="center" justify="center" style={{ height: '500px' }}>
              <Text>Click &ldquo;Visual Editor&rdquo; to load BesoGo</Text>
            </Flex>
          )}
          <div
            ref={containerRef}
            style={{
              width: '100%',
              minHeight: '500px',
              display: besogoLoaded ? 'block' : 'none',
            }}
          />
        </Card>
      )}

      {/* Help text */}
      {viewMode === 'text' && (
        <Text size={1} muted>
          Paste SGF content here. Format: (;FF[4]GM[1]SZ[19];B[pd];W[dd]...)
        </Text>
      )}
      {viewMode === 'editor' && besogoLoaded && (
        <Text size={1} muted>
          Use the visual editor to create or modify your Go game. Click &ldquo;Save SGF&rdquo; to
          update the text field with your changes.
        </Text>
      )}
    </Stack>
  )
}
