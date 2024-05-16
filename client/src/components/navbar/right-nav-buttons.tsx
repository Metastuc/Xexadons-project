import { ReactNode } from "react";

import { commonProps } from "@/types";

type ButtonOnTheRightProps = commonProps & {
	content: ReactNode | string;
	clickAction?: () => void | undefined;
};

export function RightNavigationButton({
	group,
	content,
	clickAction,
}: ButtonOnTheRightProps) {
	return (
		<>
			<button
				className={`${group}__right-button`}
				onClick={clickAction}
			>
				{typeof content === "string" ? (
					<span>{content}</span>
				) : (
					<i>{content}</i>
				)}
			</button>
		</>
	);
}
