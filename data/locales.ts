export const translations = {
  en: {
    header: {
      brokers: "Brokers",
      tools: "Tools",
      education: "Education",
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
      },
      toolsMenu: {
        economicCalendar: "Economic Calendar",
        calculators: "Forex Calculators",
        marketData: "Market Data"
      }
    },
    chatbot: {
      greeting: "Hello! I'm BrokerBot. Ask me anything about our brokers, or try one of the suggestions below!",
      suggestions: [
        "Best ECN forex brokers",
        "Best forex brokers for beginners",
        "Which broker is best for scalpers?",
        "Compare Pepperstone vs IC Markets",
        "What are the spreads for XTB?",
        "Show me high leverage brokers"
      ]
    },
    footer: {
      subtitle: "Discover your perfect forex broker with the power of AI.",
      byCountry: "By Country",
      platformsAndTypes: "Platforms & Types",
      resources: "Resources",
      tools: "Tools",
      copyright: "© {year} Brokeranalysis. All rights reserved.",
      links: {
        home: "Home",
        allBrokers: "All Brokers",
        compareBrokers: "Compare Brokers",
        costAnalyzer: "Cost Analyzer",
        brokerMatcher: "Broker Matcher",
        marketNews: "Market News",
        educationHub: "Education Hub",
        economicCalendar: "Economic Calendar",
        calculators: "Calculators",
        marketData: "Market Data",
        methodology: "Methodology",
        sources: "Sources",
      }
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
      newTools: {
          title: "Powerful New Trading Tools",
          calendar: {
              title: "Economic Calendar",
              description: "Stay ahead of market-moving events with our real-time economic calendar."
          },
          calculators: {
              title: "Forex Calculators",
              description: "Essential tools for risk management, including position size and pip value calculators."
          }
      },
      popularCategoriesTitle: "Explore Popular Categories",
      categories: {
        beginners: {
          title: "Best for Beginners",
          description: "Find user-friendly platforms with low deposits and great educational content."
        },
        ecn: {
          title: "Low Spread & ECN Brokers",
          description: "For serious traders seeking direct market access and the tightest possible spreads."
        },
        copy: {
          title: "Top Copy Trading Platforms",
          description: "Leverage the expertise of seasoned traders by automatically copying their trades."
        },
        leverage: {
          title: "High Leverage Brokers",
          description: "Maximize your trading potential with brokers offering leverage of 1:500 or more."
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
            copytrading: "Copy Trading",
            swingtrading: "Swing Trading",
            newstrading: "News Trading",
            lowcost: "Low Cost"
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
        back: "Back",
        next: "Next",
        findMyBroker: "Find My Broker",
        tooltip: "Uses AI to analyze your preferences and recommend the best brokers for you.",
        loading: "Our AI is finding your perfect broker...",
        steps: {
            country: {
                title: "Where do you live?",
                tooltip: "Brokers are regulated differently in each country. This ensures we only recommend brokers available to you."
            },
            experience: {
                title: "How familiar are you with trading?",
                tooltip: "This helps us match you with a platform that suits your skill level, from simple interfaces for beginners to advanced tools for experts.",
                options: [
                    { key: "I'm a first-timer", text: "I'm a first-timer" },
                    { key: "I've made a few trades", text: "I've made a few trades" },
                    { key: "I have experience", text: "I have experience" },
                    { key: "I'm a professional", text: "I'm a professional" }
                ]
            },
            feeStructure: {
                title: "What fee structure would you prefer?",
                tooltip: "Choose 'Low spreads' for scalping, 'Low overnight fee' for long-term trades, or 'Both' for a balanced approach.",
                options: [
                    { key: "Low spreads", text: "Low spreads" },
                    { key: "Low overnight fee", text: "Low overnight fee" },
                    { key: "Both", text: "Both" },
                    { key: "I don't know", text: "I don't know" }
                ]
            },
            depositMethod: {
                title: "How would you like to deposit funds?",
                tooltip: "Select your preferred method to ensure a smooth and convenient funding process.",
                options: [
                    { key: "Bank transfer", text: "Bank transfer" },
                    { key: "Credit/debit card", text: "Credit/debit card" },
                    { key: "PayPal", text: "PayPal" },
                    { key: "Skrill", text: "Skrill" },
                    { key: "I don't know", text: "I don't know" }
                ]
            },
            currencyPairs: {
                title: "Which currency pairs would you like to trade?",
                tooltip: "Majors have the lowest spreads, while exotics can offer more volatility and opportunity.",
                options: [
                    { key: "Major currencies", text: "Major currencies" },
                    { key: "Minor currencies", text: "Minor currencies" },
                    { key: "Exotic currencies", text: "Exotic currencies" },
                    { key: "I don't know", text: "I don't know" }
                ]
            },
            specialPreferences: {
                title: "Any special preferences? (Pick up to 5)",
                options: [
                    { key: 'Fast account opening', text: 'Fast account opening', tooltip: 'Look for brokers with a fully digital and quick onboarding process.' },
                    { key: 'Quick withdrawal', text: 'Quick withdrawal', tooltip: 'Prioritize brokers known for processing withdrawals quickly and with low fees.' },
                    { key: 'Exclude risky countries', text: 'Exclude risky countries', tooltip: 'Filter out brokers regulated in jurisdictions with lower investor protection standards.' },
                    { key: 'Educational resources', text: 'Educational resources', tooltip: 'Find brokers who provide extensive articles, videos, and webinars to help you learn.' },
                    { key: 'Great research tools', text: 'Great research tools', tooltip: 'Get access to advanced charting, market analysis, and news feeds.' },
                    { key: 'ECN account', text: 'ECN account', tooltip: 'For direct market access with raw spreads and a fixed commission, ideal for scalpers.' },
                    { key: 'Islamic account', text: 'Islamic account', tooltip: 'Find brokers offering swap-free accounts that comply with Sharia law.' },
                    { key: 'Copy trading', text: 'Copy trading', tooltip: 'Follow and automatically copy the trades of successful traders.' },
                    { key: 'Superb customer service', text: 'Superb customer service', tooltip: 'Choose brokers with highly-rated, responsive support via live chat, phone, and email.' },
                    { key: 'API access', text: 'API access', tooltip: 'For algorithmic traders who want to connect their own custom trading software.' },
                ]
            }
        },
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
    },
    education: {
        hub: {
            title: "Education Hub",
            subtitle: "Learn, practice, and master the concepts of forex trading with our interactive tools.",
            quizzes: {
                title: "Interactive Quizzes",
                description: "Test your knowledge on key topics like trading fees, risk management, and technical analysis."
            },
            webinars: {
                title: "Expert Webinars",
                description: "Join live sessions with market analysts or watch recordings to deepen your understanding."
            },
            simulators: {
                title: "Trading Simulators",
                description: "Practice your skills in a risk-free environment. Learn order types, test strategies, and more."
            }
        },
        quizzes: {
            title: "Quizzes",
            subtitle: "Select a quiz to test your knowledge.",
            fees: {
                title: "Understanding Broker Fees",
                description: "Test your knowledge of the different costs involved in forex trading, from spreads to swaps.",
                q1: { question: "What is a 'spread' in forex trading?", options: ["The commission charged by a broker per trade.", "The difference between the bid (sell) and ask (buy) price.", "A bonus offered by the broker for opening an account.", "The interest paid or earned for holding a position overnight."], correctAnswer: "The difference between the bid (sell) and ask (buy) price.", explanation: "The spread is the primary way many brokers make money. It's the cost of the trade built into the buy and sell prices of a currency pair." },
                q2: { question: "What does 'leverage' allow a trader to do?", options: ["Trade with borrowed capital from the broker.", "Guarantee profits on a trade.", "Eliminate all trading risks.", "Receive a discount on commissions."], correctAnswer: "Trade with borrowed capital from the broker.", explanation: "Leverage allows you to control a larger position with a smaller amount of your own capital. While it can amplify profits, it also significantly amplifies losses." },
                q3: { question: "A 'swap fee' (or rollover fee) is charged when you do what?", options: ["Open a trade during high volatility.", "Withdraw funds from your account.", "Hold a position open overnight.", "Use a specific trading platform."], correctAnswer: "Hold a position open overnight.", explanation: "A swap fee is the interest paid or earned for holding a position overnight, based on the interest rate difference between the two currencies in a pair." },
                q4: { question: "Which of the following is typically a 'non-trading fee'?", options: ["Spread", "Commission", "Inactivity Fee", "Swap Fee"], correctAnswer: "Inactivity Fee", explanation: "Non-trading fees are charges not directly related to buying or selling. This includes fees for inactivity, deposits, or withdrawals." },
                q5: { question: "What is the main characteristic of a true 'ECN' broker's pricing model?", options: ["They offer fixed spreads.", "They charge zero commissions.", "They offer raw, variable spreads plus a fixed commission.", "They only make money from swap fees."], correctAnswer: "They offer raw, variable spreads plus a fixed commission.", explanation: "ECN (Electronic Communication Network) brokers provide direct access to market liquidity, resulting in very tight, variable spreads. They charge a separate, fixed commission for executing the trade." }
            },
            basics: {
                title: "Forex Trading Basics",
                description: "Learn the fundamental concepts of the forex market, including pips, lots, and currency pairs.",
                q1: { question: "What is a 'pip'?", options: ["The smallest price move that a given exchange rate can make.", "A type of trading commission.", "The total profit from a trade.", "A nickname for the British Pound."], correctAnswer: "The smallest price move that a given exchange rate can make.", explanation: "A 'pip' (percentage in point) is the unit of measurement to express the change in value between two currencies. For most pairs, it is the fourth decimal place." },
                q2: { question: "In the currency pair EUR/USD, which is the 'base' currency?", options: ["USD", "Both are base currencies", "EUR", "Neither are base currencies"], correctAnswer: "EUR", explanation: "The first currency in a pair (EUR in this case) is the 'base' currency. The second currency (USD) is the 'quote' or 'counter' currency. The price shows how much of the quote currency is needed to buy one unit of the base currency." },
                q3: { question: "A 'standard lot' in forex trading represents how many units of the base currency?", options: ["1,000", "10,000", "100,000", "1,000,000"], correctAnswer: "100,000", explanation: "Lot size refers to the number of currency units you are buying or selling. A standard lot is 100,000 units, a mini lot is 10,000 units, and a micro lot is 1,000 units." },
                q4: { question: "Which of these is considered a 'major' currency pair?", options: ["EUR/TRY (Euro/Turkish Lira)", "AUD/NZD (Australian Dollar/New Zealand Dollar)", "GBP/USD (British Pound/US Dollar)", "USD/MXN (US Dollar/Mexican Peso)"], correctAnswer: "GBP/USD (British Pound/US Dollar)", explanation: "Major currency pairs are those that include the US Dollar (USD) and are the most frequently traded in the world, such as EUR/USD, GBP/USD, and USD/JPY. They typically have the highest liquidity and lowest spreads." },
                q5: { question: "What does it mean to 'go long' on a currency pair?", options: ["To sell the base currency and buy the quote currency.", "To hold a trade for a long period of time.", "To buy the base currency and sell the quote currency, expecting the price to rise.", "To hedge a position against market volatility."], correctAnswer: "To buy the base currency and sell the quote currency, expecting the price to rise.", explanation: "Going long means you are buying the base currency with the expectation that its value will increase relative to the quote currency." }
            },
            charting: {
                title: "Introduction to Charting",
                description: "Understand the basics of reading forex charts, including candlestick patterns and trends.",
                q1: { question: "On a standard candlestick chart, what does a green (or hollow) candle typically represent?", options: ["A period where the closing price was lower than the opening price.", "A period of no price movement.", "A period where the closing price was higher than the opening price.", "A signal to sell immediately."], correctAnswer: "A period where the closing price was higher than the opening price.", explanation: "A green or hollow candlestick, often called a bullish candle, signifies that the price increased over that period. The bottom of the body is the open, and the top is the close." },
                q2: { question: "What is an 'uptrend' characterized by?", options: ["A series of lower highs and lower lows.", "A series of higher highs and higher lows.", "A sideways price movement.", "A single large price spike."], correctAnswer: "A series of higher highs and higher lows.", explanation: "An uptrend is identified by a consistent pattern of the price making new highs, followed by pullbacks that result in lows that are still higher than the previous lows." },
                q3: { question: "The 'wicks' or 'shadows' on a candlestick represent what?", options: ["The total trading volume for the period.", "The highest and lowest prices reached during the period.", "The commission paid for the trade.", "A prediction of future price movement."], correctAnswer: "The highest and lowest prices reached during the period.", explanation: "The 'body' of the candle shows the open and close prices, while the thin lines (wicks or shadows) extending from the body show the full price range—the highest and lowest points reached during that time period." },
                q4: { question: "A 'support' level on a chart is an area where...", options: ["Price has trouble rising above.", "Price tends to stop falling and may reverse upwards.", "Trading volume is always highest.", "Brokers execute all sell orders."], correctAnswer: "Price tends to stop falling and may reverse upwards.", explanation: "Support is a price level where buying interest is historically strong enough to overcome selling pressure, causing the price to bounce back up. It acts as a floor." },
                q5: { question: "What is a 'resistance' level on a chart?", options: ["A price level where selling pressure tends to overcome buying pressure.", "A level that guarantees a price drop.", "The lowest price a currency has ever reached.", "A tool for calculating leverage."], correctAnswer: "A price level where selling pressure tends to overcome buying pressure.", explanation: "Resistance is the opposite of support. It's a price level where selling interest is strong enough to prevent the price from rising further, acting as a ceiling." }
            },
            risk: {
                title: "Risk Management Essentials",
                description: "Grasp the crucial concepts of managing risk, including stop-loss orders and position sizing.",
                q1: { question: "What is the primary purpose of a 'stop-loss' order?", options: ["To lock in profits when a trade is winning.", "To automatically enter a trade at a future price.", "To limit potential losses on a trade by closing it at a predetermined price.", "To increase the leverage on a position."], correctAnswer: "To limit potential losses on a trade by closing it at a predetermined price.", explanation: "A stop-loss is a crucial risk management tool. It's an order you place with your broker to close a losing trade once it reaches a certain price level, preventing further losses." },
                q2: { question: "A risk/reward ratio of 1:3 on a trade means...", options: ["You are risking $3 to potentially make $1.", "You are risking $1 to potentially make $3.", "The trade has a 33.3% chance of success.", "The trade must be closed within 3 hours."], correctAnswer: "You are risking $1 to potentially make $3.", explanation: "The risk/reward ratio compares the potential loss of a trade (the distance from your entry to your stop-loss) to its potential profit (the distance to your take-profit). A 1:3 ratio is generally considered favorable, as your potential profit is three times your potential loss." },
                q3: { question: "What is 'position sizing'?", options: ["Choosing the best time of day to trade.", "Deciding how many lots or units to trade based on your account size and risk tolerance.", "Predicting the direction of the market.", "The physical size of your monitor."], correctAnswer: "Deciding how many lots or units to trade based on your account size and risk tolerance.", explanation: "Proper position sizing is key to risk management. It involves calculating the appropriate trade size so that a potential loss from a single trade is only a small, acceptable percentage of your total account balance (e.g., 1-2%)." },
                q4: { question: "What is a 'margin call'?", options: ["A call from your broker to congratulate you on a profitable trade.", "A notification that your account equity has fallen below the required maintenance margin.", "An order type that guarantees no slippage.", "A seminar on trading psychology."], correctAnswer: "A notification that your account equity has fallen below the required maintenance margin.", explanation: "A margin call occurs when your losing positions have reduced your available account equity to a point where you no longer meet the broker's requirements. You will need to either deposit more funds or close positions to meet the margin requirements." },
                q5: { question: "Why is it generally advised not to risk more than 1-2% of your capital on a single trade?", options: ["Because brokers do not allow larger risks.", "To ensure you can survive a string of losing trades without depleting your account.", "Because it guarantees your trades will be profitable.", "To pay lower taxes on your winnings."], correctAnswer: "To ensure you can survive a string of losing trades without depleting your account.", explanation: "Even the best trading strategies have losing streaks. By risking only a small percentage of your capital per trade, you protect your account from being wiped out by a few consecutive losses, allowing you to stay in the game long enough for your strategy to be profitable." }
            },
            orders: {
                title: "Understanding Order Types",
                description: "Learn the difference between market orders, limit orders, and stop orders.",
                q1: { question: "A 'Market Order' is an instruction to...", options: ["Buy or sell at a specific price or better.", "Buy or sell immediately at the best available current price.", "Cancel a previously placed order.", "Wait for the market to become less volatile."], correctAnswer: "Buy or sell immediately at the best available current price.", explanation: "A market order is the simplest type of order. It prioritizes speed of execution over a specific price, filling your order at whatever the current market rate is." },
                q2: { question: "A trader who wants to buy a currency pair but only if it drops to a lower price would use what type of order?", options: ["Market Buy", "Buy Limit", "Buy Stop", "Sell Limit"], correctAnswer: "Buy Limit", explanation: "A Buy Limit order is placed below the current market price. It is an instruction to buy if and only if the market price drops to your specified limit price or lower." },
                q3: { question: "What is a 'Sell Stop' order used for?", options: ["To sell at the current price.", "To sell a security when its price rises to a certain level.", "To sell a security when its price falls to a certain level, often to limit a loss or initiate a short position on a breakout.", "To buy a security when its price falls to a certain level."], correctAnswer: "To sell a security when its price falls to a certain level, often to limit a loss or initiate a short position on a breakout.", explanation: "A Sell Stop order is placed below the current price. It's triggered when the market price falls to your specified level. It's commonly used as a stop-loss for a long position or to enter a short trade on a downward breakout." },
                q4: { question: "If the current price of EUR/USD is 1.0750, and you believe it will go up after it breaks through the resistance at 1.0800, what order would you place?", options: ["Buy Limit at 1.0800", "Sell Stop at 1.0800", "Buy Stop at 1.0800", "Sell Limit at 1.0800"], correctAnswer: "Buy Stop at 1.0800", explanation: "A Buy Stop order is placed above the current market price. It is used to buy when you believe the price will continue to rise after hitting a certain level (a breakout). In this case, you'd place a Buy Stop at 1.0800 to catch the upward momentum." },
                q5: { question: "A 'Take Profit' order is designed to...", options: ["Limit your losses.", "Automatically close a profitable trade at a specified price.", "Increase your position size.", "Reverse your trade direction."], correctAnswer: "Automatically close a profitable trade at a specified price.", explanation: "A Take Profit (T/P) order is the opposite of a stop-loss. It is a limit order that closes your trade once it reaches a certain level of profit, ensuring you lock in your gains." }
            }
        },
        webinars: {
            title: "Webinars",
            subtitle: "Deepen your knowledge with insights from market experts.",
            register: "Register Now",
            watch: "Watch Recording",
            upcomingTitle: "Upcoming Webinars",
            pastTitle: "Past Webinars",
            upcoming: [
                { title: "Mastering Market Psychology", speaker: "Dr. Anna Becker", date: "October 5, 2025", description: "Learn to control fear and greed, and make more rational trading decisions." },
                { title: "Advanced Fibonacci Strategies", speaker: "John Murphy", date: "October 12, 2025", description: "Discover how to apply Fibonacci retracements and extensions to identify key support and resistance levels." }
            ],
            past: [
                { title: "Introduction to Technical Analysis", speaker: "Jane Doe", date: "September 28, 2025", description: "A beginner's guide to reading charts, identifying trends, and using basic indicators." },
                { title: "Fundamental Analysis for Forex Traders", speaker: "Mark Chen", date: "September 21, 2025", description: "Understand how economic data like NFP and CPI reports influence currency movements." }
            ]
        },
        simulators: {
            title: "Trading Simulators",
            subtitle: "Practice your skills in a risk-free environment.",
            execution: {
                title: "Order Execution Simulator",
                description: "Learn the difference between market, limit, and stop orders in a live, simulated market environment."
            }
        }
    },
    tools: {
        calendar: {
            title: "Economic Calendar",
            subtitle: "Stay informed about key economic events that move the markets."
        },
        marketData: {
            title: "Market Data",
            subtitle: "Get a comprehensive overview of the forex market with real-time rates and technical insights."
        },
        calculators: {
            title: "Forex Calculators",
            subtitle: "Essential tools to help you manage your trades and risk effectively.",
            pipValue: {
                title: "Pip Value",
                accountCurrency: "Account Currency",
                currencyPair: "Currency Pair",
                positionSize: "Position Size (Lots)",
                calculate: "Calculate Pip Value",
                result: "The value of one pip for a {lots} lot position on {pair} is approximately"
            },
            positionSize: {
                title: "Position Size",
                accountBalance: "Account Balance",
                riskPercentage: "Risk Percentage (%)",
                stopLoss: "Stop Loss (pips)",
                calculate: "Calculate Position Size",
                result: "To risk {risk}% of your account with a {sl} pip stop-loss, your recommended position size is:",
                lots: "Lots",
                units: "Units"
            },
            margin: {
                title: "Margin",
                leverage: "Leverage",
                tradeSize: "Trade Size (Lots)",
                calculate: "Calculate Margin",
                result: "The margin required to open a {lots} lot position on {pair} with {leverage} leverage is"
            }
        }
    }
  },
  de: {
    header: {
      brokers: "Broker",
      tools: "Werkzeuge",
      education: "Bildung",
      marketNews: "Marktnachrichten",
      methodology: "Methodik",
      login: "Anmelden",
      register: "Registrieren",
      logout: "Abmelden",
      dashboard: "Mein Dashboard",
      megaMenu: {
        coreTools: "Kernwerkzeuge",
        allBrokers: "Alle Broker",
        compareBrokers: "Broker vergleichen",
        costAnalyzer: "Kostenanalysator",
        aiBrokerMatcher: "KI-Broker-Matcher",
        byCountry: "Nach Land",
        platformsAndTypes: "Plattformen & Typen"
      },
      toolsMenu: {
        economicCalendar: "Wirtschaftskalender",
        calculators: "Forex-Rechner",
        marketData: "Marktdaten"
      }
    },
    chatbot: {
      greeting: "Hallo! Ich bin BrokerBot. Fragen Sie mich alles über unsere Broker oder probieren Sie einen der folgenden Vorschläge aus!",
      suggestions: [
        "Beste ECN Forex Broker",
        "Beste Forex Broker für Anfänger",
        "Welcher Broker ist am besten für Scalper?",
        "Pepperstone vs. IC Markets vergleichen",
        "Was sind die Spreads für XTB?",
        "Zeigen Sie mir Broker mit hohem Hebel"
      ]
    },
    footer: {
      subtitle: "Entdecken Sie Ihren perfekten Forex-Broker mit der Kraft der KI.",
      byCountry: "Nach Land",
      platformsAndTypes: "Plattformen & Typen",
      resources: "Ressourcen",
      tools: "Werkzeuge",
      copyright: "© {year} Brokeranalysis. Alle Rechte vorbehalten.",
      links: {
        home: "Startseite",
        allBrokers: "Alle Broker",
        compareBrokers: "Broker vergleichen",
        costAnalyzer: "Kostenanalysator",
        brokerMatcher: "Broker Matcher",
        marketNews: "Marktnachrichten",
        educationHub: "Bildungszentrum",
        economicCalendar: "Wirtschaftskalender",
        calculators: "Rechner",
        marketData: "Marktdaten",
        methodology: "Methodik",
        sources: "Quellen",
      }
    },
    home: {
      heroTitle: "Finden Sie Ihren perfekten Forex-Broker",
      heroSubtitle: "Nutzen Sie die Kraft der KI, um den besten Broker für Ihren Handelsstil zu analysieren, zu vergleichen und auszuwählen.",
      heroDataDriven: "Datengetriebene Einblicke in Dutzende von regulierten Brokern weltweit.",
      useAiMatcher: "KI-Broker-Matcher verwenden",
      exploreAllBrokers: "Alle Broker erkunden",
      trustedBy: "Von Top-Tradern als vertrauenswürdig eingestuft",
      whyChoose: "Warum Brokeranalysis wählen?",
      features: {
        data: {
          title: "Umfassende Daten",
          description: "Greifen Sie auf detaillierte Informationen zu Dutzenden von Brokern zu, von Vorschriften bis zu Handelsbedingungen."
        },
        matching: {
          title: "KI-gestützte Zuordnung",
          description: "Unser intelligenter Broker-Matcher findet den idealen Broker basierend auf Ihren einzigartigen Vorlieben."
        },
        comparison: {
          title: "Side-by-Side-Vergleich",
          description: "Vergleichen Sie einfach die Hauptmerkmale mehrerer Broker in einer klaren, prägnanten Tabelle."
        },
        trust: {
          title: "Vertrauen & Sicherheit",
          description: "Wir überprüfen regulatorische Daten und verwenden KI, um für jeden Broker eine dynamische Vertrauensbewertung zu erstellen."
        }
      },
      newTools: {
          title: "Leistungsstarke neue Handelswerkzeuge",
          calendar: {
              title: "Wirtschaftskalender",
              description: "Bleiben Sie mit unserem Echtzeit-Wirtschaftskalender über marktbewegende Ereignisse auf dem Laufenden."
          },
          calculators: {
              title: "Forex-Rechner",
              description: "Wesentliche Werkzeuge für das Risikomanagement, einschließlich Positionsgrößen- und Pip-Wert-Rechner."
          }
      },
      popularCategoriesTitle: "Beliebte Kategorien erkunden",
      categories: {
        beginners: {
          title: "Am besten für Anfänger",
          description: "Finden Sie benutzerfreundliche Plattformen mit niedrigen Einzahlungen und großartigen Bildungsinhalten."
        },
        ecn: {
          title: "Broker mit niedrigen Spreads & ECN",
          description: "Für ernsthafte Händler, die direkten Marktzugang und die engstmöglichen Spreads suchen."
        },
        copy: {
          title: "Top-Copy-Trading-Plattformen",
          description: "Nutzen Sie das Fachwissen erfahrener Händler, indem Sie deren Trades automatisch kopieren."
        },
        leverage: {
          title: "Broker mit hohem Hebel",
          description: "Maximieren Sie Ihr Handelspotenzial mit Brokern, die einen Hebel von 1:500 oder mehr anbieten."
        }
      },
      howItWorksTitle: "So funktioniert es in 3 einfachen Schritten",
      steps: {
        "1": {
          title: "Fragen beantworten",
          description: "Erzählen Sie uns von Ihrem Handelsstil, Ihrer Erfahrung und was Sie bei einem Broker am meisten schätzen."
        },
        "2": {
          title: "KI-Übereinstimmungen erhalten",
          description: "Unsere KI analysiert Ihr Profil und empfiehlt die besten Broker aus unserer Datenbank."
        },
        "3": {
          title: "Vergleichen & Auswählen",
          description: "Verwenden Sie unsere Tools, um Kosten, Funktionen und Vertrauensbewertungen zu vergleichen und Ihre endgültige Wahl zu treffen."
        }
      },
      socialProofTitle: "Weltweit von Händlern als vertrauenswürdig eingestuft",
      testimonials: {
        "1": {
          quote: "\"Der KI-Broker-Matcher ist ein Game-Changer. Er hat mir einen Broker mit niedrigen Spreads gefunden, von dem ich noch nie gehört hatte. Hat mir Stunden an Recherche erspart.\"",
          author: "- Alex R., Daytrader"
        },
        "2": {
          quote: "\"Endlich eine Vergleichsseite, die wirklich nützlich ist. Der Live-Kostenanalysator ist brillant, um Echtzeitgebühren zu sehen. Sehr zu empfehlen.\"",
          author: "- Sarah T., Swingtrader"
        }
      },
      faqTitle: "Häufig gestellte Fragen",
      faqs: {
        "1": {
          q: "Was ist der sicherste Forex-Broker?",
          a: "Sicherheit hängt stark von der Regulierung ab. Die sichersten Broker sind in der Regel diejenigen, die von mehreren erstklassigen Behörden wie der FCA (UK), ASIC (Australien) und FINMA (Schweiz) reguliert werden. Unsere Plattform hebt regulatorische Daten hervor und bietet eine KI-Vertrauensbewertung, um Ihnen bei der Beurteilung der Brokersicherheit zu helfen."
        },
        "2": {
          q: "Wie wählt die KI den richtigen Broker für mich aus?",
          a: "Unser KI-Broker-Matcher analysiert Ihre Antworten auf Fragen zu Ihrem Handelsstil und Ihren Prioritäten. Anschließend vergleicht er Ihr Profil mit unserer Datenbank von Brokerattributen – wie Kosten, Plattformen und Regulierung – um die engsten Übereinstimmungen zu finden. Es ist ein datengesteuerter Prozess, der darauf ausgelegt ist, Ihre Suche zu personalisieren."
        },
        "3": {
          q: "Welcher Broker hat die niedrigsten Handelskosten?",
          a: "Die Handelskosten sind dynamisch und hängen vom gehandelten Instrument ab. Unser Live-Kostenanalysator liefert Echtzeitdaten zu Spreads und Provisionen für die von Ihnen ausgewählten Broker und hilft Ihnen, jederzeit die günstigste Option zu finden. Im Allgemeinen bieten ECN/STP-Broker wie Pepperstone oder IC Markets sehr niedrige Roh-Spreads, erheben aber eine Provision."
        }
      }
    },
    allBrokersPage: {
        title: "Alle Forex Broker",
        subtitle: "Verwenden Sie unsere erweiterten Filter, um den Broker zu finden, der perfekt zu Ihrem Handelsstil und Ihren Bedürfnissen passt.",
        filtersTitle: "Filter",
        reset: "Zurücksetzen",
        searchPlaceholder: "Nach Brokername suchen...",
        presetsTitle: "Handelsstil-Voreinstellungen",
        presets: {
            scalping: "Scalping",
            algorithmic: "Algorithmisch",
            copytrading: "Copy Trading",
            swingtrading: "Swing Trading",
            newstrading: "Nachrichtenhandel",
            lowcost: "Niedrige Kosten"
        },
        generalTitle: "Allgemein",
        minDeposit: "Mindesteinzahlung",
        minDepositOptions: {
            any: "Jeder Betrag",
            "100": "Bis zu $100",
            "250": "Bis zu $250",
            "1000": "Bis zu $1000"
        },
        regulator: "Regulierungsbehörde",
        regulatorOptions: {
            any: "Jede Regulierungsbehörde"
        },
        executionCostsTitle: "Ausführung & Kosten",
        executionType: "Ausführungsart",
        spread: "EUR/USD Spread",
        spreadOptions: {
            any: "Beliebig",
            ultraLow: "Sehr niedrig (≤ 0,5 Pips)",
            low: "Niedrig (0,6 - 1,0 Pips)",
            standard: "Standard (> 1,0 Pips)"
        },
        commissions: "Provisionen",
        commissionOptions: {
            any: "Beliebig",
            commission: "Provisionsbasiert",
            zero: "Null Provision"
        },
        techPlatformsTitle: "Technologie & Plattformen",
        platform: "Plattform",
        algoTrading: "Algorithmischer Handel",
        algoTradingOptions: {
            eaSupport: "MQL5/EA-Unterstützung",
            apiAccess: "API-Zugang"
        },
        socialTrading: "Social Trading",
        socialTradingOptions: {
            any: "Beliebig",
            yes: "Unterstützt Copy Trading",
            no: "Kein Copy Trading"
        },
        tradingConditionsTitle: "Handelsbedingungen",
        minLotSize: "Mindestlotgröße",
        minLotSizeOptions: {
            any: "Beliebig",
            micro: "Micro (0.01)",
            mini: "Mini (0.1)"
        },
        maxLeverage: "Maximaler Hebel",
        maxLeverageOptions: {
            any: "Beliebig",
            low: "Bis zu 1:100",
            medium: "1:101 - 1:499",
            high: "1:500+"
        },
        results: {
            showing: "{count} von {total} Brokern angezeigt",
            getAiRec: "KI-Empfehlung erhalten",
            aiRecTooltip: "Filtern Sie nach mindestens 2 Brokern, um eine Empfehlung zu erhalten.",
            aiError: "Leider konnte die KI keine Empfehlung abgeben. Bitte versuchen Sie es mit einem anderen Filter erneut.",
            aiPicksTitle: "Top-Auswahl der KI aus Ihrer Auswahl",
            aiAnalysisTitle: "KI-Analyse",
            noResultsTitle: "Keine Broker entsprechen Ihren Kriterien",
            noResultsSubtitle: "Versuchen Sie, Ihre Filter anzupassen, um mehr Ergebnisse zu finden."
        }
    },
    brokerMatcherPage: {
        title: "KI-Broker-Matcher",
        subtitle: "Beantworten Sie ein paar Fragen und lassen Sie unsere KI die Arbeit machen.",
        back: "Zurück",
        next: "Weiter",
        findMyBroker: "Meinen Broker finden",
        tooltip: "Verwendet KI, um Ihre Präferenzen zu analysieren und die besten Broker für Sie zu empfehlen.",
        loading: "Unsere KI findet Ihren perfekten Broker...",
        steps: {
            country: {
                title: "Wo wohnen Sie?",
                tooltip: "Broker werden in jedem Land unterschiedlich reguliert. Dadurch wird sichergestellt, dass wir nur für Sie verfügbare Broker empfehlen."
            },
            experience: {
                title: "Wie vertraut sind Sie mit dem Handel?",
                tooltip: "Dies hilft uns, Sie mit einer Plattform abzugleichen, die Ihrem Kenntnisstand entspricht, von einfachen Schnittstellen für Anfänger bis hin zu fortschrittlichen Werkzeugen für Experten.",
                options: [
                    { key: "I'm a first-timer", text: "Ich bin ein Anfänger" },
                    { key: "I've made a few trades", text: "Ich habe ein paar Trades gemacht" },
                    { key: "I have experience", text: "Ich habe Erfahrung" },
                    { key: "I'm a professional", text: "Ich bin ein Profi" }
                ]
            },
            feeStructure: {
                title: "Welche Gebührenstruktur bevorzugen Sie?",
                tooltip: "Wählen Sie 'Niedrige Spreads' für das Scalping, 'Niedrige Übernachtgebühr' für langfristige Trades oder 'Beides' für einen ausgewogenen Ansatz.",
                options: [
                    { key: "Low spreads", text: "Niedrige Spreads" },
                    { key: "Low overnight fee", text: "Niedrige Übernachtgebühr" },
                    { key: "Both", text: "Beides" },
                    { key: "I don't know", text: "Ich weiß nicht" }
                ]
            },
            depositMethod: {
                title: "Wie möchten Sie Geld einzahlen?",
                tooltip: "Wählen Sie Ihre bevorzugte Methode, um einen reibungslosen und bequemen Einzahlungsprozess zu gewährleisten.",
                options: [
                    { key: "Bank transfer", text: "Banküberweisung" },
                    { key: "Credit/debit card", text: "Kredit-/Debitkarte" },
                    { key: "PayPal", text: "PayPal" },
                    { key: "Skrill", text: "Skrill" },
                    { key: "I don't know", text: "Ich weiß nicht" }
                ]
            },
            currencyPairs: {
                title: "Welche Währungspaare möchten Sie handeln?",
                tooltip: "Hauptwährungspaare haben die niedrigsten Spreads, während exotische Paare mehr Volatilität und Chancen bieten können.",
                options: [
                    { key: "Major currencies", text: "Hauptwährungen" },
                    { key: "Minor currencies", text: "Nebenwährungen" },
                    { key: "Exotic currencies", text: "Exotische Währungen" },
                    { key: "I don't know", text: "Ich weiß nicht" }
                ]
            },
            specialPreferences: {
                title: "Besondere Vorlieben? (Wählen Sie bis zu 5)",
                options: [
                    { key: 'Fast account opening', text: 'Schnelle Kontoeröffnung', tooltip: 'Suchen Sie nach Brokern mit einem vollständig digitalen und schnellen Onboarding-Prozess.' },
                    { key: 'Quick withdrawal', text: 'Schnelle Auszahlung', tooltip: 'Priorisieren Sie Broker, die für schnelle Auszahlungen und niedrige Gebühren bekannt sind.' },
                    { key: 'Exclude risky countries', text: 'Riskante Länder ausschließen', tooltip: 'Filtern Sie Broker heraus, die in Rechtsordnungen mit geringerem Anlegerschutz reguliert sind.' },
                    { key: 'Educational resources', text: 'Bildungsressourcen', tooltip: 'Finden Sie Broker, die umfangreiche Artikel, Videos und Webinare zum Lernen anbieten.' },
                    { key: 'Great research tools', text: 'Großartige Recherchetools', tooltip: 'Erhalten Sie Zugang zu fortschrittlichen Charts, Marktanalysen und Nachrichten-Feeds.' },
                    { key: 'ECN account', text: 'ECN-Konto', tooltip: 'Für direkten Marktzugang mit rohen Spreads und einer festen Provision, ideal für Scalper.' },
                    { key: 'Islamic account', text: 'Islamisches Konto', tooltip: 'Finden Sie Broker, die Swap-freie Konten anbieten, die dem Scharia-Gesetz entsprechen.' },
                    { key: 'Copy trading', text: 'Copy Trading', tooltip: 'Folgen und kopieren Sie automatisch die Trades erfolgreicher Händler.' },
                    { key: 'Superb customer service', text: 'Hervorragender Kundenservice', tooltip: 'Wählen Sie Broker mit hoch bewertetem, reaktionsschnellem Support per Live-Chat, Telefon und E-Mail.' },
                    { key: 'API access', text: 'API-Zugang', tooltip: 'Für algorithmische Händler, die ihre eigene Handelssoftware anschließen möchten.' },
                ]
            }
        },
        results: {
            title: "Ihre Top-Übereinstimmungen",
            aiAnalysis: "KI-Analyse",
            startOver: "Neu starten",
            error: "Empfehlungen konnten nicht abgerufen werden. Bitte versuchen Sie es erneut."
        }
    },
    comparePage: {
        title: "Broker vergleichen",
        subtitle: "Side-by-Side-Analyse Ihrer ausgewählten Broker.",
        startDuel: "Duell starten",
        clearAll: "Alle löschen",
        getAiSummary: "KI-Vergleichszusammenfassung erhalten",
        aiAnalysis: "KI-Analyse",
        empty: {
            title: "Ihre Vergleichsliste ist leer.",
            subtitle: "Fügen Sie Broker hinzu, um deren Funktionen nebeneinander zu vergleichen.",
            button: "Broker durchsuchen"
        }
    },
    compareTable: {
        feature: "Merkmal",
        visit: "Besuchen",
        remove: "Entfernen",
        features: {
            overallScore: "Gesamtpunktzahl",
            score: "Punktzahl",
            tradingCosts: "Handelskosten",
            commission: "Provision",
            swap: "Swap-Gebührenkategorie",
            tradingConditions: "Handelsbedingungen",
            maxLeverage: "Max. Hebel",
            executionType: "Ausführungsart",
            accessibility: "Zugänglichkeit",
            minDeposit: "Mindesteinzahlung",
            depositMethods: "Einzahlungsmethoden",
            withdrawalMethods: "Auszahlungsmethoden",
            support: "Kundensupport",
            technology: "Technologie",
            platforms: "Plattformen",
            tradableInstruments: "Handelbare Instrumente",
            forexPairs: "Forex-Paare",
            stocks: "Aktien-CFDs",
            cryptocurrencies: "Kryptowährungen",
            trust: "Vertrauen & Hintergrund",
            regulators: "Regulierungsbehörden",
            founded: "Gegründet",
            headquarters: "Hauptsitz"
        }
    },
    loginPage: {
        title: "In Ihr Konto einloggen",
        emailLabel: "E-Mail-Adresse",
        passwordLabel: "Passwort",
        button: "Anmelden",
        noAccount: "Sie haben noch kein Konto?",
        registerLink: "Hier registrieren"
    },
    registerPage: {
        title: "Konto erstellen",
        nameLabel: "Vollständiger Name",
        emailLabel: "E-Mail-Adresse",
        passwordLabel: "Passwort",
        button: "Registrieren",
        haveAccount: "Sie haben bereits ein Konto?",
        loginLink: "Hier anmelden"
    },
    dashboardPage: {
        welcome: "Willkommen zurück, {name}!",
        subtitle: "Dies ist Ihr persönliches Dashboard zur Verfolgung und Verwaltung Ihrer Broker-Recherche.",
        quickActions: {
            newMatch: {
                title: "Neuer KI-Match",
                description: "Finden Sie einen neuen, auf Sie zugeschnittenen Broker."
            },
            compare: {
                title: "Broker vergleichen",
                description: "Sehen Sie sich Ihre Vergleichsliste an."
            },
            analyzer: {
                title: "Kostenanalysator",
                description: "Analysieren Sie Live-Handelsgebühren."
            },
            explore: {
                title: "Alle Broker erkunden",
                description: "Durchsuchen Sie unsere vollständige Brokerliste."
            }
        },
        alerts: {
            title: "Meine Benachrichtigungen",
            empty: "Keine Benachrichtigungen für Ihre favorisierten Broker. Fügen Sie einige Broker zu Ihren Favoriten hinzu, um Updates zu erhalten!",
            button: "Broker erkunden"
        },
        history: {
            title: "Ihr KI-Broker-Match-Verlauf",
            aiAnalysis: "KI-Analyse:",
            recommendations: "Empfohlene Broker für diesen Match:",
            empty: "Sie haben den KI-Broker-Matcher noch nicht verwendet.",
            button: "Finden Sie Ihren ersten Match"
        },
        reviews: {
            title: "Meine Bewertungen",
            reviewFor: "Bewertung für",
            unknownBroker: "Unbekannter Broker",
            verify: "Bewertung überprüfen",
            empty: "Sie haben noch keine Bewertungen geschrieben.",
            button: "Finden Sie einen Broker zum Bewerten"
        },
        favorites: {
            title: "Ihre Lieblingsbroker",
            empty: "Sie haben noch keine Broker favorisiert. Klicken Sie auf das Sternsymbol bei einem Broker, um ihn hier zu speichern.",
            button: "Broker erkunden"
        },
        settings: {
            title: "Kontoeinstellungen",
            email: "E-Mail-Adresse",
            name: "Vollständiger Name",
            password: "Neues Passwort",
            passwordPlaceholder: "Leer lassen, um das aktuelle Passwort beizubehalten",
            button: "Änderungen speichern",
            success: "Profil erfolgreich aktualisiert!",
            dangerZone: "Gefahrenzone",
            dangerDescription: "Das Löschen Ihres Kontos ist eine dauerhafte Aktion und kann nicht rückgängig gemacht werden.",
            deleteButton: "Mein Konto löschen",
            deleteModal: {
                title: "Kontolöschung bestätigen",
                text: "Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Alle Ihre Daten, einschließlich Favoriten und Match-Verlauf, gehen verloren.",
                cancel: "Abbrechen",
                confirm: "Ja, Konto löschen"
            }
        }
    },
      education: {
        hub: {
            title: "Bildungszentrum",
            subtitle: "Lernen, üben und meistern Sie die Konzepte des Forex-Handels mit unseren interaktiven Werkzeugen.",
            quizzes: {
                title: "Interaktive Quizze",
                description: "Testen Sie Ihr Wissen zu Schlüsselthemen wie Handelsgebühren, Risikomanagement und technischer Analyse."
            },
            webinars: {
                title: "Experten-Webinare",
                description: "Nehmen Sie an Live-Sitzungen mit Marktanalysten teil oder sehen Sie sich Aufzeichnungen an, um Ihr Verständnis zu vertiefen."
            },
            simulators: {
                title: "Handelssimulatoren",
                description: "Üben Sie Ihre Fähigkeiten in einer risikofreien Umgebung. Lernen Sie Ordertypen, testen Sie Strategien und mehr."
            }
        },
        quizzes: {
            title: "Quizze",
            subtitle: "Wählen Sie ein Quiz, um Ihr Wissen zu testen.",
            fees: {
                title: "Brokergebühren verstehen",
                description: "Testen Sie Ihr Wissen über die verschiedenen Kosten im Forex-Handel, von Spreads bis zu Swaps.",
                q1: { question: "Was ist ein 'Spread' im Forex-Handel?", options: ["Die Provision, die ein Broker pro Trade berechnet.", "Der Unterschied zwischen dem Geld- (Verkaufs-) und Brief- (Kauf-) Kurs.", "Ein Bonus, der vom Broker für die Eröffnung eines Kontos angeboten wird.", "Die Zinsen, die für das Halten einer Position über Nacht gezahlt oder verdient werden."], correctAnswer: "Der Unterschied zwischen dem Geld- (Verkaufs-) und Brief- (Kauf-) Kurs.", explanation: "Der Spread ist die Haupteinnahmequelle vieler Broker. Es sind die Handelskosten, die in die Kauf- und Verkaufspreise eines Währungspaares eingerechnet sind." },
                q2: { question: "Was ermöglicht der 'Hebel' einem Händler?", options: ["Mit geliehenem Kapital vom Broker zu handeln.", "Gewinne bei einem Trade zu garantieren.", "Alle Handelsrisiken zu eliminieren.", "Einen Rabatt auf Provisionen zu erhalten."], correctAnswer: "Mit geliehenem Kapital vom Broker zu handeln.", explanation: "Der Hebel ermöglicht es Ihnen, mit einer kleineren Menge eigenen Kapitals eine größere Position zu kontrollieren. Während er Gewinne vervielfachen kann, vervielfacht er auch Verluste erheblich." },
                q3: { question: "Eine 'Swap-Gebühr' (oder Rollover-Gebühr) wird wann berechnet?", options: ["Wenn Sie einen Trade bei hoher Volatilität eröffnen.", "Wenn Sie Geld von Ihrem Konto abheben.", "Wenn Sie eine Position über Nacht offen halten.", "Wenn Sie eine bestimmte Handelsplattform verwenden."], correctAnswer: "Wenn Sie eine Position über Nacht offen halten.", explanation: "Eine Swap-Gebühr sind die Zinsen, die für das Halten einer Position über Nacht gezahlt oder verdient werden, basierend auf der Zinsdifferenz zwischen den beiden Währungen eines Paares." },
                q4: { question: "Was davon ist typischerweise eine 'Nichthandelsgebühr'?", options: ["Spread", "Provision", "Inaktivitätsgebühr", "Swap-Gebühr"], correctAnswer: "Inaktivitätsgebühr", explanation: "Nichthandelsgebühren sind Gebühren, die nicht direkt mit dem Kauf oder Verkauf zusammenhängen. Dazu gehören Gebühren für Inaktivität, Einzahlungen oder Auszahlungen." },
                q5: { question: "Was ist das Hauptmerkmal des Preismodells eines echten 'ECN'-Brokers?", options: ["Sie bieten feste Spreads.", "Sie berechnen keine Provisionen.", "Sie bieten rohe, variable Spreads plus eine feste Provision.", "Sie verdienen nur an Swap-Gebühren Geld."], correctAnswer: "Sie bieten rohe, variable Spreads plus eine feste Provision.", explanation: "ECN-Broker (Electronic Communication Network) bieten direkten Zugang zur Marktliquidität, was zu sehr engen, variablen Spreads führt. Sie berechnen eine separate, feste Provision für die Ausführung des Trades." }
            },
            basics: {
                title: "Grundlagen des Forex-Handels",
                description: "Lernen Sie die grundlegenden Konzepte des Forex-Marktes kennen, einschließlich Pips, Lots und Währungspaaren.",
                q1: { question: "Was ist ein 'Pip'?", options: ["Die kleinste Preisbewegung, die ein gegebener Wechselkurs machen kann.", "Eine Art von Handelsprovision.", "Der Gesamtgewinn aus einem Handel.", "Ein Spitzname für das Britische Pfund."], correctAnswer: "Die kleinste Preisbewegung, die ein gegebener Wechselkurs machen kann.", explanation: "Ein 'Pip' (Percentage in Point) ist die Maßeinheit, um die Wertänderung zwischen zwei Währungen auszudrücken. Bei den meisten Paaren ist es die vierte Dezimalstelle." },
                q2: { question: "Im Währungspaar EUR/USD, was ist die 'Basiswährung'?", options: ["USD", "Beide sind Basiswährungen", "EUR", "Keine ist eine Basiswährung"], correctAnswer: "EUR", explanation: "Die erste Währung in einem Paar (in diesem Fall EUR) ist die 'Basiswährung'. Die zweite Währung (USD) ist die 'Quotierungswährung' oder 'Gegenwährung'. Der Preis zeigt, wie viel von der Quotierungswährung benötigt wird, um eine Einheit der Basiswährung zu kaufen." },
                q3: { question: "Ein 'Standard-Lot' im Forex-Handel repräsentiert wie viele Einheiten der Basiswährung?", options: ["1.000", "10.000", "100.000", "1.000.000"], correctAnswer: "100.000", explanation: "Die Lotgröße bezieht sich auf die Anzahl der Währungseinheiten, die Sie kaufen oder verkaufen. Ein Standard-Lot beträgt 100.000 Einheiten, ein Mini-Lot 10.000 Einheiten und ein Mikro-Lot 1.000 Einheiten." },
                q4: { question: "Welches davon gilt als 'Hauptwährungspaar'?", options: ["EUR/TRY (Euro/Türkische Lira)", "AUD/NZD (Australischer Dollar/Neuseeländischer Dollar)", "GBP/USD (Britisches Pfund/US-Dollar)", "USD/MXN (US-Dollar/Mexikanischer Peso)"], correctAnswer: "GBP/USD (Britisches Pfund/US-Dollar)", explanation: "Hauptwährungspaare sind jene, die den US-Dollar (USD) enthalten und weltweit am häufigsten gehandelt werden, wie z.B. EUR/USD, GBP/USD und USD/JPY. Sie haben typischerweise die höchste Liquidität und die niedrigsten Spreads." },
                q5: { question: "Was bedeutet es, bei einem Währungspaar 'long zu gehen'?", options: ["Die Basiswährung zu verkaufen und die Quotierungswährung zu kaufen.", "Einen Handel für eine lange Zeit zu halten.", "Die Basiswährung zu kaufen und die Quotierungswährung zu verkaufen, in der Erwartung, dass der Preis steigt.", "Eine Position gegen Marktvolatilität abzusichern."], correctAnswer: "Die Basiswährung zu kaufen und die Quotierungswährung zu verkaufen, in der Erwartung, dass der Preis steigt.", explanation: "Long zu gehen bedeutet, dass Sie die Basiswährung kaufen in der Erwartung, dass ihr Wert im Verhältnis zur Quotierungswährung steigen wird." }
            },
            charting: {
                title: "Einführung in die Chartanalyse",
                description: "Verstehen Sie die Grundlagen des Lesens von Forex-Charts, einschließlich Kerzenmustern und Trends.",
                q1: { question: "Was stellt eine grüne (oder hohle) Kerze auf einem Standard-Kerzenchart typischerweise dar?", options: ["Einen Zeitraum, in dem der Schlusskurs niedriger als der Eröffnungskurs war.", "Einen Zeitraum ohne Preisbewegung.", "Einen Zeitraum, in dem der Schlusskurs höher als der Eröffnungskurs war.", "Ein Signal, sofort zu verkaufen."], correctAnswer: "Einen Zeitraum, in dem der Schlusskurs höher als der Eröffnungskurs war.", explanation: "Eine grüne oder hohle Kerze, oft als bullische Kerze bezeichnet, bedeutet, dass der Preis in diesem Zeitraum gestiegen ist. Der untere Rand des Körpers ist die Eröffnung, und der obere Rand ist der Schluss." },
                q2: { question: "Wodurch ist ein 'Aufwärtstrend' gekennzeichnet?", options: ["Eine Reihe von tieferen Hochs und tieferen Tiefs.", "Eine Reihe von höheren Hochs und höheren Tiefs.", "Eine seitliche Preisbewegung.", "Ein einzelner großer Preisanstieg."], correctAnswer: "Eine Reihe von höheren Hochs und höheren Tiefs.", explanation: "Ein Aufwärtstrend wird durch ein konsistentes Muster identifiziert, bei dem der Preis neue Hochs erreicht, gefolgt von Rücksetzern, die zu Tiefs führen, die immer noch höher sind als die vorherigen Tiefs." },
                q3: { question: "Was stellen die 'Dochte' oder 'Schatten' auf einer Kerze dar?", options: ["Das gesamte Handelsvolumen für den Zeitraum.", "Die höchsten und niedrigsten Preise, die während des Zeitraums erreicht wurden.", "Die für den Handel gezahlte Provision.", "Eine Vorhersage der zukünftigen Preisbewegung."], correctAnswer: "Die höchsten und niedrigsten Preise, die während des Zeitraums erreicht wurden.", explanation: "Der 'Körper' der Kerze zeigt die Eröffnungs- und Schlusskurse, während die dünnen Linien (Dochte oder Schatten), die vom Körper ausgehen, den gesamten Preisbereich zeigen – die höchsten und niedrigsten Punkte, die in diesem Zeitraum erreicht wurden." },
                q4: { question: "Ein 'Unterstützungsniveau' auf einem Chart ist ein Bereich, in dem...", options: ["Der Preis Schwierigkeiten hat, darüber zu steigen.", "Der Preis dazu neigt, aufzuhören zu fallen und nach oben umkehren kann.", "Das Handelsvolumen immer am höchsten ist.", "Broker alle Verkaufsaufträge ausführen."], correctAnswer: "Der Preis dazu neigt, aufzuhören zu fallen und nach oben umkehren kann.", explanation: "Unterstützung ist ein Preisniveau, bei dem das Kaufinteresse historisch stark genug ist, um den Verkaufsdruck zu überwinden, was zu einem Preisanstieg führt. Es wirkt wie ein Boden." },
                q5: { question: "Was ist ein 'Widerstandsniveau' auf einem Chart?", options: ["Ein Preisniveau, bei dem der Verkaufsdruck dazu neigt, den Kaufdruck zu überwinden.", "Ein Niveau, das einen Preisverfall garantiert.", "Der niedrigste Preis, den eine Währung jemals erreicht hat.", "Ein Werkzeug zur Berechnung des Hebels."], correctAnswer: "Ein Preisniveau, bei dem der Verkaufsdruck dazu neigt, den Kaufdruck zu überwinden.", explanation: "Widerstand ist das Gegenteil von Unterstützung. Es ist ein Preisniveau, bei dem das Verkaufsinteresse stark genug ist, um den Preis am weiteren Steigen zu hindern, und wirkt wie eine Decke." }
            },
            risk: {
                title: "Grundlagen des Risikomanagements",
                description: "Verstehen Sie die entscheidenden Konzepte des Risikomanagements, einschließlich Stop-Loss-Orders und Positionsgrößenbestimmung.",
                q1: { question: "Was ist der Hauptzweck einer 'Stop-Loss'-Order?", options: ["Gewinne bei einem gewinnenden Trade zu sichern.", "Automatisch einen Trade zu einem zukünftigen Preis einzugehen.", "Potenzielle Verluste bei einem Trade zu begrenzen, indem er zu einem vorbestimmten Preis geschlossen wird.", "Den Hebel einer Position zu erhöhen."], correctAnswer: "Potenzielle Verluste bei einem Trade zu begrenzen, indem er zu einem vorbestimmten Preis geschlossen wird.", explanation: "Ein Stop-Loss ist ein entscheidendes Instrument des Risikomanagements. Es ist eine Order, die Sie bei Ihrem Broker platzieren, um einen verlierenden Trade zu schließen, sobald er ein bestimmtes Preisniveau erreicht, und so weitere Verluste zu verhindern." },
                q2: { question: "Ein Risiko-Ertrags-Verhältnis von 1:3 bei einem Trade bedeutet...", options: ["Sie riskieren 3 $, um potenziell 1 $ zu verdienen.", "Sie riskieren 1 $, um potenziell 3 $ zu verdienen.", "Der Trade hat eine Erfolgswahrscheinlichkeit von 33,3 %.", "Der Trade muss innerhalb von 3 Stunden geschlossen werden."], correctAnswer: "Sie riskieren 1 $, um potenziell 3 $ zu verdienen.", explanation: "Das Risiko-Ertrags-Verhältnis vergleicht den potenziellen Verlust eines Trades (die Entfernung von Ihrem Einstieg zu Ihrem Stop-Loss) mit seinem potenziellen Gewinn (die Entfernung zu Ihrem Take-Profit). Ein Verhältnis von 1:3 wird im Allgemeinen als günstig angesehen, da Ihr potenzieller Gewinn dreimal so hoch ist wie Ihr potenzieller Verlust." },
                q3: { question: "Was ist 'Positionsgrößenbestimmung'?", options: ["Die beste Tageszeit für den Handel zu wählen.", "Zu entscheiden, wie viele Lots oder Einheiten gehandelt werden sollen, basierend auf Ihrer Kontogröße und Risikotoleranz.", "Die Richtung des Marktes vorherzusagen.", "Die physische Größe Ihres Monitors."], correctAnswer: "Zu entscheiden, wie viele Lots oder Einheiten gehandelt werden sollen, basierend auf Ihrer Kontogröße und Risikotoleranz.", explanation: "Die richtige Positionsgrößenbestimmung ist der Schlüssel zum Risikomanagement. Sie beinhaltet die Berechnung der angemessenen Handelsgröße, sodass ein potenzieller Verlust aus einem einzelnen Handel nur ein kleiner, akzeptabler Prozentsatz Ihres gesamten Kontostands ist (z. B. 1-2 %)." },
                q4: { question: "Was ist ein 'Margin Call'?", options: ["Ein Anruf von Ihrem Broker, um Ihnen zu einem profitablen Trade zu gratulieren.", "Eine Benachrichtigung, dass Ihr Eigenkapital unter die erforderliche Mindesteinschussanforderung gefallen ist.", "Ein Ordertyp, der kein Slippage garantiert.", "Ein Seminar über Handelspsychologie."], correctAnswer: "Eine Benachrichtigung, dass Ihr Eigenkapital unter die erforderliche Mindesteinschussanforderung gefallen ist.", explanation: "Ein Margin Call tritt auf, wenn Ihre verlustbringenden Positionen Ihr verfügbares Eigenkapital so weit reduziert haben, dass Sie die Anforderungen des Brokers nicht mehr erfüllen. Sie müssen entweder mehr Geld einzahlen oder Positionen schließen, um die Margin-Anforderungen zu erfüllen." },
                q5: { question: "Warum wird allgemein empfohlen, nicht mehr als 1-2 % Ihres Kapitals bei einem einzelnen Trade zu riskieren?", options: ["Weil Broker keine größeren Risiken zulassen.", "Um sicherzustellen, dass Sie eine Reihe von Verlusttrades überleben können, ohne Ihr Konto zu leeren.", "Weil es garantiert, dass Ihre Trades profitabel sind.", "Um weniger Steuern auf Ihre Gewinne zu zahlen."], correctAnswer: "Um sicherzustellen, dass Sie eine Reihe von Verlusttrades überleben können, ohne Ihr Konto zu leeren.", explanation: "Selbst die besten Handelsstrategien haben Verlustphasen. Indem Sie pro Trade nur einen kleinen Prozentsatz Ihres Kapitals riskieren, schützen Sie Ihr Konto davor, durch einige aufeinanderfolgende Verluste ausgelöscht zu werden, und können lange genug im Spiel bleiben, damit Ihre Strategie profitabel ist." }
            },
            orders: {
                title: "Ordertypen verstehen",
                description: "Lernen Sie den Unterschied zwischen Markt-, Limit- und Stop-Orders.",
                q1: { question: "Eine 'Marktorder' ist eine Anweisung, um...", options: ["Zu einem bestimmten Preis oder besser zu kaufen oder zu verkaufen.", "Sofort zum besten verfügbaren aktuellen Preis zu kaufen oder zu verkaufen.", "Eine zuvor platzierte Order zu stornieren.", "Zu warten, bis der Markt weniger volatil wird."], correctAnswer: "Sofort zum besten verfügbaren aktuellen Preis zu kaufen oder zu verkaufen.", explanation: "Eine Marktorder ist der einfachste Ordertyp. Sie priorisiert die Ausführungsgeschwindigkeit gegenüber einem bestimmten Preis und füllt Ihre Order zum aktuellen Marktkurs aus." },
                q2: { question: "Ein Händler, der ein Währungspaar kaufen möchte, aber nur, wenn es auf einen niedrigeren Preis fällt, würde welchen Ordertyp verwenden?", options: ["Marktkauf", "Kauflimit", "Kaufstopp", "Verkaufslimit"], correctAnswer: "Kauflimit", explanation: "Eine Kauflimit-Order wird unter dem aktuellen Marktpreis platziert. Es ist eine Anweisung, zu kaufen, wenn und nur wenn der Marktpreis auf Ihren angegebenen Limitpreis oder darunter fällt." },
                q3: { question: "Wofür wird eine 'Verkaufsstopp'-Order verwendet?", options: ["Um zum aktuellen Preis zu verkaufen.", "Um ein Wertpapier zu verkaufen, wenn sein Preis auf ein bestimmtes Niveau steigt.", "Um ein Wertpapier zu verkaufen, wenn sein Preis auf ein bestimmtes Niveau fällt, oft um einen Verlust zu begrenzen oder eine Short-Position bei einem Ausbruch zu initiieren.", "Um ein Wertpapier zu kaufen, wenn sein Preis auf ein bestimmtes Niveau fällt."], correctAnswer: "Um ein Wertpapier zu verkaufen, wenn sein Preis auf ein bestimmtes Niveau fällt, oft um einen Verlust zu begrenzen oder eine Short-Position bei einem Ausbruch zu initiieren.", explanation: "Eine Verkaufsstopp-Order wird unter dem aktuellen Preis platziert. Sie wird ausgelöst, wenn der Marktpreis auf Ihr angegebenes Niveau fällt. Sie wird häufig als Stop-Loss für eine Long-Position oder zum Einstieg in einen Short-Trade bei einem Abwärtsausbruch verwendet." },
                q4: { question: "Wenn der aktuelle Preis von EUR/USD 1,0750 beträgt und Sie glauben, dass er nach dem Durchbrechen des Widerstands bei 1,0800 steigen wird, welche Order würden Sie platzieren?", options: ["Kauflimit bei 1,0800", "Verkaufsstopp bei 1,0800", "Kaufstopp bei 1,0800", "Verkaufslimit bei 1,0800"], correctAnswer: "Kaufstopp bei 1,0800", explanation: "Eine Kaufstopp-Order wird über dem aktuellen Marktpreis platziert. Sie wird verwendet, um zu kaufen, wenn Sie glauben, dass der Preis nach Erreichen eines bestimmten Niveaus (einem Ausbruch) weiter steigen wird. In diesem Fall würden Sie einen Kaufstopp bei 1,0800 platzieren, um die Aufwärtsdynamik zu erfassen." },
                q5: { question: "Eine 'Take-Profit'-Order ist dafür ausgelegt, um...", options: ["Ihre Verluste zu begrenzen.", "Einen profitablen Trade automatisch zu einem bestimmten Preis zu schließen.", "Ihre Positionsgröße zu erhöhen.", "Ihre Handelsrichtung umzukehren."], correctAnswer: "Einen profitablen Trade automatisch zu einem bestimmten Preis zu schließen.", explanation: "Eine Take-Profit- (T/P) Order ist das Gegenteil eines Stop-Loss. Es ist eine Limit-Order, die Ihren Trade schließt, sobald er ein bestimmtes Gewinnniveau erreicht, und sicherstellt, dass Sie Ihre Gewinne sichern." }
            }
        },
        webinars: {
            title: "Webinare",
            subtitle: "Vertiefen Sie Ihr Wissen mit Einblicken von Marktexperten.",
            register: "Jetzt registrieren",
            watch: "Aufzeichnung ansehen",
            upcomingTitle: "Kommende Webinare",
            pastTitle: "Vergangene Webinare",
            upcoming: [
                { title: "Marktpsychologie meistern", speaker: "Dr. Anna Becker", date: "5. Oktober 2025", description: "Lernen Sie, Angst und Gier zu kontrollieren und rationalere Handelsentscheidungen zu treffen." },
                { title: "Fortgeschrittene Fibonacci-Strategien", speaker: "John Murphy", date: "12. Oktober 2025", description: "Entdecken Sie, wie Sie Fibonacci-Retracements und -Erweiterungen anwenden, um wichtige Unterstützungs- und Widerstandsniveaus zu identifizieren." }
            ],
            past: [
                { title: "Einführung in die Technische Analyse", speaker: "Jane Doe", date: "28. September 2025", description: "Ein Leitfaden für Anfänger zum Lesen von Charts, Erkennen von Trends und Verwenden grundlegender Indikatoren." },
                { title: "Fundamentalanalyse für Forex-Händler", speaker: "Mark Chen", date: "21. September 2025", description: "Verstehen Sie, wie Wirtschaftsdaten wie NFP- und CPI-Berichte die Währungsbewegungen beeinflussen." }
            ]
        },
        simulators: {
            title: "Handelssimulatoren",
            subtitle: "Üben Sie Ihre Fähigkeiten in einer risikofreien Umgebung.",
            execution: {
                title: "Orderausführungssimulator",
                description: "Lernen Sie den Unterschied zwischen Markt-, Limit- und Stop-Orders in einer live simulierten Marktumgebung."
            }
        }
    },
    tools: {
        calendar: {
            title: "Wirtschaftskalender",
            subtitle: "Bleiben Sie über wichtige wirtschaftliche Ereignisse, die die Märkte bewegen, informiert."
        },
        marketData: {
            title: "Marktdaten",
            subtitle: "Erhalten Sie einen umfassenden Überblick über den Devisenmarkt mit Echtzeitkursen und technischen Einblicken."
        },
        calculators: {
            title: "Forex-Rechner",
            subtitle: "Wesentliche Werkzeuge, die Ihnen helfen, Ihre Trades und Ihr Risiko effektiv zu verwalten.",
            pipValue: {
                title: "Pip-Wert",
                accountCurrency: "Kontowährung",
                currencyPair: "Währungspaar",
                positionSize: "Positionsgröße (Lots)",
                calculate: "Pip-Wert berechnen",
                result: "Der Wert eines Pips für eine {lots}-Lot-Position auf {pair} beträgt ungefähr"
            },
            positionSize: {
                title: "Positionsgröße",
                accountBalance: "Kontostand",
                riskPercentage: "Risikoprozentsatz (%)",
                stopLoss: "Stop-Loss (Pips)",
                calculate: "Positionsgröße berechnen",
                result: "Um {risk}% Ihres Kontos mit einem {sl}-Pip-Stop-Loss zu riskieren, beträgt Ihre empfohlene Positionsgröße:",
                lots: "Lots",
                units: "Einheiten"
            },
            margin: {
                title: "Margin",
                leverage: "Hebel",
                tradeSize: "Handelsgröße (Lots)",
                calculate: "Margin berechnen",
                result: "Die erforderliche Margin, um eine {lots}-Lot-Position auf {pair} mit {leverage}-Hebel zu eröffnen, beträgt"
            }
        }
    }
  },
  ja: {
    header: {
      brokers: "ブローカー",
      tools: "ツール",
      education: "教育",
      marketNews: "市場ニュース",
      methodology: "方法論",
      login: "ログイン",
      register: "登録",
      logout: "ログアウト",
      dashboard: "マイダッシュボード",
      megaMenu: {
        coreTools: "コアツール",
        allBrokers: "すべてのブローカー",
        compareBrokers: "ブローカーを比較",
        costAnalyzer: "コスト分析",
        aiBrokerMatcher: "AIブローカーマッチャー",
        byCountry: "国別",
        platformsAndTypes: "プラットフォームと種類"
      },
      toolsMenu: {
        economicCalendar: "経済指標カレンダー",
        calculators: "FX計算ツール",
        marketData: "市場データ"
      }
    },
    chatbot: {
      greeting: "こんにちは！私はBrokerBotです。ブローカーに関するご質問や、以下の提案をお試しください！",
      suggestions: [
        "最高のECN FXブローカー",
        "初心者向けの最高のFXブローカー",
        "スキャルピングに最適なブローカーは？",
        "PepperstoneとIC Marketsを比較",
        "XTBのスプレッドは？",
        "ハイレバレッジのブローカーを表示"
      ]
    },
    footer: {
      subtitle: "AIの力で、あなたにぴったりのFXブローカーを見つけましょう。",
      byCountry: "国別",
      platformsAndTypes: "プラットフォームと種類",
      resources: "リソース",
      tools: "ツール",
      copyright: "© {year} Brokeranalysis. 無断複写・転載を禁じます。",
      links: {
        home: "ホーム",
        allBrokers: "すべてのブローカー",
        compareBrokers: "ブローカー比較",
        costAnalyzer: "コスト分析",
        brokerMatcher: "ブローカーマッチャー",
        marketNews: "市場ニュース",
        educationHub: "教育ハブ",
        economicCalendar: "経済指標カレンダー",
        calculators: "計算ツール",
        marketData: "市場データ",
        methodology: "方法論",
        sources: "情報源",
      }
    },
    home: {
      heroTitle: "あなたにぴったりのFXブローカーを見つける",
      heroSubtitle: "AIの力を活用して、あなたの取引スタイルに合わせた最高のブローカーを分析、比較、選択します。",
      heroDataDriven: "世界中の数十の規制されたブローカーに関するデータ駆動型の洞察。",
      useAiMatcher: "AIブローカーマッチャーを使用",
      exploreAllBrokers: "すべてのブローカーを探索",
      trustedBy: "トップトレーダーに信頼されています",
      whyChoose: "Brokeranalysisを選ぶ理由",
      features: {
        data: {
          title: "包括的なデータ",
          description: "規制から取引条件まで、数十のブローカーに関する詳細情報にアクセスできます。"
        },
        matching: {
          title: "AIによるマッチング",
          description: "当社のインテリジェントなブローカーマッチャーが、あなたのユニークな好みに基づいて理想的なブローカーを見つけます。"
        },
        comparison: {
          title: "並べて比較",
          description: "明確で簡潔な表で、複数のブローカーの主要な機能を簡単に比較できます。"
        },
        trust: {
          title: "信頼と安全性",
          description: "規制データを検証し、AIを使用して各ブローカーの動的な信頼スコアを生成します。"
        }
      },
      newTools: {
          title: "強力な新しい取引ツール",
          calendar: {
              title: "経済指標カレンダー",
              description: "リアルタイムの経済指標カレンダーで、市場を動かすイベントの先を行きましょう。"
          },
          calculators: {
              title: "FX計算ツール",
              description: "ポジションサイズやピップ値計算機など、リスク管理に不可欠なツール。"
          }
      },
      popularCategoriesTitle: "人気のカテゴリを探索",
      categories: {
        beginners: {
          title: "初心者向け",
          description: "低額の入金と優れた教育コンテンツを備えた使いやすいプラットフォームを見つけましょう。"
        },
        ecn: {
          title: "低スプレッド＆ECNブローカー",
          description: "直接的な市場アクセスと可能な限り狭いスプレッドを求める真剣なトレーダー向けです。"
        },
        copy: {
          title: "トップコピートレードプラットフォーム",
          description: "経験豊富なトレーダーの取引を自動的にコピーして、彼らの専門知識を活用しましょう。"
        },
        leverage: {
          title: "ハイレバレッジブローカー",
          description: "1:500以上のレバレッジを提供するブローカーで、あなたの取引ポテンシャルを最大限に引き出しましょう。"
        }
      },
      howItWorksTitle: "3つの簡単なステップで仕組みを解説",
      steps: {
        "1": {
          title: "質問に答える",
          description: "あなたの取引スタイル、経験、ブローカーに最も求めるものについて教えてください。"
        },
        "2": {
          title: "AIマッチングを取得",
          description: "当社のAIがあなたのプロフィールを分析し、データベースからトップブローカーを推奨します。"
        },
        "3": {
          title: "比較して選択",
          description: "当社のツールを使用してコスト、機能、信頼スコアを比較し、最終的な選択を行います。"
        }
      },
      socialProofTitle: "世界中のトレーダーから信頼されています",
      testimonials: {
        "1": {
          quote: "「AIブローカーマッチャーは画期的です。聞いたこともない低スプレッドのブローカーを見つけてくれました。何時間ものリサーチ時間を節約できました。」",
          author: "- アレックス・R、デイトレーダー"
        },
        "2": {
          quote: "「ついに本当に役立つ比較サイトが登場しました。ライブコスト分析機能はリアルタイムの手数料を確認するのに素晴らしいです。強くお勧めします。」",
          author: "- サラ・T、スイングトレーダー"
        }
      },
      faqTitle: "よくある質問",
      faqs: {
        "1": {
          q: "最も安全なFXブローカーは？",
          a: "安全性は規制に大きく依存します。最も安全なブローカーは通常、FCA（英国）、ASIC（オーストラリア）、FINMA（スイス）などの複数のトップティア機関によって規制されているブローカーです。当社のプラットフォームは規制データを強調し、ブローカーの安全性を評価するのに役立つAI信頼スコアを提供します。"
        },
        "2": {
          q: "AIはどのようにして私に適したブローカーを選ぶのですか？",
          a: "当社のAIブローカーマッチャーは、あなたの取引スタイルや優先順位に関する質問への回答を分析します。次に、あなたのプロフィールを当社のブローカー属性（コスト、プラットフォーム、規制など）のデータベースと比較して、最も近い一致を見つけます。これは、あなたの検索をパーソナライズするために設計されたデータ駆動型のプロセスです。"
        },
        "3": {
          q: "どのブローカーが最も取引コストが低いですか？",
          a: "取引コストは動的であり、取引する商品によって異なります。当社のライブコスト分析機能は、選択したブローカーのスプレッドと手数料に関するリアルタイムデータを提供し、いつでも最も安いオプションを特定するのに役立ちます。一般的に、PepperstoneやIC MarketsなどのECN/STPブローカーは非常に低い生スプレッドを提供しますが、手数料を請求します。"
        }
      }
    },
    allBrokersPage: {
        title: "すべてのFXブローカー",
        subtitle: "高度なフィルターを使用して、あなたの取引スタイルとニーズに完全に一致するブローカーを見つけましょう。",
        filtersTitle: "フィルター",
        reset: "リセット",
        searchPlaceholder: "ブローカー名で検索...",
        presetsTitle: "取引スタイルのプリセット",
        presets: {
            scalping: "スキャルピング",
            algorithmic: "アルゴリズム取引",
            copytrading: "コピートレード",
            swingtrading: "スイングトレード",
            newstrading: "ニューストレード",
            lowcost: "低コスト"
        },
        generalTitle: "一般",
        minDeposit: "最低入金額",
        minDepositOptions: {
            any: "任意の金額",
            "100": "最大$100",
            "250": "最大$250",
            "1000": "最大$1000"
        },
        regulator: "規制当局",
        regulatorOptions: {
            any: "任意の規制当局"
        },
        executionCostsTitle: "執行とコスト",
        executionType: "執行タイプ",
        spread: "EUR/USDスプレッド",
        spreadOptions: {
            any: "任意",
            ultraLow: "超低 (≤ 0.5 pips)",
            low: "低 (0.6 - 1.0 pips)",
            standard: "標準 (> 1.0 pips)"
        },
        commissions: "手数料",
        commissionOptions: {
            any: "任意",
            commission: "手数料ベース",
            zero: "手数料ゼロ"
        },
        techPlatformsTitle: "テクノロジーとプラットフォーム",
        platform: "プラットフォーム",
        algoTrading: "アルゴリズム取引",
        algoTradingOptions: {
            eaSupport: "MQL5/EAサポート",
            apiAccess: "APIアクセス"
        },
        socialTrading: "ソーシャルトレード",
        socialTradingOptions: {
            any: "任意",
            yes: "コピートレードをサポート",
            no: "コピートレードなし"
        },
        tradingConditionsTitle: "取引条件",
        minLotSize: "最小ロットサイズ",
        minLotSizeOptions: {
            any: "任意",
            micro: "マイクロ (0.01)",
            mini: "ミニ (0.1)"
        },
        maxLeverage: "最大レバレッジ",
        maxLeverageOptions: {
            any: "任意",
            low: "最大1:100",
            medium: "1:101 - 1:499",
            high: "1:500以上"
        },
        results: {
            showing: "{total}件中{count}件のブローカーを表示中",
            getAiRec: "AIの推奨を取得",
            aiRecTooltip: "推奨を得るには、少なくとも2つのブローカーに絞り込んでください。",
            aiError: "申し訳ありませんが、AIは推奨を行うことができませんでした。別のフィルターで再試行してください。",
            aiPicksTitle: "あなたの選択からのAIトップピック",
            aiAnalysisTitle: "AI分析",
            noResultsTitle: "あなたの基準に一致するブローカーはありません",
            noResultsSubtitle: "より多くの結果を見つけるためにフィルターを調整してみてください。"
        }
    },
    brokerMatcherPage: {
        title: "AIブローカー診断",
        subtitle: "いくつかの質問に答えるだけで、AIが最適なブローカーを提案します。",
        back: "戻る",
        next: "次へ",
        findMyBroker: "ブローカーを探す",
        tooltip: "AIがあなたの好みを分析し、最適なブローカーを推奨します。",
        loading: "AIがあなたに最適なブローカーを探しています...",
        steps: {
            country: {
                title: "お住まいの国はどこですか？",
                tooltip: "ブローカーは国ごとに規制が異なります。これにより、利用可能なブローカーのみを推奨します。"
            },
            experience: {
                title: "取引の経験はどのくらいですか？",
                tooltip: "初心者向けのシンプルなインターフェースから、専門家向けの高度なツールまで、あなたのスキルレベルに合ったプラットフォームを提案します。",
                options: [
                    { key: "I'm a first-timer", text: "初めてです" },
                    { key: "I've made a few trades", text: "数回取引しました" },
                    { key: "I have experience", text: "経験があります" },
                    { key: "I'm a professional", text: "プロです" }
                ]
            },
            feeStructure: {
                title: "どの手数料体系を希望しますか？",
                tooltip: "スキャルピングには「低スプレッド」、長期取引には「低オーバーナイト手数料」、バランスの取れたアプローチには「両方」を選択してください。",
                options: [
                    { key: "Low spreads", text: "低スプレッド" },
                    { key: "Low overnight fee", text: "低オーバーナイト手数料" },
                    { key: "Both", text: "両方" },
                    { key: "I don't know", text: "わかりません" }
                ]
            },
            depositMethod: {
                title: "どのようにお金を入金したいですか？",
                tooltip: "スムーズで便利な資金調達プロセスを確保するために、ご希望の方法を選択してください。",
                options: [
                    { key: "Bank transfer", text: "銀行振込" },
                    { key: "Credit/debit card", text: "クレジット/デビットカード" },
                    { key: "PayPal", text: "PayPal" },
                    { key: "Skrill", text: "Skrill" },
                    { key: "I don't know", text: "わかりません" }
                ]
            },
            currencyPairs: {
                title: "どの通貨ペアを取引したいですか？",
                tooltip: "メジャー通貨ペアはスプレッドが最も狭く、エキゾチック通貨ペアはより多くのボラティリティと機会を提供できます。",
                options: [
                    { key: "Major currencies", text: "メジャー通貨" },
                    { key: "Minor currencies", text: "マイナー通貨" },
                    { key: "Exotic currencies", text: "エキゾチック通貨" },
                    { key: "I don't know", text: "わかりません" }
                ]
            },
            specialPreferences: {
                title: "特別な希望はありますか？ (最大5つ選択)",
                options: [
                    { key: 'Fast account opening', text: '迅速な口座開設', tooltip: '完全にデジタルで迅速なオンボーディングプロセスを持つブローカーを探します。' },
                    { key: 'Quick withdrawal', text: '迅速な出金', tooltip: '迅速な出金処理と低手数料で知られるブローカーを優先します。' },
                    { key: 'Exclude risky countries', text: 'リスクの高い国を除く', tooltip: '投資家保護基準が低い管轄区域で規制されているブローカーを除外します。' },
                    { key: 'Educational resources', text: '教育リソース', tooltip: '学習に役立つ豊富な記事、ビデオ、ウェビナーを提供するブローカーを見つけます。' },
                    { key: 'Great research tools', text: '優れたリサーチツール', tooltip: '高度なチャート、市場分析、ニュースフィードへのアクセスを取得します。' },
                    { key: 'ECN account', text: 'ECN口座', tooltip: 'スキャルパーに最適な、生の スプレッドと固定手数料による直接市場アクセス。' },
                    { key: 'Islamic account', text: 'イスラム口座', tooltip: 'シャリア法に準拠したスワップフリー口座を提供するブローカーを見つけます。' },
                    { key: 'Copy trading', text: 'コピートレード', tooltip: '成功したトレーダーの取引をフォローし、自動的にコピーします。' },
                    { key: 'Superb customer service', text: '優れた顧客サービス', tooltip: 'ライブチャット、電話、メールによる高評価で応答性の高いサポートを提供するブローカーを選択します。' },
                    { key: 'API access', text: 'APIアクセス', tooltip: '独自の取引ソフトウェアを接続したいアルゴリズムトレーダー向け。' },
                ]
            }
        },
        results: {
            title: "あなたにぴったりのブローカー",
            aiAnalysis: "AI分析",
            startOver: "最初からやり直す",
            error: "推奨を取得できませんでした。もう一度お試しください。"
        }
    },
    comparePage: {
        title: "ブローカーを比較",
        subtitle: "選択したブローカーの並列分析。",
        startDuel: "対決を開始",
        clearAll: "すべてクリア",
        getAiSummary: "AI比較概要を取得",
        aiAnalysis: "AI分析",
        empty: {
            title: "比較リストは空です。",
            subtitle: "ブローカーを追加して、その機能を並べて比較します。",
            button: "ブローカーを閲覧"
        }
    },
    compareTable: {
        feature: "機能",
        visit: "訪問",
        remove: "削除",
        features: {
            overallScore: "総合スコア",
            score: "スコア",
            tradingCosts: "取引コスト",
            commission: "手数料",
            swap: "スワップ手数料カテゴリ",
            tradingConditions: "取引条件",
            maxLeverage: "最大レバレッジ",
            executionType: "執行タイプ",
            accessibility: "アクセシビリティ",
            minDeposit: "最低入金額",
            depositMethods: "入金方法",
            withdrawalMethods: "出金方法",
            support: "カスタマーサポート",
            technology: "テクノロジー",
            platforms: "プラットフォーム",
            tradableInstruments: "取引可能商品",
            forexPairs: "FXペア",
            stocks: "株式CFD",
            cryptocurrencies: "暗号通貨",
            trust: "信頼性と背景",
            regulators: "規制当局",
            founded: "設立年",
            headquarters: "本社"
        }
    },
    loginPage: {
        title: "アカウントにログイン",
        emailLabel: "メールアドレス",
        passwordLabel: "パスワード",
        button: "ログイン",
        noAccount: "アカウントをお持ちではありませんか？",
        registerLink: "こちらで登録"
    },
    registerPage: {
        title: "アカウントを作成",
        nameLabel: "フルネーム",
        emailLabel: "メールアドレス",
        passwordLabel: "パスワード",
        button: "登録",
        haveAccount: "すでにアカウントをお持ちですか？",
        loginLink: "こちらでログイン"
    },
    dashboardPage: {
        welcome: "{name}さん、おかえりなさい！",
        subtitle: "これはあなたのブローカーリサーチを追跡・管理するための個人ダッシュボードです。",
        quickActions: {
            newMatch: {
                title: "新しいAIマッチ",
                description: "あなたに合わせた新しいブローカーを見つけます。"
            },
            compare: {
                title: "ブローカー比較",
                description: "比較リストを表示します。"
            },
            analyzer: {
                title: "コスト分析",
                description: "ライブ取引手数料を分析します。"
            },
            explore: {
                title: "全ブローカーを探索",
                description: "全ブローカーリストを閲覧します。"
            }
        },
        alerts: {
            title: "マイアラート",
            empty: "お気に入りのブローカーに関するアラートはありません。お気に入りにブローカーを追加して更新情報を受け取りましょう！",
            button: "ブローカーを探索"
        },
        history: {
            title: "AIブローカーマッチ履歴",
            aiAnalysis: "AI分析：",
            recommendations: "このマッチの推奨ブローカー：",
            empty: "まだAIブローカーマッチャーを使用していません。",
            button: "最初のマッチを見つける"
        },
        reviews: {
            title: "マイレビュー",
            reviewFor: "レビュー対象：",
            unknownBroker: "不明なブローカー",
            verify: "レビューを認証",
            empty: "まだレビューを投稿していません。",
            button: "レビューするブローカーを探す"
        },
        favorites: {
            title: "お気に入りブローカー",
            empty: "まだお気に入りのブローカーがありません。ブローカーの星アイコンをクリックしてここに保存しましょう。",
            button: "ブローカーを探索"
        },
        settings: {
            title: "アカウント設定",
            email: "メールアドレス",
            name: "フルネーム",
            password: "新しいパスワード",
            passwordPlaceholder: "現在のパスワードを維持する場合は空白のままにしてください",
            button: "変更を保存",
            success: "プロフィールが正常に更新されました！",
            dangerZone: "危険ゾーン",
            dangerDescription: "アカウントの削除は永続的な操作であり、元に戻すことはできません。",
            deleteButton: "マイアカウントを削除",
            deleteModal: {
                title: "アカウント削除の確認",
                text: "アカウントを完全に削除してもよろしいですか？お気に入りやマッチ履歴を含むすべてのデータが失われます。",
                cancel: "キャンセル",
                confirm: "はい、アカウントを削除します"
            }
        }
    },
    education: {
        hub: {
            title: "教育ハブ",
            subtitle: "インタラクティブなツールでFX取引の概念を学び、練習し、習得しましょう。",
            quizzes: {
                title: "インタラクティブクイズ",
                description: "取引手数料、リスク管理、テクニカル分析などの主要なトピックに関する知識をテストします。"
            },
            webinars: {
                title: "専門家ウェビナー",
                description: "市場アナリストとのライブセッションに参加したり、録画を視聴して理解を深めましょう。"
            },
            simulators: {
                title: "取引シミュレーター",
                description: "リスクのない環境でスキルを練習しましょう。注文タイプを学び、戦略をテストするなど。"
            }
        },
        quizzes: {
            title: "クイズ",
            subtitle: "クイズを選択して知識をテストしましょう。",
            fees: {
                title: "ブローカー手数料の理解",
                description: "スプレッドからスワップまで、FX取引に関わるさまざまなコストに関する知識をテストします。",
                q1: { question: "FX取引における「スプレッド」とは何ですか？", options: ["ブローカーが1取引ごとに請求する手数料。", "ビッド（売値）とアスク（買値）の価格差。", "口座開設時にブローカーが提供するボーナス。", "ポジションを翌日に持ち越した場合に支払うまたは受け取る金利。"], correctAnswer: "ビッド（売値）とアスク（買値）の価格差。", explanation: "スプレッドは多くのブローカーが収益を上げる主要な方法です。これは通貨ペアの売買価格に組み込まれた取引のコストです。" },
                q2: { question: "「レバレッジ」によってトレーダーは何ができますか？", options: ["ブローカーから借りた資金で取引する。", "取引の利益を保証する。", "すべての取引リスクをなくす。", "手数料の割引を受ける。"], correctAnswer: "ブローカーから借りた資金で取引する。", explanation: "レバレッジを使用すると、少額の自己資本でより大きなポジションをコントロールできます。利益を増幅させることができる一方で、損失も大幅に増幅させます。" },
                q3: { question: "「スワップ手数料」（またはロールオーバー手数料）はいつ請求されますか？", options: ["ボラティリティが高い時に取引を開始したとき。", "口座から資金を引き出したとき。", "ポジションを翌日に持ち越したとき。", "特定の取引プラットフォームを使用したとき。"], correctAnswer: "ポジションを翌日に持ち越したとき。", explanation: "スワップ手数料は、2つの通貨の金利差に基づいて、ポジションを翌日に持ち越した場合に支払うまたは受け取る金利です。" },
                q4: { question: "次のうち、通常「取引外手数料」と見なされるものはどれですか？", options: ["スプレッド", "手数料", "非アクティブ手数料", "スワップ手数料"], correctAnswer: "非アクティブ手数料", explanation: "取引外手数料は、売買に直接関係しない料金です。これには、非アクティブ、入金、または出金の手数料が含まれます。" },
                q5: { question: "真の「ECN」ブローカーの価格設定モデルの主な特徴は何ですか？", options: ["固定スプレッドを提供している。", "手数料がゼロである。", "生の変動スプレッドと固定手数料を提供している。", "スワップ手数料からのみ収益を上げている。"], correctAnswer: "生の変動スプレッドと固定手数料を提供している。", explanation: "ECN（電子通信ネットワーク）ブローカーは、市場の流動性に直接アクセスできるため、非常に狭い変動スプレッドが実現します。彼らは取引の実行に対して別途固定手数料を請求します。" }
            },
            basics: {
                title: "FX取引の基礎",
                description: "ピップ、ロット、通貨ペアなど、FX市場の基本概念を学びましょう。",
                q1: { question: "「ピップ」とは何ですか？", options: ["特定の交換レートが取りうる最小の価格変動。", "取引手数料の一種。", "取引からの総利益。", "英国ポンドの愛称。"], correctAnswer: "特定の交換レートが取りうる最小の価格変動。", explanation: "「ピップ」（ポイント単位のパーセンテージ）は、2つの通貨間の価値の変化を表す測定単位です。ほとんどのペアでは、小数点第4位です。" },
                q2: { question: "通貨ペアEUR/USDでは、どちらが「基軸通貨」ですか？", options: ["USD", "両方とも基軸通貨", "EUR", "どちらも基軸通貨ではない"], correctAnswer: "EUR", explanation: "ペアの最初の通貨（この場合はEUR）が「基軸通貨」です。2番目の通貨（USD）は「決済通貨」または「相手通貨」です。価格は、基軸通貨1単位を購入するために必要な決済通貨の量を示します。" },
                q3: { question: "FX取引における「標準ロット」は、基軸通貨の何単位を表しますか？", options: ["1,000", "10,000", "100,000", "1,000,000"], correctAnswer: "100,000", explanation: "ロットサイズは、売買する通貨単位の数を指します。標準ロットは100,000単位、ミニロットは10,000単位、マイクロロットは1,000単位です。" },
                q4: { question: "これらのうち、どれが「メジャー」通貨ペアと見なされますか？", options: ["EUR/TRY（ユーロ/トルコリラ）", "AUD/NZD（オーストラリアドル/ニュージーランドドル）", "GBP/USD（英国ポンド/米ドル）", "USD/MXN（米ドル/メキシコペソ）"], correctAnswer: "GBP/USD（英国ポンド/米ドル）", explanation: "メジャー通貨ペアは、米ドル（USD）を含み、世界で最も頻繁に取引されるペアです（例：EUR/USD、GBP/USD、USD/JPY）。通常、流動性が最も高く、スプレッドが最も狭いです。" },
                q5: { question: "通貨ペアで「ロングポジションを持つ」とはどういう意味ですか？", options: ["基軸通貨を売り、決済通貨を買うこと。", "長期間取引を保有すること。", "価格が上昇すると予想して、基軸通貨を買い、決済通貨を売ること。", "市場のボラティリティに対してポジションをヘッジすること。"], correctAnswer: "価格が上昇すると予想して、基軸通貨を買い、決済通貨を売ること。", explanation: "ロングポジションを持つとは、決済通貨に対して基軸通貨の価値が上昇することを期待して基軸通貨を買うことを意味します。" }
            },
            charting: {
                title: "チャート入門",
                description: "ローソク足パターンやトレンドなど、FXチャートの読み方の基本を理解しましょう。",
                q1: { question: "標準的なローソク足チャートで、緑（または中空）のローソク足が通常表すものは何ですか？", options: ["終値が始値より低かった期間。", "価格変動がなかった期間。", "終値が始値より高かった期間。", "すぐに売るべきシグナル。"], correctAnswer: "終値が始値より高かった期間。", explanation: "緑色または中空のローソク足は、強気のローソク足とも呼ばれ、その期間中に価格が上昇したことを示します。実体の下部が始値で、上部が終値です。" },
                q2: { question: "「上昇トレンド」は何によって特徴付けられますか？", options: ["より低い高値とより低い安値の連続。", "より高い高値とより高い安値の連続。", "横ばいの価格動向。", "単一の大きな価格の急騰。"], correctAnswer: "より高い高値とより高い安値の連続。", explanation: "上昇トレンドは、価格が新高値を更新し、その後の押し目が前の安値よりも高い安値となる一貫したパターンによって識別されます。" },
                q3: { question: "ローソク足の「ヒゲ」または「影」は何を表していますか？", options: ["その期間の総取引量。", "その期間中に達した最高値と最安値。", "取引に支払われた手数料。", "将来の価格変動の予測。"], correctAnswer: "その期間中に達した最高値と最安値。", explanation: "ローソク足の「実体」は始値と終値を示し、実体から伸びる細い線（ヒゲまたは影）はその期間中の全価格範囲（最高値と最安値）を示します。" },
                q4: { question: "チャート上の「サポート」レベルとは、どのような領域ですか？", options: ["価格がそれを超えて上昇するのが難しい領域。", "価格が下落を止め、上昇に転じる傾向がある領域。", "取引量が常に最も多い領域。", "ブローカーがすべての売り注文を実行する領域。"], correctAnswer: "価格が下落を止め、上昇に転じる傾向がある領域。", explanation: "サポートは、買い意欲が売り圧力を克服するほど歴史的に強い価格レベルであり、価格が反発する原因となります。床のように機能します。" },
                q5: { question: "チャート上の「レジスタンス」レベルとは何ですか？", options: ["売り圧力が買い圧力を上回る傾向がある価格レベル。", "価格下落を保証するレベル。", "通貨が史上最安値を付けた価格。", "レバレッジを計算するためのツール。"], correctAnswer: "売り圧力が買い圧力を上回る傾向がある価格レベル。", explanation: "レジスタンスはサポートの反対です。これは、売り意欲が価格のさらなる上昇を妨げるほど強い価格レベルであり、天井のように機能します。" }
            },
            risk: {
                title: "リスク管理の基本",
                description: "ストップロス注文やポジションサイジングなど、リスク管理の重要な概念を理解しましょう。",
                q1: { question: "「ストップロス」注文の主な目的は何ですか？", options: ["利益が出ている取引で利益を確定するため。", "将来の価格で自動的に取引を開始するため。", "事前に決められた価格で取引を終了させることで、潜在的な損失を限定するため。", "ポジションのレバレッジを上げるため。"], correctAnswer: "事前に決められた価格で取引を終了させることで、潜在的な損失を限定するため。", explanation: "ストップロスは重要なリスク管理ツールです。これは、損失を出している取引が特定の価格レベルに達したときにそれを閉じるようにブローカーに発注する注文であり、さらなる損失を防ぎます。" },
                q2: { question: "取引における1:3のリスク/リワード比率は何を意味しますか？", options: ["1ドルを稼ぐために3ドルをリスクにさらしている。", "3ドルを稼ぐために1ドルをリスクにさらしている。", "その取引の成功確率は33.3%である。", "その取引は3時間以内に終了しなければならない。"], correctAnswer: "3ドルを稼ぐために1ドルをリスクにさらしている。", explanation: "リスク/リワード比率は、取引の潜在的な損失（エントリーからストップロスまでの距離）と潜在的な利益（テイクプロフィットまでの距離）を比較します。1:3の比率は一般的に有利と見なされます。なぜなら、潜在的な利益が潜在的な損失の3倍だからです。" },
                q3: { question: "「ポジションサイジング」とは何ですか？", options: ["取引に最適な時間帯を選ぶこと。", "口座サイズとリスク許容度に基づいて、取引するロット数やユニット数を決定すること。", "市場の方向を予測すること。", "モニターの物理的なサイズ。"], correctAnswer: "口座サイズとリスク許容度に基づいて、取引するロット数やユニット数を決定すること。", explanation: "適切なポジションサイジングはリスク管理の鍵です。単一の取引からの潜在的な損失が、総口座残高の許容できる小さな割合（例：1〜2%）になるように、適切な取引サイズを計算することを含みます。" },
                q4: { question: "「マージンコール」とは何ですか？", options: ["利益の出た取引を祝福するためのブローカーからの電話。", "口座の有効証拠金が必要維持証拠金を下回ったという通知。", "スリッページを保証しない注文タイプ。", "取引心理学に関するセミナー。"], correctAnswer: "口座の有効証拠金が必要維持証拠金を下回ったという通知。", explanation: "マージンコールは、損失ポジションによって利用可能な口座の有効証拠金がブローカーの要件を満たさなくなるほど減少したときに発生します。マージン要件を満たすためには、追加資金を入金するか、ポジションを閉じる必要があります。" },
                q5: { question: "なぜ一般的に、単一の取引で資本の1〜2%以上をリスクにさらさないようにアドバイスされるのですか？", options: ["ブローカーがそれ以上のリスクを許可しないから。", "口座を枯渇させることなく一連の負け取引を乗り切るため。", "取引が利益を上げることを保証するため。", "利益に対する税金を低くするため。"], correctAnswer: "口座を枯渇させることなく一連の負け取引を乗り切るため。", explanation: "最高の取引戦略でさえも連敗はあります。取引ごとに資本のわずかな割合しかリスクにさらさないことで、数回の連続した損失によって口座がゼロになるのを防ぎ、戦略が利益を上げるまでゲームに留まることができます。" }
            },
            orders: {
                title: "注文タイプの理解",
                description: "成行注文、指値注文、逆指値注文の違いを学びましょう。",
                q1: { question: "「成行注文」とは、どのような指示ですか？", options: ["特定の価格以下で売買する。", "現在の最良の価格で即座に売買する。", "以前に出した注文をキャンセルする。", "市場のボラティリティが低くなるのを待つ。"], correctAnswer: "現在の最良の価格で即座に売買する。", explanation: "成行注文は最も単純な注文タイプです。特定の価格よりも約定の速さを優先し、現在の市場レートで注文を執行します。" },
                q2: { question: "ある通貨ペアを、現在より低い価格になった場合にのみ買いたいトレーダーは、どの注文タイプを使用しますか？", options: ["成行買い", "指値買い", "逆指値買い", "指値売り"], correctAnswer: "指値買い", explanation: "指値買い注文は、現在の市場価格より低い価格で出されます。市場価格が指定した指値価格以下に下がった場合にのみ買うという指示です。" },
                q3: { question: "「逆指値売り」注文は何のために使用されますか？", options: ["現在の価格で売るため。", "証券の価格が特定のレベルまで上昇したときに売るため。", "証券の価格が特定のレベルまで下落したときに売るため。多くの場合、損失を限定したり、ブレイクアウトでショートポジションを開始したりするために使用されます。", "証券の価格が特定のレベルまで下落したときに買うため。"], correctAnswer: "証券の価格が特定のレベルまで下落したときに売るため。多くの場合、損失を限定したり、ブレイクアウトでショートポジションを開始したりするために使用されます。", explanation: "逆指値売り注文は、現在の価格より低い価格で出されます。市場価格が指定したレベルまで下落したときにトリガーされます。ロングポジションのストップロスとして、または下降ブレイクアウトでショートトレードを開始するためによく使用されます。" },
                q4: { question: "EUR/USDの現在価格が1.0750で、1.0800のレジスタンスを突破した後に上昇すると信じている場合、どの注文を出しますか？", options: ["1.0800で指値買い", "1.0800で逆指値売り", "1.0800で逆指値買い", "1.0800で指値売り"], correctAnswer: "1.0800で逆指値買い", explanation: "逆指値買い注文は、現在の市場価格より高い価格で出されます。特定のレベル（ブレイクアウト）に達した後に価格が上昇し続けると信じる場合に使用されます。この場合、上昇の勢いに乗るために1.0800で逆指値買い注文を出します。" },
                q5: { question: "「テイクプロフィット」注文の目的は何ですか？", options: ["損失を限定するため。", "利益の出ている取引を特定の価格で自動的に決済するため。", "ポジションサイズを増やすため。", "取引の方向を反転させるため。"], correctAnswer: "利益の出ている取引を特定の価格で自動的に決済するため。", explanation: "テイクプロフィット（T/P）注文はストップロスの反対です。これは、特定の利益レベルに達したときに取引を決済する指値注文であり、利益を確実に確保します。" }
            }
        },
        webinars: {
            title: "ウェビナー",
            subtitle: "市場専門家の洞察で知識を深めましょう。",
            register: "今すぐ登録",
            watch: "録画を視聴",
            upcomingTitle: "今後のウェビナー",
            pastTitle: "過去のウェビナー",
            upcoming: [
                { title: "市場心理学をマスターする", speaker: "アンナ・ベッカー博士", date: "2025年10月5日", description: "恐怖と欲望をコントロールし、より合理的な取引決定を下す方法を学びます。" },
                { title: "高度なフィボナッチ戦略", speaker: "ジョン・マーフィー", date: "2025年10月12日", description: "フィボナッチリトレースメントとエクステンションを適用して、主要なサポートとレジスタンスレベルを特定する方法を発見します。" }
            ],
            past: [
                { title: "テクニカル分析入門", speaker: "ジェーン・ドウ", date: "2025年9月28日", description: "チャートの読み方、トレンドの特定、基本的なインジケーターの使用方法に関する初心者向けガイド。" },
                { title: "FXトレーダーのためのファンダメンタルズ分析", speaker: "マーク・チェン", date: "2025年9月21日", description: "NFPやCPIレポートなどの経済データが通貨の動きにどのように影響するかを理解します。" }
            ]
        },
        simulators: {
            title: "取引シミュレーター",
            subtitle: "リスクのない環境でスキルを練習しましょう。",
            execution: {
                title: "注文実行シミュレーター",
                description: "ライブのシミュレートされた市場環境で、成行、指値、逆指値注文の違いを学びます。"
            }
        }
    },
    tools: {
        calendar: {
            title: "経済指標カレンダー",
            subtitle: "市場を動かす重要な経済イベントについて常に情報を得ましょう。"
        },
        marketData: {
            title: "市場データ",
            subtitle: "リアルタイムのレートとテクニカルな洞察で、FX市場の包括的な概要を把握しましょう。"
        },
        calculators: {
            title: "FX計算ツール",
            subtitle: "取引とリスクを効果的に管理するための必須ツール。",
            pipValue: {
                title: "ピップ値",
                accountCurrency: "口座通貨",
                currencyPair: "通貨ペア",
                positionSize: "ポジションサイズ（ロット）",
                calculate: "ピップ値を計算",
                result: "{pair}の{lots}ロットのポジションにおける1ピップの価値は約"
            },
            positionSize: {
                title: "ポジションサイズ",
                accountBalance: "口座残高",
                riskPercentage: "リスク許容率（%）",
                stopLoss: "ストップロス（pips）",
                calculate: "ポジションサイズを計算",
                result: "{sl}ピップのストップロスで口座の{risk}%をリスクにさらす場合、推奨されるポジションサイズは次のとおりです：",
                lots: "ロット",
                units: "ユニット"
            },
            margin: {
                title: "証拠金",
                leverage: "レバレッジ",
                tradeSize: "取引サイズ（ロット）",
                calculate: "証拠金を計算",
                result: "{leverage}のレバレッジで{pair}の{lots}ロットのポジションを開くために必要な証拠金は"
            }
        }
    }
  },
  ru: {
    header: {
      brokers: "Брокеры",
      tools: "Инструменты",
      education: "Обучение",
      marketNews: "Новости рынка",
      methodology: "Методология",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      dashboard: "Мой кабинет",
      megaMenu: {
        coreTools: "Основные инструменты",
        allBrokers: "Все брокеры",
        compareBrokers: "Сравнить брокеров",
        costAnalyzer: "Анализатор затрат",
        aiBrokerMatcher: "Подбор брокера с ИИ",
        byCountry: "По стране",
        platformsAndTypes: "Платформы и типы"
      },
      toolsMenu: {
        economicCalendar: "Экономический календарь",
        calculators: "Калькуляторы Форекс",
        marketData: "Рыночные данные"
      }
    },
    chatbot: {
      greeting: "Здравствуйте! Я БрокерБот. Спросите меня что-нибудь о наших брокерах или попробуйте один из предложенных вариантов!",
      suggestions: [
        "Лучшие ECN-брокеры",
        "Лучшие брокеры для начинающих",
        "Какой брокер лучше для скальпинга?",
        "Сравнить Pepperstone и IC Markets",
        "Какие спреды у XTB?",
        "Показать брокеров с высоким плечом"
      ]
    },
    footer: {
      subtitle: "Найдите своего идеального форекс-брокера с помощью ИИ.",
      byCountry: "По стране",
      platformsAndTypes: "Платформы и типы",
      resources: "Ресурсы",
      tools: "Инструменты",
      copyright: "© {year} Brokeranalysis. Все права защищены.",
      links: {
        home: "Главная",
        allBrokers: "Все брокеры",
        compareBrokers: "Сравнить брокеров",
        costAnalyzer: "Анализатор затрат",
        brokerMatcher: "Подбор брокера",
        marketNews: "Новости рынка",
        educationHub: "Центр обучения",
        economicCalendar: "Экономический календарь",
        calculators: "Калькуляторы",
        marketData: "Рыночные данные",
        methodology: "Методология",
        sources: "Источники",
      }
    },
    home: {
      heroTitle: "Найдите своего идеального Форекс-брокера",
      heroSubtitle: "Используйте возможности ИИ для анализа, сравнения и выбора лучшего брокера, соответствующего вашему стилю торговли.",
      heroDataDriven: "Данные о десятках регулируемых брокеров по всему миру.",
      useAiMatcher: "Использовать подбор с ИИ",
      exploreAllBrokers: "Посмотреть всех брокеров",
      trustedBy: "Нам доверяют лучшие трейдеры",
      whyChoose: "Почему выбирают Brokeranalysis?",
      features: {
        data: {
          title: "Комплексные данные",
          description: "Получите доступ к подробной информации о десятках брокеров, от регулирования до торговых условий."
        },
        matching: {
          title: "Подбор с помощью ИИ",
          description: "Наш умный инструмент подбора находит идеального брокера на основе ваших уникальных предпочтений."
        },
        comparison: {
          title: "Прямое сравнение",
          description: "Легко сравнивайте ключевые особенности нескольких брокеров в понятной и краткой таблице."
        },
        trust: {
          title: "Доверие и безопасность",
          description: "Мы проверяем регуляторные данные и используем ИИ для создания динамического рейтинга доверия для каждого брокера."
        }
      },
      newTools: {
          title: "Мощные новые торговые инструменты",
          calendar: {
              title: "Экономический календарь",
              description: "Будьте в курсе событий, влияющих на рынок, с нашим экономическим календарем в реальном времени."
          },
          calculators: {
              title: "Калькуляторы Форекс",
              description: "Основные инструменты для управления рисками, включая калькуляторы размера позиции и стоимости пункта."
          }
      },
      popularCategoriesTitle: "Популярные категории",
      categories: {
        beginners: {
          title: "Лучшие для начинающих",
          description: "Найдите удобные платформы с низкими депозитами и отличными образовательными ресурсами."
        },
        ecn: {
          title: "ECN-брокеры с низкими спредами",
          description: "Для серьезных трейдеров, ищущих прямой доступ к рынку и самые узкие спреды."
        },
        copy: {
          title: "Лучшие платформы для копи-трейдинга",
          description: "Используйте опыт успешных трейдеров, автоматически копируя их сделки."
        },
        leverage: {
          title: "Брокеры с высоким плечом",
          description: "Максимизируйте свой торговый потенциал с брокерами, предлагающими кредитное плечо 1:500 и выше."
        }
      },
      howItWorksTitle: "Как это работает: 3 простых шага",
      steps: {
        "1": {
          title: "Ответьте на вопросы",
          description: "Расскажите нам о вашем стиле торговли, опыте и о том, что вы цените в брокере больше всего."
        },
        "2": {
          title: "Получите подбор от ИИ",
          description: "Наш ИИ проанализирует ваш профиль и порекомендует лучших брокеров из нашей базы данных."
        },
        "3": {
          title: "Сравните и выберите",
          description: "Используйте наши инструменты для сравнения затрат, функций и рейтингов доверия, чтобы сделать окончательный выбор."
        }
      },
      socialProofTitle: "Нам доверяют трейдеры по всему миру",
      testimonials: {
        "1": {
          quote: "\"Подбор брокера с ИИ — это просто революция. Он нашел мне брокера с низкими спредами, о котором я никогда не слышал. Сэкономил мне часы исследований.\"",
          author: "- Алексей Р., Дневной трейдер"
        },
        "2": {
          quote: "\"Наконец-то полезный сайт для сравнения. Анализатор затрат в реальном времени — гениальная вещь для отслеживания комиссий. Очень рекомендую.\"",
          author: "- Сара Т., Свинг-трейдер"
        }
      },
      faqTitle: "Часто задаваемые вопросы",
      faqs: {
        "1": {
          q: "Какой форекс-брокер самый безопасный?",
          a: "Безопасность во многом зависит от регулирования. Самыми безопасными обычно являются брокеры, регулируемые несколькими ведущими органами, такими как FCA (Великобритания), ASIC (Австралия) и FINMA (Швейцария). Наша платформа предоставляет данные о регулировании и рейтинг доверия от ИИ, чтобы помочь вам оценить безопасность брокера."
        },
        "2": {
          q: "Как ИИ выбирает для меня подходящего брокера?",
          a: "Наш ИИ-подборщик анализирует ваши ответы на вопросы о вашем стиле торговли и приоритетах. Затем он сравнивает ваш профиль с нашей базой данных атрибутов брокеров — таких как затраты, платформы и регулирование — чтобы найти наиболее подходящие варианты. Это процесс, основанный на данных, предназначенный для персонализации вашего поиска."
        },
        "3": {
          q: "У какого брокера самые низкие торговые издержки?",
          a: "Торговые издержки динамичны и зависят от инструмента, которым вы торгуете. Наш анализатор затрат в реальном времени предоставляет данные о спредах и комиссиях для выбранных вами брокеров, помогая определить самый дешевый вариант в любой момент времени. Как правило, брокеры ECN/STP, такие как Pepperstone или IC Markets, предлагают очень низкие сырые спреды, но взимают комиссию."
        }
      }
    },
    allBrokersPage: {
        title: "Все Форекс-брокеры",
        subtitle: "Используйте наши расширенные фильтры, чтобы найти брокера, который идеально соответствует вашему стилю торговли и потребностям.",
        filtersTitle: "Фильтры",
        reset: "Сбросить",
        searchPlaceholder: "Поиск по названию брокера...",
        presetsTitle: "Стили торговли",
        presets: {
            scalping: "Скальпинг",
            algorithmic: "Алгоритмический",
            copytrading: "Копи-трейдинг",
            swingtrading: "Свинг-трейдинг",
            newstrading: "Торговля на новостях",
            lowcost: "Низкие затраты"
        },
        generalTitle: "Общие",
        minDeposit: "Минимальный депозит",
        minDepositOptions: {
            any: "Любая сумма",
            "100": "До $100",
            "250": "До $250",
            "1000": "До $1000"
        },
        regulator: "Регулятор",
        regulatorOptions: {
            any: "Любой регулятор"
        },
        executionCostsTitle: "Исполнение и затраты",
        executionType: "Тип исполнения",
        spread: "Спред EUR/USD",
        spreadOptions: {
            any: "Любой",
            ultraLow: "Очень низкий (≤ 0.5 пипса)",
            low: "Низкий (0.6 - 1.0 пипса)",
            standard: "Стандартный (> 1.0 пипса)"
        },
        commissions: "Комиссии",
        commissionOptions: {
            any: "Любые",
            commission: "С комиссией",
            zero: "Без комиссии"
        },
        techPlatformsTitle: "Технологии и платформы",
        platform: "Платформа",
        algoTrading: "Алгоритмическая торговля",
        algoTradingOptions: {
            eaSupport: "Поддержка MQL5/EA",
            apiAccess: "Доступ к API"
        },
        socialTrading: "Социальная торговля",
        socialTradingOptions: {
            any: "Любая",
            yes: "Поддерживает копи-трейдинг",
            no: "Нет копи-трейдинга"
        },
        tradingConditionsTitle: "Торговые условия",
        minLotSize: "Минимальный лот",
        minLotSizeOptions: {
            any: "Любой",
            micro: "Микро (0.01)",
            mini: "Мини (0.1)"
        },
        maxLeverage: "Макс. плечо",
        maxLeverageOptions: {
            any: "Любое",
            low: "До 1:100",
            medium: "1:101 - 1:499",
            high: "1:500+"
        },
        results: {
            showing: "Показано {count} из {total} брокеров",
            getAiRec: "Получить рекомендацию ИИ",
            aiRecTooltip: "Отфильтруйте до 2-х брокеров, чтобы получить рекомендацию.",
            aiError: "К сожалению, ИИ не смог дать рекомендацию. Попробуйте изменить фильтр.",
            aiPicksTitle: "Лучший выбор ИИ из вашего списка",
            aiAnalysisTitle: "Анализ ИИ",
            noResultsTitle: "Брокеры не найдены",
            noResultsSubtitle: "Попробуйте изменить фильтры для поиска."
        }
    },
    brokerMatcherPage: {
        title: "Подбор брокера с ИИ",
        subtitle: "Ответьте на несколько вопросов, и наш ИИ сделает всю работу.",
        back: "Назад",
        next: "Далее",
        findMyBroker: "Найти моего брокера",
        tooltip: "Использует ИИ для анализа ваших предпочтений и рекомендации лучших брокеров.",
        loading: "Наш ИИ ищет для вас идеального брокера...",
        steps: {
            country: {
                title: "Где вы живете?",
                tooltip: "Брокеры регулируются по-разному в каждой стране. Это гарантирует, что мы рекомендуем только доступных вам брокеров."
            },
            experience: {
                title: "Насколько вы знакомы с трейдингом?",
                tooltip: "Это поможет нам подобрать платформу, соответствующую вашему уровню навыков, от простых интерфейсов для новичков до продвинутых инструментов для экспертов.",
                options: [
                    { key: "I'm a first-timer", text: "Я новичок" },
                    { key: "I've made a few trades", text: "Я совершил несколько сделок" },
                    { key: "I have experience", text: "У меня есть опыт" },
                    { key: "I'm a professional", text: "Я профессионал" }
                ]
            },
            feeStructure: {
                title: "Какую структуру комиссий вы предпочитаете?",
                tooltip: "Выберите 'Низкие спреды' для скальпинга, 'Низкая комиссия за перенос на ночь' для долгосрочных сделок или 'Оба варианта' для сбалансированного подхода.",
                options: [
                    { key: "Low spreads", text: "Низкие спреды" },
                    { key: "Low overnight fee", text: "Низкая комиссия за перенос" },
                    { key: "Both", text: "Оба варианта" },
                    { key: "I don't know", text: "Я не знаю" }
                ]
            },
            depositMethod: {
                title: "Как вы хотите вносить средства?",
                tooltip: "Выберите предпочтительный способ для обеспечения удобного процесса пополнения счета.",
                options: [
                    { key: "Bank transfer", text: "Банковский перевод" },
                    { key: "Credit/debit card", text: "Кредитная/дебетовая карта" },
                    { key: "PayPal", text: "PayPal" },
                    { key: "Skrill", text: "Skrill" },
                    { key: "I don't know", text: "Я не знаю" }
                ]
            },
            currencyPairs: {
                title: "Какими валютными парами вы хотите торговать?",
                tooltip: "У основных пар самые низкие спреды, в то время как экзотические могут предложить большую волатильность и возможности.",
                options: [
                    { key: "Major currencies", text: "Основные валюты" },
                    { key: "Minor currencies", text: "Второстепенные валюты" },
                    { key: "Exotic currencies", text: "Экзотические валюты" },
                    { key: "I don't know", text: "Я не знаю" }
                ]
            },
            specialPreferences: {
                title: "Особые предпочтения? (Выберите до 5)",
                options: [
                    { key: 'Fast account opening', text: 'Быстрое открытие счета', tooltip: 'Ищите брокеров с полностью цифровым и быстрым процессом регистрации.' },
                    { key: 'Quick withdrawal', text: 'Быстрый вывод средств', tooltip: 'Отдавайте предпочтение брокерам, известным быстрой обработкой вывода средств и низкими комиссиями.' },
                    { key: 'Exclude risky countries', text: 'Исключить рискованные страны', tooltip: 'Отфильтруйте брокеров, регулируемых в юрисдикциях с более низкими стандартами защиты инвесторов.' },
                    { key: 'Educational resources', text: 'Образовательные ресурсы', tooltip: 'Найдите брокеров, предоставляющих обширные статьи, видео и вебинары для обучения.' },
                    { key: 'Great research tools', text: 'Отличные инструменты для исследований', tooltip: 'Получите доступ к продвинутым графикам, рыночному анализу и новостным лентам.' },
                    { key: 'ECN account', text: 'ECN-счет', tooltip: 'Для прямого доступа к рынку с сырыми спредами и фиксированной комиссией, идеально подходит для скальперов.' },
                    { key: 'Islamic account', text: 'Исламский счет', tooltip: 'Найдите брокеров, предлагающих счета без свопов, соответствующие законам шариата.' },
                    { key: 'Copy trading', text: 'Копи-трейдинг', tooltip: 'Следите и автоматически копируйте сделки успешных трейдеров.' },
                    { key: 'Superb customer service', text: 'Превосходная служба поддержки', tooltip: 'Выбирайте брокеров с высоко оцененной, отзывчивой поддержкой через чат, телефон и электронную почту.' },
                    { key: 'API access', text: 'Доступ к API', tooltip: 'Для алгоритмических трейдеров, которые хотят подключить свое собственное торговое программное обеспечение.' },
                ]
            }
        },
        results: {
            title: "Ваши лучшие совпадения",
            aiAnalysis: "Анализ ИИ",
            startOver: "Начать сначала",
            error: "Не удалось получить рекомендации. Пожалуйста, попробуйте еще раз."
        }
    },
    comparePage: {
        title: "Сравнить брокеров",
        subtitle: "Сравнительный анализ выбранных вами брокеров.",
        startDuel: "Начать дуэль",
        clearAll: "Очистить все",
        getAiSummary: "Получить сводку от ИИ",
        aiAnalysis: "Анализ ИИ",
        empty: {
            title: "Ваш список сравнения пуст.",
            subtitle: "Добавьте брокеров, чтобы сравнить их характеристики.",
            button: "Обзор брокеров"
        }
    },
    compareTable: {
        feature: "Характеристика",
        visit: "Посетить",
        remove: "Удалить",
        features: {
            overallScore: "Общий балл",
            score: "Балл",
            tradingCosts: "Торговые издержки",
            commission: "Комиссия",
            swap: "Категория своп-комиссии",
            tradingConditions: "Торговые условия",
            maxLeverage: "Макс. плечо",
            executionType: "Тип исполнения",
            accessibility: "Доступность",
            minDeposit: "Мин. депозит",
            depositMethods: "Методы пополнения",
            withdrawalMethods: "Методы вывода",
            support: "Поддержка клиентов",
            technology: "Технологии",
            platforms: "Платформы",
            tradableInstruments: "Торговые инструменты",
            forexPairs: "Валютные пары",
            stocks: "CFD на акции",
            cryptocurrencies: "Криптовалюты",
            trust: "Доверие и история",
            regulators: "Регуляторы",
            founded: "Год основания",
            headquarters: "Штаб-квартира"
        }
    },
    loginPage: {
        title: "Вход в аккаунт",
        emailLabel: "Электронная почта",
        passwordLabel: "Пароль",
        button: "Войти",
        noAccount: "Нет аккаунта?",
        registerLink: "Зарегистрироваться"
    },
    registerPage: {
        title: "Создать аккаунт",
        nameLabel: "Полное имя",
        emailLabel: "Электронная почта",
        passwordLabel: "Пароль",
        button: "Зарегистрироваться",
        haveAccount: "Уже есть аккаунт?",
        loginLink: "Войти"
    },
    dashboardPage: {
        welcome: "С возвращением, {name}!",
        subtitle: "Это ваша личная панель для отслеживания и управления исследованием брокеров.",
        quickActions: {
            newMatch: {
                title: "Новый подбор ИИ",
                description: "Найдите нового брокера, подходящего вам."
            },
            compare: {
                title: "Сравнить брокеров",
                description: "Просмотреть ваш список сравнения."
            },
            analyzer: {
                title: "Анализатор затрат",
                description: "Анализируйте торговые комиссии в реальном времени."
            },
            explore: {
                title: "Изучить всех брокеров",
                description: "Просмотрите наш полный список брокеров."
            }
        },
        alerts: {
            title: "Мои оповещения",
            empty: "Нет оповещений для избранных брокеров. Добавьте брокеров в избранное, чтобы начать получать обновления!",
            button: "Изучить брокеров"
        },
        history: {
            title: "История подборов брокеров ИИ",
            aiAnalysis: "Анализ ИИ:",
            recommendations: "Рекомендованные брокеры для этого подбора:",
            empty: "Вы еще не использовали подбор брокера с ИИ.",
            button: "Найти свой первый подбор"
        },
        reviews: {
            title: "Мои отзывы",
            reviewFor: "Отзыв о",
            unknownBroker: "Неизвестный брокер",
            verify: "Подтвердить отзыв",
            empty: "Вы еще не оставили ни одного отзыва.",
            button: "Найти брокера для отзыва"
        },
        favorites: {
            title: "Ваши избранные брокеры",
            empty: "Вы еще не добавили брокеров в избранное. Нажмите на значок звезды у брокера, чтобы сохранить его здесь.",
            button: "Изучить брокеров"
        },
        settings: {
            title: "Настройки аккаунта",
            email: "Электронная почта",
            name: "Полное имя",
            password: "Новый пароль",
            passwordPlaceholder: "Оставьте пустым, чтобы сохранить текущий пароль",
            button: "Сохранить изменения",
            success: "Профиль успешно обновлен!",
            dangerZone: "Опасная зона",
            dangerDescription: "Удаление аккаунта - это необратимое действие.",
            deleteButton: "Удалить мой аккаунт",
            deleteModal: {
                title: "Подтвердить удаление аккаунта",
                text: "Вы уверены, что хотите навсегда удалить свой аккаунт? Все ваши данные, включая избранное и историю подборов, будут потеряны.",
                cancel: "Отмена",
                confirm: "Да, удалить аккаунт"
            }
        }
    },
    education: {
        hub: {
            title: "Образовательный центр",
            subtitle: "Изучайте, практикуйте и осваивайте концепции торговли на Форекс с помощью наших интерактивных инструментов.",
            quizzes: {
                title: "Интерактивные викторины",
                description: "Проверьте свои знания по ключевым темам, таким как торговые комиссии, управление рисками и технический анализ."
            },
            webinars: {
                title: "Вебинары от экспертов",
                description: "Присоединяйтесь к живым сессиям с рыночными аналитиками или смотрите записи, чтобы углубить свое понимание."
            },
            simulators: {
                title: "Торговые симуляторы",
                description: "Практикуйте свои навыки в безрисковой среде. Изучайте типы ордеров, тестируйте стратегии и многое другое."
            }
        },
        quizzes: {
            title: "Викторины",
            subtitle: "Выберите викторину, чтобы проверить свои знания.",
            fees: {
                title: "Понимание брокерских комиссий",
                description: "Проверьте свои знания о различных затратах, связанных с торговлей на Форекс, от спредов до свопов.",
                q1: { question: "Что такое «спред» в торговле на Форекс?", options: ["Комиссия, взимаемая брокером за сделку.", "Разница между ценой покупки (bid) и ценой продажи (ask).", "Бонус, предлагаемый брокером за открытие счета.", "Проценты, выплачиваемые или получаемые за удержание позиции на ночь."], correctAnswer: "Разница между ценой покупки (bid) и ценой продажи (ask).", explanation: "Спред — это основной способ заработка для многих брокеров. Это стоимость сделки, встроенная в цены покупки и продажи валютной пары." },
                q2: { question: "Что позволяет трейдеру делать «кредитное плечо»?", options: ["Торговать заемным капиталом у брокера.", "Гарантировать прибыль от сделки.", "Исключить все торговые риски.", "Получить скидку на комиссии."], correctAnswer: "Торговать заемным капиталом у брокера.", explanation: "Кредитное плечо позволяет вам контролировать большую позицию с меньшим количеством собственного капитала. Хотя оно может увеличить прибыль, оно также значительно увеличивает убытки." },
                q3: { question: "«Своп-комиссия» (или комиссия за перенос) взимается, когда вы...", options: ["Открываете сделку во время высокой волатильности.", "Выводите средства со своего счета.", "Держите позицию открытой на ночь.", "Используете определенную торговую платформу."], correctAnswer: "Держите позицию открытой на ночь.", explanation: "Своп-комиссия — это проценты, выплачиваемые или получаемые за удержание позиции на ночь, основанные на разнице процентных ставок двух валют в паре." },
                q4: { question: "Что из следующего обычно является «неторговой комиссией»?", options: ["Спред", "Комиссия", "Комиссия за неактивность", "Своп-комиссия"], correctAnswer: "Комиссия за неактивность", explanation: "Неторговые комиссии — это сборы, не связанные напрямую с покупкой или продажей. Сюда входят сборы за неактивность, пополнение или снятие средств." },
                q5: { question: "Какова основная характеристика ценовой модели настоящего «ECN»-брокера?", options: ["Они предлагают фиксированные спреды.", "Они не взимают комиссий.", "Они предлагают сырые, переменные спреды плюс фиксированную комиссию.", "Они зарабатывают только на своп-комиссиях."], correctAnswer: "Они предлагают сырые, переменные спреды плюс фиксированную комиссию.", explanation: "ECN-брокеры (Electronic Communication Network) предоставляют прямой доступ к рыночной ликвидности, что приводит к очень узким, переменным спредам. Они взимают отдельную, фиксированную комиссию за исполнение сделки." }
            },
            basics: {
                title: "Основы торговли на Форекс",
                description: "Изучите основные понятия рынка Форекс, включая пункты, лоты и валютные пары.",
                q1: { question: "Что такое «пункт»?", options: ["Наименьшее изменение цены, которое может совершить данный обменный курс.", "Тип торговой комиссии.", "Общая прибыль от сделки.", "Прозвище для британского фунта."], correctAnswer: "Наименьшее изменение цены, которое может совершить данный обменный курс.", explanation: "«Пункт» (процент в пункте) — это единица измерения для выражения изменения стоимости между двумя валютами. Для большинства пар это четвертый знак после запятой." },
                q2: { question: "В валютной паре EUR/USD, какая валюта является «базовой»?", options: ["USD", "Обе являются базовыми валютами", "EUR", "Ни одна не является базовой валютой"], correctAnswer: "EUR", explanation: "Первая валюта в паре (в данном случае EUR) является «базовой» валютой. Вторая валюта (USD) является «котируемой» или «встречной» валютой. Цена показывает, сколько котируемой валюты необходимо для покупки одной единицы базовой валюты." },
                q3: { question: "«Стандартный лот» в торговле на Форекс представляет собой сколько единиц базовой валюты?", options: ["1,000", "10,000", "100,000", "1,000,000"], correctAnswer: "100,000", explanation: "Размер лота относится к количеству единиц валюты, которые вы покупаете или продаете. Стандартный лот составляет 100 000 единиц, мини-лот — 10 000 единиц, а микро-лот — 1 000 единиц." },
                q4: { question: "Какая из этих пар считается «основной» валютной парой?", options: ["EUR/TRY (Евро/Турецкая лира)", "AUD/NZD (Австралийский доллар/Новозеландский доллар)", "GBP/USD (Британский фунт/Доллар США)", "USD/MXN (Доллар США/Мексиканский песо)"], correctAnswer: "GBP/USD (Британский фунт/Доллар США)", explanation: "Основные валютные пары — это те, которые включают доллар США (USD) и являются наиболее часто торгуемыми в мире, такие как EUR/USD, GBP/USD и USD/JPY. Они обычно имеют самую высокую ликвидность и самые низкие спреды." },
                q5: { question: "Что значит «открыть длинную позицию» по валютной паре?", options: ["Продать базовую валюту и купить котируемую.", "Держать сделку в течение длительного периода времени.", "Купить базовую валюту и продать котируемую, ожидая роста цены.", "Хеджировать позицию от рыночной волатильности."], correctAnswer: "Купить базовую валюту и продать котируемую, ожидая роста цены.", explanation: "Открыть длинную позицию означает, что вы покупаете базовую валюту в ожидании, что ее стоимость вырастет по отношению к котируемой валюте." }
            },
            charting: {
                title: "Введение в графический анализ",
                description: "Изучите основы чтения графиков Форекс, включая свечные модели и тренды.",
                q1: { question: "Что обычно представляет собой зеленая (или полая) свеча на стандартном свечном графике?", options: ["Период, когда цена закрытия была ниже цены открытия.", "Период отсутствия движения цены.", "Период, когда цена закрытия была выше цены открытия.", "Сигнал к немедленной продаже."], correctAnswer: "Период, когда цена закрытия была выше цены открытия.", explanation: "Зеленая или полая свеча, часто называемая бычьей свечой, означает, что цена за этот период выросла. Нижняя часть тела — это открытие, а верхняя — закрытие." },
                q2: { question: "Чем характеризуется «восходящий тренд»?", options: ["Серией более низких максимумов и более низких минимумов.", "Серией более высоких максимумов и более высоких минимумов.", "Боковым движением цены.", "Одним большим скачком цены."], correctAnswer: "Серией более высоких максимумов и более высоких минимумов.", explanation: "Восходящий тренд определяется последовательным паттерном, когда цена достигает новых максимумов, за которыми следуют откаты, приводящие к минимумам, которые все еще выше предыдущих минимумов." },
                q3: { question: "Что представляют собой «фитили» или «тени» на свече?", options: ["Общий объем торгов за период.", "Самые высокие и самые низкие цены, достигнутые за период.", "Комиссия, уплаченная за сделку.", "Прогноз будущего движения цены."], correctAnswer: "Самые высокие и самые низкие цены, достигнутые за период.", explanation: "«Тело» свечи показывает цены открытия и закрытия, в то время как тонкие линии (фитили или тени), выходящие из тела, показывают полный диапазон цен — самые высокие и самые низкие точки, достигнутые за этот период времени." },
                q4: { question: "Уровень «поддержки» на графике — это область, где...", options: ["Цене трудно подняться выше.", "Цена имеет тенденцию прекращать падение и может развернуться вверх.", "Объем торгов всегда самый высокий.", "Брокеры исполняют все ордера на продажу."], correctAnswer: "Цена имеет тенденцию прекращать падение и может развернуться вверх.", explanation: "Поддержка — это уровень цен, на котором покупательский интерес исторически достаточно силен, чтобы преодолеть давление продавцов, что заставляет цену отскакивать вверх. Он действует как пол." },
                q5: { question: "Что такое уровень «сопротивления» на графике?", options: ["Уровень цен, на котором давление продавцов имеет тенденцию преодолевать покупательский интерес.", "Уровень, который гарантирует падение цены.", "Самая низкая цена, которую когда-либо достигала валюта.", "Инструмент для расчета кредитного плеча."], correctAnswer: "Уровень цен, на котором давление продавцов имеет тенденцию преодолевать покупательский интерес.", explanation: "Сопротивление — это противоположность поддержке. Это уровень цен, на котором интерес продавцов достаточно силен, чтобы предотвратить дальнейший рост цены, действуя как потолок." }
            },
            risk: {
                title: "Основы управления рисками",
                description: "Поймите ключевые концепции управления рисками, включая ордера стоп-лосс и определение размера позиции.",
                q1: { question: "Какова основная цель ордера «стоп-лосс»?", options: ["Фиксировать прибыль, когда сделка выигрывает.", "Автоматически входить в сделку по будущей цене.", "Ограничить потенциальные убытки по сделке, закрыв ее по заранее определенной цене.", "Увеличить кредитное плечо по позиции."], correctAnswer: "Ограничить потенциальные убытки по сделке, закрыв ее по заранее определенной цене.", explanation: "Стоп-лосс — это важнейший инструмент управления рисками. Это ордер, который вы размещаете у своего брокера, чтобы закрыть убыточную сделку, как только она достигнет определенного уровня цен, предотвращая дальнейшие убытки." },
                q2: { question: "Соотношение риск/вознаграждение 1:3 в сделке означает...", options: ["Вы рискуете 3 долларами, чтобы потенциально заработать 1 доллар.", "Вы рискуете 1 долларом, чтобы потенциально заработать 3 доллара.", "Сделка имеет 33,3% шанс на успех.", "Сделка должна быть закрыта в течение 3 часов."], correctAnswer: "Вы рискуете 1 долларом, чтобы потенциально заработать 3 доллара.", explanation: "Соотношение риск/вознаграждение сравнивает потенциальный убыток от сделки (расстояние от вашего входа до стоп-лосса) с ее потенциальной прибылью (расстояние до тейк-профита). Соотношение 1:3 обычно считается благоприятным, так как ваша потенциальная прибыль в три раза превышает ваш потенциальный убыток." },
                q3: { question: "Что такое «определение размера позиции»?", options: ["Выбор лучшего времени суток для торговли.", "Решение, сколько лотов или единиц торговать, исходя из размера вашего счета и толерантности к риску.", "Прогнозирование направления рынка.", "Физический размер вашего монитора."], correctAnswer: "Решение, сколько лотов или единиц торговать, исходя из размера вашего счета и толерантности к риску.", explanation: "Правильное определение размера позиции является ключом к управлению рисками. Оно включает в себя расчет соответствующего размера сделки, чтобы потенциальный убыток от одной сделки составлял лишь небольшой, приемлемый процент от вашего общего баланса на счете (например, 1-2%)." },
                q4: { question: "Что такое «маржин-колл»?", options: ["Звонок от вашего брокера, чтобы поздравить вас с прибыльной сделкой.", "Уведомление о том, что ваш капитал на счете упал ниже требуемой поддерживающей маржи.", "Тип ордера, который гарантирует отсутствие проскальзывания.", "Семинар по психологии трейдинга."], correctAnswer: "Уведомление о том, что ваш капитал на счете упал ниже требуемой поддерживающей маржи.", explanation: "Маржин-колл происходит, когда ваши убыточные позиции уменьшили ваш доступный капитал на счете до такой степени, что вы больше не соответствуете требованиям брокера. Вам нужно будет либо внести больше средств, либо закрыть позиции, чтобы соответствовать требованиям по марже." },
                q5: { question: "Почему обычно советуют не рисковать более чем 1-2% вашего капитала в одной сделке?", options: ["Потому что брокеры не разрешают большие риски.", "Чтобы убедиться, что вы сможете пережить серию убыточных сделок, не исчерпав свой счет.", "Потому что это гарантирует, что ваши сделки будут прибыльными.", "Чтобы платить меньше налогов на свои выигрыши."], correctAnswer: "Чтобы убедиться, что вы сможете пережить серию убыточных сделок, не исчерпав свой счет.", explanation: "Даже у лучших торговых стратегий бывают полосы неудач. Рискуя лишь небольшим процентом вашего капитала на сделку, вы защищаете свой счет от обнуления из-за нескольких последовательных убытков, что позволяет вам оставаться в игре достаточно долго, чтобы ваша стратегия стала прибыльной." }
            },
            orders: {
                title: "Понимание типов ордеров",
                description: "Изучите разницу между рыночными, лимитными и стоп-ордерами.",
                q1: { question: "«Рыночный ордер» — это инструкция...", options: ["Купить или продать по определенной цене или лучше.", "Немедленно купить или продать по лучшей доступной текущей цене.", "Отменить ранее размещенный ордер.", "Подождать, пока рынок станет менее волатильным."], correctAnswer: "Немедленно купить или продать по лучшей доступной текущей цене.", explanation: "Рыночный ордер — это самый простой тип ордера. Он отдает приоритет скорости исполнения над конкретной ценой, исполняя ваш ордер по текущему рыночному курсу." },
                q2: { question: "Трейдер, который хочет купить валютную пару, но только если она упадет до более низкой цены, какой тип ордера будет использовать?", options: ["Рыночная покупка", "Лимитная покупка", "Стоп-покупка", "Лимитная продажа"], correctAnswer: "Лимитная покупка", explanation: "Ордер на лимитную покупку размещается ниже текущей рыночной цены. Это инструкция на покупку, если и только если рыночная цена упадет до указанной вами лимитной цены или ниже." },
                q3: { question: "Для чего используется ордер «Стоп-продажа»?", options: ["Для продажи по текущей цене.", "Для продажи ценной бумаги, когда ее цена поднимется до определенного уровня.", "Для продажи ценной бумаги, когда ее цена упадет до определенного уровня, часто для ограничения убытка или инициирования короткой позиции при пробое.", "Для покупки ценной бумаги, когда ее цена упадет до определенного уровня."], correctAnswer: "Для продажи ценной бумаги, когда ее цена упадет до определенного уровня, часто для ограничения убытка или инициирования короткой позиции при пробое.", explanation: "Ордер на стоп-продажу размещается ниже текущей цены. Он срабатывает, когда рыночная цена падает до указанного вами уровня. Он обычно используется как стоп-лосс для длинной позиции или для входа в короткую сделку при пробое вниз." },
                q4: { question: "Если текущая цена EUR/USD составляет 1.0750, и вы считаете, что она пойдет вверх после пробития сопротивления на уровне 1.0800, какой ордер вы разместите?", options: ["Лимитная покупка на 1.0800", "Стоп-продажа на 1.0800", "Стоп-покупка на 1.0800", "Лимитная продажа на 1.0800"], correctAnswer: "Стоп-покупка на 1.0800", explanation: "Ордер на стоп-покупку размещается выше текущей рыночной цены. Он используется для покупки, когда вы считаете, что цена продолжит расти после достижения определенного уровня (пробоя). В этом случае вы разместите стоп-покупку на 1.0800, чтобы поймать восходящий импульс." },
                q5: { question: "Ордер «Тейк-профит» предназначен для...", options: ["Ограничения ваших убытков.", "Автоматического закрытия прибыльной сделки по указанной цене.", "Увеличения размера вашей позиции.", "Разворота направления вашей сделки."], correctAnswer: "Автоматического закрытия прибыльной сделки по указанной цене.", explanation: "Ордер «Тейк-профит» (T/P) является противоположностью стоп-лосса. Это лимитный ордер, который закрывает вашу сделку, как только она достигает определенного уровня прибыли, гарантируя фиксацию ваших доходов." }
            }
        },
        webinars: {
            title: "Вебинары",
            subtitle: "Углубите свои знания с помощью идей от рыночных экспертов.",
            register: "Зарегистрироваться",
            watch: "Смотреть запись",
            upcomingTitle: "Предстоящие вебинары",
            pastTitle: "Прошедшие вебинары",
            upcoming: [
                { title: "Освоение психологии рынка", speaker: "Д-р Анна Беккер", date: "5 октября 2025 г.", description: "Научитесь контролировать страх и жадность и принимать более рациональные торговые решения." },
                { title: "Продвинутые стратегии Фибоначчи", speaker: "Джон Мерфи", date: "12 октября 2025 г.", description: "Узнайте, как применять коррекции и расширения Фибоначчи для определения ключевых уровней поддержки и сопротивления." }
            ],
            past: [
                { title: "Введение в технический анализ", speaker: "Джейн Доу", date: "28 сентября 2025 г.", description: "Руководство для начинающих по чтению графиков, определению трендов и использованию основных индикаторов." },
                { title: "Фундаментальный анализ для трейдеров Форекс", speaker: "Марк Чен", date: "21 сентября 2025 г.", description: "Поймите, как экономические данные, такие как отчеты NFP и CPI, влияют на движение валют." }
            ]
        },
        simulators: {
            title: "Торговые симуляторы",
            subtitle: "Практикуйте свои навыки в безрисковой среде.",
            execution: {
                title: "Симулятор исполнения ордеров",
                description: "Изучите разницу между рыночными, лимитными и стоп-ордерами в живой, симулированной рыночной среде."
            }
        }
    },
    tools: {
        calendar: {
            title: "Экономический календарь",
            subtitle: "Будьте в курсе ключевых экономических событий, которые двигают рынки."
        },
        marketData: {
            title: "Рыночные данные",
            subtitle: "Получите всесторонний обзор рынка Форекс с курсами в реальном времени и техническим анализом."
        },
        calculators: {
            title: "Калькуляторы Форекс",
            subtitle: "Основные инструменты, которые помогут вам эффективно управлять своими сделками и рисками.",
            pipValue: {
                title: "Стоимость пункта",
                accountCurrency: "Валюта счета",
                currencyPair: "Валютная пара",
                positionSize: "Размер позиции (лоты)",
                calculate: "Рассчитать стоимость пункта",
                result: "Стоимость одного пункта для позиции в {lots} лота по {pair} составляет примерно"
            },
            positionSize: {
                title: "Размер позиции",
                accountBalance: "Баланс счета",
                riskPercentage: "Процент риска (%)",
                stopLoss: "Стоп-лосс (пункты)",
                calculate: "Рассчитать размер позиции",
                result: "Чтобы рискнуть {risk}% вашего счета со стоп-лоссом в {sl} пунктов, ваш рекомендуемый размер позиции:",
                lots: "Лоты",
                units: "Единицы"
            },
            margin: {
                title: "Маржа",
                leverage: "Кредитное плечо",
                tradeSize: "Размер сделки (лоты)",
                calculate: "Рассчитать маржу",
                result: "Маржа, необходимая для открытия позиции в {lots} лота по {pair} с плечом {leverage}, составляет"
            }
        }
    }
  },
  es: {
    header: {
      brokers: "Brokers",
      tools: "Herramientas",
      education: "Educación",
      marketNews: "Noticias de Mercado",
      methodology: "Metodología",
      login: "Iniciar Sesión",
      register: "Registrarse",
      logout: "Cerrar Sesión",
      dashboard: "Mi Panel",
      megaMenu: {
        coreTools: "Herramientas Principales",
        allBrokers: "Todos los Brokers",
        compareBrokers: "Comparar Brokers",
        costAnalyzer: "Analizador de Costos",
        aiBrokerMatcher: "Recomendador de Brokers IA",
        byCountry: "Por País",
        platformsAndTypes: "Plataformas y Tipos"
      },
      toolsMenu: {
        economicCalendar: "Calendario Económico",
        calculators: "Calculadoras de Forex",
        marketData: "Datos de Mercado"
      }
    },
    chatbot: {
      greeting: "¡Hola! Soy BrokerBot. ¡Pregúntame cualquier cosa sobre nuestros brokers, o prueba una de las sugerencias a continuación!",
      suggestions: [
        "Mejores brokers ECN",
        "Mejores brokers para principiantes",
        "¿Qué broker es mejor para scalping?",
        "Compara Pepperstone vs IC Markets",
        "¿Cuáles son los spreads de XTB?",
        "Muéstrame brokers con alto apalancamiento"
      ]
    },
    footer: {
      subtitle: "Descubre tu broker de forex perfecto con el poder de la IA.",
      byCountry: "Por País",
      platformsAndTypes: "Plataformas y Tipos",
      resources: "Recursos",
      tools: "Herramientas",
      copyright: "© {year} Brokeranalysis. Todos los derechos reservados.",
      links: {
        home: "Inicio",
        allBrokers: "Todos los Brokers",
        compareBrokers: "Comparar Brokers",
        costAnalyzer: "Analizador de Costos",
        brokerMatcher: "Recomendador de Brokers",
        marketNews: "Noticias de Mercado",
        educationHub: "Centro de Educación",
        economicCalendar: "Calendario Económico",
        calculators: "Calculadoras",
        marketData: "Datos de Mercado",
        methodology: "Metodología",
        sources: "Fuentes",
      }
    },
    home: {
      heroTitle: "Encuentra Tu Broker de Forex Perfecto",
      heroSubtitle: "Aprovecha el poder de la IA para analizar, comparar y elegir el mejor broker adaptado a tu estilo de trading.",
      heroDataDriven: "Análisis basados en datos de docenas de brokers regulados en todo el mundo.",
      useAiMatcher: "Usar Recomendador con IA",
      exploreAllBrokers: "Explorar Todos los Brokers",
      trustedBy: "Con la confianza de los mejores traders",
      whyChoose: "¿Por Qué Elegir Brokeranalysis?",
      features: {
        data: {
          title: "Datos Completos",
          description: "Accede a información detallada sobre docenas de brokers, desde regulaciones hasta condiciones de trading."
        },
        matching: {
          title: "Recomendaciones con IA",
          description: "Nuestro Recomendador inteligente encuentra el broker ideal basado en tus preferencias únicas."
        },
        comparison: {
          title: "Comparación Lado a Lado",
          description: "Compara fácilmente las características clave de múltiples brokers en una tabla clara y concisa."
        },
        trust: {
          title: "Confianza y Seguridad",
          description: "Verificamos los datos regulatorios y usamos IA para generar una puntuación de confianza dinámica para cada broker."
        }
      },
      newTools: {
        title: "Nuevas y Potentes Herramientas de Trading",
        calendar: {
          title: "Calendario Económico",
          description: "Mantente a la vanguardia de los eventos que mueven el mercado con nuestro calendario económico en tiempo real."
        },
        calculators: {
          title: "Calculadoras de Forex",
          description: "Herramientas esenciales para la gestión de riesgos, incluidas calculadoras de tamaño de posición y valor de pip."
        }
      },
      popularCategoriesTitle: "Explora Categorías Populares",
      categories: {
        beginners: {
          title: "Mejores para Principiantes",
          description: "Encuentra plataformas fáciles de usar con depósitos bajos y excelente contenido educativo."
        },
        ecn: {
          title: "Brokers ECN y de Bajo Spread",
          description: "Para traders serios que buscan acceso directo al mercado y los spreads más ajustados posibles."
        },
        copy: {
          title: "Mejores Plataformas de Copy Trading",
          description: "Aprovecha la experiencia de traders experimentados copiando automáticamente sus operaciones."
        },
        leverage: {
          title: "Brokers con Alto Apalancamiento",
          description: "Maximiza tu potencial de trading con brokers que ofrecen un apalancamiento de 1:500 o más."
        }
      },
      howItWorksTitle: "Cómo Funciona en 3 Simples Pasos",
      steps: {
        "1": {
          title: "Responde Preguntas",
          description: "Cuéntanos sobre tu estilo de trading, experiencia y lo que más valoras en un broker."
        },
        "2": {
          title: "Obtén Coincidencias de IA",
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
          quote: "\"El Recomendador de Brokers IA es revolucionario. Me encontró un broker con spreads bajos del que nunca había oído hablar. Me ahorró horas de investigación.\"",
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
          a: "La seguridad depende en gran medida de la regulación. Los brokers más seguros suelen ser aquellos regulados por múltiples autoridades de primer nivel como la FCA (Reino Unido), ASIC (Australia) y FINMA (Suiza). Nuestra plataforma destaca los datos regulatorios y proporciona una Puntuación de Confianza de IA para ayudarte a evaluar la seguridad del broker."
        },
        "2": {
          q: "¿Cómo elige la IA el broker adecuado para mí?",
          a: "Nuestro Recomendador de Brokers IA analiza tus respuestas a preguntas sobre tu estilo de trading y prioridades. Luego, compara tu perfil con nuestra base de datos de atributos de brokers (como costos, plataformas y regulación) para encontrar las coincidencias más cercanas. Es un proceso basado en datos diseñado para personalizar tu búsqueda."
        },
        "3": {
          q: "¿Qué broker tiene los costos de trading más bajos?",
          a: "Los costos de trading son dinámicos y dependen del instrumento que operes. Nuestro Analizador de Costos en Vivo proporciona datos en tiempo real sobre spreads y comisiones de los brokers que selecciones, ayudándote a identificar la opción más barata en cualquier momento. Generalmente, los brokers ECN/STP como Pepperstone o IC Markets ofrecen spreads brutos muy bajos pero cobran una comisión."
        }
      }
    },
    allBrokersPage: {
      title: "Todos los Brokers de Forex",
      subtitle: "Usa nuestros filtros avanzados para encontrar el broker que se adapte perfectamente a tu estilo de trading y necesidades.",
      filtersTitle: "Filtros",
      reset: "Reiniciar",
      searchPlaceholder: "Buscar por nombre de broker...",
      presetsTitle: "Estilos de Trading",
      presets: {
        scalping: "Scalping",
        algorithmic: "Algorítmico",
        copytrading: "Copy Trading",
        swingtrading: "Swing Trading",
        newstrading: "Trading de Noticias",
        lowcost: "Bajo Costo"
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
        standard: "Estándar (> 1.0 pips)"
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
        getAiRec: "Obtener Recomendación de IA",
        aiRecTooltip: "Filtra a al menos 2 brokers para obtener una recomendación.",
        aiError: "Lo sentimos, la IA no pudo hacer una recomendación. Inténtalo de nuevo con un filtro diferente.",
        aiPicksTitle: "Mejores Opciones de IA de tu Selección",
        aiAnalysisTitle: "Análisis de IA",
        noResultsTitle: "No hay Brokers que Coincidan con tus Criterios",
        noResultsSubtitle: "Intenta ajustar tus filtros para encontrar más resultados."
      }
    },
    brokerMatcherPage: {
        title: "Recomendador de Brokers IA",
        subtitle: "Responde unas pocas preguntas y deja que nuestra IA haga el trabajo.",
        back: "Atrás",
        next: "Siguiente",
        findMyBroker: "Encontrar mi Broker",
        tooltip: "Usa IA para analizar tus preferencias y recomendar los mejores brokers para ti.",
        loading: "Nuestra IA está encontrando tu broker perfecto...",
        steps: {
            country: {
                title: "¿Dónde vives?",
                tooltip: "Los brokers están regulados de manera diferente en cada país. Esto asegura que solo recomendemos brokers disponibles para ti."
            },
            experience: {
                title: "¿Qué tan familiarizado estás con el trading?",
                tooltip: "Esto nos ayuda a conectarte con una plataforma que se adapte a tu nivel de habilidad, desde interfaces simples para principiantes hasta herramientas avanzadas para expertos.",
                options: [
                    { key: "I'm a first-timer", text: "Soy principiante" },
                    { key: "I've made a few trades", text: "He hecho algunas operaciones" },
                    { key: "I have experience", text: "Tengo experiencia" },
                    { key: "I'm a professional", text: "Soy profesional" }
                ]
            },
            feeStructure: {
                title: "¿Qué estructura de tarifas prefieres?",
                tooltip: "Elige 'Spreads bajos' para scalping, 'Tarifa nocturna baja' para operaciones a largo plazo, o 'Ambos' para un enfoque equilibrado.",
                options: [
                    { key: "Low spreads", text: "Spreads bajos" },
                    { key: "Low overnight fee", text: "Tarifa nocturna baja" },
                    { key: "Both", text: "Ambos" },
                    { key: "I don't know", text: "No lo sé" }
                ]
            },
            depositMethod: {
                title: "¿Cómo te gustaría depositar fondos?",
                tooltip: "Selecciona tu método preferido para asegurar un proceso de financiación fluido y conveniente.",
                options: [
                    { key: "Bank transfer", text: "Transferencia bancaria" },
                    { key: "Credit/debit card", text: "Tarjeta de crédito/débito" },
                    { key: "PayPal", text: "PayPal" },
                    { key: "Skrill", text: "Skrill" },
                    { key: "I don't know", text: "No lo sé" }
                ]
            },
            currencyPairs: {
                title: "¿Qué pares de divisas te gustaría operar?",
                tooltip: "Los pares mayores tienen los spreads más bajos, mientras que los exóticos pueden ofrecer más volatilidad y oportunidades.",
                options: [
                    { key: "Major currencies", text: "Divisas principales" },
                    { key: "Minor currencies", text: "Divisas menores" },
                    { key: "Exotic currencies", text: "Divisas exóticas" },
                    { key: "I don't know", text: "No lo sé" }
                ]
            },
            specialPreferences: {
                title: "¿Alguna preferencia especial? (Elige hasta 5)",
                options: [
                    { key: 'Fast account opening', text: 'Apertura de cuenta rápida', tooltip: 'Busca brokers con un proceso de registro totalmente digital y rápido.' },
                    { key: 'Quick withdrawal', text: 'Retiro rápido', tooltip: 'Prioriza brokers conocidos por procesar retiros rápidamente y con bajas comisiones.' },
                    { key: 'Exclude risky countries', text: 'Excluir países riesgosos', tooltip: 'Filtra brokers regulados en jurisdicciones con estándares de protección al inversor más bajos.' },
                    { key: 'Educational resources', text: 'Recursos educativos', tooltip: 'Encuentra brokers que ofrecen amplios artículos, videos y webinars para ayudarte a aprender.' },
                    { key: 'Great research tools', text: 'Excelentes herramientas de investigación', tooltip: 'Obtén acceso a gráficos avanzados, análisis de mercado y noticias.' },
                    { key: 'ECN account', text: 'Cuenta ECN', tooltip: 'Para acceso directo al mercado con spreads brutos y una comisión fija, ideal para scalpers.' },
                    { key: 'Islamic account', text: 'Cuenta islámica', tooltip: 'Encuentra brokers que ofrecen cuentas sin swap que cumplen con la ley Sharia.' },
                    { key: 'Copy trading', text: 'Copy trading', tooltip: 'Sigue y copia automáticamente las operaciones de traders exitosos.' },
                    { key: 'Superb customer service', text: 'Excelente servicio al cliente', tooltip: 'Elige brokers con soporte de alta calificación y respuesta rápida a través de chat en vivo, teléfono y correo electrónico.' },
                    { key: 'API access', text: 'Acceso API', tooltip: 'Para traders algorítmicos que desean conectar su propio software de trading.' },
                ]
            }
        },
        results: {
            title: "Tus Mejores Coincidencias",
            aiAnalysis: "Análisis de IA",
            startOver: "Empezar de Nuevo",
            error: "No se pudieron obtener las recomendaciones. Por favor, inténtalo de nuevo."
        }
    },
    comparePage: {
      title: "Comparar Brokers",
      subtitle: "Análisis lado a lado de tus brokers seleccionados.",
      startDuel: "Iniciar Duelo",
      clearAll: "Limpiar Todo",
      getAiSummary: "Obtener Resumen de IA",
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
      remove: "Eliminar",
      features: {
        overallScore: "Puntuación General",
        score: "Puntuación",
        tradingCosts: "Costos de Trading",
        commission: "Comisión",
        swap: "Categoría de Tarifa Swap",
        tradingConditions: "Condiciones de Trading",
        maxLeverage: "Apalancamiento Máx.",
        executionType: "Tipo de Ejecución",
        accessibility: "Accesibilidad",
        minDeposit: "Depósito Mín.",
        depositMethods: "Métodos de Depósito",
        withdrawalMethods: "Métodos de Retiro",
        support: "Soporte al Cliente",
        technology: "Tecnología",
        platforms: "Plataformas",
        tradableInstruments: "Instrumentos Negociables",
        forexPairs: "Pares de Forex",
        stocks: "CFDs de Acciones",
        cryptocurrencies: "Criptomonedas",
        trust: "Confianza y Trayectoria",
        regulators: "Reguladores",
        founded: "Fundado en",
        headquarters: "Sede"
      }
    },
    loginPage: {
      title: "Inicia Sesión en tu Cuenta",
      emailLabel: "Dirección de Correo Electrónico",
      passwordLabel: "Contraseña",
      button: "Iniciar Sesión",
      noAccount: "¿No tienes una cuenta?",
      registerLink: "Regístrate aquí"
    },
    registerPage: {
      title: "Crear una Cuenta",
      nameLabel: "Nombre Completo",
      emailLabel: "Dirección de Correo Electrónico",
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
                title: "Nueva Coincidencia IA",
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
                title: "Explorar Todos los Brokers",
                description: "Navega por nuestra lista completa de brokers."
            }
        },
        alerts: {
            title: "Mis Alertas",
            empty: "No hay alertas para tus brokers favoritos. ¡Añade algunos brokers a tus favoritos para empezar a recibir actualizaciones!",
            button: "Explorar Brokers"
        },
        history: {
            title: "Tu Historial de Coincidencias de Brokers con IA",
            aiAnalysis: "Análisis de IA:",
            recommendations: "Brokers Recomendados para esta Coincidencia:",
            empty: "Aún no has usado el Recomendador de Brokers con IA.",
            button: "Encuentra tu Primera Coincidencia"
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
            empty: "Aún no has añadido ningún broker a favoritos. Haz clic en el icono de la estrella en un broker para guardarlo aquí.",
            button: "Explorar Brokers"
        },
        settings: {
            title: "Configuración de la Cuenta",
            email: "Dirección de Correo Electrónico",
            name: "Nombre Completo",
            password: "Nueva Contraseña",
            passwordPlaceholder: "Dejar en blanco para mantener la contraseña actual",
            button: "Guardar Cambios",
            success: "¡Perfil actualizado con éxito!",
            dangerZone: "Zona de Peligro",
            dangerDescription: "Eliminar tu cuenta es una acción permanente y no se puede deshacer.",
            deleteButton: "Eliminar Mi Cuenta",
            deleteModal: {
                title: "Confirmar Eliminación de Cuenta",
                text: "¿Estás seguro de que quieres eliminar permanentemente tu cuenta? Todos tus datos, incluyendo favoritos e historial de coincidencias, se perderán.",
                cancel: "Cancelar",
                confirm: "Sí, Eliminar Cuenta"
            }
        }
    },
    education: {
        hub: {
            title: "Centro de Educación",
            subtitle: "Aprende, practica y domina los conceptos del trading de forex con nuestras herramientas interactivas.",
            quizzes: {
                title: "Cuestionarios Interactivos",
                description: "Pon a prueba tus conocimientos sobre temas clave como tarifas de trading, gestión de riesgos y análisis técnico."
            },
            webinars: {
                title: "Webinars de Expertos",
                description: "Únete a sesiones en vivo con analistas de mercado o mira grabaciones para profundizar tu comprensión."
            },
            simulators: {
                title: "Simuladores de Trading",
                description: "Practica tus habilidades en un entorno sin riesgos. Aprende tipos de órdenes, prueba estrategias y más."
            }
        },
        quizzes: {
            title: "Cuestionarios",
            subtitle: "Selecciona un cuestionario para poner a prueba tus conocimientos.",
            fees: {
                title: "Entendiendo las Tarifas de los Brokers",
                description: "Pon a prueba tu conocimiento de los diferentes costos involucrados en el trading de forex, desde spreads hasta swaps.",
                q1: { question: "¿Qué es un 'spread' en el trading de forex?", options: ["La comisión que cobra un broker por operación.", "La diferencia entre el precio de compra (bid) y el precio de venta (ask).", "Un bono ofrecido por el broker por abrir una cuenta.", "El interés pagado o ganado por mantener una posición abierta durante la noche."], correctAnswer: "La diferencia entre el precio de compra (bid) y el precio de venta (ask).", explanation: "El spread es la principal forma en que muchos brokers ganan dinero. Es el costo de la operación incorporado en los precios de compra y venta de un par de divisas." },
                q2: { question: "¿Qué permite hacer el 'apalancamiento' a un trader?", options: ["Operar con capital prestado del broker.", "Garantizar ganancias en una operación.", "Eliminar todos los riesgos de trading.", "Recibir un descuento en las comisiones."], correctAnswer: "Operar con capital prestado del broker.", explanation: "El apalancamiento te permite controlar una posición más grande con una cantidad menor de tu propio capital. Si bien puede amplificar las ganancias, también amplifica significativamente las pérdidas." },
                q3: { question: "¿Una 'tarifa de swap' (o tarifa de rollover) se cobra cuando...?", options: ["Abres una operación durante una alta volatilidad.", "Retiras fondos de tu cuenta.", "Mantienes una posición abierta durante la noche.", "Usas una plataforma de trading específica."], correctAnswer: "Mantienes una posición abierta durante la noche.", explanation: "Una tarifa de swap es el interés pagado o ganado por mantener una posición abierta durante la noche, basado en la diferencia de tasas de interés entre las dos divisas de un par." },
                q4: { question: "¿Cuál de los siguientes es típicamente una 'tarifa no relacionada con el trading'?", options: ["Spread", "Comisión", "Tarifa por inactividad", "Tarifa de Swap"], correctAnswer: "Tarifa por inactividad", explanation: "Las tarifas no relacionadas con el trading son cargos que no están directamente relacionados con la compra o venta. Esto incluye tarifas por inactividad, depósitos o retiros." },
                q5: { question: "¿Cuál es la característica principal del modelo de precios de un verdadero broker 'ECN'?", options: ["Ofrecen spreads fijos.", "No cobran comisiones.", "Ofrecen spreads brutos y variables más una comisión fija.", "Solo ganan dinero con las tarifas de swap."], correctAnswer: "Ofrecen spreads brutos y variables más una comisión fija.", explanation: "Los brokers ECN (Red de Comunicación Electrónica) proporcionan acceso directo a la liquidez del mercado, lo que resulta en spreads variables muy ajustados. Cobran una comisión fija por separado por ejecutar la operación." }
            },
            basics: {
                title: "Conceptos Básicos de Forex",
                description: "Aprende los conceptos fundamentales del mercado de divisas, incluyendo pips, lotes y pares de divisas.",
                q1: { question: "¿Qué es un 'pip'?", options: ["El movimiento de precio más pequeño que puede hacer un tipo de cambio dado.", "Un tipo de comisión de trading.", "El beneficio total de una operación.", "Un apodo para la Libra Esterlina."], correctAnswer: "El movimiento de precio más pequeño que puede hacer un tipo de cambio dado.", explanation: "Un 'pip' (porcentaje en punto) es la unidad de medida para expresar el cambio en el valor entre dos divisas. Para la mayoría de los pares, es el cuarto decimal." },
                q2: { question: "En el par de divisas EUR/USD, ¿cuál es la moneda 'base'?", options: ["USD", "Ambas son monedas base", "EUR", "Ninguna es moneda base"], correctAnswer: "EUR", explanation: "La primera divisa en un par (EUR en este caso) es la moneda 'base'. La segunda divisa (USD) es la moneda 'cotizada' o 'contraparte'. El precio muestra cuánta moneda cotizada se necesita para comprar una unidad de la moneda base." },
                q3: { question: "Un 'lote estándar' en el trading de forex representa ¿cuántas unidades de la moneda base?", options: ["1,000", "10,000", "100,000", "1,000,000"], correctAnswer: "100,000", explanation: "El tamaño del lote se refiere al número de unidades de divisa que estás comprando o vendiendo. Un lote estándar es de 100,000 unidades, un mini lote es de 10,000 unidades y un micro lote es de 1,000 unidades." },
                q4: { question: "¿Cuál de estos se considera un par de divisas 'principal'?", options: ["EUR/TRY (Euro/Lira Turca)", "AUD/NZD (Dólar Australiano/Dólar Neozelandés)", "GBP/USD (Libra Esterlina/Dólar Estadounidense)", "USD/MXN (Dólar Estadounidense/Peso Mexicano)"], correctAnswer: "GBP/USD (Libra Esterlina/Dólar Estadounidense)", explanation: "Los pares de divisas principales son aquellos que incluyen el Dólar Estadounidense (USD) y son los más negociados en el mundo, como EUR/USD, GBP/USD y USD/JPY. Típicamente tienen la mayor liquidez y los spreads más bajos." },
                q5: { question: "¿Qué significa 'ir en largo' en un par de divisas?", options: ["Vender la moneda base y comprar la moneda cotizada.", "Mantener una operación por un largo período de tiempo.", "Comprar la moneda base y vender la moneda cotizada, esperando que el precio suba.", "Cubrir una posición contra la volatilidad del mercado."], correctAnswer: "Comprar la moneda base y vender la moneda cotizada, esperando que el precio suba.", explanation: "Ir en largo significa que estás comprando la moneda base con la expectativa de que su valor aumentará en relación con la moneda cotizada." }
            },
            charting: {
                title: "Introducción a los Gráficos",
                description: "Comprende los conceptos básicos para leer gráficos de forex, incluyendo patrones de velas y tendencias.",
                q1: { question: "En un gráfico de velas estándar, ¿qué representa típicamente una vela verde (o hueca)?", options: ["Un período en el que el precio de cierre fue más bajo que el de apertura.", "Un período sin movimiento de precios.", "Un período en el que el precio de cierre fue más alto que el de apertura.", "Una señal para vender inmediatamente."], correctAnswer: "Un período en el que el precio de cierre fue más alto que el de apertura.", explanation: "Una vela verde o hueca, a menudo llamada vela alcista, significa que el precio aumentó durante ese período. La parte inferior del cuerpo es la apertura y la parte superior es el cierre." },
                q2: { question: "¿Qué caracteriza a una 'tendencia alcista'?", options: ["Una serie de máximos más bajos y mínimos más bajos.", "Una serie de máximos más altos y mínimos más altos.", "Un movimiento de precios lateral.", "Un único gran pico de precios."], correctAnswer: "Una serie de máximos más altos y mínimos más altos.", explanation: "Una tendencia alcista se identifica por un patrón constante en el que el precio crea nuevos máximos, seguidos de retrocesos que resultan en mínimos que aún son más altos que los mínimos anteriores." },
                q3: { question: "¿Qué representan las 'mechas' o 'sombras' de una vela?", options: ["El volumen total de operaciones del período.", "Los precios más altos y más bajos alcanzados durante el período.", "La comisión pagada por la operación.", "Una predicción del movimiento futuro del precio."], correctAnswer: "Los precios más altos y más bajos alcanzados durante el período.", explanation: "El 'cuerpo' de la vela muestra los precios de apertura y cierre, mientras que las líneas delgadas (mechas o sombras) que se extienden desde el cuerpo muestran el rango completo de precios: los puntos más altos y más bajos alcanzados durante ese período de tiempo." },
                q4: { question: "Un nivel de 'soporte' en un gráfico es un área donde...", options: ["El precio tiene dificultades para subir por encima.", "El precio tiende a dejar de caer y puede revertir al alza.", "El volumen de operaciones es siempre el más alto.", "Los brokers ejecutan todas las órdenes de venta."], correctAnswer: "El precio tiende a dejar de caer y puede revertir al alza.", explanation: "El soporte es un nivel de precios donde el interés de compra es históricamente lo suficientemente fuerte como para superar la presión de venta, lo que hace que el precio rebote. Actúa como un suelo." },
                q5: { question: "¿Qué es un nivel de 'resistencia' en un gráfico?", options: ["Un nivel de precios donde la presión de venta tiende a superar la presión de compra.", "Un nivel que garantiza una caída del precio.", "El precio más bajo que una divisa ha alcanzado.", "Una herramienta para calcular el apalancamiento."], correctAnswer: "Un nivel de precios donde la presión de venta tiende a superar la presión de compra.", explanation: "La resistencia es lo opuesto al soporte. Es un nivel de precios donde el interés de venta es lo suficientemente fuerte como para evitar que el precio siga subiendo, actuando como un techo." }
            },
            risk: {
                title: "Fundamentos de la Gestión de Riesgos",
                description: "Comprende los conceptos cruciales de la gestión de riesgos, incluyendo órdenes de stop-loss y el tamaño de la posición.",
                q1: { question: "¿Cuál es el propósito principal de una orden de 'stop-loss'?", options: ["Asegurar ganancias cuando una operación es ganadora.", "Entrar automáticamente en una operación a un precio futuro.", "Limitar las pérdidas potenciales en una operación cerrándola a un precio predeterminado.", "Aumentar el apalancamiento en una posición."], correctAnswer: "Limitar las pérdidas potenciales en una operación cerrándola a un precio predeterminado.", explanation: "Un stop-loss es una herramienta crucial de gestión de riesgos. Es una orden que colocas con tu broker para cerrar una operación perdedora una vez que alcanza un cierto nivel de precios, evitando así más pérdidas." },
                q2: { question: "Una relación riesgo/recompensa de 1:3 en una operación significa...", options: ["Estás arriesgando $3 para ganar potencialmente $1.", "Estás arriesgando $1 para ganar potencialmente $3.", "La operación tiene un 33.3% de probabilidad de éxito.", "La operación debe cerrarse en 3 horas."], correctAnswer: "Estás arriesgando $1 para ganar potencialmente $3.", explanation: "La relación riesgo/recompensa compara la pérdida potencial de una operación (la distancia desde tu entrada hasta tu stop-loss) con su ganancia potencial (la distancia hasta tu take-profit). Una relación 1:3 generalmente se considera favorable, ya que tu ganancia potencial es tres veces tu pérdida potencial." },
                q3: { question: "¿Qué es el 'tamaño de la posición'?", options: ["Elegir la mejor hora del día para operar.", "Decidir cuántos lotes o unidades operar basándose en el tamaño de tu cuenta y tu tolerancia al riesgo.", "Predecir la dirección del mercado.", "El tamaño físico de tu monitor."], correctAnswer: "Decidir cuántos lotes o unidades operar basándose en el tamaño de tu cuenta y tu tolerancia al riesgo.", explanation: "Un tamaño de posición adecuado es clave para la gestión de riesgos. Implica calcular el tamaño de operación apropiado para que una pérdida potencial de una sola operación sea solo un pequeño y aceptable porcentaje del saldo total de tu cuenta (por ejemplo, 1-2%)." },
                q4: { question: "¿Qué es una 'llamada de margen'?", options: ["Una llamada de tu broker para felicitarte por una operación rentable.", "Una notificación de que el capital de tu cuenta ha caído por debajo del margen de mantenimiento requerido.", "Un tipo de orden que garantiza que no habrá deslizamiento.", "Un seminario sobre psicología del trading."], correctAnswer: "Una notificación de que el capital de tu cuenta ha caído por debajo del margen de mantenimiento requerido.", explanation: "Una llamada de margen ocurre cuando tus posiciones perdedoras han reducido el capital disponible en tu cuenta hasta un punto en el que ya no cumples con los requisitos del broker. Necesitarás depositar más fondos o cerrar posiciones para cumplir con los requisitos de margen." },
                q5: { question: "¿Por qué generalmente se aconseja no arriesgar más del 1-2% de tu capital en una sola operación?", options: ["Porque los brokers no permiten riesgos mayores.", "Para asegurar que puedas sobrevivir a una racha de operaciones perdedoras sin agotar tu cuenta.", "Porque garantiza que tus operaciones serán rentables.", "Para pagar menos impuestos sobre tus ganancias."], correctAnswer: "Para asegurar que puedas sobrevivir a una racha de operaciones perdedoras sin agotar tu cuenta.", explanation: "Incluso las mejores estrategias de trading tienen rachas perdedoras. Al arriesgar solo un pequeño porcentaje de tu capital por operación, proteges tu cuenta de ser aniquilada por unas pocas pérdidas consecutivas, lo que te permite permanecer en el juego el tiempo suficiente para que tu estrategia sea rentable." }
            },
            orders: {
                title: "Entendiendo los Tipos de Órdenes",
                description: "Aprende la diferencia entre órdenes de mercado, órdenes límite y órdenes stop.",
                q1: { question: "¿Una 'Orden de Mercado' es una instrucción para...?", options: ["Comprar o vender a un precio específico o mejor.", "Comprar o vender inmediatamente al mejor precio actual disponible.", "Cancelar una orden previamente colocada.", "Esperar a que el mercado se vuelva menos volátil."], correctAnswer: "Comprar o vender inmediatamente al mejor precio actual disponible.", explanation: "Una orden de mercado es el tipo de orden más simple. Prioriza la velocidad de ejecución sobre un precio específico, llenando tu orden al precio de mercado actual." },
                q2: { question: "¿Un trader que quiere comprar un par de divisas pero solo si baja a un precio menor, qué tipo de orden usaría?", options: ["Compra a Mercado", "Límite de Compra", "Stop de Compra", "Límite de Venta"], correctAnswer: "Límite de Compra", explanation: "Una orden de Límite de Compra se coloca por debajo del precio de mercado actual. Es una instrucción para comprar si y solo si el precio de mercado baja a tu precio límite especificado o menos." },
                q3: { question: "¿Para qué se utiliza una orden de 'Stop de Venta'?", options: ["Para vender al precio actual.", "Para vender un valor cuando su precio sube a un cierto nivel.", "Para vender un valor cuando su precio cae a un cierto nivel, a menudo para limitar una pérdida o iniciar una posición corta en una ruptura.", "Para comprar un valor cuando su precio cae a un cierto nivel."], correctAnswer: "Para vender un valor cuando su precio cae a un cierto nivel, a menudo para limitar una pérdida o iniciar una posición corta en una ruptura.", explanation: "Una orden de Stop de Venta se coloca por debajo del precio actual. Se activa cuando el precio de mercado cae a tu nivel especificado. Se usa comúnmente como un stop-loss para una posición larga o para entrar en una operación corta en una ruptura a la baja." },
                q4: { question: "Si el precio actual de EUR/USD es 1.0750, y crees que subirá después de que rompa la resistencia en 1.0800, ¿qué orden colocarías?", options: ["Límite de Compra en 1.0800", "Stop de Venta en 1.0800", "Stop de Compra en 1.0800", "Límite de Venta en 1.0800"], correctAnswer: "Stop de Compra en 1.0800", explanation: "Una orden de Stop de Compra se coloca por encima del precio de mercado actual. Se usa para comprar cuando crees que el precio continuará subiendo después de alcanzar un cierto nivel (una ruptura). En este caso, colocarías un Stop de Compra en 1.0800 para capturar el impulso alcista." },
                q5: { question: "¿Una orden de 'Take Profit' está diseñada para...?", options: ["Limitar tus pérdidas.", "Cerrar automáticamente una operación rentable a un precio especificado.", "Aumentar el tamaño de tu posición.", "Invertir la dirección de tu operación."], correctAnswer: "Cerrar automáticamente una operación rentable a un precio especificado.", explanation: "Una orden de Take Profit (T/P) es lo opuesto a un stop-loss. Es una orden límite que cierra tu operación una vez que alcanza un cierto nivel de ganancia, asegurando que asegures tus beneficios." }
            }
        },
        webinars: {
            title: "Webinars",
            subtitle: "Profundiza tus conocimientos con las perspectivas de expertos del mercado.",
            register: "Registrarse Ahora",
            watch: "Ver Grabación",
            upcomingTitle: "Próximos Webinars",
            pastTitle: "Webinars Anteriores",
            upcoming: [
                { title: "Dominando la Psicología del Mercado", speaker: "Dra. Anna Becker", date: "5 de octubre de 2025", description: "Aprende a controlar el miedo y la codicia, y a tomar decisiones de trading más racionales." },
                { title: "Estrategias Avanzadas de Fibonacci", speaker: "John Murphy", date: "12 de octubre de 2025", description: "Descubre cómo aplicar retrocesos y extensiones de Fibonacci para identificar niveles clave de soporte y resistencia." }
            ],
            past: [
                { title: "Introducción al Análisis Técnico", speaker: "Jane Doe", date: "28 de septiembre de 2025", description: "Una guía para principiantes sobre cómo leer gráficos, identificar tendencias y usar indicadores básicos." },
                { title: "Análisis Fundamental para Traders de Forex", speaker: "Mark Chen", date: "21 de septiembre de 2025", description: "Comprende cómo los datos económicos como los informes NFP y CPI influyen en los movimientos de las divisas." }
            ]
        },
        simulators: {
            title: "Simuladores de Trading",
            subtitle: "Practica tus habilidades en un entorno sin riesgos.",
            execution: {
                title: "Simulador de Ejecución de Órdenes",
                description: "Aprende la diferencia entre órdenes de mercado, límite y stop en un entorno de mercado simulado en vivo."
            }
        }
    },
    tools: {
        calendar: {
            title: "Calendario Económico",
            subtitle: "Mantente informado sobre los eventos económicos clave que mueven los mercados."
        },
        marketData: {
            title: "Datos de Mercado",
            subtitle: "Obtén una visión general completa del mercado de divisas con tasas en tiempo real e información técnica."
        },
        calculators: {
            title: "Calculadoras de Forex",
            subtitle: "Herramientas esenciales para ayudarte a gestionar tus operaciones y riesgos de manera efectiva.",
            pipValue: {
                title: "Valor del Pip",
                accountCurrency: "Moneda de la Cuenta",
                currencyPair: "Par de Divisas",
                positionSize: "Tamaño de la Posición (Lotes)",
                calculate: "Calcular Valor del Pip",
                result: "El valor de un pip para una posición de {lots} lotes en {pair} es aproximadamente"
            },
            positionSize: {
                title: "Tamaño de la Posición",
                accountBalance: "Saldo de la Cuenta",
                riskPercentage: "Porcentaje de Riesgo (%)",
                stopLoss: "Stop Loss (pips)",
                calculate: "Calcular Tamaño de la Posición",
                result: "Para arriesgar el {risk}% de tu cuenta con un stop-loss de {sl} pips, el tamaño de tu posición recomendado es:",
                lots: "Lotes",
                units: "Unidades"
            },
            margin: {
                title: "Margen",
                leverage: "Apalancamiento",
                tradeSize: "Tamaño de la Operación (Lotes)",
                calculate: "Calcular Margen",
                result: "El margen requerido para abrir una posición de {lots} lotes en {pair} con un apalancamiento de {leverage} es"
            }
        }
    }
  },
  fr: {
    header: {
      brokers: "Brokers",
      tools: "Outils",
      education: "Éducation",
      marketNews: "Actualités du Marché",
      methodology: "Méthodologie",
      login: "Connexion",
      register: "S'inscrire",
      logout: "Déconnexion",
      dashboard: "Mon Tableau de Bord",
      megaMenu: {
        coreTools: "Outils Principaux",
        allBrokers: "Tous les Brokers",
        compareBrokers: "Comparer les Brokers",
        costAnalyzer: "Analyseur de Coûts",
        aiBrokerMatcher: "Recommandeur de Broker IA",
        byCountry: "Par Pays",
        platformsAndTypes: "Plateformes & Types"
      },
      toolsMenu: {
        economicCalendar: "Calendrier Économique",
        calculators: "Calculatrices Forex",
        marketData: "Données de Marché"
      }
    },
    chatbot: {
      greeting: "Bonjour ! Je suis BrokerBot. Posez-moi des questions sur nos brokers, ou essayez l'une des suggestions ci-dessous !",
      suggestions: [
        "Meilleurs brokers ECN",
        "Meilleurs brokers pour débutants",
        "Quel broker est le meilleur pour le scalping ?",
        "Comparer Pepperstone vs IC Markets",
        "Quels sont les spreads de XTB ?",
        "Montrez-moi les brokers à fort effet de levier"
      ]
    },
    footer: {
      subtitle: "Découvrez votre broker forex parfait grâce à la puissance de l'IA.",
      byCountry: "Par Pays",
      platformsAndTypes: "Plateformes & Types",
      resources: "Ressources",
      tools: "Outils",
      copyright: "© {year} Brokeranalysis. Tous droits réservés.",
      links: {
        home: "Accueil",
        allBrokers: "Tous les Brokers",
        compareBrokers: "Comparer les Brokers",
        costAnalyzer: "Analyseur de Coûts",
        brokerMatcher: "Recommandeur de Broker",
        marketNews: "Actualités du Marché",
        educationHub: "Centre d'Éducation",
        economicCalendar: "Calendrier Économique",
        calculators: "Calculatrices",
        marketData: "Données de Marché",
        methodology: "Méthodologie",
        sources: "Sources",
      }
    },
    home: {
      heroTitle: "Trouvez Votre Broker Forex Parfait",
      heroSubtitle: "Utilisez la puissance de l'IA pour analyser, comparer et choisir le meilleur broker adapté à votre style de trading.",
      heroDataDriven: "Des informations basées sur des données de dizaines de brokers réglementés dans le monde.",
      useAiMatcher: "Utiliser le Recommandeur IA",
      exploreAllBrokers: "Explorer Tous les Brokers",
      trustedBy: "Approuvé par les meilleurs traders",
      whyChoose: "Pourquoi Choisir Brokeranalysis ?",
      features: {
        data: {
          title: "Données Complètes",
          description: "Accédez à des informations détaillées sur des dizaines de brokers, des réglementations aux conditions de trading."
        },
        matching: {
          title: "Recommandation par IA",
          description: "Notre Recommandeur intelligent trouve le broker idéal en fonction de vos préférences uniques."
        },
        comparison: {
          title: "Comparaison Côte à Côte",
          description: "Comparez facilement les principales caractéristiques de plusieurs brokers dans un tableau clair et concis."
        },
        trust: {
          title: "Confiance et Sécurité",
          description: "Nous vérifions les données réglementaires et utilisons l'IA pour générer un score de confiance dynamique pour chaque broker."
        }
      },
      newTools: {
        title: "Nouveaux Outils de Trading Puissants",
        calendar: {
          title: "Calendrier Économique",
          description: "Restez à l'affût des événements qui font bouger le marché avec notre calendrier économique en temps réel."
        },
        calculators: {
          title: "Calculatrices Forex",
          description: "Outils essentiels pour la gestion des risques, y compris les calculateurs de taille de position et de valeur de pip."
        }
      },
      popularCategoriesTitle: "Explorer les Catégories Populaires",
      categories: {
        beginners: {
          title: "Meilleurs pour Débutants",
          description: "Trouvez des plateformes conviviales avec de faibles dépôts et un excellent contenu éducatif."
        },
        ecn: {
          title: "Brokers ECN à Faible Spread",
          description: "Pour les traders sérieux cherchant un accès direct au marché et les spreads les plus serrés possibles."
        },
        copy: {
          title: "Meilleures Plateformes de Copy Trading",
          description: "Tirez parti de l'expertise de traders chevronnés en copiant automatiquement leurs transactions."
        },
        leverage: {
          title: "Brokers à Fort Effet de Levier",
          description: "Maximisez votre potentiel de trading avec des brokers offrant un effet de levier de 1:500 ou plus."
        }
      },
      howItWorksTitle: "Comment Ça Marche en 3 Étapes Simples",
      steps: {
        "1": {
          title: "Répondez aux Questions",
          description: "Parlez-nous de votre style de trading, de votre expérience et de ce que vous appréciez le plus chez un broker."
        },
        "2": {
          title: "Obtenez des Recommandations IA",
          description: "Notre IA analyse votre profil et recommande les meilleurs brokers de notre base de données."
        },
        "3": {
          title: "Comparez et Choisissez",
          description: "Utilisez nos outils pour comparer les coûts, les fonctionnalités et les scores de confiance pour faire votre choix final."
        }
      },
      socialProofTitle: "Approuvé par les Traders du Monde Entier",
      testimonials: {
        "1": {
          quote: "\"Le Recommandeur de Broker IA est une révolution. Il m'a trouvé un broker avec de faibles spreads dont je n'avais jamais entendu parler. Cela m'a fait économiser des heures de recherche.\"",
          author: "- Alex R., Day Trader"
        },
        "2": {
          quote: "\"Enfin, un site de comparaison qui est réellement utile. L'analyseur de coûts en direct est génial pour voir les frais en temps réel. Fortement recommandé.\"",
          author: "- Sarah T., Swing Trader"
        }
      },
      faqTitle: "Questions Fréquemment Posées",
      faqs: {
        "1": {
          q: "Quel est le broker forex le plus sûr ?",
          a: "La sécurité dépend fortement de la réglementation. Les brokers les plus sûrs sont généralement ceux réglementés par plusieurs autorités de premier plan comme la FCA (Royaume-Uni), l'ASIC (Australie) et la FINMA (Suisse). Notre plateforme met en évidence les données réglementaires et fournit un score de confiance IA pour vous aider à évaluer la sécurité du broker."
        },
        "2": {
          q: "Comment l'IA choisit-elle le bon broker pour moi ?",
          a: "Notre Recommandeur de Broker IA analyse vos réponses aux questions sur votre style de trading et vos priorités. Il compare ensuite votre profil à notre base de données d'attributs de brokers, comme les coûts, les plateformes et la réglementation, pour trouver les correspondances les plus proches. C'est un processus basé sur les données conçu pour personnaliser votre recherche."
        },
        "3": {
          q: "Quel broker a les coûts de trading les plus bas ?",
          a: "Les coûts de trading sont dynamiques et dépendent de l'instrument que vous tradez. Notre Analyseur de Coûts en Direct fournit des données en temps réel sur les spreads et les commissions des brokers que vous sélectionnez, vous aidant à identifier l'option la moins chère à tout moment. En général, les brokers ECN/STP comme Pepperstone ou IC Markets offrent des spreads bruts très bas mais facturent une commission."
        }
      }
    },
    allBrokersPage: {
      title: "Tous les Brokers Forex",
      subtitle: "Utilisez nos filtres avancés pour trouver le broker qui correspond perfectly à votre style de trading et à vos besoins.",
      filtersTitle: "Filtres",
      reset: "Réinitialiser",
      searchPlaceholder: "Rechercher par nom de broker...",
      presetsTitle: "Styles de Trading",
      presets: {
        scalping: "Scalping",
        algorithmic: "Algorithmique",
        copytrading: "Copy Trading",
        swingtrading: "Swing Trading",
        newstrading: "Trading sur Actualités",
        lowcost: "Faible Coût"
      },
      generalTitle: "Général",
      minDeposit: "Dépôt Minimum",
      minDepositOptions: {
        any: "Tout Montant",
        "100": "Jusqu'à 100 $",
        "250": "Jusqu'à 250 $",
        "1000": "Jusqu'à 1000 $"
      },
      regulator: "Régulateur",
      regulatorOptions: {
        any: "Tout Régulateur"
      },
      executionCostsTitle: "Exécution & Coûts",
      executionType: "Type d'Exécution",
      spread: "Spread EUR/USD",
      spreadOptions: {
        any: "Tous",
        ultraLow: "Ultra Faible (≤ 0.5 pips)",
        low: "Faible (0.6 - 1.0 pips)",
        standard: "Standard (> 1.0 pips)"
      },
      commissions: "Commissions",
      commissionOptions: {
        any: "Toutes",
        commission: "Basé sur Commission",
        zero: "Zéro Commission"
      },
      techPlatformsTitle: "Technologie & Plateformes",
      platform: "Plateforme",
      algoTrading: "Trading Algorithmique",
      algoTradingOptions: {
        eaSupport: "Support MQL5/EA",
        apiAccess: "Accès API"
      },
      socialTrading: "Trading Social",
      socialTradingOptions: {
        any: "Tous",
        yes: "Supporte le Copy Trading",
        no: "Pas de Copy Trading"
      },
      tradingConditionsTitle: "Conditions de Trading",
      minLotSize: "Taille de Lot Minimum",
      minLotSizeOptions: {
        any: "Toutes",
        micro: "Micro (0.01)",
        mini: "Mini (0.1)"
      },
      maxLeverage: "Effet de Levier Max",
      maxLeverageOptions: {
        any: "Tous",
        low: "Jusqu'à 1:100",
        medium: "1:101 - 1:499",
        high: "1:500+"
      },
      results: {
        showing: "Affichage de {count} sur {total} brokers",
        getAiRec: "Obtenir une Recommandation IA",
        aiRecTooltip: "Filtrez au moins 2 brokers pour obtenir une recommandation.",
        aiError: "Désolé, l'IA n'a pas pu faire de recommandation. Veuillez réessayer avec un filtre différent.",
        aiPicksTitle: "Meilleurs Choix de l'IA de votre Sélection",
        aiAnalysisTitle: "Analyse IA",
        noResultsTitle: "Aucun Broker ne Correspond à vos Critères",
        noResultsSubtitle: "Essayez d'ajuster vos filtres pour trouver plus de résultats."
      }
    },
     brokerMatcherPage: {
        title: "Recommandeur de Broker IA",
        subtitle: "Répondez à quelques questions et laissez notre IA faire le travail.",
        back: "Retour",
        next: "Suivant",
        findMyBroker: "Trouver mon Broker",
        tooltip: "Utilise l'IA pour analyser vos préférences et recommander les meilleurs brokers pour vous.",
        loading: "Notre IA trouve votre broker parfait...",
        steps: {
            country: {
                title: "Où vivez-vous ?",
                tooltip: "Les brokers sont réglementés différemment dans chaque pays. Cela garantit que nous ne recommandons que des brokers disponibles pour vous."
            },
            experience: {
                title: "Quelle est votre expérience en trading ?",
                tooltip: "Cela nous aide à vous associer à une plateforme adaptée à votre niveau, des interfaces simples pour les débutants aux outils avancés pour les experts.",
                options: [
                    { key: "I'm a first-timer", text: "Je suis débutant" },
                    { key: "I've made a few trades", text: "J'ai fait quelques transactions" },
                    { key: "I have experience", text: "J'ai de l'expérience" },
                    { key: "I'm a professional", text: "Je suis un professionnel" }
                ]
            },
            feeStructure: {
                title: "Quelle structure de frais préférez-vous ?",
                tooltip: "Choisissez 'Spreads bas' pour le scalping, 'Frais de nuit bas' pour les transactions à long terme, ou 'Les deux' pour une approche équilibrée.",
                options: [
                    { key: "Low spreads", text: "Spreads bas" },
                    { key: "Low overnight fee", text: "Frais de nuit bas" },
                    { key: "Both", text: "Les deux" },
                    { key: "I don't know", text: "Je ne sais pas" }
                ]
            },
            depositMethod: {
                title: "Comment souhaitez-vous déposer des fonds ?",
                tooltip: "Sélectionnez votre méthode préférée pour garantir un processus de financement simple et pratique.",
                options: [
                    { key: "Bank transfer", text: "Virement bancaire" },
                    { key: "Credit/debit card", text: "Carte de crédit/débit" },
                    { key: "PayPal", text: "PayPal" },
                    { key: "Skrill", text: "Skrill" },
                    { key: "I don't know", text: "Je ne sais pas" }
                ]
            },
            currencyPairs: {
                title: "Quelles paires de devises souhaitez-vous trader ?",
                tooltip: "Les paires majeures ont les spreads les plus bas, tandis que les exotiques peuvent offrir plus de volatilité et d'opportunités.",
                options: [
                    { key: "Major currencies", text: "Devises majeures" },
                    { key: "Minor currencies", text: "Devises mineures" },
                    { key: "Exotic currencies", text: "Devises exotiques" },
                    { key: "I don't know", text: "Je ne sais pas" }
                ]
            },
            specialPreferences: {
                title: "Des préférences particulières ? (Choisissez jusqu'à 5)",
                options: [
                    { key: 'Fast account opening', text: 'Ouverture de compte rapide', tooltip: 'Recherchez des brokers avec un processus d\'inscription entièrement numérique et rapide.' },
                    { key: 'Quick withdrawal', text: 'Retrait rapide', tooltip: 'Privilégiez les brokers connus pour traiter les retraits rapidement et avec de faibles frais.' },
                    { key: 'Exclude risky countries', text: 'Exclure les pays à risque', tooltip: 'Filtrez les brokers réglementés dans des juridictions avec des normes de protection des investisseurs plus faibles.' },
                    { key: 'Educational resources', text: 'Ressources éducatives', tooltip: 'Trouvez des brokers qui fournissent de nombreux articles, vidéos et webinaires pour vous aider à apprendre.' },
                    { key: 'Great research tools', text: 'Excellents outils de recherche', tooltip: 'Accédez à des graphiques avancés, des analyses de marché et des flux d\'actualités.' },
                    { key: 'ECN account', text: 'Compte ECN', tooltip: 'Pour un accès direct au marché avec des spreads bruts et une commission fixe, idéal pour les scalpers.' },
                    { key: 'Islamic account', text: 'Compte islamique', tooltip: 'Trouvez des brokers proposant des comptes sans swap conformes à la loi islamique.' },
                    { key: 'Copy trading', text: 'Copy trading', tooltip: 'Suivez et copiez automatiquement les transactions de traders performants.' },
                    { key: 'Superb customer service', text: 'Excellent service client', tooltip: 'Choisissez des brokers avec un support très bien noté et réactif via chat en direct, téléphone et e-mail.' },
                    { key: 'API access', text: 'Accès API', tooltip: 'Pour les traders algorithmiques qui souhaitent connecter leur propre logiciel de trading.' },
                ]
            }
        },
        results: {
            title: "Vos Meilleurs Résultats",
            aiAnalysis: "Analyse IA",
            startOver: "Recommencer",
            error: "Impossible d'obtenir les recommandations. Veuillez réessayer."
        }
    },
    comparePage: {
      title: "Comparer les Brokers",
      subtitle: "Analyse côte à côte de vos brokers sélectionnés.",
      startDuel: "Commencer le Duel",
      clearAll: "Tout Effacer",
      getAiSummary: "Obtenir le Résumé IA",
      aiAnalysis: "Analyse IA",
      empty: {
        title: "Votre liste de comparaison est vide.",
        subtitle: "Ajoutez des brokers pour comparer leurs fonctionnalités côte à côte.",
        button: "Parcourir les Brokers"
      }
    },
    compareTable: {
      feature: "Caractéristique",
      visit: "Visiter",
      remove: "Retirer",
      features: {
        overallScore: "Score Global",
        score: "Score",
        tradingCosts: "Coûts de Trading",
        commission: "Commission",
        swap: "Catégorie de Frais de Swap",
        tradingConditions: "Conditions de Trading",
        maxLeverage: "Levier Max",
        executionType: "Type d'Exécution",
        accessibility: "Accessibilité",
        minDeposit: "Dépôt Min",
        depositMethods: "Méthodes de Dépôt",
        withdrawalMethods: "Méthodes de Retrait",
        support: "Support Client",
        technology: "Technologie",
        platforms: "Plateformes",
        tradableInstruments: "Instruments Négociables",
        forexPairs: "Paires de Forex",
        stocks: "CFD sur Actions",
        cryptocurrencies: "Cryptomonnaies",
        trust: "Confiance et Historique",
        regulators: "Régulateurs",
        founded: "Fondé en",
        headquarters: "Siège Social"
      }
    },
    loginPage: {
      title: "Connectez-vous à votre Compte",
      emailLabel: "Adresse E-mail",
      passwordLabel: "Mot de passe",
      button: "Connexion",
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: "Inscrivez-vous ici"
    },
    registerPage: {
      title: "Créer un Compte",
      nameLabel: "Nom Complet",
      emailLabel: "Adresse E-mail",
      passwordLabel: "Mot de passe",
      button: "S'inscrire",
      haveAccount: "Vous avez déjà un compte ?",
      loginLink: "Connectez-vous ici"
    }
  }
};