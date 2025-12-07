import { GoogleGenAI, Modality, Chat } from "@google/genai";

// --- FIX FOR SHARED HOSTING ---
// Helper function to safely get the API Key environment independent
const getApiKey = (): string => {
  // 1. Check Vite Environment Variable (Local Development)
  // @ts-ignore
  if (import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  
  // 2. Check Global Window Object (Shared Hosting / Production)
  // This reads the key we will put in index.html later
  if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
    return (window as any).process.env.API_KEY;
  }

  return ''; // Return empty if not found
};

const apiKey = getApiKey();

// Initialize the Gemini API client
// We initialize it even if key is missing to avoid immediate crash, but calls will be guarded
const ai = new GoogleGenAI({ apiKey: apiKey });

// Standard Text Generation
export const generateContent = async (prompt: string, model: string = 'gemini-2.5-flash'): Promise<string> => {
  // Guard: Check if API Key is missing or placeholder
  if (!apiKey || apiKey.includes('PASTE_YOUR')) {
    console.error("API Key missing or invalid");
    return "Configuration Error: API Key is missing. Please edit index.html in your hosting File Manager and add your Gemini API Key.";
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class YouTube SEO expert and content strategist. Your goal is to help creators grow their channels with high-CTR titles, searchable tags, and engaging scripts.",
        temperature: 0.7,
      }
    });

    return response.text || "No text generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key or try again.";
  }
};

// --- EXISTING HELPERS ---

export const generateVideoIdeas = async (topic: string): Promise<string> => {
  return generateContent(`Generate 10 viral YouTube video title ideas for the topic: "${topic}". Format as a numbered list.`, 'gemini-2.5-flash');
};

export const generateHashtags = async (topic: string): Promise<string> => {
  return generateContent(`Generate 30 high-volume, relevant YouTube hashtags for a video about: "${topic}".`, 'gemini-2.5-flash');
};

export const generateDescription = async (topic: string): Promise<string> => {
  return generateContent(`Write a professional, SEO-optimized YouTube video description (approx 150 words) for the topic: "${topic}".`, 'gemini-2.5-flash');
};

export const generateScript = async (topic: string): Promise<string> => {
  return generateContent(`Create a comprehensive video script outline for: "${topic}".`, 'gemini-2.5-flash');
};

export const generateThumbnailIdeas = async (topic: string): Promise<string> => {
  return generateContent(`Suggest 5 high-CTR thumbnail concepts for a video about "${topic}".`, 'gemini-2.5-flash');
};

// --- NEW FEATURES ---

// Dedicated Tag Generator
export const generateTags = async (topic: string): Promise<string> => {
  return generateContent(
    `Generate a comma-separated list of high-ranking YouTube video tags for the topic: "${topic}". Limit the total character count to 500 characters. Do not include numbered lists, just the tags separated by commas. Example: tag1, tag2, tag3`, 
    'gemini-2.5-flash'
  );
};

// Shorts Generator
export const generateShortsContent = async (topic: string): Promise<string> => {
  return generateContent(
    `Act as a YouTube Shorts viral strategist. For the niche "${topic}", provide a rapid strategy plan:
    
    1. **3 Viral Concepts**: Brief, high-energy video ideas (under 60s) with a strong hook.
    2. **5 Punchy Titles**: Short, click-worthy titles optimized for mobile (under 50 chars).
    3. **Tags**: 15 trending mix of broad and specific hashtags including #Shorts.
    
    Keep the output concise, energetic, and ready to film.`,
    'gemini-2.5-flash'
  );
};

// 1. Instant AI (Flash Lite)
export const generateFastResponse = async (topic: string): Promise<string> => {
  // Uses gemini-flash-lite-latest for low latency
  return generateContent(
    `FAST MODE: Provide 5 instant viral title ideas and 10 tags for: "${topic}". Keep it brief.`, 
    'gemini-flash-lite-latest'
  );
};

// 2. Search Grounding (gemini-2.5-flash with googleSearch)
export const researchTrends = async (topic: string): Promise<{ text: string; chunks?: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the latest trending information and news related to "${topic}" for a YouTube video. Summarize key trends and facts.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return {
      text: response.text || "No results found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    return { text: "Error fetching trends.", chunks: [] };
  }
};

// 3. Text to Speech (gemini-2.5-flash-preview-tts)
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });
    // Return base64 audio data
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

// 4. Image Generation (gemini-3-pro-image-preview)
export const generateImage = async (prompt: string, aspectRatio: string = "16:9", size: string = "1K"): Promise<string | undefined> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: size as any
        }
      }
    });
    
    // Find image part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// 5. Image Analysis (gemini-3-pro-preview)
export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: prompt || "Analyze this image for YouTube thumbnail optimization. Is the text readable? Is the emotion clear?" }
        ]
      }
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Error analyzing image.";
  }
};

// 6. Chat Bot (gemini-3-pro-preview)
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are 'YT Coach', a friendly and expert YouTube consultant. Help the user with channel strategy, analytics, and content ideas.",
    }
  });
};

// 7. Utility: Emoji Suggestions
export const suggestEmojis = async (text: string): Promise<string> => {
  return generateContent(`Suggest 10 relevant emojis for this YouTube video context: "${text}". Just return the emojis separated by spaces.`, 'gemini-2.5-flash');
};

// 8. Utility: Readability
export const analyzeReadability = async (text: string): Promise<string> => {
  return generateContent(`Analyze the readability of this YouTube script/description. Give it a grade level (e.g. 5th Grade, High School) and simple tips to make it clearer for a broad audience: "${text}"`, 'gemini-2.5-flash');
};
