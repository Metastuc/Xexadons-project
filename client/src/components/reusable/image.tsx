import Image from "next/image";
import { JSX } from "react";

import { nextImageProps } from "@/types";

/**
 * `NextOptimizedImage` is a function component that uses the `next/image` Image component
 * to display an image with specific properties.
 *
 * @param {nextImageProps} props - The properties that define the image.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alternative text for the image, which gets used if the image fails to load, or by screen readers.
 * @param {string} props.group - The CSS class name for the image.
 *
 * @returns {JSX.Element} A Next.js Image component with the specified properties.
 */
export function NextOptimizedImage({
	src,
	alt,
	group,
}: nextImageProps): JSX.Element {
	return (
		<Image
			src={src}
			alt={alt!}
			className={group}
			width={0}
			height={0}
			sizes="(100vw, 100vh)"
		/>
	);
}
