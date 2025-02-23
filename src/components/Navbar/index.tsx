import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  return (
    <nav
      className={cn(
        'w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-5',
        className,
      )}
    >
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <img
              src="https://cdn.prod.website-files.com/6796783f35faa4c61a224a54/67968a44a6dd4f0210e7f803_horizontal.png"
              alt="Company Logo"
              className="h-8 w-auto"
            />
          </a>
        </div>
      </div>
    </nav>
  );
};
