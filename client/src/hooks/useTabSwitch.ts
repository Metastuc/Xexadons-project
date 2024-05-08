"use client";

import { useState } from "react";

/**
 * Custom hook to manage tab switching functionality.
 * @param {string} initialTab - The initial active tab.
 * @returns {{ activeTab: string, handleTabClick: (tab: string) => void, tabIsActive: (tab: string) => string }}
 */
export const useTabSwitcher = function (initialTab: string) {
	const [activeTab, setActiveTab] = useState(initialTab);

	// Function to handle tab change
	const handleTabClick = (tab: string) => {
		setActiveTab(tab);
	};

	// Function to set styles class to active on the selected tab
	const tabIsActive = (tab: string) => (activeTab === tab ? "active" : null);

	return {
		activeTab,
		handleTabClick,
		tabIsActive,
	};
};