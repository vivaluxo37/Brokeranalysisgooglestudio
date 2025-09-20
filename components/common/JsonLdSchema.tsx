
import React, { useEffect } from 'react';

const SCRIPT_ID = 'json-ld-schema';

interface JsonLdSchemaProps {
  data: Record<string, any>;
}

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ data }) => {
  useEffect(() => {
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    
    // Create script if it doesn't exist
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    // Set the content
    script.innerHTML = JSON.stringify(data);

    // Cleanup on unmount for SPA navigation
    return () => {
      const scriptToRemove = document.getElementById(SCRIPT_ID);
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [data]);

  return null; // This component does not render any visible elements
};

export default JsonLdSchema;
