export interface ArticleSource {
  id: string | null;
  name: string;
}

export interface Article {
  source: ArticleSource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  topic?: string;
}

export interface Topic {
  title: string;
  keywords: string[];
}

// В types/type.ts
export interface CMSItem<T> {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AllowedSource extends CMSItem<{}> {
  name: string;
}

export interface TopicItem extends CMSItem<{}> {
  title: string;
  keywords: string;
}
