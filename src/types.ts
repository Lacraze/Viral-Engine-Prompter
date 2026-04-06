export interface VideoIdea {
  title: string;
  thumbnailConcept: string;
  concept: string;
  estimatedViews: string;
  trendingReason: string;
}

export interface GenerationResult {
  ideas: VideoIdea[];
  niche: string;
  timestamp: string;
}
