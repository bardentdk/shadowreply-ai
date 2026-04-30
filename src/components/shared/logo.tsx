import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const SIZES = {
  sm: { icon: 'h-7 w-7', text: 'text-base' },
  md: { icon: 'h-9 w-9', text: 'text-lg' },
  lg: { icon: 'h-12 w-12', text: 'text-2xl' },
};

export function Logo({ className, size = 'md', href = '/' }: LogoProps) {
  const sizes = SIZES[size];

  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
      // Pour l'effet glossy rajouter la classe : glass-elevated
        className={cn(
          ' relative flex items-center justify-center rounded-xl',
          sizes.icon
        )}
      >
        {/* Pour l'arrière plan du logo : bg-gradient-to-br from-accent-primary to-accent-secondary */}
        <span
          className="absolute inset-0 rounded-xl  opacity-30 blur-md"
          aria-hidden
        />
            <svg className="w-52" viewBox="0 0 359 334" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M307.159 0C302.643 23.2668 295.407 30.7692 275.159 35.5C294.677 40.5588 302.624 47.069 307.159 70.5C311.764 49.6157 318.234 41.4622 339.159 35.5C318.49 30.1627 311.645 22.2215 307.159 0Z" fill="url(#paint0_linear_31_32)"/>
              <path d="M344.659 68.5C342.754 78.4008 339.701 81.5933 331.159 83.6064C339.393 85.7591 342.746 88.5294 344.659 98.5C346.602 89.6131 349.331 86.1435 358.159 83.6064C349.439 81.3352 346.552 77.956 344.659 68.5Z" fill="#7761E3"/>
              <path d="M174.159 238.5C173.659 242 147.406 306.306 112.659 334C143.537 328.409 163.592 318.451 203.659 290C258.041 290.293 283.632 280.519 316.659 237.5C341.159 195 339.159 159.5 316.659 117.5C294.159 75.5 237.305 56.282 188.159 70C147.659 81.5 126.659 132.5 171.159 167.5C174.026 170.198 174.327 172.005 173.659 175.5L161.659 219C160.208 223.268 160.262 225.322 164.159 227.5L170.159 230.5C173.323 232.189 174.159 238.5 174.159 238.5Z" fill="white"/>
              <circle cx="214.659" cy="184" r="9.5" fill="#1B1D2C"/>
              <circle cx="246.659" cy="184" r="9.5" fill="#1B1D2C"/>
              <circle cx="278.659" cy="184" r="9.5" fill="#1B1D2C"/>
              <path d="M53.8336 199.5C38.3336 185.5 1.44207 141.518 7.83356 100.5C3.56291 111.91 0.833558 133 0.833558 133C-10.3844 229.055 95.3336 284.5 95.3336 284.5C116.158 297.312 119.867 308.048 112.334 333.5C119.556 325.493 122.827 320.296 125.334 308C134.834 266.5 118.031 239.058 86.8336 221.5C73.0947 214.677 69.3336 213.5 53.8336 199.5Z" fill="#7761E3"/>
              <path d="M81.659 181.5L66.659 163L120.159 179.5C126.176 181.797 128.42 184.396 131.159 190.5H105.659C92.7936 190.42 88.0417 187.954 81.659 181.5Z" fill="white" stroke="black"/>
              <defs>
                <linearGradient id="paint0_linear_31_32" x1="307.159" y1="0" x2="307.159" y2="70.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B1D2C"/>
                <stop offset="1" stopColor="#7761E3"/>
                </linearGradient>
              </defs>
            </svg>

        
        {/* <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative h-1/2 w-1/2"
        >
          <path
            d="M3 12C3 7 7 3 12 3C17 3 21 7 21 12C21 17 17 21 12 21"
            stroke="url(#gradient1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M12 8V12L15 14"
            stroke="url(#gradient1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient1" x1="3" y1="3" x2="21" y2="21">
              <stop stopColor="#a855f7" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg> */}
      </div>
      {/* <span className={cn('font-bold tracking-tight', sizes.text)}>
        Shadow<span className="gradient-text">Reply</span>
      </span> */}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline-none"
      >
        {content}
      </Link>
    );
  }

  return content;
}