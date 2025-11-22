import type { Tongbreker } from '../../types';
import { TongbrekerItem } from './TongbrekerItem';

interface TongbrekerListProps {
  tongbrekers: Tongbreker[];
  onDelete: (id: string) => void;
}

export const TongbrekerList = ({ tongbrekers, onDelete }: TongbrekerListProps) => {
  if (tongbrekers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-red-300 italic text-lg">
          Nog geen tongbrekers gegenereerd. Klik op de knop hierboven! 🔥
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {tongbrekers.map((tongbreker) => (
        <TongbrekerItem key={tongbreker.id} tongbreker={tongbreker} onDelete={onDelete} />
      ))}
    </div>
  );
};
