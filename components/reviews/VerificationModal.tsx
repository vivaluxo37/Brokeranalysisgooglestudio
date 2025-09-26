import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import Spinner from '../ui/Spinner';

interface VerificationModalProps {
  isOpen: boolean;
  isVerifying: boolean;
  onClose: () => void;
  onVerify: () => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, isVerifying, onClose, onVerify }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" 
      aria-modal="true" 
      role="dialog"
    >
      <Card className="max-w-md w-full animate-fade-in">
        <CardHeader>
          <h3 className="text-xl font-bold">Verify Your Review</h3>
        </CardHeader>
        <CardContent>
          <p className="text-card-foreground/80 mb-2">
            To ensure authenticity, we simulate a verification process. In a real application, clicking 'Verify' would securely redirect you to your broker to confirm you are a real client.
          </p>
          <p className="text-sm text-card-foreground/70">
            This step helps maintain the integrity of our community reviews and provides greater trust for all traders.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 bg-input/30">
          <Button variant="secondary" onClick={onClose} disabled={isVerifying}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onVerify} disabled={isVerifying}>
            {isVerifying ? <Spinner size="sm" /> : 'Verify Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationModal;