import { getProviders } from '@/lib/api/provider'
import React from 'react'

export default function page() {
    const providers = getProviders()
    console.log("----providers-----", providers)
    
  return (
    <div className='text-black p-8'>
      provider
    </div>
  )
}
