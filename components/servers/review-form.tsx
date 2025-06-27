'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  submitReviewAction,
  type ReviewFormValues,
} from '@/app/actions/serverActions';
import { reviewFormSchema } from '@/app/actions/reviewFormSchema';

interface ReviewFormProps {
  serverId: string;
  onSuccess: () => void; // Function to call after successful submission
  initialData?: ReviewWithProfile; // Make initialData optional
}

export function ReviewForm({
  serverId,
  onSuccess,
  initialData,
}: ReviewFormProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: initialData?.rating ?? 0,
      comment: initialData?.comment ?? '',
      serverId: serverId,
    },
  });

  async function onSubmit(values: ReviewFormValues) {
    try {
      const result = await submitReviewAction(values);
      if (result.success) {
        toast.success(result.message);
        form.reset();
        onSuccess(); // Hide the form
      } else {
        toast.error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error('An unexpected error occurred.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <SelectItem key={star} value={String(star)}>
                      {'★'.repeat(star)}
                      {'☆'.repeat(5 - star)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell others about your experience with this server..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
