import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiCampingTent } from "react-icons/gi";

const Nav = () => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("name");
        window.location.href = '/login';
    }

    if (localStorage.getItem("jwt")) {
        return (
            <div className="flex flex-col sm:flex-row sm:justify-between items-center font-KOTRAHOPE">
                <Link to="/">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 font-bold ">
                        <GiCampingTent className="text-2xl mt-1 text-yellow-500 hover:text-yellow-700" />
                        <div className="text-2xl text-slate-500 hover:text-blue-500">전국 야영장 등록 현황</div>
                    </div>
                </Link>
                <div>
                    <div className="flex justify-center items-center gap-2" onClick={openModal}>
                        <button className="text-xl font-bold text-slate-500 hover:text-blue-500">{localStorage.getItem("name")}</button>
                    </div>
                    <Modal open={isModalOpen} onClose={closeModal} className="font-KOTRAHOPE">
                        <Box sx={style} className="rounded-lg w-auto">
                            <div className="flex flex-col justify-center items-center gap-4">
                                <p className="text-2xl">로그아웃 하시겠습니까?</p>
                                <button className="p-1 px-1 w-[5rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded" onClick={logout}>로그아웃</button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col sm:flex-row sm:justify-between items-center font-KOTRAHOPE">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 font-bold ">
                    <GiCampingTent className="text-2xl mt-1 text-yellow-500 hover:text-yellow-700" />
                    <div className="text-2xl text-slate-500 hover:text-blue-500">전국 야영장 등록 현황</div>
                </div>
                <div></div>
            </div>
        )
    }
}

export default Nav