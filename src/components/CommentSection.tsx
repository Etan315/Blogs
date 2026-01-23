import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { uploadImage } from "../utils/uploadImage";
import PhotoIcon from "../assets/ic-photo.svg";
import { EditComment } from "./modals/EditComment";

export const CommentSection = ({
  postId,
  onCommentAdded,
}: {
  postId: string;
  onCommentAdded?: () => void;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComment, setSelectedComment] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (data) setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to comment");
    setIsSubmitting(true);

    try {
      let imgUrl = null;
      if (commentImage) imgUrl = await uploadImage(commentImage);

      const displayName = user?.user_metadata?.display_name || user?.email;

      await supabase.from("comments").insert([
        {
          post_id: postId,
          user_id: user.id,
          author_name: displayName,
          content: newComment || null,
          image_url: imgUrl,
        },
      ]);

      setNewComment("");
      setCommentImage(null);
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (!error) {
      fetchComments();
      if (onCommentAdded) onCommentAdded();
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comment-header">Comments</h3>

      <div className="comments-list">
        {comments.map((c) => (
          <div
            key={c.id}
            className="comment-item"
            onMouseEnter={() => setHoveredCommentId(c.id)}
            onMouseLeave={() => setHoveredCommentId(null)}
          >
            <div className="header-comment">
              <div className="left">
                <strong>{c.author_name}</strong>
                <span className="timestamp">
                  {new Date(c.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {user?.id === c.user_id && hoveredCommentId === c.id && (
                <div className="comment-actions">
                  <button
                    onClick={() => {
                      setSelectedComment(c);
                      setIsEditModalOpen(true);
                    }}
                  >
                    ✎
                  </button>
                  <button onClick={() => handleDeleteComment(c.id)}>🗑</button>
                </div>
              )}
            </div>
            <p>{c.content}</p>
            {c.image_url && (
              <div className="list-image-container">
                <img src={c.image_url} className="comment-img" alt="Comment" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedComment && (
        <EditComment
          comment={selectedComment}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedComment(null);
          }}
          onUpdate={fetchComments}
        />
      )}

      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <div className="action-button">
          <div className="comment-upload-wrapper">
            <input
              type="file"
              id="comment-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
            />
            <label htmlFor="comment-upload" className="add-photo-btn">
              <img src={PhotoIcon} className="icon-photo" alt="" />
              <span>{commentImage ? commentImage.name : "Add Photo"}</span>
            </label>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
