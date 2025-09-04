'use client'

import React from 'react'
import { type ObjectInputProps } from 'sanity'
import { Card, Stack, Text, Flex } from '@sanity/ui'

// This is a preview component that shows in Sanity Studio
// The actual DualPanelEditor will be used on the frontend
export default function DualPanelPreview(props: ObjectInputProps) {
  const { value } = props

  const sgfContent = value?.sgf?.sgfContent
  const content = value?.content
  const title = value?.title || value?.sgf?.title
  const layout = value?.layout || 'sgf-left'

  return (
    <Card padding={4} border radius={2}>
      <Stack space={4}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold">
            {title || 'Dual Panel Content'}
          </Text>
          <Text size={1} muted>
            {layout === 'sgf-left' ? 'Board | Content' : 'Content | Board'}
          </Text>
        </Flex>

        {/* Preview Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            minHeight: '200px',
          }}
        >
          {/* Left Panel Preview */}
          <Card padding={3} tone="default" border>
            <Stack space={2}>
              <Text size={1} weight="medium">
                {layout === 'sgf-left' ? '●○ Go Board' : '📝 Content'}
              </Text>
              {layout === 'sgf-left' ? (
                <div>
                  {sgfContent ? (
                    <div>
                      <Text size={0} muted>
                        SGF: {sgfContent.substring(0, 40)}...
                      </Text>
                      <div
                        style={{
                          width: '100%',
                          height: '120px',
                          background: '#f4f3f0',
                          border: '1px solid #d4b896',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '8px',
                        }}
                      >
                        <Text size={0} muted>
                          Go Board Preview
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <Text size={0} muted>
                      No SGF content configured
                    </Text>
                  )}
                </div>
              ) : (
                <div>
                  {content && content.length > 0 ? (
                    <div>
                      <Text size={0}>
                        {content[0]?.children?.[0]?.text?.substring(0, 60) || 'Rich text content'}
                        ...
                      </Text>
                    </div>
                  ) : (
                    <Text size={0} muted>
                      No content configured
                    </Text>
                  )}
                </div>
              )}
            </Stack>
          </Card>

          {/* Right Panel Preview */}
          <Card padding={3} tone="default" border>
            <Stack space={2}>
              <Text size={1} weight="medium">
                {layout === 'sgf-left' ? '📝 Content' : '●○ Go Board'}
              </Text>
              {layout === 'sgf-left' ? (
                <div>
                  {content && content.length > 0 ? (
                    <div>
                      <Text size={0}>
                        {content[0]?.children?.[0]?.text?.substring(0, 60) || 'Rich text content'}
                        ...
                      </Text>
                    </div>
                  ) : (
                    <Text size={0} muted>
                      No content configured
                    </Text>
                  )}
                </div>
              ) : (
                <div>
                  {sgfContent ? (
                    <div>
                      <Text size={0} muted>
                        SGF: {sgfContent.substring(0, 40)}...
                      </Text>
                      <div
                        style={{
                          width: '100%',
                          height: '120px',
                          background: '#f4f3f0',
                          border: '1px solid #d4b896',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '8px',
                        }}
                      >
                        <Text size={0} muted>
                          Go Board Preview
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <Text size={0} muted>
                      No SGF content configured
                    </Text>
                  )}
                </div>
              )}
            </Stack>
          </Card>
        </div>

        {/* Status */}
        <Flex justify="space-between">
          <Text size={0} muted>
            Dual Panel Content Block
          </Text>
          <Text size={0} muted>
            Will render with DualPanelEditor on frontend
          </Text>
        </Flex>
      </Stack>
    </Card>
  )
}
