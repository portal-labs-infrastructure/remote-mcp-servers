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
} from '../../actions/serverFormSchema'; // Assuming schema is in a separate file or defined above
import { submitServerAction } from '@/app/actions/submitServerAction'; // Assuming your action is updated

export default function AddNewServerPage() {
  const router = useRouter();
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: '',
      mcp_url: '',
      description: '',
      category: '',
      documentation_url: '',
      icon_url: '',
      maintainer_name: '',
      maintainer_url: '',
      authentication_type: 'OAuth2',
      dynamic_client_registration: false,
      is_official: false,
    },
  });

  async function onSubmit(values: ServerFormValues) {
    // Transform empty strings for optional URL fields to null if needed by server action/DB
    const payload = {
      ...values,
      documentation_url: values.documentation_url || null,
      icon_url: values.icon_url || null,
      maintainer_url: values.maintainer_url || null,
    };

    try {
      const result = await submitServerAction(payload); // Call your server action

      if (!result.success) {
        toast.error(result.error || 'Submission Failed', {
          description:
            result.message ||
            (result.fieldErrors
              ? 'Please check the form fields.'
              : 'An unknown error occurred.'),
        });
        // Set form errors if fieldErrors are returned
        if (result.fieldErrors) {
          for (const [fieldName, errors] of Object.entries(
            result.fieldErrors,
          )) {
            if (errors && errors.length > 0) {
              form.setError(fieldName as keyof ServerFormValues, {
                type: 'manual',
                message: errors.join(', '),
              });
            }
          }
        }
      } else {
        toast.success('Server Submitted!', {
          description: result.message || 'Your server is pending review.',
        });
        router.push('/dashboard'); // Redirect to dashboard
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      });
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-xl px-4 md:px-6 w-full">
      <h1 className="text-3xl font-bold mb-8">Register New MCP Server</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full">
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
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

          {/* Boolean Checkboxes */}
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
            {form.formState.isSubmitting
              ? 'Submitting...'
              : 'Submit for Review'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
