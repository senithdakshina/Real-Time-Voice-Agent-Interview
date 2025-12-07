import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview-Ready with AI powerd Practice and Feedback</h2>
          <p className='text-lg'> 
            Practice on real interview questions & get instence feedback
          </p>
          <Button asChild className='btn-primary maxc-sm:w-full'></Button>
          <Link href="/interview">Start an Interview</Link>
        </div>

      </section>
    </>
  )
}

export default page
