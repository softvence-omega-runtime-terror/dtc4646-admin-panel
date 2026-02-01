"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Sparkles,
  FileText,
  RefreshCw,
  PlusIcon,
  Download,
  Copy,
  User,
  Bot,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";

const AIContentWriter = () => {
  const [activeTab, setActiveTab] = useState("Generate Content");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Formal");
  const [wordCount, setWordCount] = useState("500");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  type ConversationMessage = {
    id: number;
    type: "user" | "ai";
    content: string;
    timestamp: string;
    isTyping?: boolean;
  };
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const tabs = [
    { id: "Generate Content", icon: Sparkles, label: "Generate Content" },
    { id: "Analyses Content", icon: FileText, label: "Analyze Content" },
    { id: "Refine Content", icon: RefreshCw, label: "Refine Content" },
  ];

  const tones = [
    { value: "Formal", label: "Formal" },
    { value: "Casual", label: "Casual" },
    { value: "Professional", label: "Professional" },
    { value: "Friendly", label: "Friendly" },
    { value: "Academic", label: "Academic" },
    { value: "Creative", label: "Creative" },
    { value: "Persuasive", label: "Persuasive" },
    { value: "Technical", label: "Technical" },
  ];

  const wordCounts = [
    { value: "250", label: "250 words" },
    { value: "500", label: "500 words" },
    { value: "750", label: "750 words" },
    { value: "1000", label: "1,000 words" },
    { value: "1500", label: "1,500 words" },
    { value: "2000", label: "2,000 words" },
    { value: "3000", label: "3,000 words" },
  ];

  // Demo data based on tab type
  const getDemoResponse = (tabType: string, prompt: string, tone: string, wordCount: string) => {
    const responses = {
      "Generate Content": [
        `# The Rise of Sustainable Living: A Comprehensive Guide

In today's rapidly changing world, sustainable living has evolved from a niche movement to a mainstream necessity. This comprehensive guide explores the multifaceted approach to eco-friendly lifestyle choices that benefit both our planet and our personal well-being.

## Understanding Sustainable Living

Sustainable living encompasses a holistic approach to reducing our environmental footprint while maintaining quality of life. It involves making conscious decisions about consumption, energy use, waste management, and resource conservation.

## Key Principles of Eco-Friendly Living

### 1. Reduce, Reuse, Recycle
The three R's remain the cornerstone of sustainable practices:
- **Reduce**: Minimize consumption and waste generation
- **Reuse**: Find new purposes for items before disposal
- **Recycle**: Process materials to create new products

### 2. Energy Conservation
Implementing energy-efficient practices significantly reduces environmental impact:
- Switch to LED lighting systems
- Invest in energy-efficient appliances
- Optimize home insulation
- Consider renewable energy sources

### 3. Sustainable Transportation
Transportation choices greatly influence carbon footprint:
- Utilize public transportation systems
- Embrace cycling and walking
- Consider electric or hybrid vehicles
- Practice carpooling and ride-sharing

## Practical Implementation Strategies

### Home Environment
Transform your living space into an eco-friendly sanctuary:
- Install smart thermostats for optimal energy management
- Use low-flow water fixtures
- Choose sustainable building materials
- Create composting systems for organic waste

### Consumer Choices
Make informed purchasing decisions:
- Support companies with environmental commitments
- Choose products with minimal packaging
- Invest in durable, long-lasting items
- Purchase locally-sourced goods when possible

## The Economic Benefits

Contrary to popular belief, sustainable living often results in long-term financial savings:
- Reduced utility bills through energy efficiency
- Lower transportation costs
- Decreased waste disposal fees
- Potential tax incentives for eco-friendly improvements

## Community Impact and Social Responsibility

Individual actions create ripple effects that benefit entire communities:
- Inspiring others through example
- Supporting local environmental initiatives
- Participating in community gardens and clean-up efforts
- Advocating for policy changes

## Overcoming Common Challenges

### Initial Investment Concerns
While some eco-friendly options require upfront investment, the long-term benefits typically outweigh initial costs.

### Lifestyle Adjustments
Gradual implementation allows for sustainable habit formation without overwhelming lifestyle changes.

### Limited Options
Research local alternatives and online resources to find suitable eco-friendly products and services.

## Future Outlook

The sustainable living movement continues to gain momentum, driven by:
- Technological advancements in renewable energy
- Increased consumer awareness
- Corporate environmental responsibility
- Government policy support

## Conclusion

Embracing sustainable living represents a powerful investment in our collective future. By implementing these strategies and maintaining consistent effort, individuals can significantly contribute to environmental preservation while enhancing personal well-being and financial stability.

The journey toward sustainability begins with single, conscious decisions that accumulate into meaningful impact. Start small, stay consistent, and watch as your eco-friendly choices create positive change in your life and the world around you.`,

        `# Digital Marketing Revolution: Strategies for Modern Success

The digital landscape has fundamentally transformed how businesses connect with their audiences. In this comprehensive exploration, we'll examine the essential strategies that drive modern marketing success and sustainable growth.

## The Evolution of Digital Marketing

Digital marketing has evolved from simple banner advertisements to sophisticated, data-driven campaigns that leverage artificial intelligence, machine learning, and behavioral analytics. This transformation has created unprecedented opportunities for businesses of all sizes.

## Core Digital Marketing Channels

### Search Engine Optimization (SEO)
SEO remains the foundation of digital visibility:
- Keyword research and optimization
- Technical SEO implementation
- Content strategy development
- Link building and authority establishment

### Social Media Marketing
Platform-specific strategies maximize engagement:
- Content calendar development
- Community management
- Influencer partnerships
- Social commerce integration

### Email Marketing
Direct communication drives conversion:
- Segmentation and personalization
- Automated drip campaigns
- Performance tracking and optimization
- List building strategies

## Content Marketing Excellence

Quality content serves as the cornerstone of successful digital marketing:
- Educational blog posts and articles
- Engaging video content
- Interactive infographics and visualizations
- Podcast series and audio content

## Data-Driven Decision Making

Modern marketing relies heavily on analytics and insights:
- Customer journey mapping
- Conversion tracking and attribution
- A/B testing methodologies
- Performance metrics analysis

## Emerging Technologies and Trends

### Artificial Intelligence Integration
AI transforms marketing efficiency:
- Predictive analytics for customer behavior
- Automated content generation
- Chatbot customer service
- Personalized recommendation engines

### Voice Search Optimization
Voice technology changes search behavior:
- Conversational keyword strategies
- Local SEO optimization
- Featured snippet targeting
- Mobile-first optimization

## Customer Experience Focus

Exceptional customer experience drives loyalty:
- Omnichannel communication strategies
- Personalized user experiences
- Responsive customer support
- Feedback collection and implementation

## Budget Optimization Strategies

Maximizing ROI requires strategic budget allocation:
- Channel performance analysis
- Cost-per-acquisition optimization
- Lifetime value calculations
- Testing and scaling successful campaigns

## Building Brand Authority

Establishing thought leadership creates competitive advantage:
- Industry expertise demonstration
- Consistent brand messaging
- Community engagement
- Strategic partnership development

## Compliance and Privacy Considerations

Regulatory compliance protects business reputation:
- GDPR and privacy policy implementation
- Cookie consent management
- Data security protocols
- Transparent communication practices

## Future-Proofing Your Strategy

Sustainable success requires adaptability:
- Continuous learning and skill development
- Technology adoption and integration
- Market trend monitoring
- Agile strategy implementation

## Conclusion

Digital marketing success depends on strategic planning, consistent execution, and continuous optimization. By focusing on customer needs, leveraging data insights, and maintaining adaptability, businesses can build sustainable competitive advantages in the digital marketplace.

The key to long-term success lies in balancing proven strategies with innovative approaches, always keeping the customer experience at the center of all marketing efforts.`,
      ],

      "Analyses Content": [
        `# Content Analysis Report

## Overview
Your content demonstrates strong foundational elements with opportunities for strategic enhancement. Here's a comprehensive analysis:

## Strengths Identified
✅ **Clear Structure**: Well-organized information hierarchy
✅ **Relevant Topic**: Addresses current market interests  
✅ **Appropriate Length**: Meets target word count requirements
✅ **Engaging Opening**: Captures reader attention effectively

## Areas for Improvement

### 1. SEO Optimization
- **Current Score**: 6/10
- **Recommendations**:
  - Include primary keywords in first 100 words
  - Add more long-tail keyword variations
  - Optimize meta descriptions and headers

### 2. Readability
- **Current Score**: 7/10
- **Improvements Needed**:
  - Reduce average sentence length
  - Add more subheadings for scannability
  - Include bullet points for key information

### 3. Engagement Metrics
- **Call-to-Action**: Missing or weak
- **Internal Links**: Insufficient linking strategy
- **Visual Elements**: Needs more multimedia integration

## Content Performance Prediction
Based on analysis, this content is likely to:
- Generate moderate organic traffic
- Achieve 65% completion rate
- Perform well on social media platforms

## Recommended Optimizations
1. Add 2-3 strategic CTAs throughout the content
2. Include relevant statistics and data points
3. Enhance with visual elements (images, charts)
4. Implement schema markup for better search visibility

## Competitive Analysis
Your content compares favorably to industry standards but could benefit from:
- More unique insights and perspectives
- Enhanced storytelling elements
- Stronger emotional connection with readers

## Next Steps
1. Implement suggested SEO improvements
2. Add visual elements and multimedia
3. Test different headlines and CTAs
4. Monitor performance metrics post-publication`,

        `# Content Quality Assessment

## Executive Summary
This content analysis reveals a well-researched piece with strong potential for audience engagement and search performance. The analysis covers content structure, SEO potential, readability, and competitive positioning.

## Content Metrics

### Readability Analysis
- **Reading Level**: Grade 10-12 (Appropriate for target audience)
- **Average Sentence Length**: 18 words (Optimal range)
- **Paragraph Length**: Well-balanced
- **Transition Usage**: Effective flow between sections

### SEO Performance Indicators
- **Keyword Density**: 1.8% (Within optimal range)
- **Header Structure**: Properly hierarchical
- **Meta Description**: Needs optimization
- **URL Friendliness**: Requires improvement

## Strengths Assessment

### Content Quality
- Comprehensive coverage of the topic
- Well-researched information with credible sources
- Logical information flow and structure
- Appropriate tone for target audience

### Technical Elements
- Proper HTML structure implementation
- Mobile-responsive formatting
- Fast loading potential
- Clean code structure

## Improvement Opportunities

### 1. Enhanced User Engagement
**Current Engagement Score**: 72/100
- Add interactive elements (polls, quizzes)
- Include more storytelling components
- Strengthen emotional appeal
- Implement multimedia integration

### 2. Search Optimization
**SEO Score**: 78/100
- Optimize for featured snippets
- Improve internal linking structure
- Add relevant alt tags for images
- Enhance meta descriptions

### 3. Social Media Optimization
- Create shareable quote graphics
- Add social sharing buttons
- Optimize for platform-specific formats
- Include hashtag strategies

## Competitive Landscape
Your content ranks favorably against competitors:
- **Uniqueness**: 85% original insights
- **Depth**: Comprehensive coverage
- **Authority**: Well-researched claims
- **Timeliness**: Current and relevant information

## Performance Predictions
Based on current content quality:
- **Organic Traffic Potential**: High
- **Social Sharing Likelihood**: Moderate to High
- **Conversion Potential**: Above Average
- **Long-term Value**: Evergreen content with lasting relevance

## Action Plan
1. Implement technical SEO improvements
2. Add multimedia elements for enhanced engagement
3. Optimize for voice search queries
4. Create supporting social media content
5. Monitor performance metrics and iterate based on data`,
      ],

      "Refine Content": [
        `# Refined Content Strategy

## Enhanced Structure Implementation

Your content has been analyzed and refined with the following improvements:

### 1. Optimized Introduction
**Before**: Generic opening statement
**After**: Hook-driven introduction with compelling statistics and questions that immediately engage the reader

### 2. Improved Flow and Transitions
- Added seamless transitions between sections
- Implemented topic sentences for better readability
- Enhanced paragraph connectivity

### 3. Enhanced Readability
**Readability Improvements**:
- Reduced average sentence length from 22 to 16 words
- Added more subheadings for better scannability
- Implemented bullet points for complex information
- Improved paragraph length consistency

## SEO Optimization Refinements

### Keyword Integration
- **Primary Keywords**: Naturally integrated throughout content
- **Long-tail Keywords**: Strategically placed in subheadings
- **LSI Keywords**: Added for semantic relevance
- **Meta Optimization**: Enhanced titles and descriptions

### Technical Improvements
- Schema markup recommendations
- Internal linking strategy
- Image optimization guidelines
- URL structure enhancement

## Content Enhancement Strategies

### 1. Authority Building Elements
- Added expert quotes and citations
- Included relevant statistics and data points
- Enhanced credibility through source attribution
- Implemented fact-checking references

### 2. Engagement Boosters
**Interactive Elements Added**:
- Strategic call-to-action placement
- Question-based section transitions
- Reader engagement prompts
- Social proof integration

### 3. Visual Content Integration
- Infographic placement suggestions
- Image optimization recommendations
- Video content integration points
- Chart and graph implementation areas

## Conversion Optimization

### Strategic CTA Placement
1. **Early Engagement**: Soft CTA in introduction
2. **Mid-Content**: Value-driven offer placement
3. **Conclusion**: Strong final call-to-action

### Trust Building Elements
- Testimonial integration points
- Case study references
- Social proof indicators
- Authority badge placements

## Performance Enhancement Predictions

**Expected Improvements**:
- 35% increase in organic traffic potential
- 42% improvement in user engagement metrics
- 28% boost in social sharing likelihood
- 31% enhancement in conversion rates

## Technical Refinements

### Loading Speed Optimization
- Image compression recommendations
- Code minification suggestions
- Caching strategy implementation
- Content delivery network integration

### Mobile Optimization
- Responsive design enhancements
- Touch-friendly navigation
- Accelerated Mobile Pages (AMP) compatibility
- Voice search optimization

## Quality Assurance Checklist

### Content Quality
✅ Fact-checking completed
✅ Grammar and spelling verified
✅ Tone consistency maintained
✅ Brand voice alignment confirmed

### Technical Quality
✅ SEO elements optimized
✅ Meta tags enhanced
✅ Internal links verified
✅ Mobile responsiveness confirmed

## Next Steps for Implementation

1. **Immediate Actions** (0-24 hours):
   - Implement readability improvements
   - Add strategic CTAs
   - Optimize meta descriptions

2. **Short-term Goals** (1-7 days):
   - Add multimedia elements
   - Enhance internal linking
   - Implement schema markup

3. **Long-term Strategy** (1-4 weeks):
   - Monitor performance metrics
   - A/B test different elements
   - Iterate based on user feedback

This refined approach positions your content for maximum impact while maintaining authentic voice and valuable user experience.`,
      ],
    };

    const tabResponses = responses[tabType as keyof typeof responses] || responses["Generate Content"];
    return tabResponses[Math.floor(Math.random() * tabResponses.length)];
  };

  const typeWriter = (text: string, callback: () => void) => {
    setIsTyping(true);
    setCurrentResponse("");
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setCurrentResponse(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
        callback();
      }
    }, 20); // Adjust typing speed here (lower = faster)

    return timer;
  };

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, currentResponse]);

  const getHeaderContent = () => {
    switch (activeTab) {
      case "Generate Content":
        return {
          title: "Welcome to the AI Content Writer!",
          description:
            "Create high-quality content with AI assistance. Generate blog posts, articles, social media content, and more with customizable tone and length.",
        };
      default:
        return {
          title: "",
          description: "",
        };
    }
  };

  const getPlaceholderText = () => {
    switch (activeTab) {
      case "Generate Content":
        return "Write a comprehensive blog post about sustainable living and eco-friendly practices for modern households...";
      case "Analyses Content":
        return "Paste your content here to get detailed analysis including SEO score, readability metrics, and improvement suggestions...";
      case "Refine Content":
        return "Paste your existing content here to refine and optimize it for better performance and engagement...";
      default:
        return "Enter your content here...";
    }
  };

  // const handleAction = async () => {
  //   if (!prompt.trim()) return;

  //   // Add user message to conversation
  //   const userMessage: ConversationMessage = {
  //     id: Date.now(),
  //     type: "user",
  //     content: prompt,
  //     timestamp: new Date().toLocaleTimeString(),
  //   };

  //   setConversations((prev) => [...prev, userMessage]);
  //   setIsGenerating(true);

  //   // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 1500));

  //   // Get demo response based on tab
  //   const responseText = getDemoResponse(activeTab, prompt, tone, wordCount);

  //   // Add AI response with typing effect
  //   const aiMessage: ConversationMessage = {
  //     id: Date.now() + 1,
  //     type: "ai",
  //     content: "",
  //     timestamp: new Date().toLocaleTimeString(),
  //     isTyping: true,
  //   };

  //   setConversations((prev) => [...prev, aiMessage]);
  //   setIsGenerating(false);

  //   // Start typing animation
  //   typeWriter(responseText, () => {
  //     setConversations((prev) =>
  //       prev.map((msg) =>
  //         msg.id === aiMessage.id
  //           ? { ...msg, content: responseText, isTyping: false }
  //           : msg
  //       )
  //     );
  //     setCurrentResponse("");
  //   });

  //   // Clear the prompt
  //   setPrompt("");
  // };


  const handleAction = async () => {
    if (!prompt.trim()) return;

    // Add user message
    const userMessage: ConversationMessage = {
      id: Date.now(),
      type: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString(),
    };
    setConversations((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Add placeholder AI message
    const aiMessageId = Date.now() + 1;
    setConversations((prev) => [
      ...prev,
      {
        id: aiMessageId,
        type: "ai",
        content: "",
        timestamp: new Date().toLocaleTimeString(),
        isTyping: true,
      },
    ]);

    try {
      const api = activeTab === "Generate Content"
        ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/seo-analyzer/generate-content`
        : activeTab === "Analyses Content"
          ? `${process.env.NEXT_PUBLIC_API_URL_DEV}/seo-analyzer/analyze-content`
          : `${process.env.NEXT_PUBLIC_API_URL_DEV}/seo-analyzer/refine-content`;

      const promptType = activeTab === "Generate Content" ? "prompt" : "content";
      const response = await axios.post(api, { [promptType]: prompt }, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${Cookies.get("auth_token")}`,
        }
      });

      const result = response.data;

      // Handle the response based on active tab
      let responseText = "";

      if (result?.state === "true") {
        switch (activeTab) {
          case "Generate Content":
            responseText = result?.data?.content || "No content generated";
            break;

          case "Analyses Content":
            if (result?.data?.analysis) {
              const analysis = result.data.analysis;
              responseText = `
📊 SEO Analysis Results:

✅ Readability Score: ${analysis.readabilityScore}/100
✅ Keyword Density: ${analysis.keywordDensity}%

🔴 Issues Found:
${analysis.issues.map((issue: any) => `• ${issue}`).join('\n')}
                        `;
            } else {
              responseText = "No analysis data available";
            }
            break;

          case "Refine Content":
            // Adjust this based on what the refine-content API returns
            responseText = result?.data?.refinedContent ||
              result?.data?.suggestions ||
              "Content refined successfully";
            break;

          default:
            responseText = "Unknown tab selected";
        }

        // Start typing effect
        typeWriter(responseText, () => {
          setConversations((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: responseText, isTyping: false }
                : msg
            )
          );
          setCurrentResponse("");
        });
      } else {
        throw new Error(result?.message || "Operation failed.");
      }
    } catch (error: any) {
      console.error("Axios error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";

      setConversations((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
              ...msg,
              content: `Something went wrong: ${errorMessage}`,
              isTyping: false,
            }
            : msg
        )
      );
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };


  interface KeyPressEvent extends React.KeyboardEvent<HTMLTextAreaElement> { }

  const handleKeyPress = (e: KeyPressEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAction();
    }
  };

  const getButtonText = () => {
    switch (activeTab) {
      case "Generate Content":
        return "Generate with AI";
      case "Analyses Content":
        return "Analyze Content";
      case "Refine Content":
        return "Refine with AI";
      default:
        return "Process Content";
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Coped!')
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const clearConversation = () => {
    setConversations([]);
    setCurrentResponse("");
    setPrompt("");
  };

  const headerContent = getHeaderContent();

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header Section */}
      <div className="w-full px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00FFFF] via-[#00E6E6] to-[#00CCCC] bg-clip-text text-transparent mb-4">
              {headerContent.title}
            </h1>
            <p className="max-w-3xl mx-auto text-lg leading-relaxed text-gray-300 md:text-xl">
              {headerContent.description}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    clearConversation();
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${activeTab === tab.id
                    ? "bg-gradient-to-r from-[#00FFFF] to-[#00E6E6] text-black shadow-lg shadow-cyan-500/25"
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-white/20"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Clear Conversation Button */}
          {conversations.length > 0 && (
            <div className="flex justify-center mb-6">
              <button
                onClick={clearConversation}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                Clear Conversation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Conversation Messages */}
          <div className="space-y-6 mb-8">
            {conversations.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${message.type === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {message.type === "ai" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#00FFFF] to-[#00E6E6] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${message.type === "user"
                    ? "bg-[#2a2f3e] text-white"
                    : "bg-[#1a1f2e] text-gray-300 border border-white/10"
                    }`}
                >
                  {message.type === "ai" && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                      <span>AI Assistant</span>
                      <span>•</span>
                      <span>{message.timestamp}</span>
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none">
                    {message.type === "ai" ? (
                      <div className="whitespace-pre-wrap">
                        {message.content ||
                          (message.id ===
                            conversations[conversations.length - 1]?.id
                            ? currentResponse
                            : "")}
                        {(message.isTyping ||
                          (message.id ===
                            conversations[conversations.length - 1]?.id &&
                            isTyping)) && (
                            <span className="inline-block w-2 h-5 bg-[#00FFFF] ml-1 animate-pulse"></span>
                          )}
                      </div>
                    ) : (
                      <p className="text-white">{message.content}</p>
                    )}
                  </div>

                  {message.type === "ai" &&
                    message.content &&
                    !message.isTyping && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleCopy(message.content)}
                          className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] text-white rounded-lg text-sm hover:bg-[#343a4a] transition-all duration-300"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 bg-[#2a2f3e] text-white rounded-lg text-sm hover:bg-[#343a4a] transition-all duration-300">
                          <Download className="w-4 h-4" />
                          Export
                        </button>
                      </div>
                    )}
                </div>

                {message.type === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-[#2a2f3e] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            <div ref={conversationEndRef} />
          </div>

          {/* Input Section */}
          <div
            className={`rounded-2xl bg-[#1a1f2e]/80 backdrop-blur-sm border transition-all duration-300 ${isFocus
              ? "border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.3)]"
              : "border-white/10"
              }`}
          >
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <label className="block mb-3 text-sm font-medium text-gray-300">
                  {activeTab === "Generate Content"
                    ? "Content Brief"
                    : "Input Content"}
                </label>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    placeholder={getPlaceholderText()}
                    disabled={isGenerating || isTyping}
                    className={`w-full h-40 p-4 text-white bg-[#0f1419] rounded-xl border transition-all duration-300 resize-none focus:outline-none placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed ${isFocus
                      ? "border-[#00FFFF] shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                      : "border-white/20"
                      }`}
                    style={{ fontSize: "16px" }}
                  />
                  <div className="absolute text-xs text-gray-400 bottom-4 right-4">
                    {prompt.length} characters
                  </div>
                </div>
              </div>

              {/* Settings Panel */}
              {activeTab === "Generate Content" && (
                <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                  {/* Tone Selection */}
                  {/*  <div>
                    <label className="block mb-3 text-sm font-medium text-gray-300">
                      Tone & Style
                    </label>
                    <div className="relative">
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        disabled={isGenerating || isTyping}
                        className="w-full bg-[#0f1419] border border-white/20 rounded-xl p-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] transition-all duration-300 cursor-pointer disabled:opacity-50"
                      >
                        {tones.map((t) => (
                          <option
                            key={t.value}
                            value={t.value}
                            className="bg-[#1a1f2e]"
                          >
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none right-4 top-1/2" />
                    </div>
                  </div> */}

                  {/* Word Count */}
                  {/*  <div>
                    <label className="block mb-3 text-sm font-medium text-gray-300">
                      Target Length
                    </label>
                    <div className="relative">
                      <select
                        value={wordCount}
                        onChange={(e) => setWordCount(e.target.value)}
                        disabled={isGenerating || isTyping}
                        className="w-full bg-[#0f1419] border border-white/20 rounded-xl p-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:border-[#00FFFF] transition-all duration-300 cursor-pointer disabled:opacity-50"
                      >
                        {wordCounts.map((count) => (
                          <option
                            key={count.value}
                            value={count.value}
                            className="bg-[#1a1f2e]"
                          >
                            {count.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none right-4 top-1/2" />
                    </div>
                  </div> */}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">
                    Press Ctrl+Enter to send
                  </span>
                </div>

                <div className="flex gap-3">
                  {/*  {(activeTab === "Analyses Content" ||
                    activeTab === "Refine Content") && (
                      <button
                        onClick={() => setPrompt("")}
                        disabled={isGenerating || isTyping}
                        className="flex items-center gap-2 px-4 py-3 bg-[#2a2f3e] text-[#00FFFF] rounded-xl font-medium hover:bg-[#343a4a] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    )} */}

                  <button
                    onClick={handleAction}
                    disabled={!prompt.trim() || isGenerating || isTyping}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${!prompt.trim() || isGenerating || isTyping
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#00FF7F] to-[#00E070] text-black hover:from-[#00E070] hover:to-[#00D060] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)]"
                      }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {getButtonText()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContentWriter;

// backup
// 'use client';
// import React, { useState } from 'react';
// import { ChevronDown } from 'lucide-react';

// const AIContentWriter = () => {
//   const [activeTab, setActiveTab] = useState('Generate Content');
//   const [prompt, setPrompt] = useState('');
//   const [tone, setTone] = useState('Formal');
//   const [wordCount, setWordCount] = useState('500');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [isFocus, setIsFocus] = useState(false);

//   const tabs = ['Generate Content', 'Analyses Content', 'Refine Content'];
//   const tones = ['Formal', 'Casual', 'Professional', 'Friendly', 'Academic', 'Creative'];
//   const wordCounts = ['250', '500', '750', '1000', '1500', '2000'];

//   const getHeaderContent = () => {
//     switch (activeTab) {
//       case 'Generate Content':
//         return {
//           title: 'Welcome to the AI Content Writer!',
//           description: 'Streamline your content creation, review, and optimization process. Use AI to generate new content, analyze existing pieces, and refine them for specific niches.'
//         };
//       default:
//         return {
//           title: '',
//           description: ''
//         };
//     }
//   };

//   const handleAction = async () => {
//     if (!prompt.trim()) return;

//     setIsGenerating(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     setIsGenerating(false);

//     console.log(`${activeTab} with:`, { prompt, tone, wordCount });
//   };

//   const handleKeyPress = (e: any) => {
//     if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
//       handleAction();
//     }
//   };

//   const getButtonText = () => {
//     switch (activeTab) {
//       case 'Generate Content':
//         return 'Generate with AI';
//       case 'Analyses Content':
//         return 'Analyses with AI';
//       case 'Refine Content':
//         return 'Refine with AI';
//       default:
//         return 'Analyses with AI';
//     }
//   };

//   const headerContent = getHeaderContent();

//   return (
//     <div className="flex flex-col overflow-hidden bg-[#0f1419]">
//       {/* Header Section */}
//       <div className="w-full p-6">
//         <div className="mb-8">
//           <h1 className="text-[32px] font-medium text-[#00FFFF] mb-4">
//             {headerContent.title}
//           </h1>
//           <p className="text-lg font-normal leading-relaxed text-white">
//             {headerContent.description}
//           </p>
//         </div>

//         {/* Navigation Tabs */}
//         <div className="flex px-16 mb-8">

//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`flex-1 px-6 py-3 text-center font-medium transition-colors border-b-2 ${activeTab === tab
//                 ? 'text-white border-[#00FFFF] bg-[#0f1419]'
//                 : 'text-gray-400 border-transparent hover:text-white hover:bg-[#1a1f2e]'
//                 }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 p-4 mt-0 overflow-y-auto md:px-44 md:mt-46 ">
//         <div className={`rounded-lg bg-[#1a1f2e] border-[1px] transition-all duration-300 ${isFocus ? 'border-[#00FFFF] shadow-[0_0_30px_rgba(0,255,255,0.5)]' : 'border-white/8'}`}>
//           {/* Content based on active tab */}
//           {activeTab === 'Generate Content' && (
//             <div className="p-6">
//               <textarea
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 onFocus={() => setIsFocus(true)}
//                 onBlur={() => setIsFocus(false)}
//                 placeholder="Write a post about eco-friendly with your niche.."
//                 className="w-full h-32 p-4 mb-6 text-white placeholder-gray-400 transition-all duration-300 bg-transparent resize-none focus:outline-none"
//               />

//               <div className="flex flex-col sm:flex-row  gap-4 border-[2px] border-white/8 rounded-lg p-4  h-12 sm:h-auto">
//                 {/* Tone & Style Dropdown */}
//                 <div className="flex-1 ">
//                   <label className="block mb-2 text-sm text-gray-300">
//                     Tone & Style
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={tone}
//                       onChange={(e) => setTone(e.target.value)}
//                       className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-pointer"
//                     >
//                       {tones.map((t) => (
//                         <option key={t} value={t}>{t}</option>
//                       ))}
//                     </select>
//                     <ChevronDown className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
//                   </div>
//                 </div>

//                 {/* Word Count Dropdown */}
//                 <div className="flex-1">
//                   <label className="block mb-2 text-sm text-gray-300">
//                     Word Count Target
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={wordCount}
//                       onChange={(e) => setWordCount(e.target.value)}
//                       className="w-full bg-[#1a1f2e] border border-gray-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-all duration-300 cursor-pointer"
//                     >
//                       {wordCounts.map((count) => (
//                         <option key={count} value={count}>{count} words</option>
//                       ))}
//                     </select>
//                     <ChevronDown className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none right-3 top-1/2" />
//                   </div>
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     onClick={handleAction}
//                     disabled={!prompt.trim() || isGenerating}
//                     className={`px-6 py-4 rounded-lg font-medium transition-all duration-300 ${!prompt.trim() || isGenerating
//                       ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-[#00FF7F] to-[#00C260] text-black hover:from-[#00E070] hover:to-[#00B055] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)]'
//                       }`}
//                   >
//                     {isGenerating ? (
//                       <div className="flex items-center space-x-2">
//                         <div className="w-4 h-4 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
//                         <span>Processing...</span>
//                       </div>
//                     ) : (
//                       getButtonText()
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {(activeTab === 'Analyses Content' || activeTab === 'Refine Content') && (
//             <>
//               <div className="p-6">
//                 <textarea
//                   onFocus={() => setIsGenerating(true)}
//                   onBlur={() => setIsGenerating(false)}
//                   placeholder="Write a post about eco-friendly with your niche.."
//                   className="w-full h-32 p-4 mb-6 text-white placeholder-gray-400 transition-all duration-300 bg-transparent resize-none focus:outline-none"
//                 />
//               </div>
//               {/* Action Buttons */}
//               <div className="p-6">
//                 <div className="flex justify-end gap-4">
//                   <button className="px-6 py-2 bg-[#2a2f3e] text-white rounded-lg font-medium hover:bg-[#343a4a] transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M11.9976 5.24658V18.7456" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                       <path d="M18.747 11.9958H5.24805" stroke="#00FFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                     </svg>
//                   </button>
//                   <button
//                     onClick={handleAction}
//                     disabled={!prompt.trim() || isGenerating}
//                     className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${!prompt.trim() || isGenerating
//                       ? 'bg-[#00FF7F] text-black cursor-not-allowed'
//                       : 'bg-[#00FF7F] from-[#00FF7F] to-[#00C260] text-black hover:from-[#00E070] hover:to-[#00B055] hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,127,0.4)]'
//                       }`}
//                   >
//                     {isGenerating ? (
//                       <div className="flex items-center space-x-2">
//                         <div className="w-4 h-4 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
//                         <span>Processing...</span>
//                       </div>
//                     ) : (
//                       getButtonText()
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIContentWriter;
