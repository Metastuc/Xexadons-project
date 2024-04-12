// Default color is a bright yellow
const DEFAULT_COLOR = "hsl(50deg, 100%, 50%)";

// Function to generate random sparkle at di
export const generateSparkle = (color = DEFAULT_COLOR) => {
    return {
        id: String(Math.random(10000, 99999)),
        createdAt: Date.now(),
        // Bright yellow color:
        color,
        size: Math.random(10, 20),
        style: {
            // Pick a random spot in the available space
            top: Math.random(0, 100) + "%",
            left: Math.random(0, 100) + "%",
            // Float sparkles above sibling content
            zIndex: 2,
        },
    };
};