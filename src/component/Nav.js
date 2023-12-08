import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { GiCampingTent } from "react-icons/gi";

const Nav = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [unRegisterOpen, setUnRegisterOpen] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const logout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("name");
        window.location.href = '/';
    }

    const openLoginModal = () => {
        setLoginOpen(true);
    }

    const handleUnRegister = () => {
        setUnRegisterOpen(true);
    }

    const closeUnRegister = () => {
        setUnRegisterOpen(false);
    }

    const doUnRegister = () => {
        console.log("탈퇴 실행");
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
                            <div className="flex flex-col justify-center items-center gap-4 px-2.5 py-1">
                                <p className="text-2xl text-center font-bold text-slate-700">로그아웃 하시겠습니까?</p>
                                <button className="p-1.5 px-1 w-[4.375rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded text-lg" onClick={logout}>로그아웃</button>
                                {
                                    localStorage.getItem("name") !== "admin" &&
                                    <div className="border-dashed border-2 border-slate-300 p-[0px] w-full" />
                                }
                                {
                                    localStorage.getItem("name") !== "admin" &&
                                    <button className="text-[1.125rem] text-center font-bold text-red-700 transition ease-in-out hover:-translate-y-0 hover:scale-125 duration-150" onClick={handleUnRegister}>회원탈퇴</button>
                                }
                            </div>
                        </Box>
                    </Modal>
                    <Modal
                        open={unRegisterOpen}
                        onClose={closeUnRegister}
                        className="font-KOTRAHOPE"
                    >
                        <Box sx={style} className="rounded-lg w-auto">
                            <div className="flex flex-col justify-center items-center gap-4 px-2.5 py-1">
                                <p className="text-2xl text-center font-bold text-slate-700">회원 정보를 삭제하시겠습니까?</p>
                                <button className="text-xl text-center font-bold text-red-700 hover:animate-shake" onClick={doUnRegister}>삭제</button>
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 font-KOTRAHOPE">
                <Link to="/">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 font-bold ">
                        <GiCampingTent className="text-2xl mt-1 text-yellow-500 hover:text-yellow-700" />
                        <div className="text-2xl text-slate-500 hover:text-blue-500">전국 야영장 등록 현황</div>
                    </div>
                </Link>
                <div>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2" onClick={openLoginModal}>
                        <Link to="/login"><button className="text-xl font-bold text-slate-500 hover:text-blue-500">Login</button></Link>
                        <div className="text-xl font-bold text-slate-500">/</div>
                        <Link to="/join"><button className="text-xl font-bold text-slate-500 hover:text-blue-500">Join</button></Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Nav