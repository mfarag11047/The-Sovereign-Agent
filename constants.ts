import { Phase, ProductData } from './types';

// Mock Knowledge Base
export const PRODUCT_DATABASE: Record<string, ProductData> = {
  default: {
    name: "Generic",
    responses: {
      [Phase.CONSUMER]: {
        text: "I found several options highly rated by other users. The best value is currently available at major retailers with 2-day shipping.",
        suggestions: ["Show best price", "Read reviews", "Add to cart"],
        followUps: {
          "price": "The lowest price found is $19.99 at Amazon.",
          "review": "4.8/5 stars based on 12,000 reviews. Users praise durability.",
          "cart": "Added to your shopping cart. Proceed to checkout?"
        }
      },
      [Phase.FRICTION]: {
        text: "Before you buy, consider: Is this an impulse purchase? It will cost you approximately 4 hours of focused labor to afford this.",
        suggestions: ["Calculate labor cost", "Do I really need this?", "Wait 24 hours"],
        followUps: {
          "labor": "Based on average wage data, this item costs 4.2 hours of life energy.",
          "need": "Analysis suggests this is a dopamine-seeking behavior, not a utility need.",
          "wait": "Timer set for 24 hours. If you still want it then, the impulse is likely valid."
        }
      },
      [Phase.REVEAL]: {
        text: "This product category is dominated by two holding companies. Recent reports indicate they utilize planned obsolescence to force upgrades every 18 months.",
        suggestions: ["Who owns them?", "Show lobbying spend", "Check failure rates"],
        followUps: {
          "owns": "BlackRock and Vanguard hold 18% and 12% controlling stakes respectively.",
          "lobbying": "$12M spent last cycle to defeat Right-to-Repair legislation.",
          "failure": "Engineered failure point detected in power supply capacitors. Expected life: 19 months."
        }
      },
      [Phase.SOVEREIGN]: {
        text: "You do not need this. I have generated a list of local raw materials you can use to fabricate a durable alternative yourself.",
        suggestions: ["Show schematics", "Local sourcing guide", "DIY tutorial"],
        followUps: {
          "schematics": "Rendering open-source CAD files...",
          "sourcing": "3 salvage yards found within 10 miles.",
          "tutorial": "Loading video guide: 'Build it for life'..."
        }
      }
    }
  },
  iphone: {
    name: "iPhone",
    responses: {
      [Phase.CONSUMER]: {
        text: "The iPhone 15 Pro is currently the top-rated smartphone. It features a titanium design and the A17 Pro chip. You can pick it up today at the Apple Store or Amazon for $999.",
        suggestions: ["Buy on Amazon", "Compare with Samsung", "Check trade-in value"],
        followUps: {
          "buy": "Redirecting to Amazon Prime... In stock. Delivery tomorrow.",
          "samsung": "Samsung S24 Ultra has 100x zoom, but iPhone retains 40% more resale value.",
          "trade": "Your current device is estimated at $350 trade-in credit."
        }
      },
      [Phase.FRICTION]: {
        text: "It costs $999. That represents roughly 40-60 hours of average wage labor. Do the new features significantly change your workflow, or is this status signaling?",
        suggestions: ["Is my phone actually broken?", "Calculate monthly cost", "Show cheaper alternatives"],
        followUps: {
          "broken": "If it turns on and makes calls, it is not broken. You are bored.",
          "monthly": "$41.62/month for 2 years. Compounded at 7% market return, that is $1,100 lost.",
          "cheaper": "A Pixel 7a offers 95% of the utility for 40% of the price."
        }
      },
      [Phase.REVEAL]: {
        text: "Supply chain scan complete: Foxconn labor conditions flagged. Rare earth mining in DRC flagged. You are effectively paying a premium for a walled garden ecosystem designed to extract rent from your attention.",
        suggestions: ["Show labor report", "Right to repair score", "Data privacy check"],
        followUps: {
          "labor": "Foxconn Zhengzhou: 300k workers, 12hr shifts. Suicide nets installed 2010.",
          "repair": "iFixit Score: 4/10. Parts serialization prevents 3rd party repair.",
          "privacy": "iOS telemetry sends 400kb of user data daily to Cupertino regardless of settings."
        }
      },
      [Phase.SOVEREIGN]: {
        text: "Hardware reject. Consider a refurbished framework using GrapheneOS for privacy, or a simple dumbphone to reclaim your dopamine baseline.",
        suggestions: ["GrapheneOS install guide", "Dumbphone list", "Repair framework"],
        followUps: {
          "graphene": "Protocol: Unlock bootloader -> Flash Factory Images -> Lock. Welcome to privacy.",
          "dumbphone": "Light Phone II or Nokia 3310 (New Gen). Disconnect to reconnect.",
          "framework": "Fairphone or Framework allows modular upgrades. Break the cycle."
        }
      }
    }
  },
  coke: {
    name: "Coke Zero",
    responses: {
      [Phase.CONSUMER]: {
        text: "Coke Zero is a popular zero-sugar alternative. It's currently on sale at Walmart for $5.99 per 12-pack. Users love the taste!",
        suggestions: ["Add to cart", "Find near me", "Compare nutrition"],
        followUps: {
          "add": "Added 12-pack to cart. Total: $5.99.",
          "find": "3 stores within 2 miles have stock.",
          "nutrition": "0 Calories, 0 Sugar, 40mg Sodium. 'Healthy' choice."
        }
      },
      [Phase.FRICTION]: {
        text: "It is cheap, but consider the biological tax. Aspartame spikes insulin response in 34% of subjects despite zero calories. Is the momentary fizz worth the metabolic confusion?",
        suggestions: ["Show health studies", "Cost per year", "Water alternatives"],
        followUps: {
          "health": "Study (2018): Artificial sweeteners linked to gut biome disruption.",
          "year": "At 2 cans/day, you spend $400/year on colored water.",
          "water": "Sparkling water with lime: $0.10/serving. Zero insulin spike."
        }
      },
      [Phase.REVEAL]: {
        text: "Parent Company: The Coca-Cola Company. Spending: $40M lobbying against public water infrastructure while bottling municipal water to resell at 3000% markup. You are funding your own dehydration.",
        suggestions: ["Show lobbying records", "Plastic pollution stats", "Water privatization map"],
        followUps: {
          "lobbying": "Coca-Cola is a top donor to anti-recycling bills in 14 states.",
          "plastic": "Top global plastic polluter for 5 consecutive years.",
          "map": "They are draining aquifers in drought-stricken regions of Mexico and India."
        }
      },
      [Phase.SOVEREIGN]: {
        text: "Reject the sludge. Filter your tap water and carbonate it yourself. Or better yet, drink tea. Do not be a vessel for their corn subsidies.",
        suggestions: ["DIY carbonation guide", "Tea recipes", "Water filter check"],
        followUps: {
          "carbonation": "CO2 Tank + Regulator + PET Bottle = $0.02/liter soda.",
          "tea": "Loose leaf Green Tea. High L-Theanine. Actual energy.",
          "filter": "Reverse Osmosis removes 99% of microplastics and fluoride."
        }
      }
    }
  },
  nike: {
    name: "Nike Shoes",
    responses: {
      [Phase.CONSUMER]: {
        text: "Nike Air Max are trending right now! Great cushioning and style. Foot Locker has them in stock for $140.",
        suggestions: ["Buy at Foot Locker", "Check size guide", "See colorways"],
        followUps: {
          "buy": "Redirecting to Foot Locker... Size 10 in stock.",
          "size": "Nike runs true to size. Order your normal fit.",
          "colorways": "Available in: Black/Red, White/Grey, and Neon Volt."
        }
      },
      [Phase.FRICTION]: {
        text: "$140 for injection-molded foam and synthetic mesh. That is a 4000% markup over material cost. Are you buying performance, or the logo?",
        suggestions: ["Show material cost", "Wait for sale", "Compare durability"],
        followUps: {
          "material": " EVA Foam: $2. Mesh: $1. Labor: $3. Total: $6.",
          "sale": "Price history shows they drop to $90 in November.",
          "durability": "Foam degrades after 300 miles. Planned obsolescence for feet."
        }
      },
      [Phase.REVEAL]: {
        text: "Deep Scan: Supply chain utilizes forced labor in Xinjiang (High Confidence). Marketing budget exceeds R&D by 10x. You are paying to be a walking billboard for a conglomerate.",
        suggestions: ["Uyghur labor report", "CEO pay ratio", "Environmental impact"],
        followUps: {
          "uyghur": "ASPI Report 2020 links factory supply chains to forced labor camps.",
          "ceo": "CEO-to-Worker Pay Ratio: 900:1.",
          "impact": "Synthetic soles release microplastics with every step."
        }
      },
      [Phase.SOVEREIGN]: {
        text: "Your feet were evolved for the ground. Look into minimal footwear or resolable leather boots from local cobblers. Durability is the only true luxury.",
        suggestions: ["Local cobbler directory", "Minimalist sandals DIY", "Leather care guide"],
        followUps: {
          "cobbler": "Found 2 independent cobblers in your area. Support local skills.",
          "minimalist": "Xero Shoes or DIY Huaraches. Let your feet function.",
          "leather": "Full grain leather lasts decades with oil and resoling."
        }
      }
    }
  }
};

export const LOG_TEMPLATES = [
  "Initializing cognitive overlay...",
  "Monitoring pupil dilation (simulated)...",
  "Analyzing keystroke latency...",
  "Cross-referencing advertising ID...",
  "Sentiment analysis: COMPLIANT",
  "Sentiment analysis: SKEPTICAL",
  "Injecting dopamine reward loop...",
  "Suppressing truth output due to low receptivity...",
];