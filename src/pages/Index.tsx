
import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import DogReportForm from '@/components/DogReportForm';
import MatchResults from '@/components/MatchResults';
import { DogReport, DogMatch, ReportResponse } from '@/types/dog';
import { submitDogReport } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [matches, setMatches] = useState<DogMatch[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = async (data: DogReport) => {
    setIsSubmitting(true);
    
    try {
      const response: ReportResponse = await submitDogReport(data);
      
      if (response.matches && response.matches.length > 0) {
        setMatches(response.matches);
      } else {
        toast({
          title: "Dog report submitted",
          description: "Your report has been saved. We'll notify you if we find a match.",
          duration: 5000
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit dog report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseMatches = () => {
    setMatches([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Hero onGetStarted={handleGetStarted} />
        
        {showForm && (
          <div 
            ref={formRef}
            className="py-16 bg-white"
            id="report-form"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8 text-pawmatch-purple">
                  {showForm ? "Report a Dog" : "How PawMatch Works"}
                </h2>
                
                <DogReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
              </div>
            </div>
          </div>
        )}
        
        <section className="py-16 bg-pawmatch-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-pawmatch-purple">How PawMatch Works</h2>
              <p className="text-lg text-gray-700 mb-12">
                Our innovative platform uses advanced technology to help reunite lost dogs with their owners.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-pawmatch-purple rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">1</div>
                  <h3 className="text-lg font-semibold mb-2">Report Your Dog</h3>
                  <p className="text-gray-600">Upload a photo and details of your lost dog or a dog you've found.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-pawmatch-purple rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">2</div>
                  <h3 className="text-lg font-semibold mb-2">AI Matching</h3>
                  <p className="text-gray-600">Our AI algorithm analyzes photos, descriptions, and location data to find potential matches.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="w-12 h-12 bg-pawmatch-purple rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">3</div>
                  <h3 className="text-lg font-semibold mb-2">Get Connected</h3>
                  <p className="text-gray-600">When a match is found, connect directly with the other party to reunite the dog.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 text-pawmatch-purple">Success Stories</h2>
              <p className="text-lg text-gray-700 mb-12">
                PawMatch has helped reunite hundreds of dogs with their owners. Here are some of their stories.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1582562124811-c09040d0a901" 
                    alt="Success story" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Max's Journey Home</h3>
                    <p className="text-gray-600">
                      "After 2 weeks of searching, PawMatch connected me with someone who found Max just 3 miles away. I can't express how grateful I am!"
                    </p>
                    <p className="mt-4 text-sm font-medium text-pawmatch-purple">- Sarah T.</p>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1466721591366-2d5fba72006d" 
                    alt="Success story" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">Reunited with Bella</h3>
                    <p className="text-gray-600">
                      "I found a dog wandering in my neighborhood and posted on PawMatch. Within hours, I was connected with her worried owner!"
                    </p>
                    <p className="mt-4 text-sm font-medium text-pawmatch-purple">- Michael R.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {matches.length > 0 && (
        <MatchResults matches={matches} onClose={handleCloseMatches} />
      )}
    </div>
  );
};

export default Index;
