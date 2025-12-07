import { Mona_Sans } from "next/font/google";
import React, { ReactNode } from 'react'
import Image from "next/image";
import Link from "next/link";
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const Rootlayout = ({children} :{children: ReactNode}) => {
  return (
    <div className="root-layout">
      <nav>
        <Link  href="/" className="flex items-center gap-2">
          <Image src="/Logo.svg" alt="Logo" width={38} height={32}></Image>
          <h2 className="text-primary-100">VocaAI</h2>
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default Rootlayout
