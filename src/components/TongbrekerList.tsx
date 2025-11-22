import type { Tongbreker } from '../types';
import { TongbrekerItem } from './TongbrekerItem';

interface TongbrekerListProps {
  tongbrekers: Tongbreker[];
}

export const TongbrekerList = ({ tongbrekers }: TongbrekerListProps) => {
  if (tongbrekers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 italic">
          Nog geen tongbrekers gegenereerd. Klik op de knop hierboven! 👆
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tongbrekers.map((tongbreker) => (
        <TongbrekerItem key={tongbreker.id} tongbreker={tongbreker} />
      ))}
    </div>
  );
};
