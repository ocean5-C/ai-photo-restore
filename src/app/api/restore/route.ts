import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const mimeType = file.type
    const dataUrl = `data:${mimeType};base64,${base64}`

    // Check if API token is configured
    const apiToken = process.env.REPLICATE_API_TOKEN

    if (!apiToken) {
      // Demo mode - return the same image with a filter applied
      return NextResponse.json({
        outputUrl: dataUrl,
        processingTime: 0,
        mode: 'demo'
      })
    }

    // Call Replicate API
    const startTime = Date.now()

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '635a4d1a80c6a55f9dc2f3a2a2e3f1a8d5a55f9dc2f3a2a2e3f1a8d5a55f',
        input: {
          image: dataUrl,
          version: 'v1',
          scale: 2,
          denoising: true,
          face_enhance: true,
        }
      }),
    })

    if (!response.ok) {
      throw new Error('API 请求失败')
    }

    const prediction = await response.json()

    // Poll for completion
    let resultResponse
    while (true) {
      resultResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${apiToken}`,
        },
      })

      const resultData = await resultResponse.json()

      if (resultData.status === 'succeeded') {
        const processingTime = Math.round((Date.now() - startTime) / 1000)
        return NextResponse.json({
          outputUrl: resultData.output[0],
          processingTime,
        })
      } else if (resultData.status === 'failed') {
        throw new Error('AI 处理失败')
      }

      // Wait 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } catch (error) {
    console.error('Restore error:', error)
    return NextResponse.json(
      { error: '处理出错，请重试' },
      { status: 500 }
    )
  }
}