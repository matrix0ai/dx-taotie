// The Taotie mark, served from public/favicon.svg. It carries its own dark
// tile, so it reads on both the light and dark theme.
export function BrandMark({ className = 'size-5' }: { className?: string }) {
  return <img src="/favicon.svg" alt="" aria-hidden="true" className={`${className} rounded-[5px]`} />
}
