import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/best-brokers', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default CategoriesPage;
