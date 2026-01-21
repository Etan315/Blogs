import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { type RootState } from "../store";
import { uploadImage } from "../utils/uploadImage";
import PhotoIcon from "../assets/ic-photo.svg";

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

  // Fetch comments for this specific post
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
      if (commentImage) {
        imgUrl = await uploadImage(commentImage);
      }

      const displayName = user?.user_metadata?.display_name || user?.email;

      await supabase.from("comments").insert([
        {
          post_id: postId,
          user_id: user.id,
          author_name: displayName,
          content: newComment,
          image_url: imgUrl,
        },
      ]);

      setNewComment("");
      setCommentImage(null);
      fetchComments();

      //This will refresh the page from the ViewPost.tsx
      if (onCommentAdded) {
        onCommentAdded();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comments-container">
      <h3 className="comment-header">Comments</h3>

      <div className="comments-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="header-comment">
              <strong>{c.author_name}</strong>
              <span className="timestamp">
                {new Date(c.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <p className="paragraph-comment">{c.content}</p>
            {c.image_url && (
              <div className="list-image-container">
                <img src={c.image_url} alt="" className="list-post-image" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Form to add new comment with another button to add photo */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          className="comment-input"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <div className="action-button">
          <div className="comment-upload-wrapper">
            <input
              type="file"
              id="comment-image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
            />
            <label htmlFor="comment-image-upload" className="add-photo-btn">
              <img src={PhotoIcon} alt="Add Photo" className="icon-photo" />
              <span>Add Photo</span>
            </label>

            {commentImage && (
              <span className="file-name-preview">{commentImage.name}</span>
            )}
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};
