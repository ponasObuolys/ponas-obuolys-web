import React, { useState } from 'react';
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Card } from "../ui/card";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: Date;
  avatarUrl?: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  currentUser?: {
    name: string;
    avatarUrl?: string;
  };
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  onAddComment,
  currentUser
}) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Komentarai ({comments.length})</h3>
      
      {currentUser && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Parašykite komentarą..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={!newComment.trim()}>
            Komentuoti
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex items-start space-x-4">
              <Avatar>
                <img
                  src={comment.avatarUrl || "/default-avatar.png"}
                  alt={comment.author}
                />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{comment.author}</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.date).toLocaleDateString('lt-LT')}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}; 