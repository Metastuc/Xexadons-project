import { generateSparkle } from "@/utils/generateSparkles";
import SparkleInstance from "./sparkleInstance";

export default function Sparkles({ children }) {
    const sparkle = generateSparkle();
    return (
        <>
            <SparkleInstance
                color={sparkle.color}
                size={sparkle.size}
                style={sparkle.style}
            />
            {children}
        </>
    );
}
