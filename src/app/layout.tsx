import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Photo Restore - 一键修复老照片',
  description: '使用先进的人工智能技术，一键修复破损、褪色的老照片，让珍贵的回忆重现光彩',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}