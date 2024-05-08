import "./index.scss";

import { ReactNode } from "react";

export function GlassyBackground({ children }: { children: ReactNode }) {
	return <section className="glassy-background">{children}</section>;
}
