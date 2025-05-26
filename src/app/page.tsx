'use client'

import { useState } from 'react'
import QRCodeGenerator from '@/components/QRCodeGenerator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Gerador de QR Code
          </h1>
          <p className="text-lg text-gray-600">
            Transforme qualquer URL em um QR Code de forma rápida e fácil
          </p>
        </div>
        
        <QRCodeGenerator />
      </div>
    </main>
  )
}