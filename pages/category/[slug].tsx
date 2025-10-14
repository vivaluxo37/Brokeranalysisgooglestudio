import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CategorySlugRedirectPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  useEffect(() => {
    const target = slug
      ? `/best-brokers/${encodeURIComponent(slug)}`
      : '/best-brokers';

    navigate(target, { replace: true });
  }, [navigate, slug]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};

export default CategorySlugRedirectPage;
