import { useState, useEffect } from 'react';
import { getLikeStatus, toggleLike } from '../lib/api';
import { getToken } from '../lib/auth';

interface LikeButtonProps {
    articleId: number | string;
}

export default function LikeButton({ articleId }: LikeButtonProps) {
    const [likes, setLikes] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = getToken() || undefined;
                const status = await getLikeStatus(articleId, token);
                setLikes(status.totalLikes);
                setHasLiked(status.hasLiked);
            } catch (err) {
                console.error("Failed to load like status:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [articleId]);

    const handleToggle = async () => {
        const token = getToken();
        if (!token) {
            alert('Please log in to like this article.');
            return;
        }

        // Optimistic UI update
        const previousHasLiked = hasLiked;
        setHasLiked(!hasLiked);
        setLikes((prev) => (!hasLiked ? prev + 1 : prev - 1));

        try {
            const status = await toggleLike(articleId, token);
            // Confirm with server response
            setLikes(status.totalLikes);
            setHasLiked(status.hasLiked);
        } catch (err) {
            console.error("Failed to toggle like:", err);
            // Revert changes on error
            setHasLiked(previousHasLiked);
            setLikes((prev) => (previousHasLiked ? prev + 1 : prev - 1));
        }
    };

    if (loading) {
        return (
            <button className="btn btn-outline-secondary" disabled>
                <i className="bi bi-hand-thumbs-up"></i> Loading...
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline-primary'} d-flex align-items-center gap-2`}
        >
            <i className={`bi ${hasLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        </button>
    );
}
