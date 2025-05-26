'use client'

import { useState, useRef } from 'react'
import QRCode from 'qrcode'
import Image from 'next/image'

interface QRCodeGeneratorProps {}

export default function QRCodeGenerator(): JSX.Element {
  const [url, setUrl] = useState<string>('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const generateQRCode = async (): Promise<void> => {
    if (!url.trim()) {
      setError('Por favor, insira uma URL')
      return
    }

    if (!isValidUrl(url)) {
      setError('Por favor, insira uma URL válida (ex: https://www.google.com)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const qrCodeUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(qrCodeUrl)
    } catch (err) {
      setError('Erro ao gerar QR Code')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQRCode = (): void => {
    if (!qrCodeDataUrl) return

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrCodeDataUrl
    link.click()
  }

  const clearAll = (): void => {
    setUrl('')
    setQrCodeDataUrl('')
    setError('')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
            URL para converter em QR Code
          </label>
          <div className="flex gap-4">
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.exemplo.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  generateQRCode()
                }
              }}
            />
            <button
              onClick={generateQRCode}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isLoading ? 'Gerando...' : 'Gerar QR Code'}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* QR Code Display */}
        {qrCodeDataUrl && (
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
              <Image
                src={qrCodeDataUrl}
                alt="QR Code gerado"
                width={300}
                height={300}
                className="mx-auto"
              />
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={downloadQRCode}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-medium"
              >
                📥 Baixar PNG
              </button>
              <button
                onClick={clearAll}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all font-medium"
              >
                🗑️ Limpar
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>URL:</strong> {url}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!qrCodeDataUrl && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Como usar:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Digite ou cole uma URL válida no campo acima</li>
              <li>• Clique em &ldquo;Gerar QR Code&rdquo; ou pressione Enter</li>
              <li>• Escaneie o QR Code com seu celular ou baixe a imagem</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}