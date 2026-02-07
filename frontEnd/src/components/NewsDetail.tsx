import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Article } from "../types/type";
import { getFilteredNews } from "../services/newsService";
import "../style/newsDetail.scss";

const NewsDetails = () => {
  const { url } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    void getFilteredNews().then((articles) => {
      const found = articles.find(
        (a) => a.url === decodeURIComponent(url || ""),
      );
      setArticle(found || null);
    });
  }, [url]);

  if (!article) return <p>Article not found</p>;

  return (
    <div className="news-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>{article.title}</h1>
      <p>{article.source.name}</p>
      <p>{article.topic}</p>
      <p>{new Date(article.publishedAt).toLocaleString()}</p>

      {article.urlToImage && (
        <img src={article.urlToImage} alt={article.title} />
      )}

      <p>{article.content}</p>

      <a href={article.url} target="_blank" rel="noopener noreferrer">
        Read original article
      </a>
    </div>
  );
};

export default NewsDetails;
