import {
  FaFacebook,
  FaLine,
  FaYoutube,
  FaInstagram,
  FaCommentDots,
} from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import FooterItem from './footer-item'

export default function Navbar() {
  return (
    <>
      <footer className="flex flex-col bg-background-primary py-10">
        <div className="flex flex-wrap mb-12">
          <div className="basis-1/2 md:basis-1/4 aspect-3/2 overflow-hidden">
            <Image
              src="/images/home/footer-1.jpg"
              width={600}
              height={400}
              alt="footer image 1"
              className="w-full select-none"
            />
          </div>
          <div className="basis-1/2 md:basis-1/4 aspect-3/2 overflow-hidden">
            <Image
              src="/images/home/footer-2.jpg"
              width={600}
              height={400}
              alt="footer image 2"
              className="w-full select-none"
            />
          </div>
          <div className="basis-1/2 md:basis-1/4 aspect-3/2 overflow-hidden">
            <Image
              src="/images/home/footer-3.jpg"
              width={600}
              height={400}
              alt="footer image 3"
              className="w-full select-none"
            />
          </div>
          <div className="basis-1/2 md:basis-1/4 aspect-3/2 overflow-hidden">
            <Image
              src="/images/home/footer-4.jpg"
              width={600}
              height={400}
              alt="footer image 4"
              className="w-full select-none"
            />
          </div>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-center align-center md:justify-between gap-8">
              <Link
                href="/"
                className="logo text-6xl md:text-3xl text-center font-semibold"
              >
                <span className="text-primary">Pet</span>
                <span className="text-brand-warm">opia</span>
              </Link>
              <div className="flex justify-center gap-6">
                <Link href="/">
                  <FaFacebook className="w-8 h-8" />
                </Link>
                <Link href="/">
                  <FaLine className="w-8 h-8" />
                </Link>
                <Link href="/">
                  <FaYoutube className="w-8 h-8" />
                </Link>
                <Link href="/">
                  <FaInstagram className="w-8 h-8" />
                </Link>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 px-4 md:px-0">
              <Link
                href="/"
                className="w-full md:w-1/4 flex flex-col justify-center text-white bg-brand-warm p-4 rounded-2xl hover:bg-brand-warm/80 transition duration-300"
              >
                <span className="flex justify-center">
                  <FaCommentDots className="w-8 h-8" />
                </span>
                <span className="text-lg text-center">聯絡我們</span>
              </Link>

              <div className="w-full md:w-3/4 flex flex-col md:flex-row gap-8">
                <div className="flex grow flex-col divide-y divide-text-secondary">
                  <FooterItem href="/" title="關於Petopia" />
                  <FooterItem href="/" title="購物相關說明" />
                  <FooterItem href="/" title="旅遊行程說明" />
                </div>
                <div className="flex grow flex-col divide-y divide-text-secondary">
                  <FooterItem href="/" title="餐廳訂位說明" />
                  <FooterItem href="/" title="常見問題" />
                  <FooterItem href="/" title="隱私權政策" />
                </div>
              </div>
            </div>
            <div className="text-center">&copy; 2025 Petopia</div>
          </div>
        </div>

      </footer>
    </>
  )
}
