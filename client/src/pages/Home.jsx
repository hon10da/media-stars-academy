import { Helmet } from 'react-helmet-async'
import Hero from '@/components/sections/Hero'
import AboutIntro from '@/components/sections/AboutIntro'
import GallerySection from '@/components/sections/GallerySection'
import FourPillars from '@/components/sections/FourPillars'
import FeaturedPrograms from '@/components/sections/FeaturedPrograms'
import WhyChooseUs from '@/components/sections/WhyChooseUs'
import TrainersPreview from '@/components/sections/TrainersPreview'
import Testimonials from '@/components/sections/Testimonials'
import LatestMedia from '@/components/sections/LatestMedia'
import CTABand from '@/components/sections/CTABand'
import ContactSection from '@/components/sections/ContactSection'
import { SITE } from '@/lib/constants'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>{SITE.name} | {SITE.tagline}</title>
        <meta name="description" content={SITE.tagline} />
      </Helmet>
      <Hero />
      <AboutIntro />
      <FourPillars />
      <FeaturedPrograms />
      <WhyChooseUs />
      <TrainersPreview />
      <Testimonials />
<GallerySection />
<LatestMedia />
<CTABand />
      <ContactSection />
    </>
  )
}
