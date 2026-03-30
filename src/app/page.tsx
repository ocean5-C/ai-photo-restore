'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

type ProcessingStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'error'

interface RestoreResult {
  inputUrl: string
  outputUrl: string
  processingTime: number
}

export default function Home() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [result, setResult] = useState<RestoreResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showCompare, setShowCompare] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }, [])

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('请上传图片文件（JPG、PNG、WebP）')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('图片大小不能超过 10MB')
      return
    }

    setSelectedFile(file)
    setErrorMessage('')
    setResult(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRestore = async () => {
    if (!selectedFile) return

    setStatus('uploading')
    setErrorMessage('')

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', selectedFile)

      // Call API
      const response = await fetch('/api/restore', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('处理失败，请重试')
      }

      const data = await response.json()

      setStatus('completed')
      setResult({
        inputUrl: previewUrl,
        outputUrl: data.outputUrl,
        processingTime: data.processingTime,
      })
      setShowCompare(true)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : '处理出错')
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setStatus('idle')
    setResult(null)
    setErrorMessage('')
    setShowCompare(false)
  }

  const handleDownload = () => {
    if (!result) return
    const link = document.createElement('a')
    link.href = result.outputUrl
    link.download = 'restored-photo.png'
    link.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="py-6 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              ✨
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Photo Restore</h1>
              <p className="text-xs text-slate-500">老照片修复与上色</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">功能</a>
            <a href="#how" className="text-slate-600 hover:text-blue-600 transition-colors">如何使用</a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              开始使用
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            让珍贵的回忆
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">重现光彩</span>
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            使用先进的人工智能技术，一键修复破损、褪色的老照片。
            无需任何技术背景，轻松让旧照片焕然一新。
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              免费使用
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              AI 驱动
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              隐私保护
            </span>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-8 px-4" id="how">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!result ? (
              <>
                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-auto"
                        />
                      </div>
                      <button
                        onClick={handleReset}
                        className="text-slate-500 hover:text-slate-700 text-sm"
                      >
                        重新选择图片
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-600 mb-2">拖拽图片到这里，或</p>
                      <label className="inline-block">
                        <span className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer inline-block">
                          选择图片
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleInputChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-slate-400 mt-4">支持 JPG、PNG、WebP，最大 10MB</p>
                    </>
                  )}
                </div>

                {errorMessage && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-6">
                  <button
                    onClick={handleRestore}
                    disabled={!selectedFile || status === 'uploading' || status === 'processing'}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      !selectedFile || status === 'uploading' || status === 'processing'
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {status === 'uploading' || status === 'processing' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {status === 'uploading' ? '上传中...' : 'AI 修复中...'}
                      </span>
                    ) : (
                      '✨ 一键修复'
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Result Section */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">修复完成！</h3>
                  <span className="text-sm text-slate-500">处理时间: {result.processingTime}秒</span>
                </div>

                {/* Before/After Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-2 text-center">修复前</p>
                    <div className="relative rounded-lg overflow-hidden bg-slate-100">
                      <img src={result.inputUrl} alt="Before" className="w-full" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2 text-center">修复后</p>
                    <div className="relative rounded-lg overflow-hidden bg-slate-100">
                      <img src={result.outputUrl} alt="After" className="w-full" />
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  下载修复后的图片
                </button>

                {/* Try Another */}
                <button
                  onClick={handleReset}
                  className="w-full text-slate-600 py-3 hover:text-slate-900 transition-colors"
                >
                  继续修复其他照片 →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4" id="features">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-12">核心功能</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🔧
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">智能修复</h4>
              <p className="text-slate-600 text-sm">
                自动检测并修复照片上的划痕、折痕、污渍等损伤，还原清晰画质
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                🎨
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">黑白上色</h4>
              <p className="text-slate-600 text-sm">
                AI 智能识别场景和人物，为黑白照片自然上色
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                ⚡
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">快速处理</h4>
              <p className="text-slate-600 text-sm">
                先进的 AI 模型，快速完成照片修复，无需等待
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center text-sm text-slate-500">
          <p>© 2026 AI Photo Restore. 让珍贵的回忆重现光彩。</p>
        </div>
      </footer>
    </main>
  )
}