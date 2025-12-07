
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from './components/Layout.tsx';
import { ViewState, ToolType, ToolConfig, GeneratedResult, BlogPost } from './types.ts';
import * as GeminiService from './services/geminiService.ts';
import { Chat } from "@google/genai";

// --- TOOL CONFIGURATIONS ---
const TOOLS: ToolConfig[] = [
  {
    id: ToolType.SHORTS_GENERATOR,
    name: "Shorts Viral Lab",
    description: "Generate viral ideas, punchy titles & tags specifically for Shorts.",
    icon: "fa-mobile-screen",
    color: "text-red-500",
    buttonText: "Create Shorts Strategy",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.TAG_GENERATOR,
    name: "YouTube Tag Generator",
    description: "Generate SEO-optimized tags for your videos (max 500 chars).",
    icon: "fa-tags",
    color: "text-red-500",
    buttonText: "Generate Tags",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.GROWTH_KIT,
    name: "Growth & Utility Kit",
    description: "Essential tools: Title Case, Keyword Density, Emojis & Readability.",
    icon: "fa-screwdriver-wrench",
    color: "text-teal-400",
    buttonText: "Analyze / Convert",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.AI_CHAT_ASSISTANT,
    name: "AI YouTube Coach",
    description: "Chat with an advanced AI expert about your channel strategy.",
    icon: "fa-comments",
    color: "text-indigo-400",
    buttonText: "Start Chat",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.CONTENT_ANALYZER,
    name: "SEO Rank Analyzer",
    description: "Check your video's SEO score based on title, description, and tags.",
    icon: "fa-chart-line",
    color: "text-cyan-400",
    buttonText: "Analyze SEO Score",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.TREND_RESEARCHER,
    name: "Trend Researcher",
    description: "Use Google Search data to find the latest trending topics.",
    icon: "fa-magnifying-glass-chart",
    color: "text-orange-400",
    buttonText: "Find Trends",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.THUMBNAIL_GENERATOR,
    name: "Pro Thumbnail Creator",
    description: "Generate high-quality visuals with custom aspect ratios (16:9, etc).",
    icon: "fa-palette",
    color: "text-pink-500",
    buttonText: "Generate Image",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.TEXT_TO_SPEECH,
    name: "Voiceover Generator",
    description: "Convert your scripts into lifelike AI speech instantly.",
    icon: "fa-microphone-lines",
    color: "text-emerald-400",
    buttonText: "Generate Audio",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.INSTANT_IDEAS,
    name: "Instant Ideas (Fast)",
    description: "Get lightning-fast titles and tags using the Flash-Lite model.",
    icon: "fa-bolt",
    color: "text-yellow-300",
    buttonText: "Get Fast Ideas",
    promptTemplate: (t) => t,
    isNew: true
  },
  {
    id: ToolType.TITLE_GENERATOR,
    name: "Viral Title Generator",
    description: "Generate high-CTR, click-worthy titles for your next video.",
    icon: "fa-heading",
    color: "text-blue-400",
    buttonText: "Generate Titles",
    promptTemplate: (t) => t
  },
  {
    id: ToolType.HASHTAG_GENERATOR,
    name: "Hashtag Generator",
    description: "Find trending hashtags to boost your discoverability.",
    icon: "fa-hashtag",
    color: "text-pink-400",
    buttonText: "Get Hashtags",
    promptTemplate: (t) => t
  },
  {
    id: ToolType.DESCRIPTION_GENERATOR,
    name: "Description Writer",
    description: "Create SEO-optimized descriptions with timestamps.",
    icon: "fa-align-left",
    color: "text-green-400",
    buttonText: "Write Description",
    promptTemplate: (t) => t
  },
  {
    id: ToolType.SCRIPT_OUTLINE,
    name: "Video Script Writer",
    description: "Get a structured script outline to keep content engaging.",
    icon: "fa-scroll",
    color: "text-yellow-400",
    buttonText: "Create Script",
    promptTemplate: (t) => t
  }
];

