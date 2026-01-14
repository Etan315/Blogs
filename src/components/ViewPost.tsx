interface ViewPostProps {
  post: any | null;
  onClose: () => void;
}

export const ViewPost = ({ post, onClose }: ViewPostProps) => {
  if (!post) return null;

  return (
    <div className="modal-overlay view-post">
      <div className="modal-content">
        <header className="view-modal-header">
          <div className="author-info">
            <span className="author-name">{post.author_name}</span>
            <span className="dot post">&bull;</span>
            <span className="timestamp">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </header>

        <article className="full-post">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-content">
            {post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
};