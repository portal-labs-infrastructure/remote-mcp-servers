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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ratings & Reviews</h2>
        {showLeaveReviewButton && (
          <Button onClick={() => setEditingReview({} as ReviewWithProfile)}>
            Leave a Review
          </Button>
        )}
      </div>
      {/* Card bg is muted when the form is open: */}
      <Card className={editingReview ? 'bg-muted' : 'bg-background'}>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-12">
            {initialReviews.length === 0 && !showForm && (
              <div className="text-center py-12">
                <MessageSquarePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Reviews Yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Be the first to share your experience.
                </p>
                {currentUserId && (
                  <Button
                    className="mt-6"
                    onClick={() => setEditingReview({} as ReviewWithProfile)}>
                    Leave the First Review
                  </Button>
                )}
              </div>
            )}

            {initialReviews.length > 0 && (
              <div className="space-y-6">
                {initialReviews.map((review) => (
                  <div key={review.id} className="flex gap-4">
                    <Avatar>
                      <AvatarImage
                        src={review.profile.avatar_url ?? undefined}
                        alt={review.profile.username ?? 'User avatar'}
                      />
                      <AvatarFallback>
                        {review.profile.username?.[0].toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">
                          {review.profile.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>

                      {review.profile.user_id === currentUserId &&
                        !editingReview && (
                          <div className="flex items-start gap-1 mt-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditClick(review)}>
                              <Edit className="h-4 w-4" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    {userHasReviewed ? 'Edit Your Review' : 'Leave a Review'}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingReview(null)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    <p className="text-sm text-muted-foreground">
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
