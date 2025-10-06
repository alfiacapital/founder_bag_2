import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../Modal.jsx";
import {axiosClient} from "../../api/axios.jsx";
import {useQueryClient} from "@tanstack/react-query";
import {toast} from "react-toastify";

const defaultColors = [
    "#3b82f6", // blue
    "#facc15", // yellow
    "#22d3ee", // cyan
    "#fb923c", // orange
    "#9ca3af", // gray
    "#f87171", // red
    "#4ade80", // green
];

function SpaceForm({ open, onClose, initialData = null, mode = "create" }) {
    const [customColor, setCustomColor] = useState("#ff7ce5");
    const [isCustomColorSelected, setIsCustomColorSelected] = useState(false);
    const [previewImage, setPreviewImage] = useState(initialData?.image || null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        defaultValues: {
            title: initialData?.name || "",
            color: initialData?.color || customColor,
            icon: initialData?.image || null,
        },
    });

    const watchedColor = watch("color");
    const queryClient = useQueryClient();
    const handleCustomColorChange = (e) => {
        const newColor = e.target.value;
        setCustomColor(newColor);
        setIsCustomColorSelected(true);
        setValue("color", newColor, { shouldValidate: true });
    };

    const handlePredefinedColorSelect = (color) => {
        setIsCustomColorSelected(false);
        setValue("color", color);
    };

    const handleCustomColorClick = () => {
        setIsCustomColorSelected(true);
        setValue("color", customColor);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
            setValue("icon", file); // keep file reference
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.title);
            formData.append("color", data.color);
            if (mode === "edit") {
                formData.append("newName", data.title);
            }
            if (data.icon instanceof File) {
                formData.append("image", data.icon);
            }

            if (mode === "edit") {
                await axiosClient.put(`/space/${initialData._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Space updated successfully!");
            } else {
                await axiosClient.post(`/space/create`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Space created successfully!");
            }

            await queryClient.invalidateQueries("spaces");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        }
    };


    return (
        <Modal isOpen={open} onClose={onClose} size="md">
            <div className="flex justify-center items-center min-h-full p-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col items-center  py-8 px-10 w-full max-w-md mx-auto"
                >
                    <h1 className="text-xl font-bold text-dark-text1 mb-10">
                        {mode === "edit" ? "Edit space" : "Create a new space"}
                    </h1>

                    {/* Icon upload with preview */}
                    <div className="flex flex-col items-center mb-4">
                        <label className="flex flex-col items-center cursor-pointer">
                            <div className="w-16 h-16 rounded-full bg-dark-bg2 flex items-center justify-center overflow-hidden border border-dark-stroke">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="preview"
                                        className="w-full h-full object-center"
                                    />
                                ) : (
                                    <span className="text-2xl text-gray-400">📷</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.svg"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                        <span className="text-lg font-bold text-dark-text1 mt-4">UPLOAD AN ICON</span>
                        <span className="text-xs text-dark-text2 mt-1 text-center">
                            Optional (jpg, png, svg)
                        </span>
                    </div>

                    {/* Color picker */}
                    <div className="flex flex-col w-full mb-4">
                        <span className="text-dark-text2 font-normal text-start pb-1">
                            Pick space color
                        </span>
                        <div className="flex gap-3 justify-start items-center overflow-x-auto pb-1">
                            {defaultColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-6 h-6 rounded-full border-2 transition-all flex-shrink-0 cursor-pointer ${
                                        !isCustomColorSelected && watchedColor === color
                                            ? "border-white scale-110"
                                            : "border-transparent hover:border-dark-stroke"
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handlePredefinedColorSelect(color)}
                                />
                            ))}

                            {/* Custom color */}
                            <div className="relative top-1 flex-shrink-0">
                                <button
                                    type="button"
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                                        isCustomColorSelected
                                            ? "border-white scale-110"
                                            : "border-transparent hover:border-dark-stroke"
                                    }`}
                                    style={{
                                        background: isCustomColorSelected
                                            ? customColor
                                            : "linear-gradient(to right, #ec4899, #8b5cf6, #3b82f6)",
                                    }}
                                    onClick={handleCustomColorClick}
                                />
                                <input
                                    type="color"
                                    value={customColor}
                                    onChange={handleCustomColorChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                                    title="Choose custom color"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="w-full mb-4">
                        <input
                            type="text"
                            placeholder="Enter your list title"
                            className={`w-full px-3 py-2 pt-3 rounded-button border ${
                                errors.title ? "border-red-500" : "border-dark-stroke"
                            } bg-dark-bg2 text-dark-text1 focus:outline-none focus:border-dark-stroke text-left`}
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && (
                            <div className="text-left mt-1">
                                <span className="text-red-500 text-sm">
                                    {errors.title.message}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 w-full justify-center pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 pt-3 border border-dark-stroke rounded-button text-dark-text2 hover:bg-dark-hover  hover:border-dark-stroke transition-all duration-300 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 pt-3 rounded-button border border-dark-stroke text-dark-text2 hover:bg-dark-hover hover:border-dark-stroke transition-all duration-300 cursor-pointer"
                        >
                            {mode === "edit" ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

export default SpaceForm;
