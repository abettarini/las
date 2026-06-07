import React from 'react'

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`w-[${width}px] h-[${height}px] object-cover ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      {...props}
    />
  )
}

