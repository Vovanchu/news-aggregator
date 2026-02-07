import type { Article, Topic, AllowedSource, TopicItem } from "../types/type";

const CMS_URL = import.meta.env.VITE_CMS_URL || "http://localhost:1337";
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines?country=us";

// Get all allowed sources
export async function getAllowedSources(): Promise<string[]> {
  const res = await fetch(`${CMS_URL}/api/allowed-sources`);
  const json: { data: AllowedSource[] } = await res.json();

  return json.data.map((item) => item.name);
}

// Get all topics
export async function getTopics(): Promise<Topic[]> {
  const res = await fetch(`${CMS_URL}/api/topics`);
  const json: { data: TopicItem[] } = await res.json();

  return json.data.map((item) => ({
    title: item.title,
    keywords: item.keywords.split(",").map((k) => k.trim()),
  }));
}

// Get all news
export async function fetchNews(): Promise<Article[]> {
  const res = await fetch(`${NEWS_API_URL}&apiKey=${NEWS_API_KEY}`);
  const json = await res.json();
  return json.articles as Article[];
}

// Get news filtered by allowed sources
export async function getFilteredNews(): Promise<Article[]> {
  const [allowedSources, topics] = await Promise.all([
    getAllowedSources(),
    getTopics(),
  ]);

  const articles = await fetchNews();

  const filtered = articles.filter(
    (article) =>
      article.source?.name && allowedSources.includes(article.source.name),
  );

  return filtered.map((article) => {
    const matchedTopic = topics.find((topic) =>
      topic.keywords.some((keyword) =>
        (article.title + " " + (article.description || ""))
          .toLowerCase()
          .includes(keyword.toLowerCase()),
      ),
    );

    return {
      ...article,
      topic: matchedTopic ? matchedTopic.title : "Other",
    };
  });
}
