import React, { useMemo, useState } from 'react';
import { Broker } from '../types';
import { useBrokers } from '../hooks/useBrokers';
import BrokerCard from '../components/brokers/BrokerCard';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useLocation } from 'react-router-dom';
import BrokerQuickViewModal from '../components/brokers/BrokerQuickViewModal';
import Spinner from '../components/ui/Spinner';

interface CategoryPageProps {
  title: string;
  description: string;
  filterFn: (broker: Broker) => boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, description, filterFn }) => {
  const location = useLocation();
  const { brokers: allBrokers, loading, error } = useBrokers();
  const filteredBrokers = useMemo(() => allBrokers.filter(filterFn), [allBrokers, filterFn]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);

  const handleOpenQuickView = (broker: Broker) => {
    setSelectedBroker(broker);
  };

  const handleCloseQuickView = () => {
    setSelectedBroker(null);
  };
  
  const canonicalUrl = `https://brokeranalysis.com/#${location.pathname}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://brokeranalysis.com/"
    },{
      "@type": "ListItem",
      "position": 2,
      "name": title
    }]
  };


  return (
    <div>
      <BrokerQuickViewModal broker={selectedBroker} onClose={handleCloseQuickView} />
      <MetaTags 
        title={`${title} (2025) | Brokeranalysis`}
        description={description}
        canonicalUrl={canonicalUrl}
      />
      <JsonLdSchema data={breadcrumbJsonLd} />

      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{description}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-lg font-medium">Loading brokers...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500 bg-card rounded-lg border border-input">
          <p className="text-xl">Failed to load brokers</p>
          <p className="mt-2">{error}</p>
        </div>
      ) : filteredBrokers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrokers.map(broker => (
            <BrokerCard key={`category-${broker.id}`} broker={broker} onQuickView={handleOpenQuickView} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-foreground/70 bg-card rounded-lg border border-input">
            <p className="text-xl">No brokers found matching this category.</p>
            <p className="mt-2">We are constantly updating our database. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;