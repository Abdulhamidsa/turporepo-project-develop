/**
 * Utility functions for image optimization
 */

/**
 * Generates a high-quality URL for Cloudinary images
 *
 * @param url - The original image URL
 * @param options - Options for image optimization
 * @returns Optimized image URL or placeholder if URL is empty
 */
export function getHighQualityImageUrl(
  url: string | undefined,
  options: {
    placeholderUrl?: string;
    width?: number;
    height?: number;
    quality?: 'good' | 'best' | 'eco';
    crop?: 'fill' | 'fit' | 'limit' | 'crop';
    focus?: 'face' | 'auto' | 'center';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {},
) {
  const {
    placeholderUrl = '/placeholder.svg',
    width = 1200,
    height,
    quality = 'best',
    crop = 'limit',
    focus = 'auto',
    format = 'auto',
  } = options;

  if (!url) return placeholderUrl;

  // Handle Cloudinary URLs
  if (url.includes('cloudinary.com')) {
    // Convert quality option to Cloudinary parameter
    const qualityParam =
      quality === 'best' ? 'q_auto:best' : quality === 'good' ? 'q_auto:good' : 'q_auto:eco';

    // Build transformation parameters
    let transformations = `${qualityParam},f_${format},w_${width}`;

    // Add height if specified
    if (height) {
      transformations += `,h_${height}`;
    }

    // Add crop and gravity/focus parameters
    transformations += `,c_${crop}`;

    // Add gravity/focus parameter if crop is fill or crop
    if ((crop === 'fill' || crop === 'crop') && focus) {
      const gravityParam = focus === 'face' ? 'g_face' : focus === 'auto' ? 'g_auto' : 'g_center';
      transformations += `,${gravityParam}`;
    }

    // Apply high DPI for sharper images
    transformations += ',dpr_2.0';

    // Replace the upload part with our transformations
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  // For non-Cloudinary URLs, return as-is
  return url;
}

/**
 * Specialized function for profile pictures
 */
export function getProfileImageUrl(url: string | undefined, size: number = 400) {
  if (!url) return '/placeholder.svg';

  return getHighQualityImageUrl(url, {
    width: size,
    height: size,
    crop: 'fill',
    focus: 'face',
    quality: 'best',
  });
}

/**
 * Specialized function for project thumbnails
 */
export function getProjectImageUrl(url: string | undefined, width: number = 1200) {
  if (!url) return '/placeholder.svg';

  return getHighQualityImageUrl(url, {
    width,
    crop: 'limit',
    quality: 'best',
  });
}

/**
 * Specialized function for project media (high quality)
 */
export function getProjectMediaUrl(url: string | undefined, width: number = 1600) {
  if (!url) return '/placeholder.svg';

  return getHighQualityImageUrl(url, {
    width,
    crop: 'limit',
    quality: 'best',
  });
}
