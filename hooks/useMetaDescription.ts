
import { Broker } from '../types';

const useMetaDescription = (broker: Broker | undefined): string => {
    if (!broker) {
        return 'An AI-driven single-page web application to help traders research, compare, and select forex brokers.';
    }

    // The date is specified in the user prompt.
    const updatedDate = 'September 15, 2025';
    
    let description = `Read our in-depth review of ${broker.name}, founded in ${broker.foundingYear} and regulated by ${broker.regulation.regulators.slice(0, 2).join(', ')}. Analyze fees, platforms, and safety. Updated: ${updatedDate}.`;

    // Fallback to a shorter version if the first one is too long
    if (description.length > 160) {
        description = `Review of ${broker.name} (${broker.foundingYear}). Analyze fees, platforms, and regulation by ${broker.regulation.regulators[0]}. Updated: ${updatedDate}.`;
    }
    
    // Final check to ensure it's under the limit.
    if (description.length > 158) {
         return description.substring(0, 155) + '...';
    }

    return description;
};

export default useMetaDescription;
