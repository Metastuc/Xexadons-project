// import { create } from "zustand";

// import { UserProps } from "@/types";


// interface AuthState {
//     user: UserProps | undefined;
//     setUser: (user: UserProps | undefined) => void;
//     reset: () => void;
// }


// export const useAuthStore = create<AuthState>((set) => ({
// 	user: undefined,
// 	// setUser: (user: UserProps | undefined) => set({ user }),
// 	// setUser: function (user: UserProps | undefined) {
// 	// 	return set(function (state) {
// 	// 		return { ...state, user: user };
// 	// 	});
// 	// },
// 	reset: () => set({ user: undefined }),
// }));