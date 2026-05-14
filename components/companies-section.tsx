"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export default function CompaniesSection() {
  const { t } = useLanguage()

  const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return part
    })
  }

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* DESAFIA Section - Logo/Text Left, Video Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Logo, Description, Button */}
          <div className="space-y-6">
            <div className="flex justify-start mb-4">
              <Image
                src="/icons/desafialogo.svg"
                alt="DESAFIA Logo"
                width={160}
                height={80}
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            <p className="text-white/75 leading-relaxed">
              {renderTextWithBold(t("companies.desafia.description"))}
            </p>

            <Button
              className="glass glass-hover border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 transition-all duration-300 hover:scale-105"
              onClick={() => window.open("https://desafia.tech/", "_blank")}
            >
              {t("companies.desafia.button")}
            </Button>
          </div>

          {/* Right: Video */}
          <div>
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src="https://iframe.mediadelivery.net/embed/468731/a1f38e78-d887-4a33-a625-34d099932bc8?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                loading="lazy"
                style={{ border: 0, position: "absolute", top: 0, height: "100%", width: "100%" }}
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                allowFullScreen={true}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}
