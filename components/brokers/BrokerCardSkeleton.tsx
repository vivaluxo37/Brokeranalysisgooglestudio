import React from 'react';
import { Card, CardContent } from '../ui/card';

const BrokerCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col h-full animate-pulse">
      <div className="flex-grow">
        <CardContent>
          <div className="flex justify-between items-start">
            <div className="h-12 w-24 bg-input rounded-md" />
            <div className="flex flex-col items-end space-y-2">
              <div className="h-8 w-16 bg-input rounded-md" />
              <div className="h-4 w-20 bg-input rounded" />
            </div>
          </div>
          <div className="h-6 w-3/4 bg-input rounded mt-4" />
          <div className="h-4 w-1/2 bg-input rounded mt-2" />
          
          <div className="mt-4 pt-3 border-t border-input/50 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/3 bg-input rounded" />
              <div className="h-4 w-1/4 bg-input rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/4 bg-input rounded" />
              <div className="h-4 w-1/3 bg-input rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-1/2 bg-input rounded" />
              <div className="h-4 w-1/4 bg-input rounded" />
            </div>
          </div>
        </CardContent>
      </div>
      <div className="p-4 border-t border-input flex items-center gap-2">
        <div className="h-8 w-full bg-input rounded-md" />
        <div className="h-8 w-full bg-input rounded-md" />
      </div>
    </Card>
  );
};

export default BrokerCardSkeleton;
