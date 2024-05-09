import { commonProps } from "@/types";

type poolProps = commonProps & {
	activeTab: string;
};

export function Pool({ group, activeTab }: poolProps) {
	return <>pool stuff</>;
}