// --- BLOG DATA (EXTENSIVE SEO CONTENT WITH IMAGES) ---
const BLOG_POSTS: BlogPost[] = [
  {
    id: 'guide-youtube-tag-generator',
    title: 'Free YouTube Tag Generator: Rank #1 in 2024',
    excerpt: 'Stop guessing keywords. Use our free AI-powered Tag Generator to find high-volume, low-competition tags that boost your video SEO instantly.',
    date: 'Oct 28, 2024',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>Why YouTube Tags Still Matter in 2024</h2>
      <p>A common misconception among creators is that "Tags are dead." While YouTube has stated that tags are less critical for discovery than they were in 2015, they remain a <strong>crucial metadata signal</strong>, especially for:</p>
      <ul>
        <li><strong>Misspelled Searches:</strong> Helping the algorithm link "Forntite" to "Fortnite".</li>
        <li><strong>Contextual Relevance:</strong> Helping the AI understand the semantic context of your video (e.g., is "Jaguar" the car or the animal?).</li>
        <li><strong>Sidebar Suggestions:</strong> Influencing which videos yours appears next to.</li>
      </ul>

      <h3>How to Use Our Free Tag Generator</h3>
      <p>Our tool uses the latest Gemini AI models to analyze millions of data points. Here is how to get the best results:</p>
      <ol>
        <li><strong>Enter Your Main Keyword:</strong> Be specific. Instead of just "Cooking", try "Easy vegan cooking for beginners".</li>
        <li><strong>Copy the Tags:</strong> We generate a comma-separated list ready to paste directly into YouTube Studio.</li>
        <li><strong>Don't Overstuff:</strong> YouTube allows 500 characters. Our tool optimizes for this limit, prioritizing the highest-value keywords first.</li>
      </ol>

      <h3>Advanced Strategy: The "Mix" Method</h3>
      <p>For maximum reach, your tags should follow the <strong>Broad-Niche-Specific</strong> formula:</p>
      <ul>
        <li><strong>Broad:</strong> "Gaming", "Minecraft" (High volume, hard to rank)</li>
        <li><strong>Niche:</strong> "Minecraft Survival Guide" (Medium volume)</li>
        <li><strong>Specific:</strong> "How to survive first night in Minecraft 1.20" (Low volume, easy to rank)</li>
      </ul>
      <p>Use our <a href="#" class="text-yt-red hover:underline">Tag Generator Tool</a> now to build this perfect mix automatically.</p>
    `
  },
  {
    id: 'guide-shorts-viral-lab',
    title: 'How to Go Viral on YouTube Shorts: The Ultimate Strategy',
    excerpt: 'Shorts are the fastest way to grow a channel today. Learn how to use our Viral Lab to generate hooks, titles, and ideas that keep viewers swiping.',
    date: 'Oct 27, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The Psychology of a Viral Short</h2>
      <p>YouTube Shorts isn't just about being lucky; it's about <strong>retention</strong>. The algorithm promotes videos that people watch >100% of (looping).</p>
      
      <h3>The 3-Second Rule</h3>
      <p>You have less than 3 seconds to stop the scroll. Our <strong>Shorts Viral Lab</strong> tool generates "Hooks" specifically designed to grab attention immediately. Examples of strong hooks include:</p>
      <ul>
        <li>"You won't believe what happens next..."</li>
        <li>"Stop doing this mistake..."</li>
        <li>"Here is the secret to..."</li>
      </ul>

      <h3>Optimizing for Mobile SEO</h3>
      <p>Titles on Shorts are often cut off. You need punchy, short titles (under 50 chars). Our tool analyzes your niche and suggests titles that fit perfectly on a vertical screen.</p>
      
      <h3>Hashtag Strategy for Shorts</h3>
      <p>Unlike long-form videos, Shorts rely heavily on broad hashtags like #Shorts, #FYP, and #Viral. Our tool automatically blends these mandatory tags with your niche-specific keywords to maximize discoverability in the Shorts Feed.</p>
    `
  },
  {
    id: 'guide-thumbnail-generator',
    title: 'AI Thumbnail Generator: Double Your CTR (Click-Through Rate)',
    excerpt: 'Your video is worthless if nobody clicks. Learn how to design thumbnails that trigger curiosity and emotion using AI.',
    date: 'Oct 26, 2024',
    readTime: '12 min read',
    image: 'https://images.unsplash.com/photo-1626785774573-4b79931256bb?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The 90% Rule of YouTube</h2>
      <p>MrBeast, the world's biggest YouTuber, says that 90% of the effort should go into the title and thumbnail. If you have a 10/10 video but a 1/10 thumbnail, you get 0 views.</p>

      <h3>Key Elements of a High-CTR Thumbnail</h3>
      <ol>
        <li><strong>Emotion:</strong> Faces with strong emotions (shock, joy, anger) draw the eye naturally.</li>
        <li><strong>Contrast:</strong> Bright colors on dark backgrounds (or vice versa) stand out in "Dark Mode" which most users use.</li>
        <li><strong>Less Text:</strong> Never repeat the title. Use 2-3 words max (e.g., "IT FAILED!" or "DON'T BUY").</li>
      </ol>

      <h3>How Our AI Generator Works</h3>
      <p>Our <strong>Pro Thumbnail Creator</strong> uses the advanced Gemini 3 Pro Vision model. It understands composition rules. You can ask it for:</p>
      <ul>
        <li>"A shocked gamer looking at a glowing computer screen, cyberpunk style"</li>
        <li>"A delicious burger close up, high contrast, 4k food photography"</li>
      </ul>
      <p>Stop using generic stock photos. Create unique, branded imagery that sets your channel apart.</p>
    `
  },
  {
    id: 'guide-ai-chat-coach',
    title: 'Meet Your New 24/7 YouTube Coach (AI Assistant)',
    excerpt: 'Stuck on ideas? confused by analytics? Our AI YouTube Coach is trained on millions of data points to guide your channel growth.',
    date: 'Oct 25, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>Why You Need a Channel Strategy</h2>
      <p>Uploading random videos is the fastest way to fail. You need a strategy. Usually, hiring a YouTube consultant costs $100s per hour. We made it free.</p>

      <h3>What Can You Ask the AI Coach?</h3>
      <p>Our <strong>AI Chat Assistant</strong> isn't a generic chatbot. It has been system-prompted to act as a YouTube Expert. Try asking:</p>
      <ul>
        <li>"My CTR is 2.5%, how can I improve it?"</li>
        <li>"Analyze my channel niche 'Tech Reviews' and suggest 5 gap topics nobody is covering."</li>
        <li>"Roast my latest video idea."</li>
      </ul>

      <h3>Data-Driven Decisions</h3>
      <p>The AI can help you interpret your YouTube Studio analytics. If you tell it "My retention drops at 0:30", it will likely tell you that your intro is too long or you didn't deliver on the title's promise quickly enough.</p>
    `
  },
  {
    id: 'guide-seo-rank-analyzer',
    title: 'How to Audit Your Video SEO for Free',
    excerpt: 'Is your video dead on arrival? Use our SEO Rank Analyzer to check your metadata before you hit publish.',
    date: 'Oct 24, 2024',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The 3 Pillars of Video SEO</h2>
      <p>Search Engine Optimization for YouTube comes down to three things:</p>
      <ol>
        <li><strong>Relevance:</strong> Do your Title, Description, and Tags match the search intent?</li>
        <li><strong>Authority:</strong> Does your channel have a history of covering this topic?</li>
        <li><strong>Engagement:</strong> Do people click (CTR) and watch (AVD)?</li>
      </ol>

      <h3>Using the Content Analyzer</h3>
      <p>Our tool focuses on the first pillar: <strong>Relevance</strong>. By pasting your Title, Description, and Keyword, we simulate how the YouTube algorithm "reads" your video.</p>
      
      <h3>Understanding Your Score</h3>
      <ul>
        <li><strong>0-40 (Critical Issues):</strong> Missing keywords in title/desc. Description too short.</li>
        <li><strong>41-70 (Average):</strong> Basics are there, but not optimized. Maybe the title is too long or lacks power words.</li>
        <li><strong>71-100 (Optimized):</strong> Perfect keyword placement. Good density. Ready to publish!</li>
      </ul>
      <p>Don't publish blind. Audit every single video to maximize your chances of ranking.</p>
    `
  },
  {
    id: 'guide-trend-researcher',
    title: 'How to Find Trending Topics Before Your Competitors',
    excerpt: 'Speed is everything. Learn how to use our Trend Researcher to tap into real-time Google Search data.',
    date: 'Oct 23, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>Newsjacking: The Secret Weapon</h2>
      <p>"Newsjacking" is the art of creating content around breaking news. When a topic is trending, search volume explodes, and YouTube has no content to show. This is your opportunity.</p>

      <h3>How the Trend Researcher Works</h3>
      <p>Unlike other AI tools that are cut off from the internet, our <strong>Trend Researcher</strong> connects directly to Google Search. It finds:</p>
      <ul>
        <li>Latest news articles from the last 24 hours.</li>
        <li>Breakout search queries.</li>
        <li>Current public sentiment.</li>
      </ul>

      <h3>Example Workflow</h3>
      <ol>
        <li>Search for your niche (e.g., "iPhone").</li>
        <li>Tool reveals "iPhone 16 leak rumors" is trending today.</li>
        <li>Use our <strong>Title Generator</strong> to write a title about this trend.</li>
        <li>Film and upload while the wave is rising.</li>
      </ol>
    `
  },
  {
    id: 'guide-title-generator',
    title: 'Viral Title Generator: Write Headlines That Get Clicks',
    excerpt: 'A boring title is a death sentence for your video. Learn the formulas used by top creators to generate intrigue.',
    date: 'Oct 22, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>Title Formulas That Work</h2>
      <p>Top creators don't reinvent the wheel. They use proven psychological triggers.</p>
      <ul>
        <li><strong>Negativity Bias:</strong> "Why I Stopped Using X..." (People are afraid of mistakes).</li>
        <li><strong>Authority/Listicle:</strong> "7 Secrets Experts Won't Tell You..."</li>
        <li><strong>Curiosity Gap:</strong> "I Tried X, and This Happened..."</li>
      </ul>

      <h3>Optimizing for Mobile</h3>
      <p>Did you know 70% of YouTube watch time is on mobile? Long titles get cut off. Our <strong>Viral Title Generator</strong> prioritizes punchy, front-loaded titles where the most important keywords appear first.</p>
      
      <h3>Avoid Clickbait (The Bad Kind)</h3>
      <p>There is a difference between "Click-worthy" and "Clickbait". Clickbait lies. Click-worthy creates mystery but delivers on the promise. Our AI is trained to avoid misleading claims that hurt your retention.</p>
    `
  },
  {
    id: 'guide-hashtag-generator',
    title: 'The Complete Guide to YouTube Hashtags',
    excerpt: 'Are you using hashtags wrong? Learn the correct placement and quantity to boost your video discovery.',
    date: 'Oct 21, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>Hashtags vs Tags: What's the Difference?</h2>
      <p><strong>Tags</strong> are hidden metadata. <strong>Hashtags</strong> are visible links (e.g., #Gaming) that appear above your title. They connect your video to a global landing page for that topic.</p>

      <h3>The "Blue Link" Effect</h3>
      <p>The first 3 hashtags in your description appear as blue clickable links above your video title. This is prime real estate. You should use:</p>
      <ol>
        <li><strong>Brand Tag:</strong> #YourChannelName</li>
        <li><strong>Broad Topic:</strong> #Tech</li>
        <li><strong>Specific Topic:</strong> #iPhoneReview</li>
      </ol>

      <h3>Using the Generator</h3>
      <p>Don't just guess. Our <strong>Hashtag Generator</strong> analyzes what is currently popular in your niche and gives you a mix of high-competition and low-competition tags to help you rank.</p>
    `
  },
  {
    id: 'guide-description-writer',
    title: 'Description Writer: SEO Magic in Seconds',
    excerpt: 'The first two lines of your description are crucial for search ranking. Let AI write them for you.',
    date: 'Oct 20, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The "Above the Fold" Rule</h2>
      <p>When a video appears in search, users see the title and the first 100 characters of the description. This snippet must confirm that your video has the answer they are looking for.</p>

      <h3>Keyword Injection</h3>
      <p>Our <strong>Description Writer</strong> naturally weaves your primary keyword into the first sentence. It also generates:</p>
      <ul>
        <li><strong>Timestamps/Chapters:</strong> Google Search loves these. They allow users to jump to specific parts of your video directly from Google.</li>
        <li><strong>Social Links:</strong> Cleanly formatted links to your other platforms.</li>
        <li><strong>CTA (Call to Action):</strong> Reminders to subscribe or comment.</li>
      </ul>
      <p>Stop leaving your description blank. It is free SEO real estate.</p>
    `
  },
  {
    id: 'guide-script-writer',
    title: 'Video Script Writer: Eliminate Writer\'s Block',
    excerpt: 'Great videos start with great writing. Structure your content for maximum retention with our AI script outlines.',
    date: 'Oct 19, 2024',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The Ideal YouTube Video Structure</h2>
      <p>Retention graphs don't lie. Most viewers drop off in the first minute. To prevent this, you need a structure:</p>
      <ol>
        <li><strong>The Hook (0:00-0:30):</strong> State the problem and the promise. No long logo intros!</li>
        <li><strong>The Setup:</strong> Context on why this matters.</li>
        <li><strong>The Meat:</strong> The actual value/content. Break this into steps.</li>
        <li><strong>The Climax/Payoff:</strong> The final result or biggest tip.</li>
        <li><strong>The Outro:</strong> CTA to watch <em>another</em> video (not just leave).</li>
      </ol>

      <h3>How AI Helps</h3>
      <p>Our <strong>Script Writer</strong> doesn't just write words; it plans the <em>flow</em>. It suggests visual cues (B-Roll) alongside the dialogue, ensuring your video is visually engaging, not just a talking head.</p>
    `
  },
  {
    id: 'guide-text-to-speech',
    title: 'AI Voiceover Generator: Faceless Channels Made Easy',
    excerpt: 'Want to start a YouTube Automation (Cash Cow) channel? Create professional voiceovers without recording a single word.',
    date: 'Oct 18, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The Rise of "Faceless" Channels</h2>
      <p>Channels like "WatchMojo" or "Alux" make millions without ever showing a host. The secret? High-quality scripts and voiceovers.</p>

      <h3>Why Quality Matters</h3>
      <p>In the past, Text-to-Speech (TTS) sounded robotic and awful. YouTube demonetized these channels for "Repetitive Content".</p>
      <p><strong>However, technology has changed.</strong> Our tool uses Google's latest Neural Audio generation. It includes:</p>
      <ul>
        <li><strong>Intonation:</strong> The voice rises and falls naturally.</li>
        <li><strong>Pacing:</strong> It pauses at commas and periods.</li>
        <li><strong>Clarity:</strong> Crystal clear audio with no background noise.</li>
      </ul>
      <p>This allows you to scale your content production. You can produce 5 videos a day without losing your voice.</p>
    `
  },
  {
    id: 'guide-growth-kit',
    title: 'YouTube Growth Kit: The Essential Utilities',
    excerpt: 'Small tweaks make big differences. Title Case, Keyword Density, and Readability checks for professional creators.',
    date: 'Oct 17, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>The Devil is in the Details</h2>
      <p>Professional YouTubers obsess over details. Our <strong>Growth Kit</strong> combines 4 essential utilities into one dashboard:</p>
      
      <h3>1. Title Case Converter</h3>
      <p>Titles look more professional when properly capitalized. "how to bake a cake" looks lazy. "How to Bake a Cake" looks authoritative. Use our tool to fix this instantly.</p>

      <h3>2. Keyword Density Checker</h3>
      <p>Are you spamming? If you repeat your keyword too many times, YouTube flags you for spam. Our tool checks your percentage. Aim for 1-2% density.</p>

      <h3>3. Emoji Suggester</h3>
      <p>Emojis in titles increase CTR by adding color to a wall of text. 😱 But don't overdo it. Our AI suggests relevant emojis that fit the mood.</p>

      <h3>4. Readability Analyzer</h3>
      <p>YouTube is for everyone. If you use big words and complex sentences, people click off. Our tool analyzes your script and gives it a "Grade Level". Aim for a 6th-8th grade reading level for mass appeal.</p>
    `
  },
  {
    id: 'guide-instant-ideas',
    title: 'Instant Ideas: overcoming Creative Block',
    excerpt: 'Need an idea NOW? How our Flash-Lite model delivers brainstorming at the speed of thought.',
    date: 'Oct 16, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    content: `
      <h2>Quantity Leads to Quality</h2>
      <p>The best way to have a good idea is to have <em>lots</em> of ideas. But brainstorming is exhausting.</p>
      
      <h3>The Power of Speed</h3>
      <p>Our <strong>Instant Ideas</strong> tool uses the specialized Gemini Flash-Lite model. It is optimized for low latency. You type a topic, and boom—10 ideas appear in milliseconds.</p>
      
      <h3>Workflow for Success</h3>
      <p>Use this tool to generate 50 ideas in 5 minutes. Then, pick the best 3. Run those 3 through our <strong>Title Generator</strong> and <strong>Thumbnail Generator</strong> to validate them. This is how pros operate.</p>
    `
  }
];

// --- SEO & CONTENT COMPONENT ---
const SEOKnowledgeBase = () => (
  <div className="bg-yt-dark py-16 border-t border-white/5">
    <div className="max-w-4xl mx-auto px-4">
      
      {/* AD PLACEHOLDER */}
      <div className="w-full h-32 bg-gray-900/50 border border-white/5 rounded-lg flex items-center justify-center mb-12">
        <span className="text-gray-600 text-sm">Advertisement Space</span>
      </div>

      <h2 className="text-3xl font-bold text-white mb-8 text-center"><i className="fa-solid fa-book-open text-yt-red mr-3"></i>YouTube SEO Knowledge Hub</h2>
      
      <div className="grid md:grid-cols-2 gap-12 text-gray-300">
        <div className="prose prose-invert">
          <h3 className="text-xl font-bold text-white mb-4">The Ultimate YouTube SEO Checklist</h3>
          <ul className="space-y-3">
            <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Target Keyword:</strong> Include your main keyword in the Title, Description (first 2 lines), and Tags.</li>
            <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>CTR Optimization:</strong> Use power words (e.g., "Ultimate", "Secret", "Fast") in your title.</li>
            <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Thumbnail Quality:</strong> Use high-contrast colors, legible text, and emotive faces (1280x720 resolution).</li>
            <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Engagement Signals:</strong> Ask a question in the pinned comment to encourage replies.</li>
            <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Hashtags:</strong> Add 3-5 relevant hashtags above your video title.</li>
          </ul>
        </div>
        
        <div className="prose prose-invert">
          <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
          <p className="mb-4">
            YTPANEL.IN uses advanced Artificial Intelligence (Gemini Pro & Flash) to analyze millions of data points. Unlike old-school random generators, our tools understand context, sentiment, and current search trends.
          </p>
          <h4 className="font-bold text-white mb-2">Why are Tags Important?</h4>
          <p>
            While YouTube has stated tags are less critical than before, they still help the algorithm understand context, especially for common misspellings of your target keywords. Our <strong>Tag Generator</strong> ensures you fill the 500-character limit with relevant terms.
          </p>
        </div>
      </div>

      {/* FAQ Section with Schema Support */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h4 className="font-bold text-white mb-2">Is YTPANEL.IN free to use?</h4>
            <p className="text-gray-400 text-sm">Yes, our tools are 100% free for YouTube creators. We are supported by ads to keep the servers running.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h4 className="font-bold text-white mb-2">Will using AI generated tags ban my channel?</h4>
            <p className="text-gray-400 text-sm">No. Our tags are relevant keywords based on your topic. "Keyword stuffing" (using unrelated tags) is against policy, but our AI ensures relevance to keep you safe.</p>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <h4 className="font-bold text-white mb-2">How do I get more views on YouTube?</h4>
            <p className="text-gray-400 text-sm">Consistency is key. Combine high-quality content with our <strong>Title Generator</strong> and <strong>Thumbnail Creator</strong> to improve your Click-Through Rate (CTR).</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setViewState] = useState<ViewState>(ViewState.HOME);
  const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  // --- DYNAMIC SEO ENGINE ---
  const updateSEO = (title: string, desc: string) => {
    document.title = title + " | YTPANEL.IN";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
  };

  const setView = (newView: ViewState, params?: { toolId?: string, blogId?: string }) => {
    // 1. Update State
    setViewState(newView);
    
    // 2. Handle specific states
    if (newView === ViewState.TOOL && params?.toolId) {
       const tool = TOOLS.find(t => t.id === params.toolId);
       if (tool) setActiveTool(tool);
    }
    
    if (newView === ViewState.BLOG_POST && params?.blogId) {
      const post = BLOG_POSTS.find(p => p.id === params.blogId);
      if (post) setActiveBlogPost(post);
    }

    // 3. Update URL & Meta
    const url = new URL(window.location.href);
    url.searchParams.delete('page');
    url.searchParams.delete('id');

    if (newView !== ViewState.HOME) {
      url.searchParams.set('page', newView);
    }

    if (newView === ViewState.TOOL && params?.toolId) {
       url.searchParams.set('id', params.toolId);
       updateSEO(`${TOOLS.find(t => t.id === params.toolId)?.name || 'Tool'} - Free AI Tool`, "Use this free AI tool to boost your YouTube channel growth.");
    } else if (newView === ViewState.BLOG_POST && params?.blogId) {
       url.searchParams.set('id', params.blogId);
       const post = BLOG_POSTS.find(p => p.id === params.blogId);
       if(post) updateSEO(post.title, post.excerpt);
    } else {
       // Static Pages
       switch(newView) {
          case ViewState.HOME: updateSEO("Free AI YouTube Tools - Tags, Titles & Thumbnails", "Boost your YouTube channel with free AI tools. Generate viral titles, optimized tags, hashtags, and thumbnails."); break;
          case ViewState.BLOG: updateSEO("YouTube Creator Blog & Tips", "Read the latest guides and tips on YouTube SEO, algorithm updates, and channel growth."); break;
          case ViewState.ABOUT: updateSEO("About Us", "Learn about the mission behind YTPANEL.IN"); break;
          case ViewState.PRIVACY: updateSEO("Privacy Policy", "Privacy Policy for YTPANEL.IN"); break;
          default: updateSEO("YTPANEL.IN", "Ultimate YouTube Creator Tools");
       }
    }
    
    window.history.pushState({}, '', url.toString());
    window.scrollTo(0, 0);
  };

  // --- ROUTER ON MOUNT ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const id = params.get('id');

    if (page === ViewState.TOOL && id) {
       const tool = TOOLS.find(t => t.id === id);
       if (tool) {
         setActiveTool(tool);
         setViewState(ViewState.TOOL);
         updateSEO(tool.name, tool.description);
       }
    } else if (page === ViewState.BLOG_POST && id) {
       const post = BLOG_POSTS.find(p => p.id === id);
       if (post) {
         setActiveBlogPost(post);
         setViewState(ViewState.BLOG_POST);
         updateSEO(post.title, post.excerpt);
       }
    } else if (page && Object.values(ViewState).includes(page as ViewState)) {
       setView(page as ViewState);
    }
  }, []);

  const handleToolSelect = (tool: ToolConfig) => {
    setView(ViewState.TOOL, { toolId: tool.id });
  };

  return (
    <Layout currentView={view} setView={setView} tools={TOOLS} blogPosts={BLOG_POSTS}>
      {view === ViewState.HOME && <HomeView onSelectTool={handleToolSelect} setView={setView} />}
      {view === ViewState.TOOL && activeTool && <ToolView key={activeTool.id} tool={activeTool} onBack={() => setView(ViewState.HOME)} />}
      
      {/* Blog System */}
      {view === ViewState.BLOG && <BlogListView setView={setView} />}
      {view === ViewState.BLOG_POST && activeBlogPost && <BlogPostView post={activeBlogPost} onBack={() => setView(ViewState.BLOG)} />}
      
      {/* Informational Pages */}
      {view === ViewState.PRIVACY && <PrivacyView />}
      {view === ViewState.TERMS && <TermsView />}
      {view === ViewState.DISCLAIMER && <DisclaimerView />}
      {view === ViewState.ABOUT && <AboutView setView={setView} />}
      {view === ViewState.CONTACT && <ContactView />}
    </Layout>
  );
};

// --- SUB-VIEWS ---

const BlogListView: React.FC<{ setView: any }> = ({ setView }) => (
  <div className="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
    <div className="text-center mb-16">
      <h1 className="text-4xl font-bold text-white mb-4">Creator Academy</h1>
      <p className="text-gray-400 max-w-2xl mx-auto">Expert guides, algorithm updates, and growth strategies to help you scale your channel.</p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {BLOG_POSTS.map(post => (
        <div key={post.id} className="glass-panel rounded-xl overflow-hidden hover:border-yt-red/50 transition-colors cursor-pointer flex flex-col group" onClick={() => setView(ViewState.BLOG_POST, { blogId: post.id })}>
           <div className="h-48 bg-gray-800 overflow-hidden relative">
             <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
           </div>
           <div className="p-6 flex-grow">
             <div className="text-yt-red text-xs font-bold uppercase mb-2">{post.readTime}</div>
             <h3 className="text-xl font-bold text-white mb-3 hover:text-yt-red transition-colors">{post.title}</h3>
             <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
           </div>
           <div className="px-6 pb-6 pt-0 mt-auto">
             <span className="text-gray-500 text-xs">{post.date}</span>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const BlogPostView: React.FC<{ post: BlogPost; onBack: () => void }> = ({ post, onBack }) => (
  <div className="max-w-4xl mx-auto px-4 py-16 animate-fade-in">
    <button onClick={onBack} className="text-gray-400 hover:text-white mb-8 flex items-center transition-colors">
      <i className="fa-solid fa-arrow-left mr-2"></i> Back to Blog
    </button>
    
    <article className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10">
      <header className="mb-12 text-center">
         <div className="inline-block bg-yt-red/10 text-yt-red px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
           Guide
         </div>
         <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{post.title}</h1>
         
         <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 border border-white/10">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
         </div>

         <div className="flex items-center justify-center text-gray-400 text-sm space-x-4">
           <span><i className="fa-regular fa-calendar mr-2"></i>{post.date}</span>
           <span><i className="fa-regular fa-clock mr-2"></i>{post.readTime}</span>
         </div>
      </header>
      
      <div 
        className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-yt-red"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author Box */}
      <div className="mt-16 pt-8 border-t border-white/10 flex items-center">
         <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 overflow-hidden">
           <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=100&q=80" alt="Team" className="w-full h-full object-cover" />
         </div>
         <div>
           <div className="text-white font-bold">YTPANEL Editorial Team</div>
           <div className="text-gray-500 text-xs">YouTube SEO Experts & Data Scientists</div>
         </div>
      </div>
    </article>
  </div>
);

const HomeView: React.FC<{ onSelectTool: (tool: ToolConfig) => void; setView: any }> = ({ onSelectTool, setView }) => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-yt-dark to-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yt-red/10 via-transparent to-blue-500/10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative z-10">
          <div className="inline-block bg-yt-red/20 border border-yt-red/50 rounded-full px-4 py-1 mb-6">
             <span className="text-yt-red text-sm font-bold uppercase tracking-wider">New AI Models Added</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
            The Ultimate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yt-red to-orange-500 drop-shadow-lg">
              YouTube Creator Suite
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Boost your channel with our all-in-one platform. From <strong>AI Video Analysis</strong> and <strong>Pro Thumbnails</strong> to <strong>Search Trends</strong> and <strong>Voiceovers</strong>.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => document.getElementById('tools-grid')?.scrollIntoView({ behavior: 'smooth'})} className="bg-yt-red hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl shadow-red-900/40">
              Start Creating Now
            </button>
            <button onClick={() => setView(ViewState.BLOG)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg transition-all backdrop-blur-sm">
              Read Our Guides
            </button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div id="tools-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-black">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">Powerful AI Tools</h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Everything you need to research, create, and optimize your content for maximum views.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="glass-panel p-8 rounded-2xl cursor-pointer hover:bg-white/5 transition-all duration-300 group border border-white/5 hover:border-yt-red/30 relative overflow-hidden"
            >
              {tool.isNew && (
                 <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">NEW</div>
              )}
              <div className={`w-14 h-14 rounded-xl bg-gray-900/80 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${tool.color} border border-white/5`}>
                <i className={`fa-solid ${tool.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yt-red transition-colors">{tool.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO & Educational Content */}
      <SEOKnowledgeBase />

      {/* Content for AdSense / Value */}
      <div className="bg-yt-dark py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-8">Why Use YTPANEL.IN?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                    <h3 className="text-yt-red font-bold mb-2">Grow Faster</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Our AI models are tuned specifically for YouTube algorithms, helping you rank higher in search results with optimized titles, tags, and descriptions.</p>
                </div>
                <div>
                    <h3 className="text-yt-red font-bold mb-2">Save Time</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Stop staring at a blank page. Generate comprehensive scripts, professional descriptions, and eye-catching thumbnails in seconds, not hours.</p>
                </div>
                <div>
                    <h3 className="text-yt-red font-bold mb-2">Professional Quality</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">Access industry-leading AI models (Gemini Pro & Flash) normally reserved for enterprise tools. High-quality output that sounds natural and engaging.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ToolView: React.FC<{ tool: ToolConfig; onBack: () => void }> = ({ tool, onBack }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<GeneratedResult>({ text: '', isError: false });
  const [loading, setLoading] = useState(false);
  
  // Specific states for complex tools
  const [chatHistory, setChatHistory] = useState<{role: string, text: string}[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageSize, setImageSize] = useState('1K');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Thumbnail Analysis State
  const [ctrAnalysis, setCtrAnalysis] = useState<string | null>(null);
  const [analyzingCTR, setAnalyzingCTR] = useState(false);

  // SEO Analyzer State
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeyword, setSeoKeyword] = useState('');
  const [seoScore, setSeoScore] = useState<number | null>(null);

  // Growth Kit State
  const [growthTab, setGrowthTab] = useState<'case' | 'emoji' | 'density' | 'readability'>('case');
  const [densityKeyword, setDensityKeyword] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat session if needed
    if (tool.id === ToolType.AI_CHAT_ASSISTANT && !chatSession) {
      setChatSession(GeminiService.createChatSession());
      setChatHistory([{ role: 'model', text: "Hello! I'm your YouTube Coach. Ask me anything about growing your channel, understanding analytics, or brainstorming video ideas!" }]);
    }
  }, [tool.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleCase = () => {
    const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'over', 'in', 'of'];
    const titleCased = input.toLowerCase().replace(/\w\S*/g, (txt, offset) => {
        if (offset !== 0 && minorWords.includes(txt)) {
            return txt;
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    setResult({ text: titleCased, isError: false });
  };

  const handleDensityCheck = () => {
    if(!input || !densityKeyword) return;
    const words = input.toLowerCase().match(/\b\w+\b/g) || [];
    const count = words.filter(w => w === densityKeyword.toLowerCase()).length;
    const percent = words.length > 0 ? ((count / words.length) * 100).toFixed(2) : 0;
    
    setResult({ 
        text: `Analysis Result:\n----------------\nTarget Keyword: "${densityKeyword}"\nOccurrences: ${count}\nTotal Word Count: ${words.length}\nKeyword Density: ${percent}%\n\nRecommendation: ${Number(percent) > 2.5 ? "Density is high. Reduce keyword usage to avoid spam detection." : "Density is good (safe range 0.5% - 2.5%)."}`, 
        isError: false 
    });
  };

  const handleAnalyzeThumbnail = async () => {
    if (!result.image) return;
    setAnalyzingCTR(true);
    try {
      const analysis = await GeminiService.analyzeImage(result.image, "Act as a YouTube expert. Analyze this thumbnail's CTR potential. Give a score /10, identify key elements (faces, text, contrast), and list 3 specific improvements to maximize clicks.");
      setCtrAnalysis(analysis);
    } catch (e) {
      setCtrAnalysis("Failed to analyze image.");
    }
    setAnalyzingCTR(false);
  };

  const handleGenerate = async () => {
    // 0. GROWTH KIT LOGIC
    if (tool.id === ToolType.GROWTH_KIT) {
       if (growthTab === 'case') { handleTitleCase(); return; }
       if (growthTab === 'density') { handleDensityCheck(); return; }
    }

    // Validation
    if (tool.id === ToolType.CONTENT_ANALYZER) {
      if (!seoTitle || !seoDesc || !seoKeyword) {
        alert("Please fill in all fields (Title, Description, Keyword) for analysis.");
        return;
      }
    } else if ((!input.trim() && !selectedImage) && tool.id !== ToolType.AI_CHAT_ASSISTANT) {
      return;
    }

    setLoading(true);
    setResult({ text: '', isError: false });
    setSeoScore(null);
    setCtrAnalysis(null); // Reset CTR analysis on new generation
    
    try {
      // 1. CHAT BOT
      if (tool.id === ToolType.AI_CHAT_ASSISTANT && chatSession) {
        setChatHistory(prev => [...prev, { role: 'user', text: input }]);
        const currentInput = input;
        setInput(''); // Clear input early for chat feel
        
        const response = await chatSession.sendMessage({ message: currentInput });
        setChatHistory(prev => [...prev, { role: 'model', text: response.text || "No response" }]);
        setLoading(false);
        return;
      }

      // 2. SEARCH GROUNDING
      if (tool.id === ToolType.TREND_RESEARCHER) {
        const { text, chunks } = await GeminiService.researchTrends(input);
        setResult({ text, groundingChunks: chunks, isError: false });
        setLoading(false);
        return;
      }

      // 3. IMAGE GENERATOR
      if (tool.id === ToolType.THUMBNAIL_GENERATOR) {
        const imageBase64 = await GeminiService.generateImage(input, aspectRatio, imageSize);
        if (imageBase64) {
          setResult({ text: "Image generated successfully!", image: imageBase64, isError: false });
        } else {
          setResult({ text: "Failed to generate image.", isError: true });
        }
        setLoading(false);
        return;
      }

      // 4. SEO RANK ANALYZER
      if (tool.id === ToolType.CONTENT_ANALYZER) {
         const prompt = `Act as a strict YouTube SEO Auditor. Analyze the following video metadata:
Target Keyword: "${seoKeyword}"
Video Title: "${seoTitle}"
Video Description: "${seoDesc}"

Output Format:
SCORE: [0-100]
SUMMARY: [Brief analysis]
IMPROVEMENTS:
1. [Suggestion 1]
2. [Suggestion 2]
`;
         const analysis = await GeminiService.generateContent(prompt, 'gemini-2.5-flash');
         
         // Extract score using Regex
         const scoreMatch = analysis.match(/SCORE:\s*(\d+)/i);
         if (scoreMatch && scoreMatch[1]) {
            setSeoScore(parseInt(scoreMatch[1], 10));
         }

         setResult({ text: analysis, isError: false });
         setLoading(false);
         return;
      }

      // 5. TTS
      if (tool.id === ToolType.TEXT_TO_SPEECH) {
        const audioData = await GeminiService.generateSpeech(input);
        if (audioData) {
           setResult({ text: "Audio generated.", audio: audioData, isError: false });
        } else {
           setResult({ text: "Failed to generate audio.", isError: true });
        }
        setLoading(false);
        return;
      }

      // 6. INSTANT IDEAS
      if (tool.id === ToolType.INSTANT_IDEAS) {
        const fastText = await GeminiService.generateFastResponse(input);
        setResult({ text: fastText, isError: false });
        setLoading(false);
        return;
      }

      // 7. GROWTH KIT (AI Parts)
      if (tool.id === ToolType.GROWTH_KIT) {
          if (growthTab === 'emoji') {
              const res = await GeminiService.suggestEmojis(input);
              setResult({ text: res, isError: false });
          } else if (growthTab === 'readability') {
              const res = await GeminiService.analyzeReadability(input);
              setResult({ text: res, isError: false });
          }
          setLoading(false);
          return;
      }

      // DEFAULT TEXT TOOLS
      let content = '';
      switch (tool.id) {
        case ToolType.TITLE_GENERATOR: content = await GeminiService.generateVideoIdeas(input); break;
        case ToolType.HASHTAG_GENERATOR: content = await GeminiService.generateHashtags(input); break;
        case ToolType.DESCRIPTION_GENERATOR: content = await GeminiService.generateDescription(input); break;
        case ToolType.SCRIPT_OUTLINE: content = await GeminiService.generateScript(input); break;
        case ToolType.TAG_GENERATOR: content = await GeminiService.generateTags(input); break;
        case ToolType.SHORTS_GENERATOR: content = await GeminiService.generateShortsContent(input); break;
        default: content = await GeminiService.generateContent(input);
      }
      setResult({ text: content, isError: false });

    } catch (error) {
      setResult({ text: "An error occurred. Please try again.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in min-h-screen">
      <button onClick={onBack} className="text-gray-400 hover:text-white mb-6 flex items-center transition-colors">
        <i className="fa-solid fa-arrow-left mr-2"></i> Back to Tools
      </button>
      
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 border-b border-white/5">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mr-4 ${tool.color}`}>
               <i className={`fa-solid ${tool.icon} text-xl`}></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
              <p className="text-gray-400 text-xs">{tool.description}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* --- CHAT INTERFACE --- */}
          {tool.id === ToolType.AI_CHAT_ASSISTANT ? (
             <div className="flex flex-col h-[600px] border border-white/10 rounded-xl bg-black/40 overflow-hidden">
             {/* Chat History Area */}
             <div className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth">
                {chatHistory.map((msg, idx) => (
                   <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                         msg.role === 'user' ? 'bg-yt-red' : 'bg-indigo-600'
                      }`}>
                         <i className={`fa-solid ${msg.role === 'user' ? 'fa-user' : 'fa-robot'} text-xs text-white`}></i>
                      </div>
                      {/* Bubble */}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md ${
                         msg.role === 'user' 
                         ? 'bg-gradient-to-br from-yt-red to-red-700 text-white rounded-tr-none' 
                         : 'bg-gray-800 text-gray-200 rounded-tl-none border border-white/5'
                      }`}>
                         {msg.text}
                      </div>
                   </div>
                ))}
                {loading && (
                   <div className="flex items-start gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                         <i className="fa-solid fa-robot text-xs text-white"></i>
                      </div>
                      <div className="bg-gray-800 text-gray-400 rounded-2xl rounded-tl-none px-4 py-3 text-sm border border-white/5 flex items-center gap-2">
                         <span className="text-xs font-semibold">Generating</span>
                         <span className="flex gap-1">
                           <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                           <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                           <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                         </span>
                      </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
             </div>
             
             {/* Input Area */}
             <div className="p-4 bg-gray-900 border-t border-white/10">
                <div className="flex gap-2">
                   <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      placeholder="Ask about SEO, content strategy, or analytics..."
                      className="flex-grow bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yt-red transition-colors placeholder-gray-500"
                   />
                   <button 
                      onClick={handleGenerate}
                      disabled={!input.trim() || loading}
                      className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                   >
                      <i className="fa-solid fa-paper-plane"></i>
                   </button>
                </div>
             </div>
          </div>
          ) : (
            // --- STANDARD & OTHER TOOLS INTERFACE ---
            <>
              {/* Growth Kit Tabs */}
              {tool.id === ToolType.GROWTH_KIT && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { id: 'case', label: 'Title Case', icon: 'fa-font' },
                    { id: 'emoji', label: 'Emoji Suggester', icon: 'fa-face-smile' },
                    { id: 'density', label: 'Keyword Density', icon: 'fa-percent' },
                    { id: 'readability', label: 'Readability', icon: 'fa-glasses' }
                  ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setGrowthTab(tab.id as any); setResult({text: '', isError: false}); setInput(''); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                            growthTab === tab.id 
                            ? 'bg-yt-red text-white' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                    >
                        <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* SEO Analyzer Inputs */}
              {tool.id === ToolType.CONTENT_ANALYZER && (
                <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-gray-300 mb-2">Primary Keyword</label>
                     <input 
                        type="text" 
                        value={seoKeyword}
                        onChange={(e) => setSeoKeyword(e.target.value)}
                        placeholder="e.g. chocolate chip cookies"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yt-red"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-300 mb-2">Video Title</label>
                     <input 
                        type="text" 
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="e.g. The Best Chocolate Chip Cookies Recipe Ever"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yt-red"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                     <textarea
                        value={seoDesc}
                        onChange={(e) => setSeoDesc(e.target.value)}
                        placeholder="Paste your video description here..."
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yt-red h-32 resize-none"
                     />
                  </div>
                </div>
              )}

              {/* Configurations for Image Gen */}
              {tool.id === ToolType.THUMBNAIL_GENERATOR && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Aspect Ratio</label>
                    <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                      <option value="16:9">16:9 (Standard Video)</option>
                      <option value="9:16">9:16 (Shorts)</option>
                      <option value="1:1">1:1 (Square)</option>
                      <option value="4:3">4:3</option>
                      <option value="21:9">21:9 (Ultrawide)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Quality</label>
                    <select value={imageSize} onChange={(e) => setImageSize(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white">
                      <option value="1K">1K</option>
                      <option value="2K">2K (HD)</option>
                      <option value="4K">4K (UHD)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Density Specific Inputs */}
              {tool.id === ToolType.GROWTH_KIT && growthTab === 'density' && (
                <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Target Keyword</label>
                    <input 
                    type="text" 
                    value={densityKeyword}
                    onChange={(e) => setDensityKeyword(e.target.value)}
                    placeholder="Enter the keyword to count..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-yt-red mb-4"
                    />
                </div>
              )}

              {/* Main Input (Hidden for Analyzer) */}
              {tool.id !== ToolType.CONTENT_ANALYZER && (
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    {tool.id === ToolType.THUMBNAIL_GENERATOR ? "Describe the image you want to generate" :
                    tool.id === ToolType.TEXT_TO_SPEECH ? "Enter text to convert to speech" :
                    tool.id === ToolType.TAG_GENERATOR ? "Enter your video topic or title" :
                    tool.id === ToolType.SHORTS_GENERATOR ? "Enter your Shorts topic or niche" :
                    tool.id === ToolType.GROWTH_KIT && growthTab === 'case' ? "Enter title to convert" :
                    tool.id === ToolType.GROWTH_KIT && growthTab === 'density' ? "Paste content to check" :
                    tool.id === ToolType.GROWTH_KIT && growthTab === 'readability' ? "Paste script or description" :
                    "Enter your video topic"}
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type here..."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yt-red h-32 resize-none"
                  />
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || (tool.id !== ToolType.CONTENT_ANALYZER && !input.trim() && !selectedImage)}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center ${
                  loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-yt-red text-white hover:bg-red-600 shadow-lg shadow-red-900/40 transform active:scale-95'
                }`}
              >
                {loading ? (
                  <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Processing...</>
                ) : (
                  <><i className={`fa-solid ${tool.icon} mr-2`}></i> {tool.buttonText}</>
                )}
              </button>

              {/* Results Area */}
              {(result.text || result.image || result.audio || result.isError) && (
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <i className="fa-solid fa-square-check text-green-500 mr-2"></i> Result
                  </h3>
                  
                  {/* SEO SCORE DISPLAY */}
                  {seoScore !== null && (
                    <div className="flex flex-col items-center justify-center mb-8 p-6 bg-gray-900/50 rounded-xl border border-white/5">
                      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                         <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                               className="text-gray-700"
                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                               fill="none"
                               stroke="currentColor"
                               strokeWidth="3"
                            />
                            <path
                               className={`${seoScore >= 80 ? 'text-green-500' : seoScore >= 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                               strokeDasharray={`${seoScore}, 100`}
                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                               fill="none"
                               stroke="currentColor"
                               strokeWidth="3"
                            />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-white">{seoScore}</span>
                            <span className="text-[10px] text-gray-400 uppercase">SEO Score</span>
                         </div>
                      </div>
                      <p className="text-center text-sm text-gray-300 max-w-md">
                         {seoScore >= 80 ? "Excellent! Your metadata is optimized for high click-through rates." : 
                          seoScore >= 50 ? "Good, but there's room for improvement. Check the suggestions below." : 
                          "Needs work. Follow the recommendations to improve visibility."}
                      </p>
                    </div>
                  )}

                  {/* Image Result */}
                  {result.image && (
                     <div className="mb-4">
                        <img src={`data:image/png;base64,${result.image}`} alt="Generated" className="w-full rounded-lg shadow-2xl border border-white/10" />
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                            <a href={`data:image/png;base64,${result.image}`} download="ytpanel-generated.png" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center">
                                <i className="fa-solid fa-download mr-2"></i> Download Image
                            </a>
                            
                            {tool.id === ToolType.THUMBNAIL_GENERATOR && (
                                <button 
                                    onClick={handleAnalyzeThumbnail}
                                    disabled={analyzingCTR || !!ctrAnalysis} 
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold transition-colors flex items-center disabled:opacity-50"
                                >
                                    {analyzingCTR ? (
                                        <><i className="fa-solid fa-circle-notch fa-spin mr-2"></i> Analyzing...</>
                                    ) : (
                                        <><i className="fa-solid fa-microscope mr-2"></i> Analyze CTR Score</>
                                    )}
                                </button>
                            )}
                        </div>

                        {ctrAnalysis && (
                            <div className="mt-4 p-6 bg-gray-900/80 rounded-xl border border-purple-500/30 text-gray-300 text-sm whitespace-pre-wrap animate-fade-in">
                                <h4 className="text-white font-bold mb-3 flex items-center text-lg">
                                    <i className="fa-solid fa-robot text-purple-400 mr-2"></i> 
                                    AI Visual Analysis
                                </h4>
                                {ctrAnalysis}
                            </div>
                        )}
                     </div>
                  )}

                  {/* Audio Result */}
                  {result.audio && (
                    <div className="mb-4 bg-gray-900 p-4 rounded-lg">
                      <audio controls className="w-full" src={`data:audio/mp3;base64,${result.audio}`} />
                    </div>
                  )}

                  {/* Grounding / Search Links */}
                  {result.groundingChunks && result.groundingChunks.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                       {result.groundingChunks.map((chunk, i) => chunk.web?.uri && (
                         <a key={i} href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-blue-300 truncate max-w-[200px]">
                           <i className="fa-solid fa-link mr-1"></i> {chunk.web.title || "Source"}
                         </a>
                       ))}
                    </div>
                  )}

                  {/* Text Result */}
                  {result.text && (
                    <div className="bg-gray-900 rounded-lg p-6 text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed border border-gray-700 relative group">
                      {result.text}
                      <button
                        onClick={() => navigator.clipboard.writeText(result.text)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-all"
                      >
                        <i className="fa-regular fa-copy"></i> Copy
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- LEGAL & INFO PAGES ---

const AboutView: React.FC<{ setView: (view: ViewState) => void }> = ({ setView }) => (
  <div className="animate-fade-in">
    {/* Hero */}
    <div className="bg-gradient-to-b from-yt-dark to-black py-16 text-center border-b border-white/5">
       <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Empowering YouTube Creators with AI</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
             At YTPANEL.IN, our mission is simple: to democratize advanced AI technology for content creators of all sizes.
          </p>
          <button onClick={() => setView(ViewState.CONTACT)} className="bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors">
             Get in Touch
          </button>
       </div>
    </div>

    {/* Content */}
    <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert prose-lg">
      <div className="glass-panel p-8 rounded-xl border border-white/10">
        <h3>Who We Are</h3>
        <p>
          YTPANEL.IN is a state-of-the-art platform developed by a team of SEO specialists, software engineers, and content strategists. We identified a gap in the market: professional-grade analytics and generation tools were often locked behind expensive paywalls or complicated interfaces.
        </p>
        <p>
          We leverage the power of <strong>Google's Gemini 2.5 and 3.0 Pro</strong> models to provide real-time, high-quality suggestions for titles, scripts, thumbnails, and SEO tags. Whether you have 10 subscribers or 10 million, our tools adapt to your niche.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 my-12 not-prose">
           <div className="bg-black/30 p-6 rounded-lg text-center">
              <i className="fa-solid fa-bolt text-yt-red text-3xl mb-4"></i>
              <h4 className="text-white font-bold mb-2">Speed</h4>
              <p className="text-gray-400 text-sm">Instant results using Flash-Lite models.</p>
           </div>
           <div className="bg-black/30 p-6 rounded-lg text-center">
              <i className="fa-solid fa-shield-halved text-blue-500 text-3xl mb-4"></i>
              <h4 className="text-white font-bold mb-2">Privacy</h4>
              <p className="text-gray-400 text-sm">We don't store your personal data.</p>
           </div>
           <div className="bg-black/30 p-6 rounded-lg text-center">
              <i className="fa-solid fa-brain text-purple-500 text-3xl mb-4"></i>
              <h4 className="text-white font-bold mb-2">Intelligence</h4>
              <p className="text-gray-400 text-sm">Powered by the latest LLMs.</p>
           </div>
        </div>

        <h3>Our Commitment</h3>
        <p>
          We are committed to providing a clean, ad-light experience that focuses on utility. We believe that by helping you grow your channel, we contribute to a richer, more diverse creator economy.
        </p>
      </div>
    </div>
  </div>
);

const DisclaimerView = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert">
    <div className="glass-panel p-8 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold mb-8 text-yt-red">Disclaimer</h1>
      
      <h3>General Information</h3>
      <p>
        The information provided by YTPANEL.IN ("we," "us," or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
      </p>

      <h3>AI-Generated Content</h3>
      <p>
        Our services utilize Artificial Intelligence (AI) to generate content, including but not limited to video titles, descriptions, tags, scripts, and images. While we strive for high quality:
      </p>
      <ul>
        <li><strong>Accuracy:</strong> AI models can occasionally produce incorrect or biased information. You should verify facts before publishing.</li>
        <li><strong>Originality:</strong> While the AI generates unique combinations, we cannot guarantee that a specific phrase has never been used before.</li>
        <li><strong>Compliance:</strong> It is your responsibility to ensure that the content you publish on YouTube complies with YouTube's Community Guidelines and Terms of Service.</li>
      </ul>

      <h3>External Links Disclaimer</h3>
      <p>
        The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties (such as YouTube). Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
      </p>

      <h3>Professional Disclaimer</h3>
      <p>
        The Site cannot and does not contain legal or financial advice. The SEO and growth information is provided for general educational and informational purposes only and is not a substitute for professional advice.
      </p>
      
      <p className="text-sm text-gray-500 mt-8">Last Updated: October 26, 2023</p>
    </div>
  </div>
);

const PrivacyView = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert">
    <div className="glass-panel p-8 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="lead">At YTPANEL.IN, accessible from https://ytpanel.in, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by YTPANEL.IN and how we use it.</p>
      
      <h3>Log Files</h3>
      <p>
        YTPANEL.IN follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
      </p>

      <h3>Cookies and Web Beacons</h3>
      <p>
        Like any other website, YTPANEL.IN uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
      </p>

      <h3>Google DoubleClick DART Cookie</h3>
      <p>
        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer">https://policies.google.com/technologies/ads</a>
      </p>

      <h3>Third Party Privacy Policies</h3>
      <p>
        YTPANEL.IN's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
      </p>

      <h3>Children's Information</h3>
      <p>
        Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. YTPANEL.IN does not knowingly collect any Personal Identifiable Information from children under the age of 13.
      </p>

      <h3>Consent</h3>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
    </div>
  </div>
);

const TermsView = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 prose prose-invert">
    <div className="glass-panel p-8 rounded-xl border border-white/10">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <h3>1. Acceptance of Terms</h3>
      <p>
        By accessing this Website, accessible from https://ytpanel.in, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
      </p>

      <h3>2. Use License</h3>
      <p>
        Permission is granted to temporarily download one copy of the materials on YTPANEL.IN's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      </p>
      <ul>
        <li>modify or copy the materials;</li>
        <li>use the materials for any commercial purpose or for any public display;</li>
        <li>attempt to reverse engineer any software contained on YTPANEL.IN's Website;</li>
        <li>remove any copyright or other proprietary notations from the materials; or</li>
        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
      </ul>

      <h3>3. Disclaimer</h3>
      <p>
        All the materials on YTPANEL.IN’s Website are provided "as is". YTPANEL.IN makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, YTPANEL.IN does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or on any sites linked to this Website.
      </p>

      <h3>4. Limitations</h3>
      <p>
        In no event shall YTPANEL.IN or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on YTPANEL.IN’s Website.
      </p>

      <h3>5. Revisions and Errata</h3>
      <p>
        The materials appearing on YTPANEL.IN’s Website may include technical, typographical, or photographic errors. YTPANEL.IN does not promise that any of the materials in this Website are accurate, complete, or current.
      </p>

      <h3>6. Site Terms of Use Modifications</h3>
      <p>
        YTPANEL.IN may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of these Terms and Conditions of Use.
      </p>
    </div>
  </div>
);

const ContactView = () => (
  <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
    <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
    <p className="text-gray-400 text-center mb-12">
      Have a question about a tool? Suggestion for a new feature? We'd love to hear from you.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
       {/* Info Panel */}
       <div className="md:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-white/10 text-center">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-envelope text-yt-red text-xl"></i>
             </div>
             <h3 className="font-bold text-white mb-1">Email Us</h3>
             <p className="text-gray-400 text-sm break-all">support@ytpanel.in</p>
          </div>
          
          <div className="glass-panel p-6 rounded-xl border border-white/10 text-center">
             <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-brands fa-twitter text-blue-400 text-xl"></i>
             </div>
             <h3 className="font-bold text-white mb-1">Follow Us</h3>
             <p className="text-gray-400 text-sm">@ytpanel_official</p>
          </div>
       </div>

       {/* Form Panel */}
       <div className="md:col-span-2">
          <div className="glass-panel p-8 rounded-xl border border-white/10">
             <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you shortly.'); }}>
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                      <input required type="text" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yt-red focus:outline-none" placeholder="John Doe" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                      <input required type="email" className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yt-red focus:outline-none" placeholder="john@example.com" />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                      <select className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yt-red focus:outline-none">
                         <option>General Inquiry</option>
                         <option>Report a Bug</option>
                         <option>Feature Request</option>
                         <option>Business Partnership</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                      <textarea required className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yt-red focus:outline-none h-32 resize-none" placeholder="How can we help you?"></textarea>
                   </div>
                   <button type="submit" className="w-full bg-yt-red hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
                      Send Message
                   </button>
                </div>
             </form>
          </div>
       </div>
    </div>
  </div>
);

export default App;
