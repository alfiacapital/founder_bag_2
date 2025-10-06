import React from 'react';
import Menu from "@/components/Menu.jsx";
import {FaEllipsisVertical} from "react-icons/fa6";
import {formatDistanceToNow} from "date-fns";
import {getUserImage} from "@/utils/getUserImage.jsx";
import {useNavigate} from "react-router-dom";
import {useUserContext} from "@/context/UserProvider.jsx";
import {useQuery} from "@tanstack/react-query";
import {axiosClient} from "@/api/axios.jsx";

function CardsView({setDeleteModal, setShareModal, setManageUsersModal}) {
    const { data: notes, isLoading } = useQuery({
        queryKey: ["recently-notes"],
        queryFn: async () => {
            const res = await axiosClient.get(`/notes/recently`);
            return res.data.notes;
        },
    });
    const navigate = useNavigate();
    const {user} = useUserContext();

    if (isLoading) return <div>Loading...</div>;
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, key) => {
                let parsedDesc = "";
                try {
                    const json = JSON.parse(note.description);
                    parsedDesc = json?.content
                        ?.map((block) =>
                            block.content?.map((c) => c.text).join(" ")
                        )
                        .join(" ");
                } catch (e) {
                    parsedDesc = note.description;
                }

                return (
                    <div
                        key={key}
                        className="bg-dark-bg2 rounded-default shadow-sm border border-dark-stroke hover:border-dark-stroke p-5 hover:shadow-lg transition-all duration-300 flex flex-col"
                    >
                        {/* Header with title + menu */}
                        <div className="flex justify-between items-center mb-2">
                            <h2
                                onClick={() => navigate(`/note/${note._id}`)}
                                className="text-lg font-semibold text-dark-text1 truncate cursor-pointer hover:underline"
                            >
                                {note.title}
                            </h2>
                            <Menu
                                button={
                                    <button className="p-1.5 mb-2 rounded-button border border-dark-stroke hover:bg-dark-hover cursor-pointer text-dark-text2 hover:text-dark-text1">
                                        <FaEllipsisVertical />
                                    </button>
                                }
                                items={[
                                    {
                                        label: "Share",
                                        onClick: () => setShareModal({ isOpen: true, note }),
                                    },
                                    {
                                        label: "Manage",
                                        onClick: () => setManageUsersModal({ isOpen: true, note }),
                                    },
                                    {
                                        label: "Trash",
                                        onClick: () => setDeleteModal({ isOpen: true, note }),
                                    },
                                ]}
                            />
                        </div>

                        {/* Description */}
                        <p
                            onClick={() => navigate(`/note/${note._id}`)}
                            className="text-sm text-dark-text2 line-clamp-4 flex-1 cursor-pointer"
                        >
                            {parsedDesc}
                        </p>
                        {/* Footer */}
                        <div className="mt-4 flex justify-between items-center gap-2">
                            {/* Left: created time */}
                            <div className="text-xs text-dark-text2">
                                {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                            </div>

                            {/* Right: Owner + shared users */}
                            <div className="flex items-center -space-x-3">
                                {/* Owner avatar */}
                                <img
                                    className="border-2 border-dark-stroke bg-dark-bg rounded-full h-7 w-7 object-cover"
                                    src={getUserImage(user?.image)}
                                    alt={user?.full_name || "Owner"}
                                />

                                {/* Shared users avatars */}
                                {note.sharedWith &&
                                    note.sharedWith.slice(0, 4).map((user, key) => (
                                        <img
                                            key={key}
                                            className="border-2 border-dark-stroke bg-dark-bg rounded-full h-7 w-7 object-cover"
                                            src={getUserImage(user.image)}
                                            alt={user.full_name}
                                        />
                                    ))}

                                {/* Extra count if more than 4 shared users */}
                                {note.sharedWith && note.sharedWith.length > 4 && (
                                    <span className="flex items-center justify-center bg-dark-bg2 text-xs text-dark-text1 font-semibold border-2 border-dark-stroke rounded-full h-8 w-8 pt-1">
                                                    +{note.sharedWith.length - 4}
                                                  </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CardsView;
