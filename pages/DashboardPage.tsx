import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { MatcherHistoryItem } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import Card, { CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Icons } from '../constants';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import { useReviews } from '../hooks/useReviews';
import VerificationModal from '../components/reviews/VerificationModal';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import { useAlerts } from '../hooks/useAlerts';

// A reusable accordion component for the dashboard
const AccordionItem: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({ title, subtitle, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-input last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 px-6 text-left hover:bg-input/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div>
            <span className="font-semibold text-primary-400">{title}</span>
            <p className="text-sm text-card-foreground/70">{subtitle}</p>
        </div>
        <Icons.chevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6 bg-background">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for the "Quick Actions" section
// FIX: Changed icon prop from React.ReactElement to React.ElementType and updated component to render it directly to fix a TypeScript error with React.cloneElement.
const QuickActionCard: React.FC<{ to: string, icon: React.ElementType<{ className?: string }>, title: string, description: string }> = ({ to, icon: Icon, title, description }) => (
    <Link to={to} className="block group">
        <Card className="h-full hover:border-primary-600 hover:-translate-y-1 transition-all">
            <CardContent className="flex items-start gap-4">
                <div className="p-3 bg-input rounded-lg text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-sm text-card-foreground/70">{description}</p>
                </div>
            </CardContent>
        </Card>
    </Link>
);


const DashboardPage: React.FC = () => {
  const { user, updateUser, deleteAccount } = useAuth();
  const { favoritesList } = useFavorites();
  const { getReviewsByUserId, verifyReview } = useReviews();
  const { getAlertsForFavorites } = useAlerts();
  const [history, setHistory] = useState<MatcherHistoryItem[]>([]);
  const navigate = useNavigate();

  // State for account settings
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState(''); // Dummy field for UI
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for verification modal
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const userReviews = useMemo(() => {
    return user ? getReviewsByUserId(user.id) : [];
  }, [user, getReviewsByUserId]);

  useEffect(() => {
    if (user) {
      const key = `matcherHistory_${user.id}`;
      try {
        const storedHistory = JSON.parse(localStorage.getItem(key) || '[]');
        setHistory(storedHistory);
      } catch (e) {
        console.error("Failed to load matcher history:", e);
        setHistory([]);
      }
      setName(user.name); // Keep name in sync if user changes
    }
  }, [user]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setIsUpdating(true);
    setUpdateSuccess(false);
    try {
      await updateUser(name.trim());
      setUpdateSuccess(true);
      setPassword(''); // Clear password field
      setTimeout(() => setUpdateSuccess(false), 3000); // Hide message after 3s
    } catch (error) {
      console.error("Failed to update user", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Failed to delete account", error);
      setIsDeleting(false); // Only set to false on error, otherwise component unmounts
    }
  };

  const handleOpenVerification = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setIsVerificationModalOpen(true);
  };

  const handleVerifyReview = () => {
    if (!selectedReviewId) return;
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      verifyReview(selectedReviewId);
      setIsVerifying(false);
      setIsVerificationModalOpen(false);
      setSelectedReviewId(null);
    }, 1000);
  };

  const favoriteBrokers = allBrokers.filter(b => favoritesList.includes(b.id));
  const myAlerts = getAlertsForFavorites(favoritesList);

  const getSeverityColor = (severity: 'High' | 'Medium' | 'Low') => {
      switch (severity) {
          case 'High': return 'border-l-red-500 bg-red-900/20';
          case 'Medium': return 'border-l-yellow-500 bg-yellow-900/20';
          case 'Low': return 'border-l-green-500 bg-green-900/20';
          default: return 'border-l-gray-500 bg-gray-900/20';
      }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-lg text-foreground/80 mt-2">This is your personal dashboard to track and manage your broker research.</p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickActionCard to="/broker-matcher" icon={Icons.bot} title="New AI Match" description="Find a new broker tailored to you." />
          <QuickActionCard to="/compare" icon={Icons.layers} title="Compare Brokers" description="View your comparison list." />
          <QuickActionCard to="/cost-analyzer" icon={Icons.data} title="Cost Analyzer" description="Analyze live trading fees." />
          <QuickActionCard to="/brokers" icon={Icons.shieldCheck} title="Explore All Brokers" description="Browse our full broker list." />
      </div>

       {/* My Alerts */}
       <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">My Alerts</h2>
        </CardHeader>
        <CardContent>
          {myAlerts.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {myAlerts.map(alert => {
                const broker = allBrokers.find(b => b.id === alert.brokerId);
                return (
                  <div key={alert.id} className={`p-4 rounded-r-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-card-foreground">
                          {broker?.name}: {alert.title}
                        </p>
                        <p className="text-sm text-card-foreground/80 mt-1">{alert.description}</p>
                      </div>
                      <p className="text-xs text-card-foreground/60 flex-shrink-0 ml-4">{new Date(alert.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <p className="text-card-foreground/70">No alerts for your favorited brokers. Add some brokers to your favorites to start receiving updates!</p>
              <Link to="/brokers" className="mt-4 inline-block">
                <Button variant="secondary">Explore Brokers</Button>
              </Link>
            </div>
          )}
        </CardContent>
       </Card>

      {/* AI Match History */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Your AI Broker Match History</h2>
        </CardHeader>
        <CardContent className="p-0">
          {history.length > 0 ? (
            <div className="divide-y divide-input">
              {history.map(item => {
                const matchedBrokers = allBrokers.filter(b => item.recommendedBrokerIds.includes(b.id));
                const title = `Match for a ${item.preferences.experience} Trader`;
                const subtitle = `Priority: ${item.preferences.priority} | ${new Date(item.timestamp).toLocaleDateString()}`;
                return (
                    <AccordionItem key={item.id} title={title} subtitle={subtitle}>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-semibold text-primary-400 mb-2">AI Analysis:</h4>
                                <p className="text-foreground/90 italic">"{item.reasoning}"</p>
                            </div>
                            <div>
                               <h4 className="font-semibold text-primary-400 mb-4">Recommended Brokers for this Match:</h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {matchedBrokers.map(broker => <BrokerCard key={broker.id} broker={broker} isRecommended={true} />)}
                               </div>
                            </div>
                        </div>
                    </AccordionItem>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
                <p className="text-card-foreground/70">You haven't used the AI Broker Matcher yet.</p>
                <Link to="/broker-matcher" className="mt-4 inline-block">
                    <Button variant="primary">Find Your First Match</Button>
                </Link>
            </div>
          )}
        </CardContent>
      </Card>
      
       {/* My Reviews Section */}
       <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">My Reviews</h2>
        </CardHeader>
        <CardContent>
          {userReviews.length > 0 ? (
            <div className="space-y-4">
              {userReviews.map(review => {
                const broker = allBrokers.find(b => b.id === review.brokerId);
                return (
                  <div key={review.id} className="p-4 rounded-lg bg-input/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <p className="font-semibold text-card-foreground">
                        Review for <Link to={`/broker/${broker?.id}`} className="text-primary-400 hover:underline">{broker?.name || 'Unknown Broker'}</Link>
                      </p>
                      <StarRating score={review.rating * 2} size="sm" className="my-1"/>
                      <p className="text-sm text-card-foreground/80 italic">"{review.comment}"</p>
                    </div>
                    <div className="flex-shrink-0">
                      {review.verified ? (
                        <Badge variant="success" Icon={Icons.verified}>Verified</Badge>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => handleOpenVerification(review.id)}>
                          Verify Review
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <p className="text-card-foreground/70">You haven't written any reviews yet.</p>
              <Link to="/brokers" className="mt-4 inline-block">
                <Button variant="secondary">Find a Broker to Review</Button>
              </Link>
            </div>
          )}
        </CardContent>
       </Card>

       {/* Favorite Brokers */}
       <Card>
        <CardHeader>
            <h2 className="text-2xl font-semibold">Your Favorite Brokers</h2>
        </CardHeader>
        <CardContent>
            {favoriteBrokers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteBrokers.map(broker => <BrokerCard key={broker.id} broker={broker} />)}
                </div>
            ) : (
                <div className="text-center py-12 px-6">
                    <p className="text-card-foreground/70">You haven't favorited any brokers yet. Click the star icon on a broker to save it here.</p>
                     <Link to="/brokers" className="mt-4 inline-block">
                        <Button variant="secondary">Explore Brokers</Button>
                    </Link>
                </div>
            )}
        </CardContent>
       </Card>

       {/* Account Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Account Settings</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSubmit} className="max-w-lg space-y-4">
            <div>
                <Input id="email" label="Email Address" type="email" value={user?.email || ''} disabled className="cursor-not-allowed bg-input/50" />
            </div>
            <div>
                <Input id="fullName" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <Input id="password" label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Button type="submit" disabled={isUpdating || name === user?.name}>
                {isUpdating ? <Spinner size="sm" /> : 'Save Changes'}
              </Button>
              {updateSuccess && <p className="text-sm text-green-400 animate-fade-in">Profile updated successfully!</p>}
            </div>
          </form>
          <div className="mt-8 pt-6 border-t border-input">
            <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
            <p className="text-sm text-card-foreground/70 mt-1">Deleting your account is a permanent action and cannot be undone.</p>
            <Button variant="danger" className="mt-4" onClick={() => setIsDeleteModalOpen(true)}>
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in" aria-modal="true" role="dialog">
          <Card className="max-w-md w-full animate-fade-in">
            <CardHeader>
              <h3 className="text-xl font-bold">Confirm Account Deletion</h3>
            </CardHeader>
            <CardContent>
              <p className="text-card-foreground/80">Are you sure you want to permanently delete your account? All your data, including favorites and match history, will be lost.</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-4 bg-input/30">
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteAccount} disabled={isDeleting}>
                {isDeleting ? <Spinner size="sm" /> : 'Yes, Delete Account'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        isVerifying={isVerifying}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerifyReview}
      />

    </div>
  );
};

export default DashboardPage;