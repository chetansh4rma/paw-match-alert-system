
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <div className="relative bg-gradient-to-b from-pawmatch-light to-white py-16 md:py-24 overflow-hidden paw-pattern">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-pawmatch-purple">
            Reunite With Your <span className="text-pawmatch-orange">Furry Friend</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            PawMatch uses cutting-edge technology to help reunite lost dogs with their owners.
            Our powerful matching algorithm connects lost and found pet reports in your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-pawmatch-purple hover:bg-pawmatch-purple/90 text-lg"
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-pawmatch-purple text-pawmatch-purple hover:bg-pawmatch-purple/10 text-lg"
            >
              How It Works
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-pawmatch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pawmatch-purple" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Location Matching</h3>
            <p className="text-gray-600">We use precise location data to find matches within your vicinity.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-pawmatch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pawmatch-purple" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Visual Recognition</h3>
            <p className="text-gray-600">Our AI matches dog photos to help identify your pet accurately.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-pawmatch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-pawmatch-purple" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Connections</h3>
            <p className="text-gray-600">Connect directly with owners/finders through our platform.</p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>
    </div>
  );
};

export default Hero;
