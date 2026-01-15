import { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { supabase } from "../supabaseClient";
import { EditPost } from "./modals/EditPost";

export const ViewPost = ({ post, onClose, onRefresh }: any) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!post) return null;

  const isAuthor = user && user.id === post.user_id;

  // Instant Delete Function
  const handleInstantDelete = async () => {
    setLoading(true);
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className="modal-overlay view-post">
      <div className="modal-content">
        <header className="view-modal-header">
          <div className="author-info">
            <span className="author-name">{post.author_name}</span>
            <span className="dot post">&bull;</span>
            <span className="timestamp">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="header-actions">
            {isAuthor && (
              <>
                <button
                  className="icon-btn edit"
                  onClick={() => setIsEditOpen(true)}
                >
                  ✎
                </button>
                <button
                  className="icon-btn delete"
                  onClick={handleInstantDelete}
                  disabled={loading}
                >
                  {loading ? "..." : "🗑"}
                </button>
              </>
            )}
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
        </header>

        <article className="full-post">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-content">
            {post.content
              .split("\n")
              .map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        </article>

        <EditPost
          post={post}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onUpdate={() => {
            onRefresh();
            onClose();
          }}
        />
      </div>
    </div>
  );
};
