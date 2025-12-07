import { Mona_Sans } from "next/font/google";
import React, { ReactNode } from 'react'
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const Rootlayout = ({children} :{children: ReactNode}) => {
  return (
    <html lang='en' className='dark'>
    <body className={`${monaSans.className} antialiased pattern`}>
      {children}
    </body>
    </html>
  )
}

export default Rootlayout
