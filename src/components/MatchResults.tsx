
import { DogMatch } from '@/types/dog';
import DogMatchCard from './DogMatchCard';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MatchResultsProps {
  matches: DogMatch[];
  onClose: () => void;
}

const MatchResults = ({ matches, onClose }: MatchResultsProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-pawmatch-purple">Potential Matches Found!</h2>
              <p className="text-gray-600">We found {matches.length} potential match{matches.length > 1 ? 'es' : ''} for your dog.</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {matches.map((match) => (
              <DogMatchCard key={match._id} match={match} />
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              className="bg-pawmatch-purple hover:bg-pawmatch-purple/90"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
