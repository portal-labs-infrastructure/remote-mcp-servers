'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Edit, MessageSquarePlus } from 'lucide-react';
import { ReviewForm } from './review-form';
import { DeleteReviewDialog } from './delete-review-dialog';

interface ReviewsSectionProps {
  serverId: string;
  initialReviews: ReviewWithProfile[];
  currentUserId?: string;
}

export function ReviewsSection({
  serverId,
  initialReviews,
  currentUserId,
}: ReviewsSectionProps) {
  const [editingReview, setEditingReview] = useState<ReviewWithProfile | null>(
    null,
  );

  const userHasReviewed = initialReviews.some(
    (review) => review.profile.user_id === currentUserId,
  );
  const showLeaveReviewButton =
    currentUserId && !userHasReviewed && !editingReview;
  const showForm = !!editingReview;

  const handleEditClick = (review: ReviewWithProfile) => {
    setEditingReview(review);
  };

  const handleFormSuccess = () => {
    setEditingReview(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Ratings & Reviews
        </h2>
        {showLeaveReviewButton && (
          <Button
            onClick={() => setEditingReview({} as ReviewWithProfile)}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md">
            Leave a Review
          </Button>
        )}
      </div>

      <Card
        className={`shadow-lg transition-all duration-200 border-border/50 ${editingReview ? 'bg-muted/50 backdrop-blur-sm' : 'bg-card/80 backdrop-blur-sm'}`}>
        <CardContent className="pt-8">
          <div className="flex flex-col gap-12">
            {initialReviews.length === 0 && !showForm && (
              <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-xl bg-muted/20">
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <MessageSquarePlus className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-foreground">
                  No Reviews Yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Be the first to share your experience.
                </p>
                {currentUserId && (
                  <Button
                    className="mt-8 transition-all duration-200 hover:scale-105 hover:shadow-md"
                    onClick={() => setEditingReview({} as ReviewWithProfile)}>
                    Leave the First Review
                  </Button>
                )}
              </div>
            )}

            {initialReviews.length > 0 && (
              <div className="space-y-8">
                {initialReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Avatar className="h-12 w-12 border-2 border-border/50">
                      <AvatarImage
                        src={review.profile.avatar_url ?? undefined}
                        alt={review.profile.username ?? 'User avatar'}
                      />
                      <AvatarFallback className="font-semibold bg-primary/10 text-primary">
                        {review.profile.username?.[0].toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-foreground">
                          {review.profile.username}
                        </p>
                        <p className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-yellow-500 text-lg">
                          {'★'.repeat(review.rating)}
                          {'☆'.repeat(5 - review.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground font-medium">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {review.comment}
                      </p>

                      {review.profile.user_id === currentUserId &&
                        !editingReview && (
                          <div className="flex items-start gap-1 mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 transition-all duration-200 hover:scale-105"
                              onClick={() => handleEditClick(review)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <DeleteReviewDialog
                              reviewId={review.id}
                              serverId={serverId}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showForm && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl font-bold">
                    <span>
                      {userHasReviewed ? 'Edit Your Review' : 'Leave a Review'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="transition-all duration-200 hover:scale-105"
                      onClick={() => setEditingReview(null)}>
                      ✕
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    <p className="text-muted-foreground">
                      {userHasReviewed
                        ? 'Update your review details below.'
                        : 'Share your experience with this server.'}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewForm
                    serverId={serverId}
                    onSuccess={handleFormSuccess}
                    initialData={editingReview ?? undefined}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
