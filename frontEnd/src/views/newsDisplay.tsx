import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getFilteredNews } from "../services/newsService";
import type { Article } from "../types/type";
import "../style/newsDisplay.scss";

interface NewsDisplayProps {
  search: string;
}

const NewsDisplay = ({ search }: NewsDisplayProps) => {
  const [news, setNews] = useState<Article[]>([]);
  const [selectedSource, setSelectedSource] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) setLoading(true);
      const res = await getFilteredNews();
      if (isMounted) {
        setNews(res);
        setLoading(false);
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const sources = useMemo(
    () => Array.from(new Set(news.map((n) => n.source.name))),
    [news],
  );

  const filteredNews = useMemo(() => {
    return news
      .filter(
        (a) =>
          (selectedSource === "all" || a.source.name === selectedSource) &&
          a.title.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) =>
        sortOrder === "newest"
          ? new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          : new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime(),
      );
  }, [news, search, selectedSource, sortOrder]);

  // Pagination
  const pageCount = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const skeletons = Array.from({ length: itemsPerPage });

  return (
    <div className="main-container">
      <div className="news-display">
        {/* Controls */}
        <div className="news-controls">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">All sources</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* Grid news */}
        <div className="news-grid">
          {loading
            ? skeletons.map((_, idx) => (
                <div key={idx} className="news-card skeleton">
                  <div className="skeleton-img" />
                  <div className="skeleton-title" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ))
            : paginatedNews.map((article) => (
                <Link
                  key={article.url}
                  to={`/news/${encodeURIComponent(article.url)}`}
                >
                  <div className="news-card">
                    <div className="news-img-placeholder" />
                    <h3>{article.title}</h3>
                    <p>{article.source.name}</p>
                    <p>{article.topic}</p>
                    <p>{new Date(article.publishedAt).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
        </div>

        {/* Pagination controls */}
        {pageCount > 1 && !loading && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(pageCount)].map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={page === currentPage ? "active" : ""}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDisplay;
