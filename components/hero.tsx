import SearchForm from '@/components/search-form';

export default async function Hero() {
  return (
    <section className="w-full py-24 md:py-32 lg:py-40 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Subtle background pattern - much more subtle in dark mode */}
      <div className="absolute inset-0 bg-grid-slate-200/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]" />

      <div className="relative m-auto container px-6 md:px-6 text-center">
        <div className="mb-12 md:mb-16 text-left md:text-center">
          <h1 className="text-5xl max-w-4xl mb-8 m-auto font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/70 leading-tight">
            Remote MCP Registry
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-lg leading-relaxed">
            Discover, add, and manage remote MCP servers through a powerful,
            standards-compliant API.
          </p>
        </div>

        <div className="mb-12 md:mb-16">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
