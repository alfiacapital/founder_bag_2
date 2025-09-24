export const getUserImage = (image) => {
    if (!image) return "/icon.png";
    if (image.startsWith("http://") || image.startsWith("https://")) return image;
    return `${import.meta.env.VITE_MAIN_APP_URL}${image}`;
};
