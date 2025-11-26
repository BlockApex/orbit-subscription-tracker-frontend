'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common/Button'

const sourcesData = [
  {
    id: 'bank',
    title: 'Connect Bank via (Plaid)',
    subtitle: 'Automatically detect recurring charges from your bank account',
    description: '',
    icon: '/assets/resources/1.svg',
  },
  {
    id: 'email',
    title: 'Connect Email',
    subtitle: 'Gmail, Outlook, etc.',
    description: 'Scan your inbox for subscription receipts',
    icon: '/assets/resources/2.svg',
  },
  {
    id: 'manual',
    title: 'Add Manually',
    subtitle: 'Enter subscriptions yourself with full control over details',
    description: 'Most flexible option',
    icon: '/assets/resources/3.svg',
  },
]

const Sources = () => {
  const [selectedSource, setSelectedSource] = useState<string>('')
  const router = useRouter()

  const handleContinue = () => {
    if (!selectedSource) return
    router.push('/import-subscriptions/manual')
  }

  return (
    <main className="w-full min-h-screen bg-gray-50 relative overflow-hidden p-4">

      <div className='mt-2'>
        <h5 className="text-xl font-normal text-black">
          Connect your sources
        </h5>
        <p className="text-base text-foreground mt-1">
          Choose how you&apos;d like to import your subscriptions
        </p>
      </div>
      {/* Source Options */}
      <div className="flex flex-col gap-4 mt-8">
        {sourcesData.map((src) => {
          const isActive = selectedSource === src.id
          return (
            <section
              key={src.id}
              onClick={() => setSelectedSource(src.id)}
              className={`w-full border rounded-xl p-4 relative cursor-pointer transition-all duration-200 ${isActive
                ? 'border-primary bg-gray-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-start gap-4">
                <Image src={src.icon} width={50} height={50} alt={src.title} />
                <div className="flex flex-col gap-1">
                  <h6 className="text-lg font-semibold text-black">
                    {src.title}
                  </h6>
                  <p className="text-base text-gray-600">{src.subtitle}</p>
                  <p className="text-base text-gray-600 mt-2">
                    {src.description}
                  </p>
                  {src.id === 'bank' ? (
                    <div className='flex items-center gap-4'>
                      <span className='text-sm px-4 py-1 bg-success/20 rounded-2xl text-success' >Recommended</span>
                      <span className='text-sm text-foreground'>Fast & secure</span>
                    </div>
                  ) : ''}
                </div>
              </div>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center absolute top-4 right-4 border ${isActive
                  ? 'border-primary bg-primary'
                  : 'border-gray-400 bg-white'
                  }`}
              >
                {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
              </span>
            </section>
          )
        })}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-2 left-0 right-0 p-2 flex justify-center">
        <Button
          variant="primary"
          size="full"
          disabled={!selectedSource}
          onClick={handleContinue}
          className={`flex items-center gap-4 ${!selectedSource ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          Continue <ArrowRight size={17} />
        </Button>
      </div>
    </main>
  )
}

export default Sources
