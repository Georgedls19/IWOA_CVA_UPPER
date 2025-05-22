import React from "react";

export default function ThemedCard({ title, children }) {
    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <div>{children}</div>
        </div>
    );
}
