'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AUTHENTICATION_TYPES,
  serverFormSchema,
  type ServerFormValues,
} from '@/app/actions/serverFormSchema';
import {
  createServerAction,
  updateServerAction,
} from '@/app/actions/serverActions';

// Define the props for our reusable form
interface ServerFormProps {
  initialData?: DiscoverableMcpServer; // Make initialData optional
}

export function ServerForm({ initialData }: ServerFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    // Use initialData for defaultValues if in edit mode
    defaultValues: {
      name: initialData?.name ?? '',
      mcp_url: initialData?.mcp_url ?? '',
      description: initialData?.description ?? '',
      category: initialData?.category ?? '',
      documentation_url: initialData?.documentation_url ?? '',
      icon_url: initialData?.icon_url ?? '',
      maintainer_name: initialData?.maintainer_name ?? '',
      maintainer_url: initialData?.maintainer_url ?? '',
      authentication_type: initialData?.authentication_type ?? 'None',
      dynamic_client_registration:
        initialData?.dynamic_client_registration ?? false,
      is_official: initialData?.is_official ?? false,
    },
  });

  async function onSubmit(values: ServerFormValues) {
    // This part is slightly different: we call the action directly
    const actionPromise = isEditMode
      ? updateServerAction({ ...values, id: initialData!.id })
      : createServerAction(values);

    try {
      const result = await actionPromise;

      if (!result.success) {
        toast.error(result.error || 'Action Failed', {
          description: result.message || 'Please check the form for errors.',
        });
        if (result.fieldErrors) {
          // ... (error handling is the same)
        }
      } else {
        // --- CHANGE IS HERE ---
        toast.success(isEditMode ? 'Server Updated!' : 'Server Submitted!', {
          description: result.message,
        });

        // Redirect to the dashboard after a short delay to allow the user to see the toast.
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000); // 1-second delay
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred.');
    }
  }

  const authenticationType = form.watch('authentication_type');
  const showDynamicRegistration = authenticationType === 'OAuth2';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {/* Required Fields */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Server Name *</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome MCP Server" {...field} />
              </FormControl>
              <FormDescription>
                A human-readable name for your server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mcp_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MCP URL *</FormLabel>
              <FormControl>
                <Input placeholder="https://mcp.example.com/v1" {...field} />
              </FormControl>
              <FormDescription>
                The primary endpoint for your MCP server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Productivity, AI Agent, Utility"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The primary category your server falls into.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Optional Text Fields */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about your server..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authentication_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Type *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select authentication method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AUTHENTICATION_TYPES.map((authType) => (
                    <SelectItem key={authType} value={authType}>
                      {authType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                The primary authentication method supported by the server.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boolean Checkboxes */}
        {showDynamicRegistration && (
          <FormField
            control={form.control}
            name="dynamic_client_registration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Supports Dynamic Client Registration?</FormLabel>
                  <FormDescription>
                    Does your server support dynamic client registration as per
                    MCP specs?
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Optional URL Fields */}
        <FormField
          control={form.control}
          name="documentation_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentation URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://docs.example.com"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/logo.png"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Maintainer Info */}
        <FormField
          control={form.control}
          name="maintainer_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintainer Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name / Organization"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="maintainer_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintainer URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://your-website.com"
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_official"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Official Server?</FormLabel>
                <FormDescription>
                  Is this an official server provided by the primary service
                  maintainer?
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full">
          {form.formState.isSubmitting ? 'Submitting...' : 'Submit Server'}
        </Button>
      </form>
    </Form>
  );
}
