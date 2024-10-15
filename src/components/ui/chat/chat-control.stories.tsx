import type { Meta, StoryObj } from '@storybook/react'

import { ChatControl } from './chat-control'
import React from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UI/ChatControl',
  component: ChatControl,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatControl>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messages: [
      {
        content: 'Hello!',
        timestamp: '2022-01-01T00:00:00Z',
        role: 'assistant'
      },
      {
        content: 'Hi!',
        timestamp: '2022-01-01T00:00:01Z',
        role: 'user'
      }
    ],
    isLoading: false,
    isGenerating: false,
    input: '',
    onSubmit: () => {},
    onLoadMore: () => {}
  }
}

export const IsGenerating: Story = {
  args: {
    messages: [
      {
        content: 'Hello!',
        timestamp: '2022-01-01T00:00:00Z',
        role: 'assistant'
      },
      {
        content: 'Hi!',
        timestamp: '2022-01-01T00:00:01Z',
        role: 'user'
      }
    ],
    isLoading: false,
    isGenerating: true,
    input: '',
    onSubmit: () => {},
    onLoadMore: () => {}
  }
}