'use client';

import { store } from "@/store";
import { Provider } from "react-redux";

interface ICustomProvider {
    children: React.ReactNode;
}

export const CustomProvider = ({ children }: ICustomProvider) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};