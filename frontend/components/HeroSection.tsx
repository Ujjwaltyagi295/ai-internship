import Image from 'next/image'
import HeorButton from '@/components/ui/herobutton';

export default function HeroSection() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-[100%] -z-10">
        <Image
          src="/cloudfinal3.png"
          alt="Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>
      
      <div className="relative z-10">
        <nav className="flex items-center justify-between px-8 py-6 bg-transparent border-b border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-500 font-bold text-xl">×</span>
            </div>
            <span className="text-white font-bold text-xl">CareerPath</span>
          </div>
          
          <div className="flex items-center gap-8">
            <a href="#" className="text-white font-medium hover:text-white/80 transition">Home</a>
            <a href="#" className="text-white/70 font-medium hover:text-white transition">How it works</a>
            <a href="#" className="text-white/70 font-medium hover:text-white transition">Blogs</a>
            <a href="#" className="text-white/70 font-medium hover:text-white transition">Pricing</a>
            <a href="#" className="text-white/70 font-medium hover:text-white transition">Enterprise</a>
          </div>
        
          <a href='/dashboard/job' className="px-6 py-2.5 bg-white text-gray-900 rounded-lg font-semibold hover:bg-white/90 transition">
           Get Started
          </a>
        </nav>

        <main className="relative flex flex-col items-center justify-center px-8 pt-12 pb-16">
          {/* Vertical Lines with Glass Effect */}
          <div className="absolute left-0 top-0 h-full w-px bg-white/30 backdrop-blur-sm"></div>
          <div className="absolute left-40 top-0 h-full w-px bg-white/20 backdrop-blur-sm"></div>
          <div className="absolute right-0 top-0 h-full w-px bg-white/30 backdrop-blur-sm"></div>
          <div className="absolute right-40 top-0 h-full w-px bg-white/20 backdrop-blur-sm"></div>
          <HeorButton/>
          
          <h1 className="text-6xl font-normal mt-3 text-white text-center max-w-5xl leading-tight mb-4">
            Your <span className="text-7xl font-bold">All-in-One</span> System
            for
            <br />
            Smarter Career{" "}
            Matching
          </h1>

          <p className="text-white/90 text-lg text-center max-w-2xl mb-6">
            Get AI-matched opportunities and track your applications easily.
          </p>

          <div className="flex items-center gap-4 mb-10">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#3180ff] hover:bg-blue-700 text-white rounded-lg font-semibold transition">
              Get Started
            </button>
            <button className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold border border-white/30 transition">
              Browse Internships
            </button>
          </div>

          <div className="w-full max-w-[1200px] mx-auto">
            {/* Glass background container with padding */}
            <div className="relative rounded-4xl bg-white/20 backdrop-blur-md p-8">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src="/heroimg.png"
                  alt="Dashboard Preview"
                  width={1200}
                  height={700}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </main>

     

      </div>
      
    </div>
  );
}
