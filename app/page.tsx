import { Button } from '@/components/ui/button'
import CompanionCard from '@/components/ui/CompanionCard'
import CompanionList from '@/components/ui/CompanionList'
import CTA from '@/components/ui/CTA'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1 className='text-2xl underline'>Popular Companions</h1>
      <section className="home-section">
        <CompanionCard 
        id="123"
        name="Neura the Brainy Explorer"
        topic="Neural Network of the brain"
        subject="Neuroscience"
        duration={45}
        color="#ffda62"
        />
        <CompanionCard 
        id="123"
        name="Countsy the Number Wizard"
        topic="Derivatives & integrals"
        subject="Science"
        duration={30}
        color="#efd0ff"
        />
        <CompanionCard 
        id="789"
        name="Verba the Vocabulary Builder"
        topic="Language "
        subject="English Literature"
        duration={30}
        color="#bde7ff"
        />
      </section>

      <section className='home-section"'>
        <CompanionList 
        title="Recent completed Sessions"
        companions={recentSessions}
        classNames="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  )
}

export default Page