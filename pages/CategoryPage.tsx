import React, { useMemo, useState } from 'react';
import { Broker } from '../types';
import { brokers as allBrokers } from '../data/brokers';
import BrokerCard from '../components/brokers/BrokerCard';
import MetaTags from '../components/common/MetaTags';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useLocation } from 'react-router-dom';
import BrokerQuickViewModal from '../components/brokers/BrokerQuickViewModal';

interface CategoryPageProps {
  title: string;
  description: string;
  filterFn: (broker: Broker) => boolean;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ title, description, filterFn }) => {
  const location = useLocation();
  const filteredBrokers = useMemo(() => allBrokers.filter(filterFn), [filterFn]);
  // FIX: Added state and handlers for BrokerQuickViewModal.
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
      {/* FIX: Added BrokerQuickViewModal to handle quick view functionality */}
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

      {filteredBrokers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBrokers.map(broker => (
            // FIX: Added missing onQuickView prop to BrokerCard
            <BrokerCard key={broker.id} broker={broker} onQuickView={handleOpenQuickView} />
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