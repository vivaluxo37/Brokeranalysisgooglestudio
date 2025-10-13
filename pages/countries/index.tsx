import { type FC, useMemo } from 'react';
import { Link } from 'react-router-dom';

import MetaTags from '../../components/common/MetaTags';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { COUNTRIES, POPULAR_COUNTRIES, CountryConfig } from '../../lib/constants/countries';

const CountriesPage: FC = () => {
  const groupedCountries = useMemo(() => {
    return COUNTRIES.reduce<Record<string, CountryConfig[]>>((acc, country) => {
      const region = country.region || 'Other';
      if (!acc[region]) {
        acc[region] = [];
      }
      acc[region].push(country);
      return acc;
    }, {});
  }, []);

  if (!COUNTRIES.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags
        title="Find Forex Brokers by Country | BrokerAnalysis"
        description="Browse forex broker recommendations by country. Access regulated broker lists tailored for your region."
        canonicalUrl="https://brokeranalysis.com/countries"
        keywords={[
          'forex brokers by country',
          'country specific forex brokers',
          'regulated forex brokers'
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Forex Brokers by Country</h1>
          <p className="text-lg text-gray-600">
            Choose your country to see regulated brokers, availability, and localized trading guidance.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Popular Countries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_COUNTRIES.map(country => (
              <Link
                key={country.slug}
                to={`/best-forex-brokers/${country.slug}`}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{country.flag}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{country.name}</p>
                    <p className="text-sm text-gray-500">View recommended brokers</p>
                  </div>
                </div>
                <span className="text-blue-600 text-sm font-medium">Explore →</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Supported Countries</h2>
          <div className="space-y-8">
            {Object.entries(groupedCountries).map(([region, entries]) => (
              <div key={region}>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{region}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {entries
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(country => (
                      <Link
                        key={country.slug}
                        to={`/best-forex-brokers/${country.slug}`}
                        className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow-sm transition"
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{country.flag}</span>
                          <div>
                            <p className="font-medium text-gray-900">{country.name}</p>
                            <p className="text-xs text-gray-500">
                              {country.currency} • {country.region}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CountriesPage;
