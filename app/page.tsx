import Image from 'next/image';
import Link from 'next/link';
import { Camera, Wand2, ArrowRight, Image as ImageIcon } from "lucide-react";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

import image1 from '@/assets/1.webp';
import image2 from '@/assets/2.webp';
import image3 from '@/assets/3.webp';
import image4 from '@/assets/4.webp';
import image5 from '@/assets/5.webp';

const HeroSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[80vh]">
        {/* Left Column - Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-zinc-800">AI-Powered Image Processing</span>
            </div>

            <h1 className="text-5xl font-bold text-zinc-900 leading-tight">
              Transform Your Images
              <span className="block text-primary">in Seconds</span>
            </h1>

            <p className="text-xl text-zinc-600 max-w-lg">
              Professional-grade image processing powered by advanced AI. Perfect for e-commerce, design, and content creation.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-zinc-900">1s</div>
                <div className="text-sm text-zinc-600">Processing Time</div>
              </div>
              <div className="w-px bg-zinc-200"></div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-zinc-900">99%</div>
                <div className="text-sm text-zinc-600">Accuracy Rate</div>
              </div>
              <div className="w-px bg-zinc-200"></div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-zinc-900">2K</div>
                <div className="text-sm text-zinc-600">Max Resolution</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base font-semibold px-8" asChild>
              <Link href="/app">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base font-semibold px-8" asChild>
              <Link href="#examples">
                View Examples
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-zinc-200 border-2 border-white" />
              ))}
            </div>
            <div className="text-sm text-zinc-600">
              <span className="font-semibold text-zinc-900">4.9/5</span> from over 1,000 reviews
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-zinc-100 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.1)_100%)]" />
            <Image
              src={image1}
              alt="Image Processing Demo"
              width={800}
              height={800}
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>

          {/* Floating Stats */}
          <div className="absolute -left-8 top-1/4 bg-white shadow-lg rounded-xl p-4 max-w-[200px]">
            <div className="text-sm font-medium text-zinc-900">Processing Images</div>
            <div className="text-xs text-zinc-600 mt-1">Real-time AI enhancement</div>
            <div className="w-full bg-zinc-100 rounded-full h-1.5 mt-3">
              <div className="bg-primary h-1.5 rounded-full w-2/3"></div>
            </div>
          </div>

          <div className="absolute -right-8 bottom-1/4 bg-white shadow-lg rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-900">1,000+</div>
                <div className="text-xs text-zinc-600">Images Processed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingSection = () => {

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <Card className="relative overflow-hidden border-2 border-primary">
        <div className="absolute top-0 left-0 w-full bg-primary text-white text-center py-1 text-sm">
          Paid Users Only
        </div>
        <CardHeader className="text-center pt-8 pb-6">
          <div className="mb-3">
            <Camera className="w-10 h-10 mx-auto text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Process Your Images</h2>
          <p className="text-sm text-gray-600">Unlock full processing capabilities</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">1000</span>
              <span className="text-gray-600">images/month</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                <span className="text-zinc-600 text-sm">✓</span>
              </div>
              <span className="text-gray-600">High-quality processing</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                <span className="text-zinc-600 text-sm">✓</span>
              </div>
              <span className="text-gray-600">Batch upload support</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                <span className="text-zinc-600 text-sm">✓</span>
              </div>
              <span className="text-gray-600">Priority processing queue</span>
            </div>
          </div>

          <div className="pt-4">
            <Button
              className="w-full text-white py-6 text-lg font-semibold"
              asChild
            >
              <Link href="/app">
                Upgrade Now
              </Link>
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Start processing immediately after upgrade
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


const FeatureSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column - Image/Preview */}
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-zinc-50 flex items-center justify-center">
            <Image
              src={image2}
              width={600}
              height={600}
              alt="Background Removal Demo"
              className="rounded-xl"
            />
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-zinc-50 px-6 py-2 rounded-full text-sm font-medium">
            AI-Powered Technology
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8 text-primary" />
              <span className="text-sm font-medium text-primary">AUTOMATIC</span>
            </div>
            <h2 className="text-4xl font-bold text-zinc-900">
              Effortless, Professional Background Removal
            </h2>
            <p className="text-xl text-zinc-600">
              Perfect results in seconds, no manual editing needed
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1s</span>
              </div>
              <div className="text-zinc-600">
                Process images in<br />under 1 seconds
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <span className="text-zinc-600">Advanced edge detection technology</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <span className="text-zinc-600">Preserves fine details like hair</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center mr-3">
                  <span className="text-primary text-sm">✓</span>
                </div>
                <span className="text-zinc-600">Works with complex backgrounds</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full py-6 text-lg font-semibold rounded-xl"
              asChild
            >
              <Link href="/app">
                Try It Now
              </Link>
            </Button>
            <p className="text-center text-sm text-zinc-500">
              Get pixel-perfect results instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExamplesSection = () => {
  return (
    <Carousel className="max-w-3xl" id="examples">
      <CarouselContent className="relative">
        <Image src={image3} alt={"an example image"} />
        <Image src={image4} alt={"an example image"} />
        <Image src={image5} alt={"an example image"} />
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full mb-7">
      <HeroSection />
      <div className="py-24" />
      <FeatureSection />
      <div className="py-24" />
      <ExamplesSection />
      <div className="py-24" />
      <PricingSection />
    </main>
  );
}
