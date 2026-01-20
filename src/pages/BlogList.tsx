import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ViewPost } from "../components/ViewPost";

interface BlogListProps {
  refreshTrigger?: number;
  onRefresh: () => void;
}

export const BlogList = ({ refreshTrigger, onRefresh }: BlogListProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPosts();
  }, [page, refreshTrigger]);

  const fetchPosts = async () => {
    const from = page * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, count, error } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (!error && data) {
      setPosts(data);
      setTotalCount(count || 0);
    }
  };

  return (
    <div className="blog-list-container">
      <ViewPost
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onRefresh={onRefresh}
      />

      {posts.map((post) => (
        <article
          key={post.id}
          className="post-item"
          onClick={() => setSelectedPost(post)}
        >
          <div className="user-post-details">
            <span>{post.author_name}</span>{" "}
            <div className="time-Info">
              <span className="dot"> &bull; </span>{" "}
              <small>{new Date(post.created_at).toLocaleDateString()}</small>
            </div>
          </div>
          <h2>{post.title}</h2>
          <p>{post.content.substring(0, 150)}...</p>

          <div className="post-footer">
            <div className="comment-count-pill">
              <img src={CommentIcon} className="comment-icon" alt="Comments" />
              <span>{post.commentCount} comments</span>
            </div>
          </div>
        </article>
      ))}

      <div className="pagination-controls">
        <button disabled={page === 0} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span style={{ margin: "0 15px" }}>
          Page {page + 1} of {Math.ceil(totalCount / itemsPerPage)}
        </span>
        <button
          disabled={(page + 1) * itemsPerPage >= totalCount}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
