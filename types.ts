
export enum ToolType {
  TITLE_GENERATOR = 'TITLE_GENERATOR',
  HASHTAG_GENERATOR = 'HASHTAG_GENERATOR',
  DESCRIPTION_GENERATOR = 'DESCRIPTION_GENERATOR',
  SCRIPT_OUTLINE = 'SCRIPT_OUTLINE',
  TAG_GENERATOR = 'TAG_GENERATOR',
  CHANNEL_AUDIT = 'CHANNEL_AUDIT',
  THUMBNAIL_IDEAS = 'THUMBNAIL_IDEAS',
  // New Features
  AI_CHAT_ASSISTANT = 'AI_CHAT_ASSISTANT',
  TREND_RESEARCHER = 'TREND_RESEARCHER',
  THUMBNAIL_GENERATOR = 'THUMBNAIL_GENERATOR',
  CONTENT_ANALYZER = 'CONTENT_ANALYZER',
  TEXT_TO_SPEECH = 'TEXT_TO_SPEECH',
  INSTANT_IDEAS = 'INSTANT_IDEAS',
  GROWTH_KIT = 'GROWTH_KIT',
  SHORTS_GENERATOR = 'SHORTS_GENERATOR'
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
  color: string;
  promptTemplate: (topic: string) => string;
  buttonText: string;
  isNew?: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  TOOL = 'TOOL',
  PRIVACY = 'PRIVACY',
  TERMS = 'TERMS',
  CONTACT = 'CONTACT',
  ABOUT = 'ABOUT',
  DISCLAIMER = 'DISCLAIMER',
  BLOG = 'BLOG',
  BLOG_POST = 'BLOG_POST'
}

export interface GeneratedResult {
  text: string;
  image?: string;
  audio?: string;
  groundingChunks?: Array<{
    web?: { uri: string; title: string };
  }>;
  isError: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string; // HTML string
  image: string;
}
