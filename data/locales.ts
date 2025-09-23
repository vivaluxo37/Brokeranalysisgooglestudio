
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
        uk: {
          title: "UK Forex Broker",
          description: "Entdecken Sie erstklassige, von der FCA regulierte Broker, die für ihren robusten Kundenschutz bekannt sind."
        },
        ecn: {
          title: "ECN Broker",
          description: "Für ernsthafte Händler, die direkten Marktzugang und die engstmöglichen Spreads suchen."
        },
        copy: {
          title: "Copy Trading",
          description: "Nutzen Sie das Fachwissen erfahrener Händler, indem Sie deren Trades automatisch kopieren."
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
        steps: {
            "0": {
                title: "Zuerst, was ist Ihre Handelserfahrung?",
                options: ["Anfänger", "Mittel", "Experte"]
            },
            "1": {
                title: "Was ist Ihre geplante Ersteinzahlung?",
                options: ["Unter $200", "$200 - $1000", "$1000 - $5000", "$5000+"]
            },
            "2": {
                title: "Gibt es bevorzugte Handelsplattformen?",
                options: ["MetaTrader 4/5", "cTrader", "TradingView", "Proprietär", "Ist mir egal"],
                placeholder: "Oder geben Sie Ihre eigene ein..."
            },
            "3": {
                title: "Zuletzt, was ist Ihnen am wichtigsten?",
                options: ["Niedrigstmögliche Spreads", "Erstklassige Regulierung", "Beste Handelsplattform", "Anfängerfreundlich"],
                placeholder: "Oder geben Sie Ihre eigene ein..."
            }
        },
        back: "Zurück",
        findMyBroker: "Meinen Broker finden",
        tooltip: "Verwendet KI, um Ihre Präferenzen zu analysieren und die besten Broker für Sie zu empfehlen.",
        loading: "Unsere KI findet Ihren perfekten Broker...",
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
            eurusd: "EUR/USD Spread",
            gbpusd: "GBP/USD Spread",
            usdjpy: "USD/JPY Spread",
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
            matchTitle: "Match für einen {experience} Händler",
            matchSubtitle: "Priorität: {priority} | {date}",
            preferences: "Ihre Präferenzen:",
            experience: "Erfahrung:",
            deposit: "Ersteinzahlung:",
            platforms: "Plattformen:",
            priority: "Priorität:",
            any: "Beliebig",
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
        uk: {
          title: "英国のFXブローカー",
          description: "堅牢な顧客保護で知られる、FCA規制のトップクラスのブローカーを探索しましょう。"
        },
        ecn: {
          title: "ECNブローカー",
          description: "直接的な市場アクセスと可能な限り狭いスプレッドを求める真剣なトレーダー向けです。"
        },
        copy: {
          title: "コピートレード",
          description: "経験豊富なトレーダーの取引を自動的にコピーして、彼らの専門知識を活用しましょう。"
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
        title: "AIブローカーマッチャー",
        subtitle: "いくつかの質問に答えて、残りはAIにお任せください。",
        steps: {
            "0": {
                title: "まず、あなたの取引経験は？",
                options: ["初心者", "中級者", "専門家"]
            },
            "1": {
                title: "予定している初回入金額はいくらですか？",
                options: ["$200未満", "$200 - $1000", "$1000 - $5000", "$5000以上"]
            },
            "2": {
                title: "希望する取引プラットフォームはありますか？",
                options: ["MetaTrader 4/5", "cTrader", "TradingView", "独自プラットフォーム", "気にしない"],
                placeholder: "または、ご自身で入力..."
            },
            "3": {
                title: "最後に、あなたにとって最も重要なことは何ですか？",
                options: ["可能な限り低いスプレッド", "トップティアの規制", "最高の取引プラットフォーム", "初心者向け"],
                placeholder: "または、ご自身で入力..."
            }
        },
        back: "戻る",
        findMyBroker: "私のブローカーを探す",
        tooltip: "AIを使用してあなたの好みを分析し、最適なブローカーを推奨します。",
        loading: "AIがあなたにぴったりのブローカーを探しています...",
        results: {
            title: "あなたのトップマッチ",
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
            eurusd: "EUR/USDスプレッド",
            gbpusd: "GBP/USDスプレッド",
            usdjpy: "USD/JPYスプレッド",
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
        welcome: "おかえりなさい、{name}さん！",
        subtitle: "これはあなたのブローカーリサーチを追跡・管理するための個人ダッシュボードです。",
        quickActions: {
            newMatch: {
                title: "新しいAIマッチ",
                description: "あなたに合わせた新しいブローカーを見つけます。"
            },
            compare: {
                title: "ブローカーを比較",
                description: "比較リストを表示します。"
            },
            analyzer: {
                title: "コスト分析",
                description: "ライブ取引手数料を分析します。"
            },
            explore: {
                title: "すべてのブローカーを探索",
                description: "全ブローカーリストを閲覧します。"
            }
        },
        alerts: {
            title: "マイアラート",
            empty: "お気に入りのブローカーのアラートはありません。更新情報を受け取るには、お気に入りにブローカーを追加してください！",
            button: "ブローカーを探索"
        },
        history: {
            title: "あなたのAIブローカーマッチ履歴",
            matchTitle: "{experience}トレーダー向けのマッチ",
            matchSubtitle: "優先事項: {priority} | {date}",
            preferences: "あなたの好み:",
            experience: "経験:",
            deposit: "初回入金額:",
            platforms: "プラットフォーム:",
            priority: "優先事項:",
            any: "任意",
            aiAnalysis: "AI分析:",
            recommendations: "このマッチに推奨されるブローカー:",
            empty: "まだAIブローカーマッチャーを使用していません。",
            button: "最初のマッチを見つける"
        },
        reviews: {
            title: "私のレビュー",
            reviewFor: "のレビュー",
            unknownBroker: "不明なブローカー",
            verify: "レビューを認証",
            empty: "まだレビューを書いていません。",
            button: "レビューするブローカーを探す"
        },
        favorites: {
            title: "お気に入りのブローカー",
            empty: "まだお気に入りのブローカーはありません。ブローカーの星アイコンをクリックして、ここに保存してください。",
            button: "ブローカーを探索"
        },
        settings: {
            title: "アカウント設定",
            email: "メールアドレス",
            name: "フルネーム",
            password: "新しいパスワード",
            passwordPlaceholder: "現在のパスワードを維持するには空欄のままにしてください",
            button: "変更を保存",
            success: "プロフィールが正常に更新されました！",
            dangerZone: "危険地帯",
            dangerDescription: "アカウントの削除は永続的な操作であり、元に戻すことはできません。",
            deleteButton: "マイアカウントを削除",
            deleteModal: {
                title: "アカウント削除の確認",
                text: "アカウントを永久に削除してもよろしいですか？お気に入りやマッチ履歴を含むすべてのデータが失われます。",
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
                description: "マーケットアナリストとのライブセッションに参加したり、録画を視聴して理解を深めましょう。"
            },
            simulators: {
                title: "取引シミュレーター",
                description: "リスクのない環境でスキルを練習しましょう。注文タイプを学び、戦略をテストするなど、さまざまなことができます。"
            }
        },
        quizzes: {
            title: "クイズ",
            subtitle: "知識をテストするためにクイズを選択してください。",
            fees: {
                title: "ブローカー手数料の理解",
                description: "スプレッドからスワップまで、FX取引に関連するさまざまなコストに関する知識をテストします。",
                q1: { question: "FX取引における「スプレッド」とは何ですか？", options: ["ブローカーが取引ごとに請求する手数料。", "ビッド（売値）とアスク（買値）の価格差。", "口座開設時にブローカーが提供するボーナス。", "ポジションを翌日に持ち越した場合に支払われる、または受け取れる利息。"], correctAnswer: "ビッド（売値）とアスク（買値）の価格差。", explanation: "スプレッドは多くのブローカーが利益を上げる主要な方法です。これは通貨ペアの売買価格に組み込まれた取引コストです。" },
                q2: { question: "「レバレッジ」はトレーダーに何を可能にさせますか？", options: ["ブローカーから借りた資本で取引すること。", "取引での利益を保証すること。", "すべての取引リスクを排除すること。", "手数料の割引を受けること。"], correctAnswer: "ブローカーから借りた資本で取引すること。", explanation: "レバレッジを使用すると、より少ない自己資本でより大きなポジションをコントロールできます。利益を増幅させることができますが、損失も大幅に増幅させます。" },
                q3: { question: "「スワップ手数料」（またはロールオーバー手数料）はいつ請求されますか？", options: ["ボラティリティが高いときに取引を開始する。", "口座から資金を引き出す。", "ポジションを翌日に持ち越す。", "特定の取引プラットフォームを使用する。"], correctAnswer: "ポジションを翌日に持ち越す。", explanation: "スワップ手数料は、ペアの2つの通貨間の金利差に基づいて、ポジションを翌日に持ち越した場合に支払われる、または受け取れる利息です。" },
                q4: { question: "次のうち、通常「非取引手数料」はどれですか？", options: ["スプレッド", "手数料", "非アクティブ手数料", "スワップ手数料"], correctAnswer: "非アクティブ手数料", explanation: "非取引手数料は、売買に直接関連しない料金です。これには、非アクティブ、入金、または引き出しの手数料が含まれます。" },
                q5: { question: "真の「ECN」ブローカーの価格設定モデルの主な特徴は何ですか？", options: ["固定スプレッドを提供する。", "手数料がゼロである。", "生の変動スプレッドと固定手数料を提供する。", "スワップ手数料からのみ利益を上げる。"], correctAnswer: "生の変動スプレッドと固定手数料を提供する。", explanation: "ECN（電子通信ネットワーク）ブローカーは、市場の流動性への直接アクセスを提供し、その結果、非常に狭い変動スプレッドが実現します。彼らは取引を実行するために別途固定手数料を請求します。" }
            },
            basics: {
                title: "FX取引の基礎",
                description: "ピップ、ロット、通貨ペアなど、FX市場の基本概念を学びましょう。",
                q1: { question: "「ピップ」とは何ですか？", options: ["特定の交換レートが取りうる最小の価格変動。", "取引手数料の一種。", "取引からの総利益。", "英ポンドの愛称。"], correctAnswer: "特定の交換レートが取りうる最小の価格変動。", explanation: "「ピップ」（ポイント単位のパーセンテージ）は、2つの通貨間の価値の変化を表すための測定単位です。ほとんどのペアでは、小数点以下第4位です。" },
                q2: { question: "通貨ペアEUR/USDでは、どちらが「基軸」通貨ですか？", options: ["USD", "両方が基軸通貨です", "EUR", "どちらも基軸通貨ではありません"], correctAnswer: "EUR", explanation: "ペアの最初の通貨（この場合はEUR）が「基軸」通貨です。2番目の通貨（USD）は「決済」または「カウンター」通貨です。価格は、基軸通貨の1単位を購入するために必要な決済通貨の量を示します。" },
                q3: { question: "FX取引における「標準ロット」は、基軸通貨の何単位を表しますか？", options: ["1,000", "10,000", "100,000", "1,000,000"], correctAnswer: "100,000", explanation: "ロットサイズは、購入または売却する通貨単位の数を指します。標準ロットは100,000単位、ミニロットは10,000単位、マイクロロットは1,000単位です。" },
                q4: { question: "これらのうち、どれが「メジャー」通貨ペアと見なされますか？", options: ["EUR/TRY（ユーロ/トルコリラ）", "AUD/NZD（オーストラリアドル/ニュージーランドドル）", "GBP/USD（英ポンド/米ドル）", "USD/MXN（米ドル/メキシコペソ）"], correctAnswer: "GBP/USD（英ポンド/米ドル）", explanation: "メジャー通貨ペアは、米ドル（USD）を含み、世界で最も頻繁に取引されるペアです。例：EUR/USD、GBP/USD、USD/JPY。通常、最も高い流動性と最も低いスプレッドを持っています。" },
                q5: { question: "通貨ペアで「ロングポジションを取る」とはどういう意味ですか？", options: ["基軸通貨を売り、決済通貨を買うこと。", "取引を長期間保持すること。", "価格が上昇することを期待して、基軸通貨を買い、決済通貨を売ること。", "市場のボラティリティに対してポジションをヘッジすること。"], correctAnswer: "価格が上昇することを期待して、基軸通貨を買い、決済通貨を売ること。", explanation: "ロングポジションを取るとは、決済通貨に対してその価値が上がると期待して基軸通貨を購入することです。" }
            },
            charting: {
                title: "チャート入門",
                description: "ローソク足パターンやトレンドなど、FXチャートの読み方の基本を理解しましょう。",
                q1: { question: "標準的なローソク足チャートで、緑（または中空）のローソク足は通常何を表しますか？", options: ["終値が始値より低かった期間。", "価格変動がなかった期間。", "終値が始値より高かった期間。", "すぐに売るべきシグナル。"], correctAnswer: "終値が始値より高かった期間。", explanation: "緑または中空のローソク足は、しばしば強気のローソク足と呼ばれ、その期間中に価格が上昇したことを示します。実体の下部が始値で、上部が終値です。" },
                q2: { question: "「上昇トレンド」は何によって特徴付けられますか？", options: ["より低い高値とより低い安値の連続。", "より高い高値とより高い安値の連続。", "横ばいの価格変動。", "単一の大きな価格の急騰。"], correctAnswer: "より高い高値とより高い安値の連続。", explanation: "上昇トレンドは、価格が新高値を更新し、その後、前の安値よりもまだ高い安値となる調整が続く一貫したパターンによって識別されます。" },
                q3: { question: "ローソク足の「ひげ」または「影」は何を表しますか？", options: ["その期間の総取引量。", "その期間中に到達した最高値と最安値。", "取引のために支払われた手数料。", "将来の価格変動の予測。"], correctAnswer: "その期間中に到達した最高値と最安値。", explanation: "ローソク足の「実体」は始値と終値を示し、実体から伸びる細い線（ひげまたは影）は、その期間中に到達した最高点と最低点の全価格範囲を示します。" },
                q4: { question: "チャート上の「サポート」レベルとは、どのようなエリアですか？", options: ["価格がそれを超えて上昇するのが難しいエリア。", "価格が下落を停止し、上向きに反転する傾向があるエリア。", "取引量が常に最も多いエリア。", "ブローカーがすべての売り注文を実行するエリア。"], correctAnswer: "価格が下落を停止し、上向きに反転する傾向があるエリア。", explanation: "サポートは、買い意欲が歴史的に売り圧力を克服するのに十分強い価格レベルであり、価格が反発する原因となります。それは床として機能します。" },
                q5: { question: "チャート上の「レジスタンス」レベルとは何ですか？", options: ["売り圧力が買い圧力を上回る傾向がある価格レベル。", "価格の下落を保証するレベル。", "通貨がこれまでに到達した最低価格。", "レバレッジを計算するためのツール。"], correctAnswer: "売り圧力が買い圧力を上回る傾向がある価格レベル。", explanation: "レジスタンスはサポートの反対です。それは、売り意欲が価格のさらなる上昇を防ぐのに十分強い価格レベルであり、天井として機能します。" }
            },
            risk: {
                title: "リスク管理の要点",
                description: "ストップロス注文やポジションサイジングなど、リスク管理の重要な概念を把握しましょう。",
                q1: { question: "「ストップロス」注文の主な目的は何ですか？", options: ["取引が勝っているときに利益を確定するため。", "将来の価格で自動的に取引を開始するため。", "事前に決められた価格で取引を終了することにより、取引の潜在的な損失を制限するため。", "ポジションのレバレッジを増やすため。"], correctAnswer: "事前に決められた価格で取引を終了することにより、取引の潜在的な損失を制限するため。", explanation: "ストップロスは重要なリスク管理ツールです。これは、損失の出ている取引が特定の価格レベルに達したときにそれを閉じるためにブローカーに発注する注文であり、さらなる損失を防ぎます。" },
                q2: { question: "取引における1:3のリスク/リワード比率は何を意味しますか？", options: ["潜在的に1ドルを稼ぐために3ドルをリスクにさらしている。", "潜在的に3ドルを稼ぐために1ドルをリスクにさらしている。", "その取引の成功確率は33.3%である。", "その取引は3時間以内に終了しなければならない。"], correctAnswer: "潜在的に3ドルを稼ぐために1ドルをリスクにさらしている。", explanation: "リスク/リワード比率は、取引の潜在的な損失（エントリーからストップロスまでの距離）とその潜在的な利益（テイクプロフィットまでの距離）を比較します。1:3の比率は一般的に有利と見なされます。なぜなら、あなたの潜在的な利益は潜在的な損失の3倍だからです。" },
                q3: { question: "「ポジションサイジング」とは何ですか？", options: ["取引するのに最適な時間帯を選ぶこと。", "口座サイズとリスク許容度に基づいて、取引するロット数またはユニット数を決定すること。", "市場の方向を予測すること。", "モニターの物理的なサイズ。"], correctAnswer: "口座サイズとリスク許容度に基づいて、取引するロット数またはユニット数を決定すること。", explanation: "適切なポジションサイジングはリスク管理の鍵です。これには、単一の取引からの潜在的な損失が総口座残高の小さく許容できる割合（例：1〜2%）になるように、適切な取引サイズを計算することが含まれます。" },
                q4: { question: "「マージンコール」とは何ですか？", options: ["収益性の高い取引についてブローカーからのお祝いの電話。", "口座の資本が、必要な維持証拠金を下回ったという通知。", "スリッページがないことを保証する注文タイプ。", "取引心理学に関するセミナー。"], correctAnswer: "口座の資本が、必要な維持証拠金を下回ったという通知。", explanation: "マージンコールは、損失ポジションによって利用可能な口座資本がブローカーの要件を満たさなくなったときに発生します。証拠金要件を満たすためには、さらに資金を入金するか、ポジションを閉じる必要があります。" },
                q5: { question: "なぜ一般的に、単一の取引で資本の1〜2%以上をリスクにさらさないようにアドバイスされるのですか？", options: ["ブローカーがより大きなリスクを許可しないため。", "口座を枯渇させることなく、一連の負け取引を乗り切ることができるようにするため。", "取引が利益を上げることを保証するため。", "賞金にかかる税金を低くするため。"], correctAnswer: "口座を枯渇させることなく、一連の負け取引を乗り切ることができるようにするため。", explanation: "最高の取引戦略でさえ、連敗することがあります。取引ごとに資本のほんのわずかな割合をリスクにさらすことで、数回の連続した損失によって口座が全滅するのを防ぎ、戦略が利益を上げるのに十分な時間、ゲームに留まることができます。" }
            },
            orders: {
                title: "注文タイプの理解",
                description: "成行注文、指値注文、逆指値注文の違いを学びましょう。",
                q1: { question: "「成行注文」とは…の指示です", options: ["特定の価格またはそれより良い価格で売買する。", "現在の最良の利用可能な価格で直ちに売買する。", "以前に出した注文をキャンセルする。", "市場のボラティリティが低くなるのを待つ。"], correctAnswer: "現在の最良の利用可能な価格で直ちに売買する。", explanation: "成行注文は最も単純な注文タイプです。特定の価格よりも執行速度を優先し、現在の市場レートで注文を約定させます。" },
                q2: { question: "通貨ペアを購入したいが、価格がより低いレベルに下がった場合にのみ購入したいトレーダーは、どのタイプの注文を使用しますか？", options: ["成行買い", "買い指値", "買い逆指値", "売り指値"], correctAnswer: "買い指値", explanation: "買い指値注文は、現在の市場価格より下に置かれます。これは、市場価格が指定した指値価格以下に下がった場合にのみ購入する指示です。" },
                q3: { question: "「売り逆指値」注文は何のために使用されますか？", options: ["現在の価格で売るため。", "証券の価格が特定のレベルに上昇したときに売るため。", "証券の価格が特定のレベルに下落したときに売るため。しばしば損失を限定したり、ブレイクアウトでショートポジションを開始するために使用されます。", "証券の価格が特定のレベルに下落したときに買うため。"], correctAnswer: "証券の価格が特定のレベルに下落したときに売るため。しばしば損失を限定したり、ブレイクアウトでショートポジションを開始するために使用されます。", explanation: "売り逆指値注文は、現在の価格より下に置かれます。市場価格が指定したレベルに下がったときにトリガーされます。ロングポジションのストップロスとして、または下降ブレイクアウトでショートトレードに入るためによく使用されます。" },
                q4: { question: "EUR/USDの現在の価格が1.0750で、1.0800の抵抗線を突破した後に上昇すると信じている場合、どの注文を出しますか？", options: ["1.0800で買い指値", "1.0800で売り逆指値", "1.0800で買い逆指値", "1.0800で売り指値"], correctAnswer: "1.0800で買い逆指値", explanation: "買い逆指値注文は、現在の市場価格より上に置かれます。これは、特定のレベル（ブレイクアウト）に達した後に価格が上昇し続けると信じているときに購入するために使用されます。この場合、上昇の勢いを捉えるために1.0800で買い逆指値注文を出します。" },
                q5: { question: "「テイクプロフィット」注文は…のために設計されています", options: ["損失を限定するため。", "指定された価格で収益性の高い取引を自動的に終了するため。", "ポジションサイズを増やすため。", "取引の方向を反転させるため。"], correctAnswer: "指定された価格で収益性の高い取引を自動的に終了するため。", explanation: "テイクプロフィット（T/P）注文はストップロスの反対です。これは、特定の利益レベルに達したときに取引を終了する指値注文であり、利益を確定させます。" }
            }
        },
        webinars: {
            title: "ウェビナー",
            subtitle: "市場の専門家からの洞察で知識を深めましょう。",
            register: "今すぐ登録",
            watch: "録画を視聴",
            upcomingTitle: "今後のウェビナー",
            pastTitle: "過去のウェビナー",
            upcoming: [
                { title: "市場心理学の習得", speaker: "アンナ・ベッカー博士", date: "2025年10月5日", description: "恐怖と貪欲をコントロールし、より合理的な取引決定を下す方法を学びます。" },
                { title: "高度なフィボナッチ戦略", speaker: "ジョン・マーフィー", date: "2025年10月12日", description: "主要なサポートおよびレジスタンスレベルを特定するためにフィボナッチリトレースメントとエクステンションを適用する方法を発見します。" }
            ],
            past: [
                { title: "テクニカル分析入門", speaker: "ジェーン・ドウ", date: "2025年9月28日", description: "チャートの読み方、トレンドの特定、基本的なインジケーターの使用に関する初心者向けガイド。" },
                { title: "FXトレーダーのためのファンダメンタル分析", speaker: "マーク・チェン", date: "2025年9月21日", description: "NFPやCPIレポートなどの経済データが通貨の動きにどのように影響するかを理解します。" }
            ]
        },
        simulators: {
            title: "取引シミュレーター",
            subtitle: "リスクのない環境でスキルを練習しましょう。",
            execution: {
                title: "注文実行シミュレーター",
                description: "ライブのシミュレーション市場環境で、成行注文、指値注文、逆指値注文の違いを学びます。"
            }
        }
    },
    tools: {
        calendar: {
            title: "経済指標カレンダー",
            subtitle: "市場を動かす主要な経済イベントについて常に情報を入手してください。"
        },
        marketData: {
            title: "市場データ",
            subtitle: "リアルタイムのレートとテクニカルな洞察でFX市場の包括的な概要を入手してください。"
        },
        calculators: {
            title: "FX計算ツール",
            subtitle: "取引とリスクを効果的に管理するのに役立つ不可欠なツール。",
            pipValue: {
                title: "ピップ値",
                accountCurrency: "口座通貨",
                currencyPair: "通貨ペア",
                positionSize: "ポジションサイズ（ロット）",
                calculate: "ピップ値を計算",
                result: "{pair}の{lots}ロットのポジションの1ピップの価値は、およそ"
            },
            positionSize: {
                title: "ポジションサイズ",
                accountBalance: "口座残高",
                riskPercentage: "リスク許容率（%）",
                stopLoss: "ストップロス（pips）",
                calculate: "ポジションサイズを計算",
                result: "{sl}ピップのストップロスで口座の{risk}%をリスクにさらすための推奨ポジションサイズは次のとおりです:",
                lots: "ロット",
                units: "ユニット"
            },
            margin: {
                title: "証拠金",
                leverage: "レバレッジ",
                tradeSize: "取引サイズ（ロット）",
                calculate: "証拠金を計算",
                result: "{leverage}のレバレッジで{pair}の{lots}ロットのポジションを開設するために必要な証拠金は"
            }
        }
    }
  }
}