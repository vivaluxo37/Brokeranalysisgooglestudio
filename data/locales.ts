export const translations = {
  en: {
    header: {
      brokers: "Brokers",
      marketNews: "Market News",
      methodology: "Methodology",
      login: "Login",
      register: "Register",
      logout: "Logout",
      dashboard: "My Dashboard",
      megaMenu: {
        coreTools: "Core Tools",
        allBrokers: "All Brokers",
        compareBrokers: "Compare Brokers",
        costAnalyzer: "Cost Analyzer",
        aiBrokerMatcher: "AI Broker Matcher",
        byCountry: "By Country",
        platformsAndTypes: "Platforms & Types"
      }
    },
    footer: {
      subtitle: "Discover your perfect forex broker with the power of AI.",
      byCountry: "By Country",
      platformsAndTypes: "Platforms & Types",
      resources: "Resources",
      copyright: "© {year} Brokeranalysis. All rights reserved."
    },
    home: {
      heroTitle: "Find Your Perfect Forex Broker",
      heroSubtitle: "Leverage the power of AI to analyze, compare, and choose the best broker tailored to your trading style.",
      heroDataDriven: "Data-driven insights on dozens of regulated brokers worldwide.",
      useAiMatcher: "Use AI Broker Matcher",
      exploreAllBrokers: "Explore All Brokers",
      trustedBy: "Trusted by top traders",
      whyChoose: "Why Choose Brokeranalysis?",
      features: {
        data: {
          title: "Comprehensive Data",
          description: "Access detailed information on dozens of brokers, from regulations to trading conditions."
        },
        matching: {
          title: "AI-Powered Matching",
          description: "Our intelligent Broker Matcher finds the ideal broker based on your unique preferences."
        },
        comparison: {
          title: "Side-by-Side Comparison",
          description: "Easily compare key features of multiple brokers in a clear, concise table."
        },
        trust: {
          title: "Trust & Safety",
          description: "We verify regulatory data and use AI to generate a dynamic trust score for each broker."
        }
      },
      popularCategoriesTitle: "Explore Popular Categories",
      categories: {
        beginners: {
          title: "Best for Beginners",
          description: "Find user-friendly platforms with low deposits and great educational content."
        },
        uk: {
          title: "UK Forex Brokers",
          description: "Explore top-tier, FCA-regulated brokers known for their robust client protection."
        },
        ecn: {
          title: "ECN Brokers",
          description: "For serious traders seeking direct market access and the tightest possible spreads."
        },
        copy: {
          title: "Copy Trading",
          description: "Leverage the expertise of seasoned traders by automatically copying their trades."
        }
      },
      howItWorksTitle: "How It Works in 3 Simple Steps",
      steps: {
        "1": {
          title: "Answer Questions",
          description: "Tell us about your trading style, experience, and what you value most in a broker."
        },
        "2": {
          title: "Get AI Matches",
          description: "Our AI analyzes your profile and recommends top brokers from our database."
        },
        "3": {
          title: "Compare & Choose",
          description: "Use our tools to compare costs, features, and trust scores to make your final choice."
        }
      },
      socialProofTitle: "Trusted by Traders Worldwide",
      testimonials: {
        "1": {
          quote: "\"The AI Broker Matcher is a game-changer. It found me a broker with low spreads that I'd never heard of. Saved me hours of research.\"",
          author: "- Alex R., Day Trader"
        },
        "2": {
          quote: "\"Finally, a comparison site that's actually useful. The live cost analyzer is brilliant for seeing real-time fees. Highly recommended.\"",
          author: "- Sarah T., Swing Trader"
        }
      },
      faqTitle: "Frequently Asked Questions",
      faqs: {
        "1": {
          q: "What’s the safest forex broker?",
          a: "Safety depends heavily on regulation. The safest brokers are typically those regulated by multiple top-tier authorities like the FCA (UK), ASIC (Australia), and FINMA (Switzerland). Our platform highlights regulatory data and provides an AI Trust Score to help you assess broker safety."
        },
        "2": {
          q: "How does AI choose the right broker for me?",
          a: "Our AI Broker Matcher analyzes your answers to questions about your trading style, and priorities. It then compares your profile against our database of broker attributes—like costs, platforms, and regulation—to find the closest matches. It's a data-driven process designed to personalize your search."
        },
        "3": {
          q: "Which broker has the lowest trading costs?",
          a: "Trading costs are dynamic and depend on the instrument you trade. Our Live Cost Analyzer provides real-time data on spreads and commissions for brokers you select, helping you identify the cheapest option at any given moment. Generally, ECN/STP brokers like Pepperstone or IC Markets offer very low raw spreads but charge a commission."
        }
      }
    },
    allBrokersPage: {
        title: "All Forex Brokers",
        subtitle: "Use our advanced filters to find the broker that perfectly matches your trading style and needs.",
        filtersTitle: "Filters",
        reset: "Reset",
        searchPlaceholder: "Search by broker name...",
        presetsTitle: "Trading Style Presets",
        presets: {
            scalping: "Scalping",
            algorithmic: "Algorithmic",
            copyTrading: "Copy Trading",
            swingTrading: "Swing Trading"
        },
        generalTitle: "General",
        minDeposit: "Minimum Deposit",
        minDepositOptions: {
            any: "Any Amount",
            "100": "Up to $100",
            "250": "Up to $250",
            "1000": "Up to $1000"
        },
        regulator: "Regulator",
        regulatorOptions: {
            any: "Any Regulator"
        },
        executionCostsTitle: "Execution & Costs",
        executionType: "Execution Type",
        spread: "EUR/USD Spread",
        spreadOptions: {
            any: "Any",
            ultraLow: "Ultra Low (≤ 0.5 pips)",
            low: "Low (0.6 - 1.0 pips)",
            standard: "Standard ( > 1.0 pips)"
        },
        commissions: "Commissions",
        commissionOptions: {
            any: "Any",
            commission: "Commission-based",
            zero: "Zero Commission"
        },
        techPlatformsTitle: "Technology & Platforms",
        platform: "Platform",
        algoTrading: "Algorithmic Trading",
        algoTradingOptions: {
            eaSupport: "MQL5/EA Support",
            apiAccess: "API Access"
        },
        socialTrading: "Social Trading",
        socialTradingOptions: {
            any: "Any",
            yes: "Supports Copy Trading",
            no: "No Copy Trading"
        },
        tradingConditionsTitle: "Trading Conditions",
        minLotSize: "Minimum Lot Size",
        minLotSizeOptions: {
            any: "Any",
            micro: "Micro (0.01)",
            mini: "Mini (0.1)"
        },
        maxLeverage: "Max Leverage",
        maxLeverageOptions: {
            any: "Any",
            low: "Up to 1:100",
            medium: "1:101 - 1:499",
            high: "1:500+"
        },
        results: {
            showing: "Showing {count} of {total} brokers",
            getAiRec: "Get AI Recommendation",
            aiRecTooltip: "Filter to at least 2 brokers to get a recommendation.",
            aiError: "Sorry, the AI couldn't make a recommendation. Please try again with a different filter.",
            aiPicksTitle: "AI Top Picks From Your Selection",
            aiAnalysisTitle: "AI Analysis",
            noResultsTitle: "No Brokers Match Your Criteria",
            noResultsSubtitle: "Try adjusting your filters to find more results."
        }
    },
    brokerMatcherPage: {
        title: "AI Broker Matcher",
        subtitle: "Answer a few questions and let our AI do the work.",
        steps: {
            "0": {
                title: "First, what's your trading experience?",
                options: ["Beginner", "Intermediate", "Expert"]
            },
            "1": {
                title: "What is your planned initial deposit?",
                options: ["Under $200", "$200 - $1000", "$1000 - $5000", "$5000+"]
            },
            "2": {
                title: "Any preferred trading platforms?",
                options: ["MetaTrader 4/5", "cTrader", "TradingView", "Proprietary", "I don't mind"],
                placeholder: "Or type your own..."
            },
            "3": {
                title: "Finally, what's most important to you?",
                options: ["Lowest Possible Spreads", "Top-Tier Regulation", "Best Trading Platform", "Beginner Friendly"],
                placeholder: "Or type your own..."
            }
        },
        back: "Back",
        findMyBroker: "Find My Broker",
        tooltip: "Uses AI to analyze your preferences and recommend the best brokers for you.",
        loading: "Our AI is finding your perfect broker...",
        results: {
            title: "Your Top Matches",
            aiAnalysis: "AI Analysis",
            startOver: "Start Over",
            error: "Failed to get recommendations. Please try again."
        }
    },
    comparePage: {
        title: "Compare Brokers",
        subtitle: "Side-by-side analysis of your selected brokers.",
        startDuel: "Start Duel",
        clearAll: "Clear All",
        getAiSummary: "Get AI Comparison Summary",
        aiAnalysis: "AI Analysis",
        empty: {
            title: "Your comparison list is empty.",
            subtitle: "Add brokers to compare their features side-by-side.",
            button: "Browse Brokers"
        }
    },
    compareTable: {
        feature: "Feature",
        visit: "Visit",
        remove: "Remove",
        features: {
            overallScore: "Overall Score",
            score: "Score",
            tradingCosts: "Trading Costs",
            eurusd: "EUR/USD Spread",
            gbpusd: "GBP/USD Spread",
            usdjpy: "USD/JPY Spread",
            commission: "Commission",
            swap: "Swap Fee Category",
            tradingConditions: "Trading Conditions",
            maxLeverage: "Max Leverage",
            executionType: "Execution Type",
            accessibility: "Accessibility",
            minDeposit: "Min. Deposit",
            depositMethods: "Deposit Methods",
            withdrawalMethods: "Withdrawal Methods",
            support: "Customer Support",
            technology: "Technology",
            platforms: "Platforms",
            tradableInstruments: "Tradable Instruments",
            forexPairs: "Forex Pairs",
            stocks: "Stock CFDs",
            cryptocurrencies: "Cryptocurrencies",
            trust: "Trust & Background",
            regulators: "Regulators",
            founded: "Founded",
            headquarters: "Headquarters"
        }
    },
    loginPage: {
        title: "Login to your Account",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        button: "Login",
        noAccount: "Don't have an account?",
        registerLink: "Register here"
    },
    registerPage: {
        title: "Create an Account",
        nameLabel: "Full Name",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        button: "Register",
        haveAccount: "Already have an account?",
        loginLink: "Login here"
    },
    dashboardPage: {
        welcome: "Welcome back, {name}!",
        subtitle: "This is your personal dashboard to track and manage your broker research.",
        quickActions: {
            newMatch: {
                title: "New AI Match",
                description: "Find a new broker tailored to you."
            },
            compare: {
                title: "Compare Brokers",
                description: "View your comparison list."
            },
            analyzer: {
                title: "Cost Analyzer",
                description: "Analyze live trading fees."
            },
            explore: {
                title: "Explore All Brokers",
                description: "Browse our full broker list."
            }
        },
        alerts: {
            title: "My Alerts",
            empty: "No alerts for your favorited brokers. Add some brokers to your favorites to start receiving updates!",
            button: "Explore Brokers"
        },
        history: {
            title: "Your AI Broker Match History",
            matchTitle: "Match for a {experience} Trader",
            matchSubtitle: "Priority: {priority} | {date}",
            preferences: "Your Preferences:",
            experience: "Experience:",
            deposit: "Initial Deposit:",
            platforms: "Platforms:",
            priority: "Priority:",
            any: "Any",
            aiAnalysis: "AI Analysis:",
            recommendations: "Recommended Brokers for this Match:",
            empty: "You haven't used the AI Broker Matcher yet.",
            button: "Find Your First Match"
        },
        reviews: {
            title: "My Reviews",
            reviewFor: "Review for",
            unknownBroker: "Unknown Broker",
            verify: "Verify Review",
            empty: "You haven't written any reviews yet.",
            button: "Find a Broker to Review"
        },
        favorites: {
            title: "Your Favorite Brokers",
            empty: "You haven't favorited any brokers yet. Click the star icon on a broker to save it here.",
            button: "Explore Brokers"
        },
        settings: {
            title: "Account Settings",
            email: "Email Address",
            name: "Full Name",
            password: "New Password",
            passwordPlaceholder: "Leave blank to keep current password",
            button: "Save Changes",
            success: "Profile updated successfully!",
            dangerZone: "Danger Zone",
            dangerDescription: "Deleting your account is a permanent action and cannot be undone.",
            deleteButton: "Delete My Account",
            deleteModal: {
                title: "Confirm Account Deletion",
                text: "Are you sure you want to permanently delete your account? All your data, including favorites and match history, will be lost.",
                cancel: "Cancel",
                confirm: "Yes, Delete Account"
            }
        }
    }
  },
  es: {
    header: {
      brokers: "Brokers",
      marketNews: "Noticias del Mercado",
      methodology: "Metodología",
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
      dashboard: "Mi Panel",
      megaMenu: {
        coreTools: "Herramientas Clave",
        allBrokers: "Todos los Brokers",
        compareBrokers: "Comparar Brokers",
        costAnalyzer: "Analizador de Costos",
        aiBrokerMatcher: "Asistente IA de Brokers",
        byCountry: "Por País",
        platformsAndTypes: "Plataformas y Tipos"
      }
    },
    footer: {
      subtitle: "Descubre tu broker de forex perfecto con el poder de la IA.",
      byCountry: "Por País",
      platformsAndTypes: "Plataformas y Tipos",
      resources: "Recursos",
      copyright: "© {year} Brokeranalysis. Todos los derechos reservados."
    },
    home: {
      heroTitle: "Encuentra Tu Broker de Forex Perfecto",
      heroSubtitle: "Aprovecha el poder de la IA para analizar, comparar y elegir el mejor broker adaptado a tu estilo de trading.",
      heroDataDriven: "Análisis basados en datos de docenas de brokers regulados en todo el mundo.",
      useAiMatcher: "Usar Asistente IA",
      exploreAllBrokers: "Explorar Todos los Brokers",
      trustedBy: "Con la confianza de los mejores traders",
      whyChoose: "¿Por Qué Elegir Brokeranalysis?",
      features: {
        data: {
          title: "Datos Completos",
          description: "Accede a información detallada sobre docenas de brokers, desde regulaciones hasta condiciones de trading."
        },
        matching: {
          title: "Selección con IA",
          description: "Nuestro Asistente de Brokers inteligente encuentra el broker ideal según tus preferencias únicas."
        },
        comparison: {
          title: "Comparación Directa",
          description: "Compara fácilmente las características clave de múltiples brokers en una tabla clara y concisa."
        },
        trust: {
          title: "Confianza y Seguridad",
          description: "Verificamos datos regulatorios y usamos IA para generar una puntuación de confianza dinámica para cada broker."
        }
      },
      popularCategoriesTitle: "Explora Categorías Populares",
      categories: {
        beginners: {
          title: "Mejor para Principiantes",
          description: "Encuentra plataformas fáciles de usar con depósitos bajos y excelente contenido educativo."
        },
        uk: {
          title: "Brokers del Reino Unido",
          description: "Explora brokers de primer nivel regulados por la FCA, conocidos por su sólida protección al cliente."
        },
        ecn: {
          title: "Brokers ECN",
          description: "Para traders serios que buscan acceso directo al mercado y los spreads más ajustados posibles."
        },
        copy: {
          title: "Copy Trading",
          description: "Aprovecha la experiencia de traders experimentados copiando automáticamente sus operaciones."
        }
      },
      howItWorksTitle: "Cómo Funciona en 3 Simples Pasos",
      steps: {
        "1": {
          title: "Responde Preguntas",
          description: "Cuéntanos sobre tu estilo de trading, experiencia y lo que más valoras en un broker."
        },
        "2": {
          title: "Recibe Coincidencias IA",
          description: "Nuestra IA analiza tu perfil y recomienda los mejores brokers de nuestra base de datos."
        },
        "3": {
          title: "Compara y Elige",
          description: "Usa nuestras herramientas para comparar costos, características y puntuaciones de confianza para tomar tu decisión final."
        }
      },
      socialProofTitle: "Con la Confianza de Traders de Todo el Mundo",
      testimonials: {
        "1": {
          quote: "\"El Asistente IA de Brokers es revolucionario. Me encontró un broker con spreads bajos del que nunca había oído hablar. Me ahorró horas de investigación.\"",
          author: "- Alex R., Day Trader"
        },
        "2": {
          quote: "\"Finalmente, un sitio de comparación que es realmente útil. El analizador de costos en vivo es brillante para ver las tarifas en tiempo real. Muy recomendable.\"",
          author: "- Sarah T., Swing Trader"
        }
      },
      faqTitle: "Preguntas Frecuentes",
      faqs: {
        "1": {
          q: "¿Cuál es el broker de forex más seguro?",
          a: "La seguridad depende en gran medida de la regulación. Los brokers más seguros suelen ser aquellos regulados por múltiples autoridades de primer nivel como la FCA (Reino Unido), ASIC (Australia) y FINMA (Suiza). Nuestra plataforma destaca los datos regulatorios y proporciona una Puntuación de Confianza IA para ayudarte a evaluar la seguridad del broker."
        },
        "2": {
          q: "¿Cómo elige la IA el broker adecuado para mí?",
          a: "Nuestro Asistente IA de Brokers analiza tus respuestas sobre tu estilo de trading y prioridades. Luego, compara tu perfil con nuestra base de datos de atributos de brokers para encontrar las mejores coincidencias. Es un proceso basado en datos diseñado para personalizar tu búsqueda."
        },
        "3": {
          q: "¿Qué broker tiene los costos de trading más bajos?",
          a: "Los costos son dinámicos. Nuestro Analizador de Costos en Vivo proporciona datos en tiempo real sobre spreads y comisiones para los brokers que selecciones, ayudándote a identificar la opción más barata. Generalmente, los brokers ECN/STP como Pepperstone o IC Markets ofrecen spreads muy bajos pero cobran una comisión."
        }
      }
    },
    allBrokersPage: {
        title: "Todos los Brokers de Forex",
        subtitle: "Usa nuestros filtros avanzados para encontrar el broker que se ajuste perfectamente a tu estilo y necesidades.",
        filtersTitle: "Filtros",
        reset: "Reiniciar",
        searchPlaceholder: "Buscar por nombre de broker...",
        presetsTitle: "Estilos de Trading",
        presets: {
            scalping: "Scalping",
            algorithmic: "Algorítmico",
            copyTrading: "Copy Trading",
            swingTrading: "Swing Trading"
        },
        generalTitle: "General",
        minDeposit: "Depósito Mínimo",
        minDepositOptions: {
            any: "Cualquier Cantidad",
            "100": "Hasta $100",
            "250": "Hasta $250",
            "1000": "Hasta $1000"
        },
        regulator: "Regulador",
        regulatorOptions: {
            any: "Cualquier Regulador"
        },
        executionCostsTitle: "Ejecución y Costos",
        executionType: "Tipo de Ejecución",
        spread: "Spread EUR/USD",
        spreadOptions: {
            any: "Cualquiera",
            ultraLow: "Ultra Bajo (≤ 0.5 pips)",
            low: "Bajo (0.6 - 1.0 pips)",
            standard: "Estándar ( > 1.0 pips)"
        },
        commissions: "Comisiones",
        commissionOptions: {
            any: "Cualquiera",
            commission: "Basado en Comisión",
            zero: "Comisión Cero"
        },
        techPlatformsTitle: "Tecnología y Plataformas",
        platform: "Plataforma",
        algoTrading: "Trading Algorítmico",
        algoTradingOptions: {
            eaSupport: "Soporte MQL5/EA",
            apiAccess: "Acceso API"
        },
        socialTrading: "Trading Social",
        socialTradingOptions: {
            any: "Cualquiera",
            yes: "Soporta Copy Trading",
            no: "Sin Copy Trading"
        },
        tradingConditionsTitle: "Condiciones de Trading",
        minLotSize: "Tamaño Mínimo de Lote",
        minLotSizeOptions: {
            any: "Cualquiera",
            micro: "Micro (0.01)",
            mini: "Mini (0.1)"
        },
        maxLeverage: "Apalancamiento Máximo",
        maxLeverageOptions: {
            any: "Cualquiera",
            low: "Hasta 1:100",
            medium: "1:101 - 1:499",
            high: "1:500+"
        },
        results: {
            showing: "Mostrando {count} de {total} brokers",
            getAiRec: "Obtener Recomendación IA",
            aiRecTooltip: "Filtra a por lo menos 2 brokers para obtener una recomendación.",
            aiError: "Lo sentimos, la IA no pudo hacer una recomendación. Por favor, intenta con un filtro diferente.",
            aiPicksTitle: "Selección Destacada de la IA",
            aiAnalysisTitle: "Análisis de IA",
            noResultsTitle: "Ningún Broker Coincide con Tus Criterios",
            noResultsSubtitle: "Intenta ajustar tus filtros para encontrar más resultados."
        }
    },
    brokerMatcherPage: {
        title: "Asistente IA de Brokers",
        subtitle: "Responde unas preguntas y deja que nuestra IA haga el trabajo.",
        steps: {
            "0": {
                title: "Primero, ¿cuál es tu experiencia en trading?",
                options: ["Principiante", "Intermedio", "Experto"]
            },
            "1": {
                title: "¿Cuál es tu depósito inicial planeado?",
                options: ["Menos de $200", "$200 - $1000", "$1000 - $5000", "$5000+"]
            },
            "2": {
                title: "¿Alguna plataforma de trading preferida?",
                options: ["MetaTrader 4/5", "cTrader", "TradingView", "Propia", "No me importa"],
                placeholder: "O escribe la tuya..."
            },
            "3": {
                title: "Finalmente, ¿qué es lo más importante para ti?",
                options: ["Spreads más bajos", "Regulación de primer nivel", "La mejor plataforma", "Amigable para principiantes"],
                placeholder: "O escribe la tuya..."
            }
        },
        back: "Atrás",
        findMyBroker: "Encontrar Mi Broker",
        tooltip: "Usa IA para analizar tus preferencias y recomendar los mejores brokers para ti.",
        loading: "Nuestra IA está encontrando tu broker perfecto...",
        results: {
            title: "Tus Mejores Coincidencias",
            aiAnalysis: "Análisis de IA",
            startOver: "Empezar de Nuevo",
            error: "Fallo al obtener recomendaciones. Por favor, intenta de nuevo."
        }
    },
    comparePage: {
        title: "Comparar Brokers",
        subtitle: "Análisis lado a lado de tus brokers seleccionados.",
        startDuel: "Iniciar Duelo",
        clearAll: "Limpiar Todo",
        getAiSummary: "Obtener Resumen IA",
        aiAnalysis: "Análisis de IA",
        empty: {
            title: "Tu lista de comparación está vacía.",
            subtitle: "Añade brokers para comparar sus características lado a lado.",
            button: "Explorar Brokers"
        }
    },
    compareTable: {
        feature: "Característica",
        visit: "Visitar",
        remove: "Quitar",
        features: {
            overallScore: "Puntuación General",
            score: "Puntuación",
            tradingCosts: "Costos de Trading",
            eurusd: "Spread EUR/USD",
            gbpusd: "Spread GBP/USD",
            usdjpy: "Spread USD/JPY",
            commission: "Comisión",
            swap: "Categoría de Swap",
            tradingConditions: "Condiciones de Trading",
            maxLeverage: "Apalancamiento Máx.",
            executionType: "Tipo de Ejecución",
            accessibility: "Accesibilidad",
            minDeposit: "Depósito Mín.",
            depositMethods: "Métodos de Depósito",
            withdrawalMethods: "Métodos de Retiro",
            support: "Atención al Cliente",
            technology: "Tecnología",
            platforms: "Plataformas",
            tradableInstruments: "Instrumentos Negociables",
            forexPairs: "Pares de Forex",
            stocks: "CFDs de Acciones",
            cryptocurrencies: "Criptomonedas",
            trust: "Confianza y Antecedentes",
            regulators: "Reguladores",
            founded: "Fundado en",
            headquarters: "Sede"
        }
    },
    loginPage: {
        title: "Inicia sesión en tu cuenta",
        emailLabel: "Correo Electrónico",
        passwordLabel: "Contraseña",
        button: "Iniciar Sesión",
        noAccount: "¿No tienes una cuenta?",
        registerLink: "Regístrate aquí"
    },
    registerPage: {
        title: "Crear una Cuenta",
        nameLabel: "Nombre Completo",
        emailLabel: "Correo Electrónico",
        passwordLabel: "Contraseña",
        button: "Registrarse",
        haveAccount: "¿Ya tienes una cuenta?",
        loginLink: "Inicia sesión aquí"
    },
    dashboardPage: {
        welcome: "¡Bienvenido de nuevo, {name}!",
        subtitle: "Este es tu panel personal para seguir y gestionar tu investigación de brokers.",
        quickActions: {
            newMatch: {
                title: "Nuevo Match IA",
                description: "Encuentra un nuevo broker a tu medida."
            },
            compare: {
                title: "Comparar Brokers",
                description: "Ver tu lista de comparación."
            },
            analyzer: {
                title: "Analizador de Costos",
                description: "Analiza las tarifas de trading en vivo."
            },
            explore: {
                title: "Explorar Brokers",
                description: "Navega por nuestra lista completa."
            }
        },
        alerts: {
            title: "Mis Alertas",
            empty: "No hay alertas para tus brokers favoritos. ¡Añade algunos a favoritos para empezar a recibir actualizaciones!",
            button: "Explorar Brokers"
        },
        history: {
            title: "Tu Historial de Matches con IA",
            matchTitle: "Match para un Trader {experience}",
            matchSubtitle: "Prioridad: {priority} | {date}",
            preferences: "Tus Preferencias:",
            experience: "Experiencia:",
            deposit: "Depósito Inicial:",
            platforms: "Plataformas:",
            priority: "Prioridad:",
            any: "Cualquiera",
            aiAnalysis: "Análisis de IA:",
            recommendations: "Brokers Recomendados para este Match:",
            empty: "Aún no has usado el Asistente IA de Brokers.",
            button: "Encuentra tu Primer Match"
        },
        reviews: {
            title: "Mis Reseñas",
            reviewFor: "Reseña para",
            unknownBroker: "Broker Desconocido",
            verify: "Verificar Reseña",
            empty: "Aún no has escrito ninguna reseña.",
            button: "Encontrar un Broker para Reseñar"
        },
        favorites: {
            title: "Tus Brokers Favoritos",
            empty: "No has añadido ningún broker a favoritos. Haz clic en el icono de estrella para guardarlo aquí.",
            button: "Explorar Brokers"
        },
        settings: {
            title: "Configuración de la Cuenta",
            email: "Correo Electrónico",
            name: "Nombre Completo",
            password: "Nueva Contraseña",
            passwordPlaceholder: "Dejar en blanco para mantener la actual",
            button: "Guardar Cambios",
            success: "¡Perfil actualizado con éxito!",
            dangerZone: "Zona de Peligro",
            dangerDescription: "Eliminar tu cuenta es una acción permanente y no se puede deshacer.",
            deleteButton: "Eliminar Mi Cuenta",
            deleteModal: {
                title: "Confirmar Eliminación de Cuenta",
                text: "¿Estás seguro de que quieres eliminar tu cuenta permanentemente? Todos tus datos se perderán.",
                cancel: "Cancelar",
                confirm: "Sí, Eliminar Cuenta"
            }
        }
    }
  },
  ar: {
    header: {
      brokers: "الوسطاء",
      marketNews: "أخبار السوق",
      methodology: "المنهجية",
      login: "تسجيل الدخول",
      register: "التسجيل",
      logout: "تسجيل الخروج",
      dashboard: "لوحة التحكم",
      megaMenu: {
        coreTools: "الأدوات الأساسية",
        allBrokers: "كل الوسطاء",
        compareBrokers: "مقارنة الوسطاء",
        costAnalyzer: "محلل التكاليف",
        aiBrokerMatcher: "مساعد الذكاء الاصطناعي",
        byCountry: "حسب البلد",
        platformsAndTypes: "المنصات والأنواع"
      }
    },
    footer: {
      subtitle: "اكتشف وسيط الفوركس المثالي لك بقوة الذكاء الاصطناعي.",
      byCountry: "حسب البلد",
      platformsAndTypes: "المنصات والأنواع",
      resources: "المصادر",
      copyright: "© {year} Brokeranalysis. جميع الحقوق محفوظة."
    },
    home: {
      heroTitle: "ابحث عن وسيط الفوركس المثالي لك",
      heroSubtitle: "استفد من قوة الذكاء الاصطناعي لتحليل ومقارنة واختيار أفضل وسيط مصمم خصيصًا لأسلوب تداولك.",
      heroDataDriven: "رؤى قائمة على البيانات حول العشرات من الوسطاء المنظمين في جميع أنحاء العالم.",
      useAiMatcher: "استخدم مساعد الذكاء الاصطناعي",
      exploreAllBrokers: "استكشف جميع الوسطاء",
      trustedBy: "موثوق به من قبل كبار المتداولين",
      whyChoose: "لماذا تختار Brokeranalysis؟",
      features: {
        data: {
          title: "بيانات شاملة",
          description: "احصل على معلومات مفصلة عن عشرات الوسطاء، من اللوائح التنظيمية إلى شروط التداول."
        },
        matching: {
          title: "مطابقة مدعومة بالذكاء الاصطناعي",
          description: "يجد مساعد الوسطاء الذكي الخاص بنا الوسيط المثالي بناءً على تفضيلاتك الفريدة."
        },
        comparison: {
          title: "مقارنة جنبًا إلى جنب",
          description: "قارن بسهولة الميزات الرئيسية لعدة وسطاء في جدول واضح وموجز."
        },
        trust: {
          title: "الثقة والأمان",
          description: "نتحقق من البيانات التنظيمية ونستخدم الذكاء الاصطناعي لإنشاء درجة ثقة ديناميكية لكل وسيط."
        }
      },
      popularCategoriesTitle: "استكشف الفئات الشائعة",
      categories: {
        beginners: {
          title: "الأفضل للمبتدئين",
          description: "ابحث عن منصات سهلة الاستخدام مع إيداعات منخفضة ومحتوى تعليمي رائع."
        },
        uk: {
          title: "وسطاء الفوركس في المملكة المتحدة",
          description: "استكشف وسطاء من الدرجة الأولى منظمين من قبل FCA، ومعروفين بحماية العملاء القوية."
        },
        ecn: {
          title: "وسطاء ECN",
          description: "للمتداولين الجادين الذين يبحثون عن وصول مباشر للسوق وأضيق فروق أسعار ممكنة."
        },
        copy: {
          title: "نسخ التداول",
          description: "استفد من خبرة المتداولين المخضرمين عن طريق نسخ صفقاتهم تلقائيًا."
        }
      },
      howItWorksTitle: "كيف يعمل في 3 خطوات بسيطة",
      steps: {
        "1": {
          title: "أجب عن الأسئلة",
          description: "أخبرنا عن أسلوب تداولك وخبرتك وما تقدره أكثر في الوسيط."
        },
        "2": {
          title: "احصل على مطابقات الذكاء الاصطناعي",
          description: "يحلل ذكاؤنا الاصطناعي ملفك الشخصي ويوصي بأفضل الوسطاء من قاعدة بياناتنا."
        },
        "3": {
          title: "قارن واختر",
          description: "استخدم أدواتنا لمقارنة التكاليف والميزات ودرجات الثقة لاتخاذ قرارك النهائي."
        }
      },
      socialProofTitle: "موثوق به من قبل المتداولين في جميع أنحاء العالم",
      testimonials: {
        "1": {
          quote: "\"مساعد الذكاء الاصطناعي للوسطاء يغير قواعد اللعبة. لقد وجد لي وسيطًا بفروق أسعار منخفضة لم أسمع به من قبل. وفر عليّ ساعات من البحث.\"",
          author: "- أليكس ر.، متداول يومي"
        },
        "2": {
          quote: "\"أخيرًا، موقع مقارنة مفيد بالفعل. محلل التكاليف المباشر رائع لرؤية الرسوم في الوقت الفعلي. موصى به للغاية.\"",
          author: "- سارة ت.، متداولة متأرجحة"
        }
      },
      faqTitle: "الأسئلة الشائعة",
      faqs: {
        "1": {
          q: "ما هو أكثر وسطاء الفوركس أمانًا؟",
          a: "يعتمد الأمان بشكل كبير على التنظيم. عادة ما يكون الوسطاء الأكثر أمانًا هم أولئك الذين تنظمهم سلطات متعددة من الدرجة الأولى مثل FCA (المملكة المتحدة) و ASIC (أستراليا) و FINMA (سويسرا). تسلط منصتنا الضوء على البيانات التنظيمية وتوفر درجة ثقة بالذكاء الاصطناعي لمساعدتك في تقييم أمان الوسيط."
        },
        "2": {
          q: "كيف يختار الذكاء الاصطناعي الوسيط المناسب لي؟",
          a: "يحلل مساعد الذكاء الاصطناعي للوسطاء إجاباتك على الأسئلة المتعلقة بأسلوب تداولك وأولوياتك. ثم يقارن ملفك الشخصي بقاعدة بياناتنا لسمات الوسطاء للعثور على أفضل التطابقات. إنها عملية تعتمد على البيانات ومصممة لتخصيص بحثك."
        },
        "3": {
          q: "أي وسيط لديه أقل تكاليف تداول؟",
          a: "التكاليف ديناميكية. يوفر محلل التكاليف المباشر لدينا بيانات في الوقت الفعلي عن فروق الأسعار والعمولات للوسطاء الذين تختارهم، مما يساعدك على تحديد الخيار الأرخص. بشكل عام، يقدم وسطاء ECN/STP مثل Pepperstone أو IC Markets فروق أسعار خام منخفضة جدًا ولكنهم يفرضون عمولة."
        }
      }
    },
     allBrokersPage: {
        title: "جميع وسطاء الفوركس",
        subtitle: "استخدم فلاترنا المتقدمة للعثور على الوسيط الذي يتناسب تمامًا مع أسلوب تداولك واحتياجاتك.",
        filtersTitle: "الفلاتر",
        reset: "إعادة تعيين",
        searchPlaceholder: "ابحث باسم الوسيط...",
        presetsTitle: "أنماط التداول",
        presets: {
            scalping: "سكالبينج",
            algorithmic: "تداول خوارزمي",
            copyTrading: "نسخ التداول",
            swingTrading: "تداول متأرجح"
        },
        generalTitle: "عام",
        minDeposit: "الحد الأدنى للإيداع",
        minDepositOptions: {
            any: "أي مبلغ",
            "100": "حتى 100 دولار",
            "250": "حتى 250 دولار",
            "1000": "حتى 1000 دولار"
        },
        regulator: "الهيئة التنظيمية",
        regulatorOptions: {
            any: "أي هيئة"
        },
        executionCostsTitle: "التنفيذ والتكاليف",
        executionType: "نوع التنفيذ",
        spread: "سبريد EUR/USD",
        spreadOptions: {
            any: "أي",
            ultraLow: "منخفض جدًا (≤ 0.5 نقطة)",
            low: "منخفض (0.6 - 1.0 نقطة)",
            standard: "قياسي (> 1.0 نقطة)"
        },
        commissions: "العمولات",
        commissionOptions: {
            any: "أي",
            commission: "بعمولة",
            zero: "بدون عمولة"
        },
        techPlatformsTitle: "التكنولوجيا والمنصات",
        platform: "المنصة",
        algoTrading: "التداول الخوارزمي",
        algoTradingOptions: {
            eaSupport: "دعم MQL5/EA",
            apiAccess: "وصول API"
        },
        socialTrading: "التداول الاجتماعي",
        socialTradingOptions: {
            any: "أي",
            yes: "يدعم نسخ التداول",
            no: "لا يدعم نسخ التداول"
        },
        tradingConditionsTitle: "شروط التداول",
        minLotSize: "أدنى حجم لوت",
        minLotSizeOptions: {
            any: "أي",
            micro: "مايكرو (0.01)",
            mini: "ميني (0.1)"
        },
        maxLeverage: "أقصى رافعة مالية",
        maxLeverageOptions: {
            any: "أي",
            low: "حتى 1:100",
            medium: "1:101 - 1:499",
            high: "1:500+"
        },
        results: {
            showing: "عرض {count} من {total} وسيط",
            getAiRec: "احصل على توصية الذكاء الاصطناعي",
            aiRecTooltip: "قم بالتصفية لاختيار وسيطين على الأقل للحصول على توصية.",
            aiError: "عذرًا، لم يتمكن الذكاء الاصطناعي من تقديم توصية. يرجى المحاولة مرة أخرى بفلتر مختلف.",
            aiPicksTitle: "أفضل اختيارات الذكاء الاصطناعي من تحديدك",
            aiAnalysisTitle: "تحليل الذكاء الاصطناعي",
            noResultsTitle: "لا يوجد وسطاء يطابقون معاييرك",
            noResultsSubtitle: "حاول تعديل فلاترك للعثور على المزيد من النتائج."
        }
    },
    brokerMatcherPage: {
        title: "مساعد الذكاء الاصطناعي للوسطاء",
        subtitle: "أجب عن بعض الأسئلة ودع الذكاء الاصطناعي يقوم بالعمل.",
        steps: {
            "0": {
                title: "أولاً، ما هي خبرتك في التداول؟",
                options: ["مبتدئ", "متوسط", "خبير"]
            },
            "1": {
                title: "ما هو إيداعك الأولي المخطط له؟",
                options: ["أقل من 200 دولار", "200 - 1000 دولار", "1000 - 5000 دولار", "5000+ دولار"]
            },
            "2": {
                title: "هل لديك منصات تداول مفضلة؟",
                options: ["MetaTrader 4/5", "cTrader", "TradingView", "خاصة بالوسيط", "لا أمانع"],
                placeholder: "أو اكتب بنفسك..."
            },
            "3": {
                title: "أخيرًا، ما هو الأهم بالنسبة لك؟",
                options: ["أقل فروق أسعار ممكنة", "تنظيم من الدرجة الأولى", "أفضل منصة تداول", "سهل للمبتدئين"],
                placeholder: "أو اكتب بنفسك..."
            }
        },
        back: "رجوع",
        findMyBroker: "ابحث عن وسيطي",
        tooltip: "يستخدم الذكاء الاصطناعي لتحليل تفضيلاتك والتوصية بأفضل الوسطاء لك.",
        loading: "يقوم ذكاؤنا الاصطناعي بالبحث عن وسيطك المثالي...",
        results: {
            title: "أفضل المطابقات لك",
            aiAnalysis: "تحليل الذكاء الاصطناعي",
            startOver: "ابدأ من جديد",
            error: "فشل في الحصول على توصيات. يرجى المحاولة مرة أخرى."
        }
    },
    comparePage: {
        title: "مقارنة الوسطاء",
        subtitle: "تحليل مقارن للوسطاء الذين اخترتهم.",
        startDuel: "بدء المبارزة",
        clearAll: "مسح الكل",
        getAiSummary: "احصل على ملخص الذكاء الاصطناعي",
        aiAnalysis: "تحليل الذكاء الاصطناعي",
        empty: {
            title: "قائمة المقارنة فارغة.",
            subtitle: "أضف وسطاء لمقارنة ميزاتهم جنبًا إلى جنب.",
            button: "تصفح الوسطاء"
        }
    },
    compareTable: {
        feature: "الميزة",
        visit: "زيارة",
        remove: "إزالة",
        features: {
            overallScore: "التقييم العام",
            score: "التقييم",
            tradingCosts: "تكاليف التداول",
            eurusd: "سبريد EUR/USD",
            gbpusd: "سبريد GBP/USD",
            usdjpy: "سبريد USD/JPY",
            commission: "العمولة",
            swap: "فئة رسوم التبييت",
            tradingConditions: "شروط التداول",
            maxLeverage: "الرافعة المالية القصوى",
            executionType: "نوع التنفيذ",
            accessibility: "إمكانية الوصول",
            minDeposit: "أدنى إيداع",
            depositMethods: "طرق الإيداع",
            withdrawalMethods: "طرق السحب",
            support: "دعم العملاء",
            technology: "التكنولوجيا",
            platforms: "المنصات",
            tradableInstruments: "الأدوات القابلة للتداول",
            forexPairs: "أزواج الفوركس",
            stocks: "عقود فروقات الأسهم",
            cryptocurrencies: "العملات المشفرة",
            trust: "الثقة والخلفية",
            regulators: "الهيئات التنظيمية",
            founded: "سنة التأسيس",
            headquarters: "المقر الرئيسي"
        }
    },
    loginPage: {
        title: "تسجيل الدخول إلى حسابك",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        button: "تسجيل الدخول",
        noAccount: "ليس لديك حساب؟",
        registerLink: "سجل هنا"
    },
    registerPage: {
        title: "إنشاء حساب",
        nameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        button: "تسجيل",
        haveAccount: "هل لديك حساب بالفعل؟",
        loginLink: "سجل الدخول هنا"
    },
    dashboardPage: {
        welcome: "مرحبًا بعودتك، {name}!",
        subtitle: "هذه لوحة التحكم الشخصية الخاصة بك لتتبع وإدارة أبحاثك عن الوسطاء.",
        quickActions: {
            newMatch: {
                title: "مطابقة جديدة بالذكاء الاصطناعي",
                description: "ابحث عن وسيط جديد مصمم خصيصًا لك."
            },
            compare: {
                title: "مقارنة الوسطاء",
                description: "عرض قائمة المقارنة الخاصة بك."
            },
            analyzer: {
                title: "محلل التكاليف",
                description: "تحليل رسوم التداول الحية."
            },
            explore: {
                title: "استكشاف جميع الوسطاء",
                description: "تصفح قائمتنا الكاملة للوسطاء."
            }
        },
        alerts: {
            title: "تنبيهاتي",
            empty: "لا توجد تنبيهات للوسطاء المفضلين لديك. أضف بعض الوسطاء إلى مفضلتك لبدء تلقي التحديثات!",
            button: "استكشاف الوسطاء"
        },
        history: {
            title: "سجل مطابقات الذكاء الاصطناعي الخاص بك",
            matchTitle: "مطابقة لمتداول {experience}",
            matchSubtitle: "الأولوية: {priority} | {date}",
            preferences: "تفضيلاتك:",
            experience: "الخبرة:",
            deposit: "الإيداع الأولي:",
            platforms: "المنصات:",
            priority: "الأولوية:",
            any: "أي",
            aiAnalysis: "تحليل الذكاء الاصطناعي:",
            recommendations: "الوسطاء الموصى بهم لهذه المطابقة:",
            empty: "لم تستخدم مساعد الذكاء الاصطناعي للوسطاء بعد.",
            button: "ابحث عن أول مطابقة لك"
        },
        reviews: {
            title: "مراجعاتي",
            reviewFor: "مراجعة لـ",
            unknownBroker: "وسيط غير معروف",
            verify: "التحقق من المراجعة",
            empty: "لم تكتب أي مراجعات بعد.",
            button: "ابحث عن وسيط لمراجعته"
        },
        favorites: {
            title: "الوسطاء المفضلون لديك",
            empty: "لم تقم بتفضيل أي وسطاء بعد. انقر على أيقونة النجمة على وسيط لحفظه هنا.",
            button: "استكشاف الوسطاء"
        },
        settings: {
            title: "إعدادات الحساب",
            email: "البريد الإلكتروني",
            name: "الاسم الكامل",
            password: "كلمة المرور الجديدة",
            passwordPlaceholder: "اتركها فارغة للحفاظ على كلمة المرور الحالية",
            button: "حفظ التغييرات",
            success: "تم تحديث الملف الشخصي بنجاح!",
            dangerZone: "منطقة الخطر",
            dangerDescription: "حذف حسابك هو إجراء دائم ولا يمكن التراجع عنه.",
            deleteButton: "حذف حسابي",
            deleteModal: {
                title: "تأكيد حذف الحساب",
                text: "هل أنت متأكد من أنك تريد حذف حسابك بشكل دائم؟ سيتم فقدان جميع بياناتك، بما في ذلك المفضلة وسجل المطابقات.",
                cancel: "إلغاء",
                confirm: "نعم، احذف الحساب"
            }
        }
    }
  },
  zh: {
    header: { brokers: "经纪商", marketNews: "市场新闻", methodology: "方法论", login: "登录", register: "注册", logout: "登出", dashboard: "我的仪表板", megaMenu: { coreTools: "核心工具", allBrokers: "所有经纪商", compareBrokers: "比较经纪商", costAnalyzer: "成本分析器", aiBrokerMatcher: "AI经纪商匹配器", byCountry: "按国家", platformsAndTypes: "平台与类型" } },
    footer: { subtitle: "借助AI的力量，发现您完美的外汇经纪商。", byCountry: "按国家", platformsAndTypes: "平台与类型", resources: "资源", copyright: "© {year} Brokeranalysis. 版权所有。" },
    home: { heroTitle: "找到您完美的外汇经纪商", heroSubtitle: "利用AI的力量分析、比较并选择最适合您交易风格的经纪商。", heroDataDriven: "全球数十家受监管经纪商的数据驱动洞察。", useAiMatcher: "使用AI经纪商匹配器", exploreAllBrokers: "浏览所有经纪商", trustedBy: "深受顶尖交易者信赖", whyChoose: "为何选择 Brokeranalysis？", features: { data: { title: "全面数据", description: "获取数十家经纪商的详细信息，从监管到交易条件。" }, matching: { title: "AI驱动匹配", description: "我们的智能经纪商匹配器根据您的独特偏好找到理想的经纪商。" }, comparison: { title: "并排比较", description: "在一个清晰简洁的表格中轻松比较多家经纪商的关键特性。" }, trust: { title: "信任与安全", description: "我们验证监管数据，并使用AI为每家经纪商生成动态信任评分。" } }, popularCategoriesTitle: "探索热门分类", categories: { beginners: { title: "最适合初学者", description: "寻找用户友好的平台，低入金门槛和优质教育内容。" }, uk: { title: "英国外汇经纪商", description: "探索受FCA监管的顶级经纪商，以其强大的客户保护而闻名。" }, ecn: { title: "ECN经纪商", description: "为寻求直接市场准入和最窄点差的专业交易者而设。" }, copy: { title: "复制交易", description: "通过自动复制经验丰富的交易者的交易来利用他们的专业知识。" } }, howItWorksTitle: "简单三步，轻松上手", steps: { "1": { title: "回答问题", description: "告诉我们您的交易风格、经验以及您最看重经纪商的哪些方面。" }, "2": { title: "获取AI匹配", description: "我们的AI会分析您的个人资料，并从我们的数据库中推荐顶级经纪商。" }, "3": { title: "比较与选择", description: "使用我们的工具比较成本、功能和信任评分，做出最终选择。" } }, socialProofTitle: "深受全球交易者信赖", testimonials: { "1": { quote: "“AI经纪商匹配器改变了游戏规则。它为我找到了一个我从未听说过的低点差经纪商。为我节省了数小时的研究时间。”", author: "- Alex R.，日内交易者" }, "2": { quote: "“终于有了一个真正有用的比较网站。实时成本分析器对于查看实时费用非常棒。强烈推荐。”", author: "- Sarah T.，波段交易者" } }, faqTitle: "常见问题解答", faqs: { "1": { q: "哪个外汇经纪商最安全？", a: "安全性在很大程度上取决于监管。最安全的经纪商通常是受多个顶级机构监管的，如FCA（英国）、ASIC（澳大利亚）和FINMA（瑞士）。我们的平台会突出显示监管数据，并提供AI信任评分以帮助您评估经纪商的安全性。" }, "2": { q: "AI如何为我选择合适的经纪商？", a: "我们的AI经纪商匹配器会分析您关于交易风格和优先事项问题的答案。然后，它将您的个人资料与我们的经纪商属性数据库（如成本、平台和监管）进行比较，以找到最接近的匹配项。这是一个旨在个性化您搜索的数据驱动过程。" }, "3": { q: "哪个经纪商的交易成本最低？", a: "交易成本是动态的，取决于您交易的品种。我们的实时成本分析器为您选择的经纪商提供点差和佣金的实时数据，帮助您随时确定最便宜的选择。通常，像Pepperstone或IC Markets这样的ECN/STP经纪商提供非常低的点差，但会收取佣金。" } } },
    allBrokersPage: { title: "所有外汇经纪商", subtitle: "使用我们的高级筛选器，找到完全匹配您交易风格和需求的经纪商。", filtersTitle: "筛选器", reset: "重置", searchPlaceholder: "按经纪商名称搜索...", presetsTitle: "交易风格预设", presets: { scalping: "剥头皮", algorithmic: "算法交易", copyTrading: "复制交易", swingTrading: "波段交易" }, generalTitle: "通用", minDeposit: "最低入金", minDepositOptions: { any: "任何金额", "100": "最高$100", "250": "最高$250", "1000": "最高$1000" }, regulator: "监管机构", regulatorOptions: { any: "任何监管机构" }, executionCostsTitle: "执行与成本", executionType: "执行类型", spread: "EUR/USD 点差", spreadOptions: { any: "任何", ultraLow: "超低 (≤ 0.5 点)", low: "低 (0.6 - 1.0 点)", standard: "标准 (> 1.0 点)" }, commissions: "佣金", commissionOptions: { any: "任何", commission: "基于佣金", zero: "零佣金" }, techPlatformsTitle: "技术与平台", platform: "平台", algoTrading: "算法交易", algoTradingOptions: { eaSupport: "MQL5/EA 支持", apiAccess: "API 访问" }, socialTrading: "社交交易", socialTradingOptions: { any: "任何", yes: "支持复制交易", no: "无复制交易" }, tradingConditionsTitle: "交易条件", minLotSize: "最小手数", minLotSizeOptions: { any: "任何", micro: "微型手 (0.01)", mini: "迷你手 (0.1)" }, maxLeverage: "最大杠杆", maxLeverageOptions: { any: "任何", low: "最高 1:100", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "显示 {total} 个经纪商中的 {count} 个", getAiRec: "获取AI推荐", aiRecTooltip: "至少筛选出2个经纪商以获取推荐。", aiError: "抱歉，AI无法提供推荐。请尝试使用不同的筛选条件。", aiPicksTitle: "AI从您的选择中精选", aiAnalysisTitle: "AI分析", noResultsTitle: "没有符合您条件的经纪商", noResultsSubtitle: "尝试调整您的筛选条件以查找更多结果。" } },
    brokerMatcherPage: { title: "AI经纪商匹配器", subtitle: "回答几个问题，让我们的AI来完成工作。", steps: { "0": { title: "首先，您的交易经验如何？", options: ["初学者", "中级", "专家"] }, "1": { title: "您计划的初始入金是多少？", options: ["$200以下", "$200 - $1000", "$1000 - $5000", "$5000以上"] }, "2": { title: "有偏好的交易平台吗？", options: ["MetaTrader 4/5", "cTrader", "TradingView", "自研平台", "无所谓"], placeholder: "或者自己输入..." }, "3": { title: "最后，对您来说最重要的是什么？", options: ["最低点差", "顶级监管", "最佳交易平台", "适合初学者"], placeholder: "或者自己输入..." } }, back: "返回", findMyBroker: "找到我的经纪商", tooltip: "使用AI分析您的偏好并为您推荐最佳经纪商。", loading: "我们的AI正在为您寻找完美的经纪商...", results: { title: "您的最佳匹配", aiAnalysis: "AI分析", startOver: "重新开始", error: "获取推荐失败。请重试。" } },
    comparePage: { title: "比较经纪商", subtitle: "对您选择的经纪商进行并排分析。", startDuel: "开始对决", clearAll: "全部清除", getAiSummary: "获取AI比较摘要", aiAnalysis: "AI分析", empty: { title: "您的比较列表是空的。", subtitle: "添加经纪商以并排比较他们的功能。", button: "浏览经纪商" } },
    compareTable: { feature: "功能", visit: "访问", remove: "移除", features: { overallScore: "综合评分", score: "评分", tradingCosts: "交易成本", eurusd: "EUR/USD 点差", gbpusd: "GBP/USD 点差", usdjpy: "USD/JPY 点差", commission: "佣金", swap: "隔夜利息类别", tradingConditions: "交易条件", maxLeverage: "最大杠杆", executionType: "执行类型", accessibility: "易用性", minDeposit: "最低入金", depositMethods: "入金方式", withdrawalMethods: "出金方式", support: "客户支持", technology: "技术", platforms: "平台", tradableInstruments: "可交易品种", forexPairs: "外汇对", stocks: "股票差价合约", cryptocurrencies: "加密货币", trust: "信任与背景", regulators: "监管机构", founded: "成立年份", headquarters: "总部" } },
    loginPage: { title: "登录您的账户", emailLabel: "电子邮件地址", passwordLabel: "密码", button: "登录", noAccount: "没有账户？", registerLink: "在此注册" },
    registerPage: { title: "创建账户", nameLabel: "全名", emailLabel: "电子邮件地址", passwordLabel: "密码", button: "注册", haveAccount: "已经有账户了？", loginLink: "在此登录" },
    dashboardPage: { welcome: "欢迎回来, {name}!", subtitle: "这是您跟踪和管理经纪商研究的个人仪表板。", quickActions: { newMatch: { title: "新的AI匹配", description: "为您量身定制寻找新的经纪商。" }, compare: { title: "比较经纪商", description: "查看您的比较列表。" }, analyzer: { title: "成本分析器", description: "分析实时交易费用。" }, explore: { title: "浏览所有经纪商", description: "浏览我们的完整经纪商列表。" } }, alerts: { title: "我的警报", empty: "您收藏的经纪商没有警报。收藏一些经纪商以开始接收更新！", button: "浏览经纪商" }, history: { title: "您的AI经纪商匹配历史", matchTitle: "为{experience}交易者的匹配", matchSubtitle: "优先考虑: {priority} | {date}", preferences: "您的偏好:", experience: "经验:", deposit: "初始入金:", platforms: "平台:", priority: "优先考虑:", any: "任何", aiAnalysis: "AI分析:", recommendations: "此匹配的推荐经纪商:", empty: "您尚未使用过AI经纪商匹配器。", button: "找到您的第一个匹配" }, reviews: { title: "我的评价", reviewFor: "对", unknownBroker: "未知经纪商", verify: "验证评价", empty: "您尚未撰写任何评价。", button: "寻找经纪商进行评价" }, favorites: { title: "您收藏的经纪商", empty: "您尚未收藏任何经纪商。点击经纪商上的星形图标以在此处保存。", button: "浏览经纪商" }, settings: { title: "账户设置", email: "电子邮件地址", name: "全名", password: "新密码", passwordPlaceholder: "留空以保留当前密码", button: "保存更改", success: "个人资料更新成功！", dangerZone: "危险区", dangerDescription: "删除您的账户是永久性操作，无法撤销。", deleteButton: "删除我的账户", deleteModal: { title: "确认删除账户", text: "您确定要永久删除您的账户吗？您的所有数据，包括收藏夹和匹配历史，都将丢失。", cancel: "取消", confirm: "是的，删除账户" } } }
  },
  hi: {
    header: { brokers: "ब्रोकर", marketNews: "बाज़ार समाचार", methodology: "कार्यप्रणाली", login: "लॉग इन करें", register: "पंजीकरण करें", logout: "लॉग आउट", dashboard: "मेरा डैशबोर्ड", megaMenu: { coreTools: "मुख्य उपकरण", allBrokers: "सभी ब्रोकर", compareBrokers: "ब्रोकर की तुलना करें", costAnalyzer: "लागत विश्लेषक", aiBrokerMatcher: "AI ब्रोकर मैचमेकर", byCountry: "देश के अनुसार", platformsAndTypes: "प्लेटफार्म और प्रकार" } },
    footer: { subtitle: "AI की शक्ति से अपना आदर्श विदेशी मुद्रा ब्रोकर खोजें।", byCountry: "देश के अनुसार", platformsAndTypes: "प्लेटफार्म और प्रकार", resources: "संसाधन", copyright: "© {year} Brokeranalysis. सर्वाधिकार सुरक्षित।" },
    home: { heroTitle: "अपना आदर्श विदेशी मुद्रा ब्रोकर खोजें", heroSubtitle: "AI की शक्ति का लाभ उठाकर अपनी ट्रेडिंग शैली के अनुरूप सर्वश्रेष्ठ ब्रोकर का विश्लेषण, तुलना और चयन करें।", heroDataDriven: "दुनिया भर के दर्जनों विनियमित ब्रोकरों पर डेटा-संचालित अंतर्दृष्टि।", useAiMatcher: "AI ब्रोकर मैचमेकर का उपयोग करें", exploreAllBrokers: "सभी ब्रोकर देखें", trustedBy: "शीर्ष व्यापारियों द्वारा विश्वसनीय", whyChoose: "Brokeranalysis क्यों चुनें?", features: { data: { title: "व्यापक डेटा", description: "दर्जनों ब्रोकरों पर विस्तृत जानकारी प्राप्त करें, विनियमों से लेकर ट्रेडिंग शर्तों तक।" }, matching: { title: "AI-संचालित मिलान", description: "हमारा बुद्धिमान ब्रोकर मैचमेकर आपकी अनूठी प्राथमिकताओं के आधार पर आदर्श ब्रोकर ढूंढता है।" }, comparison: { title: "साथ-साथ तुलना", description: "एक स्पष्ट, संक्षिप्त तालिका में कई ब्रोकरों की प्रमुख विशेषताओं की आसानी से तुलना करें।" }, trust: { title: "विश्वास और सुरक्षा", description: "हम नियामक डेटा को सत्यापित करते हैं और प्रत्येक ब्रोकर के लिए एक गतिशील विश्वास स्कोर उत्पन्न करने के लिए AI का उपयोग करते हैं।" } }, popularCategoriesTitle: "लोकप्रिय श्रेणियां देखें", categories: { beginners: { title: "शुरुआती के लिए सर्वश्रेष्ठ", description: "कम जमा और बेहतरीन शैक्षिक सामग्री वाले उपयोगकर्ता-अनुकूल प्लेटफॉर्म खोजें।" }, uk: { title: "यूके विदेशी मुद्रा ब्रोकर", description: "अपने मजबूत ग्राहक संरक्षण के लिए जाने जाने वाले शीर्ष-स्तरीय, FCA-विनियमित ब्रोकर देखें।" }, ecn: { title: "ECN ब्रोकर", description: "प्रत्यक्ष बाजार पहुंच और न्यूनतम संभव स्प्रेड चाहने वाले गंभीर व्यापारियों के लिए।" }, copy: { title: "कॉपी ट्रेडिंग", description: "अनुभवी व्यापारियों के ट्रेडों को स्वचालित रूप से कॉपी करके उनकी विशेषज्ञता का लाभ उठाएं।" } }, howItWorksTitle: "3 सरल चरणों में यह कैसे काम करता है", steps: { "1": { title: "सवालों के जवाब दें", description: "हमें अपनी ट्रेडिंग शैली, अनुभव और एक ब्रोकर में आप सबसे ज्यादा क्या महत्व देते हैं, के बारे में बताएं।" }, "2": { title: "AI मैच प्राप्त करें", description: "हमारा AI आपकी प्रोफाइल का विश्लेषण करता है और हमारे डेटाबेस से शीर्ष ब्रोकरों की सिफारिश करता है।" }, "3": { title: "तुलना करें और चुनें", description: "अपना अंतिम विकल्प बनाने के लिए लागत, सुविधाओं और विश्वास स्कोर की तुलना करने के लिए हमारे टूल का उपयोग करें।" } }, socialProofTitle: "दुनिया भर के व्यापारियों द्वारा विश्वसनीय", testimonials: { "1": { quote: "“AI ब्रोकर मैचमेकर एक गेम-चेंजर है। इसने मुझे कम स्प्रेड वाला एक ब्रोकर ढूंढ कर दिया जिसके बारे में मैंने कभी नहीं सुना था। इसने मेरे घंटों के शोध को बचाया।”", author: "- एलेक्स आर., डे ट्रेडर" }, "2": { quote: "“आखिरकार, एक तुलना साइट जो वास्तव में उपयोगी है। लाइव लागत विश्लेषक वास्तविक समय की फीस देखने के लिए शानदार है। अत्यधिक अनुशंसित।”", author: "- सारा टी., स्विंग ट्रेडर" } }, faqTitle: "अक्सर पूछे जाने वाले प्रश्न", faqs: { "1": { q: "सबसे सुरक्षित विदेशी मुद्रा ब्रोकर कौन सा है?", a: "सुरक्षा काफी हद तक विनियमन पर निर्भर करती है। सबसे सुरक्षित ब्रोकर आमतौर पर वे होते हैं जो FCA (यूके), ASIC (ऑस्ट्रेलिया), और FINMA (स्विट्जरलैंड) जैसे कई शीर्ष-स्तरीय प्राधिकरणों द्वारा विनियमित होते हैं। हमारा प्लेटफॉर्म नियामक डेटा पर प्रकाश डालता है और ब्रोकर सुरक्षा का आकलन करने में आपकी मदद करने के लिए एक AI ट्रस्ट स्कोर प्रदान करता है।" }, "2": { q: "AI मेरे लिए सही ब्रोकर कैसे चुनता है?", a: "हमारा AI ब्रोकर मैचमेकर आपकी ट्रेडिंग शैली और प्राथमिकताओं के बारे में सवालों के आपके जवाबों का विश्लेषण करता है। फिर यह आपकी प्रोफाइल की तुलना हमारे ब्रोकर विशेषताओं के डेटाबेस से करता है ताकि सबसे करीबी मैच मिल सकें। यह आपकी खोज को वैयक्तिकृत करने के लिए डिज़ाइन की गई एक डेटा-संचालित प्रक्रिया है।" }, "3": { q: "किस ब्रोकर की ट्रेडिंग लागत सबसे कम है?", a: "ट्रेडिंग लागत गतिशील होती है और आपके द्वारा ट्रेड किए जाने वाले उपकरण पर निर्भर करती है। हमारा लाइव लागत विश्लेषक आपके द्वारा चुने गए ब्रोकरों के लिए स्प्रेड और कमीशन पर वास्तविक समय का डेटा प्रदान करता है, जिससे आपको किसी भी समय सबसे सस्ता विकल्प पहचानने में मदद मिलती है। आम तौर पर, Pepperstone या IC Markets जैसे ECN/STP ब्रोकर बहुत कम कच्चे स्प्रेड की पेशकश करते हैं लेकिन एक कमीशन लेते हैं।" } } },
    allBrokersPage: { title: "सभी विदेशी मुद्रा ब्रोकर", subtitle: "अपनी ट्रेडिंग शैली और जरूरतों से पूरी तरह मेल खाने वाले ब्रोकर को खोजने के लिए हमारे उन्नत फ़िल्टर का उपयोग करें।", filtersTitle: "फ़िल्टर", reset: "रीसेट", searchPlaceholder: "ब्रोकर के नाम से खोजें...", presetsTitle: "ट्रेडिंग शैली प्रीसेट", presets: { scalping: "स्कैल्पिंग", algorithmic: "एल्गोरिथम", copyTrading: "कॉपी ट्रेडिंग", swingTrading: "स्विंग ट्रेडिंग" }, generalTitle: "सामान्य", minDeposit: "न्यूनतम जमा", minDepositOptions: { any: "कोई भी राशि", "100": "$100 तक", "250": "$250 तक", "1000": "$1000 तक" }, regulator: "नियामक", regulatorOptions: { any: "कोई भी नियामक" }, executionCostsTitle: "निष्पादन और लागत", executionType: "निष्पादन प्रकार", spread: "EUR/USD स्प्रेड", spreadOptions: { any: "कोई भी", ultraLow: "अल्ट्रा लो (≤ 0.5 पिप्स)", low: "कम (0.6 - 1.0 पिप्स)", standard: "मानक (> 1.0 पिप्स)" }, commissions: "कमीशन", commissionOptions: { any: "कोई भी", commission: "कमीशन-आधारित", zero: "शून्य कमीशन" }, techPlatformsTitle: "प्रौद्योगिकी और प्लेटफॉर्म", platform: "प्लेटफॉर्म", algoTrading: "एल्गोरिथम ट्रेडिंग", algoTradingOptions: { eaSupport: "MQL5/EA समर्थन", apiAccess: "एपीआई एक्सेस" }, socialTrading: "सोशल ट्रेडिंग", socialTradingOptions: { any: "कोई भी", yes: "कॉपी ट्रेडिंग का समर्थन करता है", no: "कोई कॉपी ट्रेडिंग नहीं" }, tradingConditionsTitle: "ट्रेडिंग शर्तें", minLotSize: "न्यूनतम लॉट आकार", minLotSizeOptions: { any: "कोई भी", micro: "माइक्रो (0.01)", mini: "मिनी (0.1)" }, maxLeverage: "अधिकतम लीवरेज", maxLeverageOptions: { any: "कोई भी", low: "1:100 तक", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "{total} में से {count} ब्रोकर दिखा रहा है", getAiRec: "AI सिफारिश प्राप्त करें", aiRecTooltip: "सिफारिश प्राप्त करने के लिए कम से कम 2 ब्रोकरों को फ़िल्टर करें।", aiError: "क्षमा करें, AI एक सिफारिश नहीं कर सका। कृपया एक अलग फ़िल्टर के साथ पुनः प्रयास करें।", aiPicksTitle: "आपके चयन से AI की शीर्ष पसंद", aiAnalysisTitle: "AI विश्लेषण", noResultsTitle: "कोई ब्रोकर आपके मानदंडों से मेल नहीं खाता", noResultsSubtitle: "अधिक परिणाम खोजने के लिए अपने फ़िल्टर समायोजित करने का प्रयास करें।" } },
    brokerMatcherPage: { title: "AI ब्रोकर मैचमेकर", subtitle: "कुछ सवालों के जवाब दें और हमारे AI को काम करने दें।", steps: { "0": { title: "सबसे पहले, आपका ट्रेडिंग अनुभव क्या है?", options: ["शुरुआती", "मध्यम", "विशेषज्ञ"] }, "1": { title: "आपकी योजनाबद्ध प्रारंभिक जमा राशि क्या है?", options: ["$200 से कम", "$200 - $1000", "$1000 - $5000", "$5000+"] }, "2": { title: "कोई पसंदीदा ट्रेडिंग प्लेटफॉर्म?", options: ["मेटाट्रेडर 4/5", "cTrader", "ट्रेडिंग व्यू", "स्वामित्व", "मुझे कोई आपत्ति नहीं है"], placeholder: "या अपना टाइप करें..." }, "3": { title: "अंत में, आपके लिए सबसे महत्वपूर्ण क्या है?", options: ["सबसे कम संभव स्प्रेड", "शीर्ष-स्तरीय विनियमन", "सर्वश्रेष्ठ ट्रेडिंग प्लेटफॉर्म", "शुरुआती के अनुकूल"], placeholder: "या अपना टाइप करें..." } }, back: "वापस", findMyBroker: "मेरा ब्रोकर खोजें", tooltip: "आपकी प्राथमिकताओं का विश्लेषण करने और आपके लिए सर्वश्रेष्ठ ब्रोकरों की सिफारिश करने के लिए AI का उपयोग करता है।", loading: "हमारा AI आपके लिए आदर्श ब्रोकर ढूंढ रहा है...", results: { title: "आपके शीर्ष मैच", aiAnalysis: "AI विश्लेषण", startOver: "फिर से शुरू करें", error: "सिफारिशें प्राप्त करने में विफल। कृपया पुनः प्रयास करें।" } },
    comparePage: { title: "ब्रोकर की तुलना करें", subtitle: "आपके चयनित ब्रोकरों का साथ-साथ विश्लेषण।", startDuel: "द्वंद्व शुरू करें", clearAll: "सभी साफ़ करें", getAiSummary: "AI तुलना सारांश प्राप्त करें", aiAnalysis: "AI विश्लेषण", empty: { title: "आपकी तुलना सूची खाली है।", subtitle: "उनकी विशेषताओं की साथ-साथ तुलना करने के लिए ब्रोकर जोड़ें।", button: "ब्रोकर ब्राउज़ करें" } },
    compareTable: { feature: "सुविधा", visit: "विजिट करें", remove: "हटाएं", features: { overallScore: "समग्र स्कोर", score: "स्कोर", tradingCosts: "ट्रेडिंग लागत", eurusd: "EUR/USD स्प्रेड", gbpusd: "GBP/USD स्प्रेड", usdjpy: "USD/JPY स्प्रेड", commission: "कमीशन", swap: "स्वैप शुल्क श्रेणी", tradingConditions: "ट्रेडिंग शर्तें", maxLeverage: "अधिकतम लीवरेज", executionType: "निष्पादन प्रकार", accessibility: "पहुंच", minDeposit: "न्यूनतम जमा", depositMethods: "जमा के तरीके", withdrawalMethods: "निकासी के तरीके", support: "ग्राहक सहायता", technology: "प्रौद्योगिकी", platforms: "प्लेटफॉर्म", tradableInstruments: "ट्रेड करने योग्य उपकरण", forexPairs: "विदेशी मुद्रा जोड़े", stocks: "स्टॉक सीएफडी", cryptocurrencies: "क्रिप्टोकरेंसी", trust: "विश्वास और पृष्ठभूमि", regulators: "नियामक", founded: "स्थापित", headquarters: "मुख्यालय" } },
    loginPage: { title: "अपने खाते में लॉग इन करें", emailLabel: "ईमेल पता", passwordLabel: "पासवर्ड", button: "लॉग इन करें", noAccount: "खाता नहीं है?", registerLink: "यहां पंजीकरण करें" },
    registerPage: { title: "एक खाता बनाएं", nameLabel: "पूरा नाम", emailLabel: "ईमेल पता", passwordLabel: "पासवर्ड", button: "पंजीकरण करें", haveAccount: "पहले से ही एक खाता है?", loginLink: "यहां लॉग इन करें" },
    dashboardPage: { welcome: "वापस स्वागत है, {name}!", subtitle: "यह आपके ब्रोकर अनुसंधान को ट्रैक और प्रबंधित करने के लिए आपका व्यक्तिगत डैशबोर्ड है।", quickActions: { newMatch: { title: "नया AI मैच", description: "आपके अनुरूप एक नया ब्रोकर खोजें।" }, compare: { title: "ब्रोकर की तुलना करें", description: "अपनी तुलना सूची देखें।" }, analyzer: { title: "लागत विश्लेषक", description: "लाइव ट्रेडिंग शुल्क का विश्लेषण करें।" }, explore: { title: "सभी ब्रोकर देखें", description: "हमारी पूरी ब्रोकर सूची ब्राउज़ करें।" } }, alerts: { title: "मेरे अलर्ट", empty: "आपके पसंदीदा ब्रोकरों के लिए कोई अलर्ट नहीं है। अपडेट प्राप्त करना शुरू करने के लिए कुछ ब्रोकरों को अपनी पसंदीदा सूची में जोड़ें!", button: "ब्रोकर देखें" }, history: { title: "आपका AI ब्रोकर मैच इतिहास", matchTitle: "एक {experience} ट्रेडर के लिए मैच", matchSubtitle: "प्राथमिकता: {priority} | {date}", preferences: "आपकी प्राथमिकताएं:", experience: "अनुभव:", deposit: "प्रारंभिक जमा:", platforms: "प्लेटफॉर्म:", priority: "प्राथमिकता:", any: "कोई भी", aiAnalysis: "AI विश्लेषण:", recommendations: "इस मैच के लिए अनुशंसित ब्रोकर:", empty: "आपने अभी तक AI ब्रोकर मैचमेकर का उपयोग नहीं किया है।", button: "अपना पहला मैच खोजें" }, reviews: { title: "मेरी समीक्षाएं", reviewFor: "के लिए समीक्षा", unknownBroker: "अज्ञात ब्रोकर", verify: "समीक्षा सत्यापित करें", empty: "आपने अभी तक कोई समीक्षा नहीं लिखी है।", button: "समीक्षा करने के लिए एक ब्रोकर खोजें" }, favorites: { title: "आपके पसंदीदा ब्रोकर", empty: "आपने अभी तक किसी ब्रोकर को पसंदीदा नहीं बनाया है। इसे यहां सहेजने के लिए किसी ब्रोकर पर स्टार आइकन पर क्लिक करें।", button: "ब्रोकर देखें" }, settings: { title: "खाता सेटिंग्स", email: "ईमेल पता", name: "पूरा नाम", password: "नया पासवर्ड", passwordPlaceholder: "वर्तमान पासवर्ड रखने के लिए खाली छोड़ दें", button: "परिवर्तन सहेजें", success: "प्रोफाइल सफलतापूर्वक अपडेट किया गया!", dangerZone: "खतरे का क्षेत्र", dangerDescription: "आपके खाते को हटाना एक स्थायी कार्रवाई है और इसे पूर्ववत नहीं किया जा सकता है।", deleteButton: "मेरा खाता हटाएं", deleteModal: { title: "खाता हटाने की पुष्टि करें", text: "क्या आप वाकई अपने खाते को स्थायी रूप से हटाना चाहते हैं? आपका सारा डेटा, जिसमें पसंदीदा और मैच इतिहास शामिल है, खो जाएगा।", cancel: "रद्द करें", confirm: "हाँ, खाता हटाएं" } } }
  },
  fr: {
    header: { brokers: "Courtiers", marketNews: "Actualités du Marché", methodology: "Méthodologie", login: "Connexion", register: "S'inscrire", logout: "Déconnexion", dashboard: "Mon Tableau de Bord", megaMenu: { coreTools: "Outils Principaux", allBrokers: "Tous les Courtiers", compareBrokers: "Comparer les Courtiers", costAnalyzer: "Analyseur de Coûts", aiBrokerMatcher: "Assistant IA Courtiers", byCountry: "Par Pays", platformsAndTypes: "Plateformes & Types" } },
    footer: { subtitle: "Découvrez votre courtier forex idéal grâce à la puissance de l'IA.", byCountry: "Par Pays", platformsAndTypes: "Plateformes & Types", resources: "Ressources", copyright: "© {year} Brokeranalysis. Tous droits réservés." },
    home: { heroTitle: "Trouvez Votre Courtier Forex Idéal", heroSubtitle: "Exploitez la puissance de l'IA pour analyser, comparer et choisir le meilleur courtier adapté à votre style de trading.", heroDataDriven: "Aperçus basés sur les données de dizaines de courtiers réglementés dans le monde.", useAiMatcher: "Utiliser l'Assistant IA", exploreAllBrokers: "Explorer Tous les Courtiers", trustedBy: "Approuvé par les meilleurs traders", whyChoose: "Pourquoi Choisir Brokeranalysis ?", features: { data: { title: "Données Complètes", description: "Accédez à des informations détaillées sur des dizaines de courtiers, des réglementations aux conditions de trading." }, matching: { title: "Matching par IA", description: "Notre Assistant intelligent trouve le courtier idéal en fonction de vos préférences uniques." }, comparison: { title: "Comparaison Côte à Côte", description: "Comparez facilement les caractéristiques clés de plusieurs courtiers dans un tableau clair et concis." }, trust: { title: "Confiance & Sécurité", description: "Nous vérifions les données réglementaires et utilisons l'IA pour générer un score de confiance dynamique pour chaque courtier." } }, popularCategoriesTitle: "Explorer les Catégories Populaires", categories: { beginners: { title: "Idéal pour Débutants", description: "Trouvez des plateformes conviviales avec de faibles dépôts et un excellent contenu éducatif." }, uk: { title: "Courtiers Forex au R-U", description: "Explorez des courtiers de premier plan, réglementés par la FCA, connus pour leur solide protection des clients." }, ecn: { title: "Courtiers ECN", description: "Pour les traders sérieux recherchant un accès direct au marché et les spreads les plus serrés possibles." }, copy: { title: "Copy Trading", description: "Profitez de l'expertise de traders chevronnés en copiant automatiquement leurs transactions." } }, howItWorksTitle: "Comment ça Marche en 3 Étapes Simples", steps: { "1": { title: "Répondez aux Questions", description: "Parlez-nous de votre style de trading, de votre expérience et de ce que vous appréciez le plus chez un courtier." }, "2": { title: "Obtenez des Matchs IA", description: "Notre IA analyse votre profil et recommande les meilleurs courtiers de notre base de données." }, "3": { title: "Comparez & Choisissez", description: "Utilisez nos outils pour comparer les coûts, les fonctionnalités et les scores de confiance pour faire votre choix final." } }, socialProofTitle: "Approuvé par les Traders du Monde Entier", testimonials: { "1": { quote: "“L'Assistant IA pour courtiers est une révolution. Il m'a trouvé un courtier avec des spreads bas dont je n'avais jamais entendu parler. Cela m'a fait gagner des heures de recherche.”", author: "- Alex R., Day Trader" }, "2": { quote: "“Enfin, un site de comparaison qui est réellement utile. L'analyseur de coûts en direct est génial pour voir les frais en temps réel. Fortement recommandé.”", author: "- Sarah T., Swing Trader" } }, faqTitle: "Foire Aux Questions", faqs: { "1": { q: "Quel est le courtier forex le plus sûr ?", a: "La sécurité dépend fortement de la réglementation. Les courtiers les plus sûrs sont généralement ceux réglementés par plusieurs autorités de premier plan comme la FCA (R-U), l'ASIC (Australie) et la FINMA (Suisse). Notre plateforme met en évidence les données réglementaires et fournit un score de confiance IA pour vous aider à évaluer la sécurité d'un courtier." }, "2": { q: "Comment l'IA choisit-elle le bon courtier pour moi ?", a: "Notre Assistant IA analyse vos réponses aux questions sur votre style de trading et vos priorités. Il compare ensuite votre profil à notre base de données d'attributs de courtiers pour trouver les correspondances les plus proches. C'est un processus basé sur les données conçu pour personnaliser votre recherche." }, "3": { q: "Quel courtier a les coûts de trading les plus bas ?", a: "Les coûts de trading sont dynamiques. Notre Analyseur de Coûts en Direct fournit des données en temps réel sur les spreads et les commissions pour les courtiers que vous sélectionnez, vous aidant à identifier l'option la moins chère à tout moment. Généralement, les courtiers ECN/STP comme Pepperstone ou IC Markets offrent des spreads bruts très bas mais facturent une commission." } } },
    allBrokersPage: { title: "Tous les Courtiers Forex", subtitle: "Utilisez nos filtres avancés pour trouver le courtier qui correspond parfaitement à votre style de trading et à vos besoins.", filtersTitle: "Filtres", reset: "Réinitialiser", searchPlaceholder: "Rechercher par nom de courtier...", presetsTitle: "Préréglages de Style de Trading", presets: { scalping: "Scalping", algorithmic: "Algorithmique", copyTrading: "Copy Trading", swingTrading: "Swing Trading" }, generalTitle: "Général", minDeposit: "Dépôt Minimum", minDepositOptions: { any: "Tout montant", "100": "Jusqu'à 100 $", "250": "Jusqu'à 250 $", "1000": "Jusqu'à 1000 $" }, regulator: "Régulateur", regulatorOptions: { any: "Tout régulateur" }, executionCostsTitle: "Exécution & Coûts", executionType: "Type d'Exécution", spread: "Spread EUR/USD", spreadOptions: { any: "Tout", ultraLow: "Ultra Faible (≤ 0.5 pips)", low: "Faible (0.6 - 1.0 pips)", standard: "Standard (> 1.0 pips)" }, commissions: "Commissions", commissionOptions: { any: "Toute", commission: "Basé sur commission", zero: "Zéro commission" }, techPlatformsTitle: "Technologie & Plateformes", platform: "Plateforme", algoTrading: "Trading Algorithmique", algoTradingOptions: { eaSupport: "Support MQL5/EA", apiAccess: "Accès API" }, socialTrading: "Trading Social", socialTradingOptions: { any: "Tout", yes: "Supporte le Copy Trading", no: "Pas de Copy Trading" }, tradingConditionsTitle: "Conditions de Trading", minLotSize: "Taille de Lot Minimum", minLotSizeOptions: { any: "Toute", micro: "Micro (0.01)", mini: "Mini (0.1)" }, maxLeverage: "Effet de Levier Max", maxLeverageOptions: { any: "Tout", low: "Jusqu'à 1:100", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "Affichage de {count} courtiers sur {total}", getAiRec: "Obtenir une Recommandation IA", aiRecTooltip: "Filtrez pour avoir au moins 2 courtiers pour obtenir une recommandation.", aiError: "Désolé, l'IA n'a pas pu faire de recommandation. Veuillez réessayer avec un filtre différent.", aiPicksTitle: "Meilleurs Choix de l'IA de Votre Sélection", aiAnalysisTitle: "Analyse IA", noResultsTitle: "Aucun Courtier ne Correspond à Vos Critères", noResultsSubtitle: "Essayez d'ajuster vos filtres pour trouver plus de résultats." } },
    brokerMatcherPage: { title: "Assistant IA Courtiers", subtitle: "Répondez à quelques questions et laissez notre IA faire le travail.", steps: { "0": { title: "Tout d'abord, quelle est votre expérience en trading ?", options: ["Débutant", "Intermédiaire", "Expert"] }, "1": { title: "Quel est votre dépôt initial prévu ?", options: ["Moins de 200 $", "200 $ - 1000 $", "1000 $ - 5000 $", "5000 $+"] }, "2": { title: "Des plateformes de trading préférées ?", options: ["MetaTrader 4/5", "cTrader", "TradingView", "Propriétaire", "Peu importe"], placeholder: "Ou tapez la vôtre..." }, "3": { title: "Enfin, qu'est-ce qui est le plus important pour vous ?", options: ["Spreads les plus bas", "Réglementation de premier ordre", "Meilleure plateforme de trading", "Facile pour les débutants"], placeholder: "Ou tapez la vôtre..." } }, back: "Retour", findMyBroker: "Trouver Mon Courtier", tooltip: "Utilise l'IA pour analyser vos préférences et vous recommander les meilleurs courtiers.", loading: "Notre IA recherche votre courtier idéal...", results: { title: "Vos Meilleurs Matchs", aiAnalysis: "Analyse IA", startOver: "Recommencer", error: "Échec de l'obtention des recommandations. Veuillez réessayer." } },
    comparePage: { title: "Comparer les Courtiers", subtitle: "Analyse côte à côte de vos courtiers sélectionnés.", startDuel: "Commencer le Duel", clearAll: "Tout Effacer", getAiSummary: "Obtenir un Résumé Comparatif par IA", aiAnalysis: "Analyse IA", empty: { title: "Votre liste de comparaison est vide.", subtitle: "Ajoutez des courtiers pour comparer leurs fonctionnalités côte à côte.", button: "Parcourir les Courtiers" } },
    compareTable: { feature: "Caractéristique", visit: "Visiter", remove: "Retirer", features: { overallScore: "Note Globale", score: "Note", tradingCosts: "Coûts de Trading", eurusd: "Spread EUR/USD", gbpusd: "Spread GBP/USD", usdjpy: "Spread USD/JPY", commission: "Commission", swap: "Catégorie de Frais de Swap", tradingConditions: "Conditions de Trading", maxLeverage: "Levier Max", executionType: "Type d'Exécution", accessibility: "Accessibilité", minDeposit: "Dépôt Min.", depositMethods: "Méthodes de Dépôt", withdrawalMethods: "Méthodes de Retrait", support: "Support Client", technology: "Technologie", platforms: "Plateformes", tradableInstruments: "Instruments Négociables", forexPairs: "Paires de Devises", stocks: "CFD sur Actions", cryptocurrencies: "Cryptomonnaies", trust: "Confiance & Historique", regulators: "Régulateurs", founded: "Fondé en", headquarters: "Siège Social" } },
    loginPage: { title: "Connectez-vous à votre compte", emailLabel: "Adresse e-mail", passwordLabel: "Mot de passe", button: "Connexion", noAccount: "Vous n'avez pas de compte ?", registerLink: "Inscrivez-vous ici" },
    registerPage: { title: "Créer un Compte", nameLabel: "Nom Complet", emailLabel: "Adresse e-mail", passwordLabel: "Mot de passe", button: "S'inscrire", haveAccount: "Vous avez déjà un compte ?", loginLink: "Connectez-vous ici" },
    dashboardPage: { welcome: "Content de vous revoir, {name} !", subtitle: "Ceci est votre tableau de bord personnel pour suivre et gérer votre recherche de courtiers.", quickActions: { newMatch: { title: "Nouveau Match IA", description: "Trouvez un nouveau courtier sur mesure." }, compare: { title: "Comparer les Courtiers", description: "Voir votre liste de comparaison." }, analyzer: { title: "Analyseur de Coûts", description: "Analysez les frais de trading en direct." }, explore: { title: "Explorer Tous les Courtiers", description: "Parcourez notre liste complète de courtiers." } }, alerts: { title: "Mes Alertes", empty: "Aucune alerte pour vos courtiers favoris. Ajoutez des courtiers à vos favoris pour commencer à recevoir des mises à jour !", button: "Explorer les Courtiers" }, history: { title: "Votre Historique de Matchs IA", matchTitle: "Match pour un Trader {experience}", matchSubtitle: "Priorité : {priority} | {date}", preferences: "Vos Préférences :", experience: "Expérience :", deposit: "Dépôt Initial :", platforms: "Plateformes :", priority: "Priorité :", any: "Toute", aiAnalysis: "Analyse IA :", recommendations: "Courtiers Recommandés pour ce Match :", empty: "Vous n'avez pas encore utilisé l'Assistant IA pour Courtiers.", button: "Trouvez Votre Premier Match" }, reviews: { title: "Mes Avis", reviewFor: "Avis pour", unknownBroker: "Courtier Inconnu", verify: "Vérifier l'Avis", empty: "Vous n'avez encore écrit aucun avis.", button: "Trouver un Courtier à Évaluer" }, favorites: { title: "Vos Courtiers Favoris", empty: "Vous n'avez mis aucun courtier en favori. Cliquez sur l'icône étoile d'un courtier pour le sauvegarder ici.", button: "Explorer les Courtiers" }, settings: { title: "Paramètres du Compte", email: "Adresse e-mail", name: "Nom Complet", password: "Nouveau Mot de Passe", passwordPlaceholder: "Laisser vide pour conserver le mot de passe actuel", button: "Sauvegarder les Modifications", success: "Profil mis à jour avec succès !", dangerZone: "Zone de Danger", dangerDescription: "La suppression de votre compte est une action permanente et ne peut être annulée.", deleteButton: "Supprimer Mon Compte", deleteModal: { title: "Confirmer la Suppression du Compte", text: "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Toutes vos données, y compris les favoris et l'historique des matchs, seront perdues.", cancel: "Annuler", confirm: "Oui, Supprimer le Compte" } } }
  },
  ru: {
    header: { brokers: "Брокеры", marketNews: "Новости Рынка", methodology: "Методология", login: "Войти", register: "Регистрация", logout: "Выйти", dashboard: "Моя Панель", megaMenu: { coreTools: "Основные Инструменты", allBrokers: "Все Брокеры", compareBrokers: "Сравнить Брокеров", costAnalyzer: "Анализатор Затрат", aiBrokerMatcher: "AI Подбор Брокера", byCountry: "По Стране", platformsAndTypes: "Платформы и Типы" } },
    footer: { subtitle: "Найдите своего идеального форекс-брокера с помощью искусственного интеллекта.", byCountry: "По Стране", platformsAndTypes: "Платформы и Типы", resources: "Ресурсы", copyright: "© {year} Brokeranalysis. Все права защищены." },
    home: { heroTitle: "Найдите Своего Идеального Форекс-Брокера", heroSubtitle: "Используйте возможности ИИ для анализа, сравнения и выбора лучшего брокера, соответствующего вашему стилю торговли.", heroDataDriven: "Основанные на данных сведения о десятках регулируемых брокеров по всему миру.", useAiMatcher: "Использовать AI Подборщик", exploreAllBrokers: "Посмотреть Всех Брокеров", trustedBy: "Нам доверяют ведущие трейдеры", whyChoose: "Почему Brokeranalysis?", features: { data: { title: "Полные Данные", description: "Получите доступ к подробной информации о десятках брокеров, от регулирования до торговых условий." }, matching: { title: "Подбор с Помощью ИИ", description: "Наш интеллектуальный Подборщик Брокеров найдет идеального брокера на основе ваших уникальных предпочтений." }, comparison: { title: "Прямое Сравнение", description: "Легко сравнивайте ключевые особенности нескольких брокеров в наглядной и краткой таблице." }, trust: { title: "Доверие и Безопасность", description: "Мы проверяем данные о регулировании и используем ИИ для генерации динамического рейтинга доверия для каждого брокера." } }, popularCategoriesTitle: "Изучите Популярные Категории", categories: { beginners: { title: "Лучшие для Начинающих", description: "Найдите удобные платформы с низкими депозитами и отличными образовательными материалами." }, uk: { title: "Брокеры из Великобритании", description: "Ознакомьтесь с ведущими брокерами, регулируемыми FCA, известными своей надежной защитой клиентов." }, ecn: { title: "ECN Брокеры", description: "Для серьезных трейдеров, ищущих прямой доступ к рынку и минимально возможные спреды." }, copy: { title: "Копи-Трейдинг", description: "Используйте опыт опытных трейдеров, автоматически копируя их сделки." } }, howItWorksTitle: "Как это работает за 3 простых шага", steps: { "1": { title: "Ответьте на Вопросы", description: "Расскажите нам о своем стиле торговли, опыте и о том, что для вас важнее всего в брокере." }, "2": { title: "Получите Результаты от ИИ", description: "Наш ИИ анализирует ваш профиль и рекомендует лучших брокеров из нашей базы данных." }, "3": { title: "Сравните и Выберите", description: "Используйте наши инструменты для сравнения затрат, функций и рейтингов доверия, чтобы сделать окончательный выбор." } }, socialProofTitle: "Нам Доверяют Трейдеры по Всему Миру", testimonials: { "1": { quote: "“AI Подборщик Брокеров — это просто революция. Он нашел мне брокера с низкими спредами, о котором я никогда не слышал. Сэкономил мне часы исследований.”", author: "- Алекс Р., Дневной трейдер" }, "2": { quote: "“Наконец-то появился действительно полезный сайт для сравнения. Анализатор затрат в реальном времени — гениальная вещь для отслеживания комиссий. Очень рекомендую.”", author: "- Сара Т., Свинг-трейдер" } }, faqTitle: "Часто Задаваемые Вопросы", faqs: { "1": { q: "Какой форекс-брокер самый безопасный?", a: "Безопасность во многом зависит от регулирования. Самыми безопасными обычно являются брокеры, регулируемые несколькими ведущими органами, такими как FCA (Великобритания), ASIC (Австралия) и FINMA (Швейцария). Наша платформа предоставляет данные о регулировании и рейтинг доверия от ИИ, чтобы помочь вам оценить безопасность брокера." }, "2": { q: "Как ИИ выбирает для меня подходящего брокера?", a: "Наш AI Подборщик Брокеров анализирует ваши ответы на вопросы о вашем стиле торговли и приоритетах. Затем он сравнивает ваш профиль с нашей базой данных атрибутов брокеров, чтобы найти наиболее подходящие варианты. Это процесс, основанный на данных, предназначенный для персонализации вашего поиска." }, "3": { q: "У какого брокера самые низкие торговые издержки?", a: "Торговые издержки динамичны. Наш Анализатор Затрат в Реальном Времени предоставляет данные о спредах и комиссиях для выбранных вами брокеров, помогая определить самый дешевый вариант. В целом, ECN/STP брокеры, такие как Pepperstone или IC Markets, предлагают очень низкие спреды, но взимают комиссию." } } },
    allBrokersPage: { title: "Все Форекс-Брокеры", subtitle: "Используйте наши расширенные фильтры, чтобы найти брокера, который идеально соответствует вашему стилю торговли и потребностям.", filtersTitle: "Фильтры", reset: "Сбросить", searchPlaceholder: "Поиск по названию брокера...", presetsTitle: "Стили Торговли", presets: { scalping: "Скальпинг", algorithmic: "Алгоритмический", copyTrading: "Копи-трейдинг", swingTrading: "Свинг-трейдинг" }, generalTitle: "Общие", minDeposit: "Минимальный Депозит", minDepositOptions: { any: "Любая сумма", "100": "До $100", "250": "До $250", "1000": "До $1000" }, regulator: "Регулятор", regulatorOptions: { any: "Любой регулятор" }, executionCostsTitle: "Исполнение и Затраты", executionType: "Тип Исполнения", spread: "Спред EUR/USD", spreadOptions: { any: "Любой", ultraLow: "Ультранизкий (≤ 0.5 п.)", low: "Низкий (0.6 - 1.0 п.)", standard: "Стандартный (> 1.0 п.)" }, commissions: "Комиссии", commissionOptions: { any: "Любые", commission: "С комиссией", zero: "Без комиссии" }, techPlatformsTitle: "Технологии и Платформы", platform: "Платформа", algoTrading: "Алготрейдинг", algoTradingOptions: { eaSupport: "Поддержка MQL5/EA", apiAccess: "Доступ к API" }, socialTrading: "Социальный Трейдинг", socialTradingOptions: { any: "Любой", yes: "Поддерживает копи-трейдинг", no: "Без копи-трейдинга" }, tradingConditionsTitle: "Торговые Условия", minLotSize: "Минимальный Лот", minLotSizeOptions: { any: "Любой", micro: "Микро (0.01)", mini: "Мини (0.1)" }, maxLeverage: "Макс. Плечо", maxLeverageOptions: { any: "Любое", low: "До 1:100", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "Показано {count} из {total} брокеров", getAiRec: "Получить Рекомендацию ИИ", aiRecTooltip: "Отфильтруйте хотя бы 2 брокеров, чтобы получить рекомендацию.", aiError: "К сожалению, ИИ не смог дать рекомендацию. Пожалуйста, попробуйте другой фильтр.", aiPicksTitle: "Лучший Выбор ИИ из Вашего Списка", aiAnalysisTitle: "Анализ ИИ", noResultsTitle: "Брокеры, Соответствующие Вашим Критериям, не Найдены", noResultsSubtitle: "Попробуйте изменить фильтры, чтобы найти больше результатов." } },
    brokerMatcherPage: { title: "AI Подбор Брокера", subtitle: "Ответьте на несколько вопросов, и пусть наш ИИ сделает всю работу.", steps: { "0": { title: "Во-первых, какой у вас опыт в трейдинге?", options: ["Начинающий", "Средний", "Эксперт"] }, "1": { title: "Какой ваш планируемый начальный депозит?", options: ["Менее $200", "$200 - $1000", "$1000 - $5000", "$5000+"] }, "2": { title: "Предпочитаемые торговые платформы?", options: ["MetaTrader 4/5", "cTrader", "TradingView", "Собственная", "Не имеет значения"], placeholder: "Или введите свой вариант..." }, "3": { title: "И наконец, что для вас важнее всего?", options: ["Минимальные спреды", "Регулирование высшего уровня", "Лучшая торговая платформа", "Удобство для начинающих"], placeholder: "Или введите свой вариант..." } }, back: "Назад", findMyBroker: "Найти Моего Брокера", tooltip: "Использует ИИ для анализа ваших предпочтений и рекомендации лучших брокеров.", loading: "Наш ИИ ищет для вас идеального брокера...", results: { title: "Ваши Лучшие Совпадения", aiAnalysis: "Анализ ИИ", startOver: "Начать Сначала", error: "Не удалось получить рекомендации. Пожалуйста, попробуйте снова." } },
    comparePage: { title: "Сравнить Брокеров", subtitle: "Прямое сравнение выбранных вами брокеров.", startDuel: "Начать Дуэль", clearAll: "Очистить Все", getAiSummary: "Получить Сравнительный Анализ от ИИ", aiAnalysis: "Анализ ИИ", empty: { title: "Ваш список для сравнения пуст.", subtitle: "Добавьте брокеров, чтобы сравнить их характеристики.", button: "Посмотреть Брокеров" } },
    compareTable: { feature: "Характеристика", visit: "Посетить", remove: "Удалить", features: { overallScore: "Общая Оценка", score: "Оценка", tradingCosts: "Торговые Затраты", eurusd: "Спред EUR/USD", gbpusd: "Спред GBP/USD", usdjpy: "Спред USD/JPY", commission: "Комиссия", swap: "Категория Свопа", tradingConditions: "Торговые Условия", maxLeverage: "Макс. Плечо", executionType: "Тип Исполнения", accessibility: "Доступность", minDeposit: "Мин. Депозит", depositMethods: "Способы Пополнения", withdrawalMethods: "Способы Вывода", support: "Поддержка Клиентов", technology: "Технологии", platforms: "Платформы", tradableInstruments: "Торговые Инструменты", forexPairs: "Валютные пары", stocks: "CFD на акции", cryptocurrencies: "Криптовалюты", trust: "Надежность и История", regulators: "Регуляторы", founded: "Год Основания", headquarters: "Штаб-квартира" } },
    loginPage: { title: "Вход в ваш аккаунт", emailLabel: "Электронная почта", passwordLabel: "Пароль", button: "Войти", noAccount: "Нет аккаунта?", registerLink: "Зарегистрируйтесь здесь" },
    registerPage: { title: "Создать Аккаунт", nameLabel: "Полное Имя", emailLabel: "Электронная почта", passwordLabel: "Пароль", button: "Регистрация", haveAccount: "Уже есть аккаунт?", loginLink: "Войдите здесь" },
    dashboardPage: { welcome: "С возвращением, {name}!", subtitle: "Это ваша личная панель для отслеживания и управления исследованием брокеров.", quickActions: { newMatch: { title: "Новый подбор ИИ", description: "Найдите нового брокера, подходящего именно вам." }, compare: { title: "Сравнить брокеров", description: "Просмотрите свой список для сравнения." }, analyzer: { title: "Анализатор затрат", description: "Анализируйте торговые комиссии в реальном времени." }, explore: { title: "Все брокеры", description: "Просмотрите наш полный список брокеров." } }, alerts: { title: "Мои оповещения", empty: "Нет оповещений для ваших избранных брокеров. Добавьте брокеров в избранное, чтобы начать получать обновления!", button: "Посмотреть брокеров" }, history: { title: "Ваша история подборов ИИ", matchTitle: "Подбор для трейдера уровня {experience}", matchSubtitle: "Приоритет: {priority} | {date}", preferences: "Ваши предпочтения:", experience: "Опыт:", deposit: "Начальный депозит:", platforms: "Платформы:", priority: "Приоритет:", any: "Любая", aiAnalysis: "Анализ ИИ:", recommendations: "Рекомендованные брокеры для этого подбора:", empty: "Вы еще не использовали AI Подборщик Брокеров.", button: "Найти свой первый подбор" }, reviews: { title: "Мои отзывы", reviewFor: "Отзыв для", unknownBroker: "Неизвестный брокер", verify: "Подтвердить отзыв", empty: "Вы еще не написали ни одного отзыва.", button: "Найти брокера для отзыва" }, favorites: { title: "Ваши избранные брокеры", empty: "Вы еще не добавили ни одного брокера в избранное. Нажмите на значок звезды у брокера, чтобы сохранить его здесь.", button: "Посмотреть брокеров" }, settings: { title: "Настройки аккаунта", email: "Электронная почта", name: "Полное Имя", password: "Новый пароль", passwordPlaceholder: "Оставьте пустым, чтобы сохранить текущий пароль", button: "Сохранить изменения", success: "Профиль успешно обновлен!", dangerZone: "Опасная зона", dangerDescription: "Удаление вашего аккаунта является необратимым действием.", deleteButton: "Удалить мой аккаунт", deleteModal: { title: "Подтвердите удаление аккаунта", text: "Вы уверены, что хотите навсегда удалить свой аккаунт? Все ваши данные, включая избранное и историю подборов, будут потеряны.", cancel: "Отмена", confirm: "Да, удалить аккаунт" } } }
  },
  pt: {
    header: { brokers: "Corretoras", marketNews: "Notícias do Mercado", methodology: "Metodologia", login: "Entrar", register: "Registrar", logout: "Sair", dashboard: "Meu Painel", megaMenu: { coreTools: "Ferramentas Principais", allBrokers: "Todas as Corretoras", compareBrokers: "Comparar Corretoras", costAnalyzer: "Analisador de Custos", aiBrokerMatcher: "Assistente IA de Corretoras", byCountry: "Por País", platformsAndTypes: "Plataformas e Tipos" } },
    footer: { subtitle: "Descubra sua corretora de forex perfeita com o poder da IA.", byCountry: "Por País", platformsAndTypes: "Plataformas e Tipos", resources: "Recursos", copyright: "© {year} Brokeranalysis. Todos os direitos reservados." },
    home: { heroTitle: "Encontre Sua Corretora de Forex Perfeita", heroSubtitle: "Aproveite o poder da IA para analisar, comparar e escolher a melhor corretora adaptada ao seu estilo de negociação.", heroDataDriven: "Insights baseados em dados de dezenas de corretoras regulamentadas em todo o mundo.", useAiMatcher: "Usar Assistente de IA", exploreAllBrokers: "Explorar Todas as Corretoras", trustedBy: "Confiado pelos melhores traders", whyChoose: "Por que escolher a Brokeranalysis?", features: { data: { title: "Dados Abrangentes", description: "Acesse informações detalhadas sobre dezenas de corretoras, desde regulamentações até condições de negociação." }, matching: { title: "Correspondência por IA", description: "Nosso Assistente de Corretoras inteligente encontra a corretora ideal com base em suas preferências únicas." }, comparison: { title: "Comparação Lado a Lado", description: "Compare facilmente as principais características de várias corretoras em uma tabela clara e concisa." }, trust: { title: "Confiança e Segurança", description: "Verificamos dados regulatórios e usamos IA para gerar uma pontuação de confiança dinâmica para cada corretora." } }, popularCategoriesTitle: "Explore Categorias Populares", categories: { beginners: { title: "Melhor para Iniciantes", description: "Encontre plataformas fáceis de usar com depósitos baixos e ótimo conteúdo educacional." }, uk: { title: "Corretoras do Reino Unido", description: "Explore corretoras de primeira linha, regulamentadas pela FCA, conhecidas por sua robusta proteção ao cliente." }, ecn: { title: "Corretoras ECN", description: "Para traders sérios que buscam acesso direto ao mercado e os spreads mais apertados possíveis." }, copy: { title: "Copy Trading", description: "Aproveite a experiência de traders experientes copiando automaticamente suas negociações." } }, howItWorksTitle: "Como Funciona em 3 Passos Simples", steps: { "1": { title: "Responda às Perguntas", description: "Conte-nos sobre seu estilo de negociação, experiência e o que você mais valoriza em uma corretora." }, "2": { title: "Receba Sugestões da IA", description: "Nossa IA analisa seu perfil и recomenda as melhores corretoras de nosso banco de dados." }, "3": { title: "Compare e Escolha", description: "Use nossas ferramentas para comparar custos, recursos e pontuações de confiança para fazer sua escolha final." } }, socialProofTitle: "Confiado por Traders de Todo o Mundo", testimonials: { "1": { quote: "“O Assistente de Corretoras IA é uma virada de jogo. Ele me encontrou uma corretora com spreads baixos da qual eu nunca tinha ouvido falar. Me poupou horas de pesquisa.”", author: "- Alex R., Day Trader" }, "2": { quote: "“Finalmente, um site de comparação que é realmente útil. O analisador de custos ao vivo é brilhante para ver as taxas em tempo real. Altamente recomendado.”", author: "- Sarah T., Swing Trader" } }, faqTitle: "Perguntas Frequentes", faqs: { "1": { q: "Qual é a corretora de forex mais segura?", a: "A segurança depende muito da regulamentação. As corretoras mais seguras são tipicamente aquelas regulamentadas por várias autoridades de primeira linha, como a FCA (Reino Unido), ASIC (Austrália) e FINMA (Suíça). Nossa plataforma destaca dados regulatórios e fornece uma Pontuação de Confiança da IA para ajudá-lo a avaliar a segurança da corretora." }, "2": { q: "Como a IA escolhe a corretora certa para mim?", a: "Nosso Assistente de Corretoras IA analisa suas respostas a perguntas sobre seu estilo de negociação e prioridades. Em seguida, compara seu perfil com nosso banco de dados de atributos de corretoras para encontrar as correspondências mais próximas. É um processo orientado por dados, projetado para personalizar sua busca." }, "3": { q: "Qual corretora tem os custos de negociação mais baixos?", a: "Os custos de negociação são dinâmicos. Nosso Analisador de Custos ao Vivo fornece dados em tempo real sobre spreads e comissões para as corretoras que você selecionar, ajudando a identificar a opção mais barata a qualquer momento. Geralmente, corretoras ECN/STP como Pepperstone ou IC Markets oferecem spreads brutos muito baixos, mas cobram uma comissão." } } },
    allBrokersPage: { title: "Todas as Corretoras de Forex", subtitle: "Use nossos filtros avançados para encontrar a corretora que corresponde perfeitamente ao seu estilo de negociação e necessidades.", filtersTitle: "Filtros", reset: "Redefinir", searchPlaceholder: "Buscar por nome da corretora...", presetsTitle: "Estilos de Negociação", presets: { scalping: "Scalping", algorithmic: "Algorítmico", copyTrading: "Copy Trading", swingTrading: "Swing Trading" }, generalTitle: "Geral", minDeposit: "Depósito Mínimo", minDepositOptions: { any: "Qualquer valor", "100": "Até $100", "250": "Até $250", "1000": "Até $1000" }, regulator: "Regulador", regulatorOptions: { any: "Qualquer regulador" }, executionCostsTitle: "Execução e Custos", executionType: "Tipo de Execução", spread: "Spread EUR/USD", spreadOptions: { any: "Qualquer", ultraLow: "Ultra Baixo (≤ 0.5 pips)", low: "Baixo (0.6 - 1.0 pips)", standard: "Padrão (> 1.0 pips)" }, commissions: "Comissões", commissionOptions: { any: "Qualquer", commission: "Baseado em comissão", zero: "Comissão zero" }, techPlatformsTitle: "Tecnologia e Plataformas", platform: "Plataforma", algoTrading: "Negociação Algorítmica", algoTradingOptions: { eaSupport: "Suporte MQL5/EA", apiAccess: "Acesso à API" }, socialTrading: "Negociação Social", socialTradingOptions: { any: "Qualquer", yes: "Suporta Copy Trading", no: "Sem Copy Trading" }, tradingConditionsTitle: "Condições de Negociação", minLotSize: "Tamanho Mínimo do Lote", minLotSizeOptions: { any: "Qualquer", micro: "Micro (0.01)", mini: "Mini (0.1)" }, maxLeverage: "Alavancagem Máxima", maxLeverageOptions: { any: "Qualquer", low: "Até 1:100", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "Mostrando {count} de {total} corretoras", getAiRec: "Obter Recomendação da IA", aiRecTooltip: "Filtre para pelo menos 2 corretoras para obter uma recomendação.", aiError: "Desculpe, a IA не pôde fazer uma recomendação. Por favor, tente novamente com um filtro diferente.", aiPicksTitle: "Principais Escolhas da IA da Sua Seleção", aiAnalysisTitle: "Análise da IA", noResultsTitle: "Nenhuma Corretora Corresponde aos Seus Critérios", noResultsSubtitle: "Tente ajustar seus filtros para encontrar mais resultados." } },
    brokerMatcherPage: { title: "Assistente IA de Corretoras", subtitle: "Responda a algumas perguntas e deixe nossa IA fazer o trabalho.", steps: { "0": { title: "Primeiro, qual é a sua experiência de negociação?", options: ["Iniciante", "Intermediário", "Especialista"] }, "1": { title: "Qual é o seu depósito inicial planejado?", options: ["Menos de $200", "$200 - $1000", "$1000 - $5000", "$5000+"] }, "2": { title: "Alguma plataforma de negociação preferida?", options: ["MetaTrader 4/5", "cTrader", "TradingView", "Própria", "Não me importo"], placeholder: "Ou digite a sua..." }, "3": { title: "Finalmente, o que é mais importante para você?", options: ["Spreads mais baixos possíveis", "Regulamentação de primeira linha", "Melhor plataforma de negociação", "Amigável para iniciantes"], placeholder: "Ou digite o seu..." } }, back: "Voltar", findMyBroker: "Encontrar Minha Corretora", tooltip: "Usa IA para analisar suas preferências e recomendar as melhores corretoras para você.", loading: "Nossa IA está encontrando sua corretora perfeita...", results: { title: "Suas Melhores Correspondências", aiAnalysis: "Análise da IA", startOver: "Começar de Novo", error: "Falha ao obter recomendações. Por favor, tente novamente." } },
    comparePage: { title: "Comparar Corretoras", subtitle: "Análise lado a lado de suas corretoras selecionadas.", startDuel: "Iniciar Duelo", clearAll: "Limpar Tudo", getAiSummary: "Obter Resumo Comparativo da IA", aiAnalysis: "Análise da IA", empty: { title: "Sua lista de comparação está vazia.", subtitle: "Adicione corretoras para comparar suas características lado a lado.", button: "Navegar pelas Corretoras" } },
    compareTable: { feature: "Característica", visit: "Visitar", remove: "Remover", features: { overallScore: "Pontuação Geral", score: "Pontuação", tradingCosts: "Custos de Negociação", eurusd: "Spread EUR/USD", gbpusd: "Spread GBP/USD", usdjpy: "Spread USD/JPY", commission: "Comissão", swap: "Categoria de Taxa de Swap", tradingConditions: "Condições de Negociação", maxLeverage: "Alavancagem Máx.", executionType: "Tipo de Execução", accessibility: "Acessibilidade", minDeposit: "Depósito Mín.", depositMethods: "Métodos de Depósito", withdrawalMethods: "Métodos de Saque", support: "Suporte ao Cliente", technology: "Tecnologia", platforms: "Plataformas", tradableInstruments: "Instrumentos Negociáveis", forexPairs: "Pares de Moedas", stocks: "CFDs de Ações", cryptocurrencies: "Criptomoedas", trust: "Confiança e Histórico", regulators: "Reguladores", founded: "Fundada em", headquarters: "Sede" } },
    loginPage: { title: "Faça login na sua conta", emailLabel: "Endereço de e-mail", passwordLabel: "Senha", button: "Entrar", noAccount: "Não tem uma conta?", registerLink: "Registre-se aqui" },
    registerPage: { title: "Criar uma Conta", nameLabel: "Nome Completo", emailLabel: "Endereço de e-mail", passwordLabel: "Senha", button: "Registrar", haveAccount: "Já tem uma conta?", loginLink: "Faça login aqui" },
    dashboardPage: { welcome: "Bem-vindo de volta, {name}!", subtitle: "Este é o seu painel pessoal para acompanhar e gerenciar sua pesquisa de corretoras.", quickActions: { newMatch: { title: "Nova Correspondência IA", description: "Encontre uma nova corretora sob medida para você." }, compare: { title: "Comparar Corretoras", description: "Veja sua lista de comparação." }, analyzer: { title: "Analisador de Custos", description: "Analise as taxas de negociação ao vivo." }, explore: { title: "Explorar Todas as Corretoras", description: "Navegue em nossa lista completa de corretoras." } }, alerts: { title: "Meus Alertas", empty: "Nenhum alerta para suas corretoras favoritas. Adicione algumas corretoras aos seus favoritos para começar a receber atualizações!", button: "Explorar Corretoras" }, history: { title: "Seu Histórico de Correspondências da IA", matchTitle: "Correspondência para um Trader {experience}", matchSubtitle: "Prioridade: {priority} | {date}", preferences: "Suas Preferências:", experience: "Experiência:", deposit: "Depósito Inicial:", platforms: "Plataformas:", priority: "Prioridade:", any: "Qualquer", aiAnalysis: "Análise da IA:", recommendations: "Corretoras Recomendadas para esta Correspondência:", empty: "Você ainda não usou o Assistente de Corretoras IA.", button: "Encontrar sua Primeira Correspondência" }, reviews: { title: "Minhas Análises", reviewFor: "Análise para", unknownBroker: "Corretora Desconhecida", verify: "Verificar Análise", empty: "Você ainda não escreveu nenhuma análise.", button: "Encontrar uma Corretora para Analisar" }, favorites: { title: "Suas Corretoras Favoritas", empty: "Você ainda não favoritou nenhuma corretora. Clique no ícone de estrela em uma corretora para salvá-la aqui.", button: "Explorar Corretoras" }, settings: { title: "Configurações da Conta", email: "Endereço de e-mail", name: "Nome Completo", password: "Nova Senha", passwordPlaceholder: "Deixe em branco para manter a senha atual", button: "Salvar Alterações", success: "Perfil atualizado com sucesso!", dangerZone: "Zona de Perigo", dangerDescription: "Excluir sua conta é uma ação permanente e não pode ser desfeita.", deleteButton: "Excluir Minha Conta", deleteModal: { title: "Confirmar Exclusão da Conta", text: "Tem certeza de que deseja excluir permanentemente sua conta? Todos os seus dados, incluindo favoritos e histórico de correspondências, serão perdidos.", cancel: "Cancelar", confirm: "Sim, Excluir Conta" } } }
  },
  de: {
    header: { brokers: "Broker", marketNews: "Marktnachrichten", methodology: "Methodik", login: "Anmelden", register: "Registrieren", logout: "Abmelden", dashboard: "Mein Dashboard", megaMenu: { coreTools: "Kernwerkzeuge", allBrokers: "Alle Broker", compareBrokers: "Broker vergleichen", costAnalyzer: "Kostenanalysator", aiBrokerMatcher: "KI-Broker-Finder", byCountry: "Nach Land", platformsAndTypes: "Plattformen & Typen" } },
    footer: { subtitle: "Entdecken Sie Ihren perfekten Forex-Broker mit der Kraft der KI.", byCountry: "Nach Land", platformsAndTypes: "Plattformen & Typen", resources: "Ressourcen", copyright: "© {year} Brokeranalysis. Alle Rechte vorbehalten." },
    home: { heroTitle: "Finden Sie Ihren Perfekten Forex-Broker", heroSubtitle: "Nutzen Sie die Kraft der KI, um den besten Broker für Ihren Handelsstil zu analysieren, zu vergleichen und auszuwählen.", heroDataDriven: "Datenbasierte Einblicke zu Dutzenden regulierter Broker weltweit.", useAiMatcher: "KI-Broker-Finder nutzen", exploreAllBrokers: "Alle Broker entdecken", trustedBy: "Vertraut von Top-Tradern", whyChoose: "Warum Brokeranalysis?", features: { data: { title: "Umfassende Daten", description: "Greifen Sie auf detaillierte Informationen zu Dutzenden von Brokern zu, von Regulierungen bis zu Handelsbedingungen." }, matching: { title: "KI-gestütztes Matching", description: "Unser intelligenter Broker-Finder findet den idealen Broker basierend auf Ihren einzigartigen Präferenzen." }, comparison: { title: "Direkter Vergleich", description: "Vergleichen Sie einfach die Hauptmerkmale mehrerer Broker in einer klaren, übersichtlichen Tabelle." }, trust: { title: "Vertrauen & Sicherheit", description: "Wir überprüfen regulatorische Daten und nutzen KI, um einen dynamischen Vertrauens-Score für jeden Broker zu erstellen." } }, popularCategoriesTitle: "Beliebte Kategorien entdecken", categories: { beginners: { title: "Ideal für Anfänger", description: "Finden Sie benutzerfreundliche Plattformen mit niedrigen Einzahlungen und großartigen Lerninhalten." }, uk: { title: "Britische Forex-Broker", description: "Entdecken Sie erstklassige, FCA-regulierte Broker, die für ihren robusten Kundenschutz bekannt sind." }, ecn: { title: "ECN-Broker", description: "Für ernsthafte Trader, die direkten Marktzugang und die engstmöglichen Spreads suchen." }, copy: { title: "Copy Trading", description: "Nutzen Sie die Expertise erfahrener Trader, indem Sie deren Trades automatisch kopieren." } }, howItWorksTitle: "So funktioniert es in 3 einfachen Schritten", steps: { "1": { title: "Fragen beantworten", description: "Erzählen Sie uns von Ihrem Handelsstil, Ihrer Erfahrung und was Ihnen bei einem Broker am wichtigsten ist." }, "2": { title: "KI-Vorschläge erhalten", description: "Unsere KI analysiert Ihr Profil und empfiehlt die besten Broker aus unserer Datenbank." }, "3": { title: "Vergleichen & Auswählen", description: "Nutzen Sie unsere Tools, um Kosten, Funktionen und Vertrauens-Scores zu vergleichen und Ihre endgültige Wahl zu treffen." } }, socialProofTitle: "Weltweit von Tradern geschätzt", testimonials: { "1": { quote: "„Der KI-Broker-Finder ist ein Game-Changer. Er hat mir einen Broker mit niedrigen Spreads gefunden, von dem ich noch nie gehört hatte. Hat mir Stunden an Recherche gespart.“", author: "- Alex R., Daytrader" }, "2": { quote: "„Endlich eine Vergleichsseite, die wirklich nützlich ist. Der Live-Kostenanalysator ist brillant, um die Echtzeit-Gebühren zu sehen. Sehr empfehlenswert.“", author: "- Sarah T., Swing-Traderin" } }, faqTitle: "Häufig gestellte Fragen", faqs: { "1": { q: "Welcher ist der sicherste Forex-Broker?", a: "Sicherheit hängt stark von der Regulierung ab. Die sichersten Broker sind in der Regel diejenigen, die von mehreren erstklassigen Behörden wie der FCA (UK), ASIC (Australien) und FINMA (Schweiz) reguliert werden. Unsere Plattform hebt regulatorische Daten hervor und bietet einen KI-Vertrauens-Score, um Ihnen bei der Bewertung der Sicherheit eines Brokers zu helfen." }, "2": { q: "Wie wählt die KI den richtigen Broker für mich aus?", a: "Unser KI-Broker-Finder analysiert Ihre Antworten auf Fragen zu Ihrem Handelsstil und Ihren Prioritäten. Dann vergleicht er Ihr Profil mit unserer Datenbank von Broker-Attributen, um die besten Übereinstimmungen zu finden. Es ist ein datengesteuerter Prozess, der darauf ausgelegt ist, Ihre Suche zu personalisieren." }, "3": { q: "Welcher Broker hat die niedrigsten Handelskosten?", a: "Handelskosten sind dynamisch. Unser Live-Kostenanalysator liefert Echtzeitdaten zu Spreads und Provisionen für die von Ihnen ausgewählten Broker und hilft Ihnen, die günstigste Option zu identifizieren. Im Allgemeinen bieten ECN/STP-Broker wie Pepperstone oder IC Markets sehr niedrige Roh-Spreads, erheben aber eine Provision." } } },
    allBrokersPage: { title: "Alle Forex-Broker", subtitle: "Verwenden Sie unsere erweiterten Filter, um den Broker zu finden, der perfekt zu Ihrem Handelsstil und Ihren Bedürfnissen passt.", filtersTitle: "Filter", reset: "Zurücksetzen", searchPlaceholder: "Nach Broker-Namen suchen...", presetsTitle: "Handelsstil-Voreinstellungen", presets: { scalping: "Scalping", algorithmic: "Algorithmisch", copyTrading: "Copy Trading", swingTrading: "Swing Trading" }, generalTitle: "Allgemein", minDeposit: "Mindesteinzahlung", minDepositOptions: { any: "Jeder Betrag", "100": "Bis zu $100", "250": "Bis zu $250", "1000": "Bis zu $1000" }, regulator: "Regulierungsbehörde", regulatorOptions: { any: "Jede Behörde" }, executionCostsTitle: "Ausführung & Kosten", executionType: "Ausführungstyp", spread: "EUR/USD Spread", spreadOptions: { any: "Jeder", ultraLow: "Sehr niedrig (≤ 0.5 Pips)", low: "Niedrig (0.6 - 1.0 Pips)", standard: "Standard (> 1.0 Pips)" }, commissions: "Provisionen", commissionOptions: { any: "Jede", commission: "Provisionsbasiert", zero: "Null Provision" }, techPlatformsTitle: "Technologie & Plattformen", platform: "Plattform", algoTrading: "Algorithmischer Handel", algoTradingOptions: { eaSupport: "MQL5/EA-Unterstützung", apiAccess: "API-Zugang" }, socialTrading: "Social Trading", socialTradingOptions: { any: "Jedes", yes: "Unterstützt Copy Trading", no: "Kein Copy Trading" }, tradingConditionsTitle: "Handelsbedingungen", minLotSize: "Mindest-Lotgröße", minLotSizeOptions: { any: "Jede", micro: "Micro (0.01)", mini: "Mini (0.1)" }, maxLeverage: "Max. Hebel", maxLeverageOptions: { any: "Jeder", low: "Bis zu 1:100", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "Zeige {count} von {total} Brokern", getAiRec: "KI-Empfehlung erhalten", aiRecTooltip: "Filtern Sie mindestens 2 Broker, um eine Empfehlung zu erhalten.", aiError: "Leider konnte die KI keine Empfehlung abgeben. Bitte versuchen Sie es mit einem anderen Filter.", aiPicksTitle: "Top-Auswahl der KI aus Ihrer Auswahl", aiAnalysisTitle: "KI-Analyse", noResultsTitle: "Keine Broker entsprechen Ihren Kriterien", noResultsSubtitle: "Versuchen Sie, Ihre Filter anzupassen, um mehr Ergebnisse zu finden." } },
    brokerMatcherPage: { title: "KI-Broker-Finder", subtitle: "Beantworten Sie ein paar Fragen und lassen Sie unsere KI die Arbeit machen.", steps: { "0": { title: "Zuerst, was ist Ihre Handelserfahrung?", options: ["Anfänger", "Fortgeschritten", "Experte"] }, "1": { title: "Was ist Ihre geplante Ersteinzahlung?", options: ["Unter $200", "$200 - $1000", "$1000 - $5000", "$5000+"] }, "2": { title: "Bevorzugte Handelsplattformen?", options: ["MetaTrader 4/5", "cTrader", "TradingView", "Proprietär", "Egal"], placeholder: "Oder geben Sie Ihre eigene ein..." }, "3": { title: "Zuletzt, was ist Ihnen am wichtigsten?", options: ["Niedrigstmögliche Spreads", "Erstklassige Regulierung", "Beste Handelsplattform", "Anfängerfreundlich"], placeholder: "Oder geben Sie Ihre eigene ein..." } }, back: "Zurück", findMyBroker: "Meinen Broker finden", tooltip: "Nutzt KI, um Ihre Präferenzen zu analysieren und Ihnen die besten Broker zu empfehlen.", loading: "Unsere KI findet Ihren perfekten Broker...", results: { title: "Ihre Top-Treffer", aiAnalysis: "KI-Analyse", startOver: "Neu starten", error: "Empfehlungen konnten не abgerufen werden. Bitte versuchen Sie es erneut." } },
    comparePage: { title: "Broker vergleichen", subtitle: "Direkter Vergleich Ihrer ausgewählten Broker.", startDuel: "Duell starten", clearAll: "Alle löschen", getAiSummary: "KI-Vergleichszusammenfassung erhalten", aiAnalysis: "KI-Analyse", empty: { title: "Ihre Vergleichsliste ist leer.", subtitle: "Fügen Sie Broker hinzu, um deren Funktionen direkt zu vergleichen.", button: "Broker durchsuchen" } },
    compareTable: { feature: "Merkmal", visit: "Besuchen", remove: "Entfernen", features: { overallScore: "Gesamtbewertung", score: "Bewertung", tradingCosts: "Handelskosten", eurusd: "EUR/USD Spread", gbpusd: "GBP/USD Spread", usdjpy: "USD/JPY Spread", commission: "Provision", swap: "Swap-Gebührenkategorie", tradingConditions: "Handelsbedingungen", maxLeverage: "Max. Hebel", executionType: "Ausführungstyp", accessibility: "Zugänglichkeit", minDeposit: "Min. Einzahlung", depositMethods: "Einzahlungsmethoden", withdrawalMethods: "Auszahlungsmethoden", support: "Kundensupport", technology: "Technologie", platforms: "Plattformen", tradableInstruments: "Handelbare Instrumente", forexPairs: "Währungspaare", stocks: "Aktien-CFDs", cryptocurrencies: "Kryptowährungen", trust: "Vertrauen & Hintergrund", regulators: "Regulierungsbehörden", founded: "Gegründet", headquarters: "Hauptsitz" } },
    loginPage: { title: "In Ihr Konto einloggen", emailLabel: "E-Mail-Adresse", passwordLabel: "Passwort", button: "Anmelden", noAccount: "Sie haben kein Konto?", registerLink: "Hier registrieren" },
    registerPage: { title: "Konto erstellen", nameLabel: "Vollständiger Name", emailLabel: "E-Mail-Adresse", passwordLabel: "Passwort", button: "Registrieren", haveAccount: "Sie haben bereits ein Konto?", loginLink: "Hier anmelden" },
    dashboardPage: { welcome: "Willkommen zurück, {name}!", subtitle: "Dies ist Ihr persönliches Dashboard, um Ihre Broker-Recherche zu verfolgen und zu verwalten.", quickActions: { newMatch: { title: "Neuer KI-Match", description: "Finden Sie einen neuen, auf Sie zugeschnittenen Broker." }, compare: { title: "Broker vergleichen", description: "Sehen Sie sich Ihre Vergleichsliste an." }, analyzer: { title: "Kostenanalysator", description: "Analysieren Sie Live-Handelsgebühren." }, explore: { title: "Alle Broker erkunden", description: "Durchsuchen Sie unsere vollständige Broker-Liste." } }, alerts: { title: "Meine Benachrichtigungen", empty: "Keine Benachrichtigungen für Ihre favorisierten Broker. Fügen Sie Broker zu Ihren Favoriten hinzu, um Updates zu erhalten!", button: "Broker erkunden" }, history: { title: "Ihr KI-Broker-Match-Verlauf", matchTitle: "Match für einen {experience}-Trader", matchSubtitle: "Priorität: {priority} | {date}", preferences: "Ihre Präferenzen:", experience: "Erfahrung:", deposit: "Ersteinzahlung:", platforms: "Plattformen:", priority: "Priorität:", any: "Jede", aiAnalysis: "KI-Analyse:", recommendations: "Empfohlene Broker für diesen Match:", empty: "Sie haben den KI-Broker-Finder noch nicht verwendet.", button: "Finden Sie Ihren ersten Match" }, reviews: { title: "Meine Bewertungen", reviewFor: "Bewertung für", unknownBroker: "Unbekannter Broker", verify: "Bewertung verifizieren", empty: "Sie haben noch keine Bewertungen geschrieben.", button: "Broker zum Bewerten finden" }, favorites: { title: "Ihre favorisierten Broker", empty: "Sie haben noch keine Broker favorisiert. Klicken Sie auf das Stern-Symbol eines Brokers, um ihn hier zu speichern.", button: "Broker erkunden" }, settings: { title: "Kontoeinstellungen", email: "E-Mail-Adresse", name: "Vollständiger Name", password: "Neues Passwort", passwordPlaceholder: "Leer lassen, um das aktuelle Passwort beizubehalten", button: "Änderungen speichern", success: "Profil erfolgreich aktualisiert!", dangerZone: "Gefahrenzone", dangerDescription: "Das Löschen Ihres Kontos ist eine endgültige Aktion und kann nicht rückgängig gemacht werden.", deleteButton: "Mein Konto löschen", deleteModal: { title: "Kontolöschung bestätigen", text: "Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Alle Ihre Daten, einschließlich Favoriten und Match-Verlauf, gehen verloren.", cancel: "Abbrechen", confirm: "Ja, Konto löschen" } } }
  },
  ja: {
    header: { brokers: "ブローカー", marketNews: "市場ニュース", methodology: "方法論", login: "ログイン", register: "登録", logout: "ログアウト", dashboard: "マイダッシュボード", megaMenu: { coreTools: "コアツール", allBrokers: "すべてのブローカー", compareBrokers: "ブローカーを比較", costAnalyzer: "コスト分析", aiBrokerMatcher: "AIブローカーマッチャー", byCountry: "国別", platformsAndTypes: "プラットフォームとタイプ" } },
    footer: { subtitle: "AIの力で完璧なFXブローカーを見つけましょう。", byCountry: "国別", platformsAndTypes: "プラットフォームとタイプ", resources: "リソース", copyright: "© {year} Brokeranalysis. 無断複写・転載を禁じます。" },
    home: { heroTitle: "あなたにぴったりのFXブローカーを見つけよう", heroSubtitle: "AIの力を活用して、あなたの取引スタイルに合わせた最高のブローカーを分析、比較、選択します。", heroDataDriven: "世界中の数十の規制されたブローカーに関するデータ駆動型の洞察。", useAiMatcher: "AIブローカーマッチャーを使用", exploreAllBrokers: "すべてのブローカーを見る", trustedBy: "トップトレーダーに信頼されています", whyChoose: "Brokeranalysisを選ぶ理由", features: { data: { title: "包括的なデータ", description: "規制から取引条件まで、数十のブローカーに関する詳細情報にアクセスします。" }, matching: { title: "AIによるマッチング", description: "当社のインテリジェントなブローカーマッチャーが、あなたのユニークな好みに基づいて理想的なブローカーを見つけます。" }, comparison: { title: "横並び比較", description: "明確で簡潔な表で、複数のブローカーの主要な特徴を簡単に比較できます。" }, trust: { title: "信頼と安全性", description: "規制データを検証し、AIを使用して各ブローカーの動的な信頼スコアを生成します。" } }, popularCategoriesTitle: "人気のカテゴリを探す", categories: { beginners: { title: "初心者向け", description: "低預金で優れた教育コンテンツを備えた使いやすいプラットフォームを見つけましょう。" }, uk: { title: "英国のFXブローカー", description: "堅牢な顧客保護で知られる、FCA規制のトップティアブローカーをご覧ください。" }, ecn: { title: "ECNブローカー", description: "直接市場アクセスと可能な限り狭いスプレッドを求める真剣なトレーダー向け。" }, copy: { title: "コピートレード", description: "経験豊富なトレーダーの取引を自動的にコピーして、彼らの専門知識を活用しましょう。" } }, howItWorksTitle: "3つの簡単なステップで仕組みを解説", steps: { "1": { title: "質問に答える", description: "あなたの取引スタイル、経験、ブローカーに最も求めるものについて教えてください。" }, "2": { title: "AIマッチングを取得", description: "当社のAIがあなたのプロフィールを分析し、データベースからトップブローカーを推奨します。" }, "3": { title: "比較して選択", description: "当社のツールを使用してコスト、機能、信頼スコアを比較し、最終的な選択を行います。" } }, socialProofTitle: "世界中のトレーダーから信頼されています", testimonials: { "1": { quote: "「AIブローカーマッチャーは画期的です。聞いたことのない低スプレッドのブローカーを見つけてくれました。何時間ものリサーチ時間を節約できました。」", author: "- アレックス R.、デイトレーダー" }, "2": { quote: "「ついに本当に役立つ比較サイトが登場しました。リアルタイムのコスト分析は、リアルタイムの手数料を見るのに素晴らしいです。強くお勧めします。」", author: "- サラ T.、スイングトレーダー" } }, faqTitle: "よくある質問", faqs: { "1": { q: "最も安全なFXブローカーは？", a: "安全性は規制に大きく依存します。最も安全なブローカーは通常、FCA（英国）、ASIC（オーストラリア）、FINMA（スイス）などの複数のトップティア当局によって規制されているブローカーです。当社のプラットフォームは規制データを強調し、ブローカーの安全性を評価するのに役立つAI信頼スコアを提供します。" }, "2": { q: "AIはどのようにして私に適したブローカーを選ぶのですか？", a: "当社のAIブローカーマッチャーは、あなたの取引スタイルと優先順位に関する質問への回答を分析します。そして、あなたのプロフィールをブローカーの属性データベースと比較して、最も近いマッチを見つけます。これは、あなたの検索をパーソナライズするために設計されたデータ駆動型のプロセスです。" }, "3": { q: "どのブローカーの取引コストが最も低いですか？", a: "取引コストは動的です。当社のライブコスト分析ツールは、選択したブローカーのスプレッドと手数料に関するリアルタイムデータを提供し、最も安いオプションを特定するのに役立ちます。一般的に、PepperstoneやIC MarketsのようなECN/STPブローカーは非常に低い生スプレッドを提供しますが、手数料を請求します。" } } },
    allBrokersPage: { title: "すべてのFXブローカー", subtitle: "当社の高度なフィルターを使用して、あなたの取引スタイルとニーズに完全に一致するブローカーを見つけてください。", filtersTitle: "フィルター", reset: "リセット", searchPlaceholder: "ブローカー名で検索...", presetsTitle: "取引スタイルプリセット", presets: { scalping: "スキャルピング", algorithmic: "アルゴリズム", copyTrading: "コピートレード", swingTrading: "スイングトレード" }, generalTitle: "一般", minDeposit: "最低入金額", minDepositOptions: { any: "任意の金額", "100": "$100まで", "250": "$250まで", "1000": "$1000まで" }, regulator: "規制当局", regulatorOptions: { any: "任意の規制当局" }, executionCostsTitle: "執行とコスト", executionType: "執行タイプ", spread: "EUR/USD スプレッド", spreadOptions: { any: "任意", ultraLow: "超低 (≤ 0.5 pips)", low: "低 (0.6 - 1.0 pips)", standard: "標準 (> 1.0 pips)" }, commissions: "手数料", commissionOptions: { any: "任意", commission: "手数料ベース", zero: "手数料ゼロ" }, techPlatformsTitle: "テクノロジーとプラットフォーム", platform: "プラットフォーム", algoTrading: "アルゴリズム取引", algoTradingOptions: { eaSupport: "MQL5/EA サポート", apiAccess: "APIアクセス" }, socialTrading: "ソーシャルトレード", socialTradingOptions: { any: "任意", yes: "コピートレードをサポート", no: "コピートレードなし" }, tradingConditionsTitle: "取引条件", minLotSize: "最小ロットサイズ", minLotSizeOptions: { any: "任意", micro: "マイクロ (0.01)", mini: "ミニ (0.1)" }, maxLeverage: "最大レバレッジ", maxLeverageOptions: { any: "任意", low: "最大 1:100", medium: "1:101 - 1:499", high: "1:500+" }, results: { showing: "{total}件中{count}件のブローカーを表示", getAiRec: "AIの推奨を取得", aiRecTooltip: "推奨を得るには、少なくとも2つのブローカーに絞り込んでください。", aiError: "申し訳ありませんが、AIは推奨を行うことができませんでした。別のフィルターで再試行してください。", aiPicksTitle: "あなたの選択からのAIトップピック", aiAnalysisTitle: "AI分析", noResultsTitle: "あなたの基準に一致するブローカーはありません", noResultsSubtitle: "より多くの結果を見つけるためにフィルターを調整してみてください。" } },
    brokerMatcherPage: { title: "AIブローカーマッチャー", subtitle: "いくつかの質問に答えて、AIに作業を任せましょう。", steps: { "0": { title: "まず、あなたの取引経験は？", options: ["初心者", "中級者", "専門家"] }, "1": { title: "予定している初期入金額は？", options: ["$200未満", "$200 - $1000", "$1000 - $5000", "$5000以上"] }, "2": { title: "好みの取引プラットフォームは？", options: ["MetaTrader 4/5", "cTrader", "TradingView", "独自", "気にしない"], placeholder: "または、ご自身で入力..." }, "3": { title: "最後に、あなたにとって最も重要なことは？", options: ["可能な限り低いスプレッド", "トップティアの規制", "最高の取引プラットフォーム", "初心者向け"], placeholder: "または、ご自身で入力..." } }, back: "戻る", findMyBroker: "私のブローカーを探す", tooltip: "AIを使用してあなたの好みを分析し、最適なブローカーを推奨します。", loading: "AIがあなたにぴったりのブローカーを探しています...", results: { title: "あなたのトップマッチ", aiAnalysis: "AI分析", startOver: "やり直す", error: "推奨の取得に失敗しました。再試行してください。" } },
    comparePage: { title: "ブローカーを比較", subtitle: "選択したブローカーの横並び分析。", startDuel: "デュエルを開始", clearAll: "すべてクリア", getAiSummary: "AI比較概要を取得", aiAnalysis: "AI分析", empty: { title: "比較リストは空です。", subtitle: "ブローカーを追加して、その機能を横並びで比較します。", button: "ブローカーを閲覧" } },
    compareTable: { feature: "機能", visit: "訪問", remove: "削除", features: { overallScore: "総合スコア", score: "スコア", tradingCosts: "取引コスト", eurusd: "EUR/USD スプレッド", gbpusd: "GBP/USD スプレッド", usdjpy: "USD/JPY スプレッド", commission: "手数料", swap: "スワップ手数料カテゴリ", tradingConditions: "取引条件", maxLeverage: "最大レバレッジ", executionType: "執行タイプ", accessibility: "アクセシビリティ", minDeposit: "最低入金額", depositMethods: "入金方法", withdrawalMethods: "出金方法", support: "カスタマーサポート", technology: "テクノロジー", platforms: "プラットフォーム", tradableInstruments: "取引可能な商品", forexPairs: "通貨ペア", stocks: "株式CFD", cryptocurrencies: "暗号資産", trust: "信頼性と背景", regulators: "規制当局", founded: "設立", headquarters: "本社" } },
    loginPage: { title: "アカウントにログイン", emailLabel: "メールアドレス", passwordLabel: "パスワード", button: "ログイン", noAccount: "アカウントをお持ちではありませんか？", registerLink: "こちらで登録" },
    registerPage: { title: "アカウントを作成", nameLabel: "氏名", emailLabel: "メールアドレス", passwordLabel: "パスワード", button: "登録", haveAccount: "すでにアカウントをお持ちですか？", loginLink: "こちらでログイン" },
    dashboardPage: { welcome: "おかえりなさい、{name}さん！", subtitle: "これは、ブローカーの調査を追跡および管理するための個人用ダッシュボードです。", quickActions: { newMatch: { title: "新しいAIマッチ", description: "あなたに合わせた新しいブローカーを見つけます。" }, compare: { title: "ブローカーを比較", description: "比較リストを表示します。" }, analyzer: { title: "コスト分析", description: "ライブ取引手数料を分析します。" }, explore: { title: "すべてのブローカーを探索", description: "完全なブローカーリストを閲覧します。" } }, alerts: { title: "マイアラート", empty: "お気に入りのブローカーに関するアラートはありません。更新情報を受け取るには、お気に入りにブローカーを追加してください！", button: "ブローカーを探索" }, history: { title: "AIブローカーマッチ履歴", matchTitle: "{experience}トレーダー向けのマッチ", matchSubtitle: "優先事項: {priority} | {date}", preferences: "あなたの好み:", experience: "経験:", deposit: "初期入金額:", platforms: "プラットフォーム:", priority: "優先事項:", any: "任意", aiAnalysis: "AI分析:", recommendations: "このマッチにおすすめのブローカー:", empty: "まだAIブローカーマッチャーを使用していません。", button: "最初のマッチを見つける" }, reviews: { title: "私のレビュー", reviewFor: "のレビュー", unknownBroker: "不明なブローカー", verify: "レビューを検証", empty: "まだレビューを書いていません。", button: "レビューするブローカーを探す" }, favorites: { title: "お気に入りのブローカー", empty: "まだお気に入りのブローカーはありません。ブローカーの星アイコンをクリックして、ここに保存してください。", button: "ブローカーを探索" }, settings: { title: "アカウント設定", email: "メールアドレス", name: "氏名", password: "新しいパスワード", passwordPlaceholder: "現在のパスワードを維持するには空のままにしてください", button: "変更を保存", success: "プロフィールが正常に更新されました！", dangerZone: "危険ゾーン", dangerDescription: "アカウントの削除は永久的な操作であり、元に戻すことはできません。", deleteButton: "マイアカウントを削除", deleteModal: { title: "アカウント削除の確認", text: "アカウントを永久に削除してもよろしいですか？お気に入りやマッチ履歴を含むすべてのデータが失われます。", cancel: "キャンセル", confirm: "はい、アカウントを削除します" } } }
  }
}