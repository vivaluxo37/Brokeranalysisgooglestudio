import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import Spinner from '../ui/Spinner';

interface ReportBrokerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokerName: string;
}

const ReportBrokerModal: React.FC<ReportBrokerModalProps> = ({ isOpen, onClose, brokerName }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setReportSubmitted(true);
      setTimeout(() => {
        onClose();
        setReportSubmitted(false);
      }, 2000); // Close modal after 2 seconds
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <Card className="max-w-lg w-full animate-fade-in">
        <CardHeader>
          <h3 className="text-xl font-bold">Report {brokerName}</h3>
        </CardHeader>
        <CardContent>
          {reportSubmitted ? (
            <div className="text-center p-8">
              <h4 className="text-2xl font-bold text-green-400">Thank You!</h4>
              <p className="text-card-foreground/80 mt-2">Your report has been submitted for review by our team.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-card-foreground/80">
                Help keep the community safe. If you've had a negative experience or suspect this broker of wrongdoing, please provide details below. All reports are reviewed by our compliance team.
              </p>
              <div>
                <label htmlFor="issueType" className="block text-sm font-medium text-card-foreground/90 mb-1">Issue Type</label>
                <select id="issueType" required className="w-full bg-input border-input rounded-md shadow-sm p-2">
                  <option>Withdrawal Problems</option>
                  <option>Misleading Advertising</option>
                  <option>Unlicensed Activity</option>
                  <option>Platform Manipulation</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-card-foreground/90 mb-1">Description</label>
                <textarea
                  id="description"
                  rows={4}
                  className="block w-full bg-input border-input rounded-md shadow-sm p-2 placeholder:text-foreground/60"
                  placeholder={`Please describe the issue with ${brokerName} in detail...`}
                  required
                />
              </div>
              <div>
                 <label htmlFor="evidence" className="block text-sm font-medium text-card-foreground/90 mb-1">Attach Evidence (Optional)</label>
                 <input type="file" id="evidence" className="block w-full text-sm text-foreground/80 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-900/50 file:text-primary-300 hover:file:bg-primary-900/80"/>
              </div>
            </form>
          )}
        </CardContent>
        {!reportSubmitted && (
            <CardFooter className="flex justify-end gap-4 bg-input/30">
                <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? <Spinner size="sm" /> : 'Submit Report'}
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ReportBrokerModal;
