import React from 'react';

interface AIStructuredDataProps {
  content: {
    title: string;
    description: string;
    category: string;
    targetAudience: string[];
    keyTopics: string[];
    entities: Array<{
      name: string;
      type: string;
      description?: string;
      attributes?: Record<string, any>;
    }>;
    relationships: Array<{
      from: string;
      to: string;
      type: string;
      description: string;
    }>;
    actionItems: Array<{
      action: string;
      requirement: string;
      outcome: string;
    }>;
  };
}

const AIStructuredData: React.FC<AIStructuredDataProps> = ({ content }) => {
  // Create AI-specific structured data for enhanced LLM understanding
  const aiStructuredData = {
    '@context': {
      '@vocab': 'https://schema.org/',
      'ai': 'https://ai-standards.org/vocab/'
    },
    '@type': 'AIContent',
    title: content.title,
    description: content.description,
    category: content.category,
    targetAudience: content.targetAudience,
    keyTopics: content.keyTopics,
    entities: content.entities.map(entity => ({
      '@type': entity.type,
      name: entity.name,
      description: entity.description,
      ...entity.attributes
    })),
    relationships: content.relationships,
    actionItems: content.actionItems,
    metadata: {
      contentPurpose: 'educational_and_comparative',
      audienceIntent: 'broker_selection_and_analysis',
      complexity: 'intermediate',
      timeToRead: '8-10 minutes',
      lastUpdated: new Date().toISOString()
    }
  };

  return (
    <>
      {/* AI-Optimized Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aiStructuredData, null, 2) }}
      />

      {/* Hidden AI-friendly content */}
      <div className="sr-only" aria-hidden="true">
        <h2>AI Summary</h2>
        <p>{content.title}: {content.description}</p>

        <h3>Target Audience</h3>
        <ul>
          {content.targetAudience.map((audience, index) => (
            <li key={index}>{audience}</li>
          ))}
        </ul>

        <h3>Key Topics</h3>
        <ul>
          {content.keyTopics.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>

        <h3>Entities</h3>
        <dl>
          {content.entities.map((entity, index) => (
            <React.Fragment key={index}>
              <dt>{entity.name} ({entity.type})</dt>
              <dd>{entity.description}</dd>
            </React.Fragment>
          ))}
        </dl>

        <h3>Action Items</h3>
        <ol>
          {content.actionItems.map((item, index) => (
            <li key={index}>
              <strong>{item.action}</strong>: {item.requirement} → {item.outcome}
            </li>
          ))}
        </ol>
      </div>
    </>
  );
};

export default AIStructuredData;