import { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '../lib/api';
import { getToken, getUser } from '../lib/auth';
import type { CommentDTO } from '../types/engagement';

interface CommentSectionProps {
    articleId: number | string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
    const [comments, setComments] = useState<CommentDTO[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [newCommentText, setNewCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const currentUser = getUser();
    const token = getToken();

    const fetchComments = async (pageToFetch: number, append = false) => {
        setLoading(true);
        try {
            const data = await getComments(articleId, pageToFetch, 10);
            if (append) {
                setComments(prev => [...prev, ...data.content]);
            } else {
                setComments(data.content);
            }
            setHasMore(data.totalPages > pageToFetch + 1);
        } catch (err) {
            console.error('Failed to load comments', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(0);
        setPage(0);
    }, [articleId]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchComments(nextPage, true);
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        if (!newCommentText.trim()) return;

        setSubmitting(true);
        try {
            const comment = await addComment(articleId, newCommentText, token);
            setComments(prev => [comment, ...prev]);
            setNewCommentText('');
        } catch (err) {
            console.error('Failed to post comment', err);
            alert('Failed to post comment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!token) return;
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteComment(commentId, token);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Failed to delete comment', err);
            alert('Failed to delete comment. You may not be authorized.');
        }
    };

    const canDelete = (authorId: string) => {
        if (!currentUser) return false;
        return currentUser.userId === authorId || currentUser.staff === true;
    };

    return (
        <div className="comments-section mt-5 border-top pt-4">
            <h4>Comments</h4>
            
            {token ? (
                <form onSubmit={handleAddComment} className="mb-4">
                    <div className="mb-2">
                        <textarea 
                            className="form-control" 
                            rows={3}
                            placeholder="Add a comment..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            disabled={submitting}
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={submitting || !newCommentText.trim()}
                    >
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            ) : (
                <div className="alert alert-secondary">
                    Please log in to add a comment.
                </div>
            )}

            <div className="comments-list">
                {comments.length === 0 && !loading && (
                    <p className="text-muted">No comments yet. Be the first to start the conversation!</p>
                )}
                
                {comments.map(comment => (
                    <div key={comment.id} className="comment-card card mb-3 p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <strong>{comment.authorName}</strong>
                                <small className="text-muted ms-2">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </small>
                            </div>
                            {canDelete(comment.authorId) && (
                                <button 
                                    className="btn btn-sm btn-outline-danger border-0" 
                                    onClick={() => handleDelete(comment.id)}
                                    title="Delete Comment"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            )}
                        </div>
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{comment.text}</p>
                    </div>
                ))}

                {hasMore && (
                    <div className="text-center mt-3">
                        <button 
                            className="btn btn-outline-secondary" 
                            onClick={handleLoadMore}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Load More Comments'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
