import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiCampingTent } from "react-icons/gi";
import { useRecoilState } from "recoil";
import { userState } from './Recoil';
import { TEAnimation } from "tw-elements-react";

const Nav = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unRegisterOpen, setUnRegisterOpen] = useState(false);
    const [recoilName, setRecoilName] = useRecoilState(userState);
    const [username, setUsername] = useState();
    const [quitResult, setQuitResult] = useState();
    const [quitOpen, setQuitOpen] = useState(false);

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
        const currentUrl = window.location.href;
        window.location.href = currentUrl;
    }

    const handleUnRegister = () => {
        setUnRegisterOpen(true);
    }

    const closeUnRegister = () => {
        setUnRegisterOpen(false);
    }

    const closeQuit = () => {
        setQuitOpen(false);
        if (quitResult) {
            if (quitResult.key === "success" && quitResult.value === "ok") {
                localStorage.removeItem("jwt");
            }
        }
        const currentUrl = window.location.href;
        window.location.href = currentUrl;
    }

    const doUnRegister = () => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        async function fetchQuit() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}quit`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.json();
                setQuitResult(datas);
                closeUnRegister();
                closeModal();
                setQuitOpen(true);
            } catch (error) {
                console.error(error);
            }
        }
        fetchQuit();
    }

    useEffect(() => {
        if (localStorage.getItem("jwt")) {
            const formData = new URLSearchParams();
            formData.append('token', localStorage.getItem("jwt"));
            async function fetchMember() {
                try {
                    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}member`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const datas = await response.json();
                    setRecoilName(datas);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchMember();
        }
    }, [])

    useEffect(() => {
        if (recoilName.key === "success") {
            setUsername(recoilName.value);
        }
    }, [recoilName])

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
                        <button className="text-xl font-bold text-slate-500 hover:text-blue-500">{username}</button>
                    </div>
                    <Modal open={isModalOpen} onClose={closeModal} className="font-KOTRAHOPE">
                        <Box sx={style} className="rounded-lg w-auto">
                            <div className="flex flex-col justify-center items-center gap-4 px-2.5 py-1">
                                <p className="text-2xl text-center font-bold text-slate-700">로그아웃 하시겠습니까?</p>
                                <button className="p-1.5 px-1 w-[4.375rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded text-lg" onClick={logout}>로그아웃</button>
                                {
                                    username !== "admin" &&
                                    <div className="border-dashed border-2 border-slate-300 p-[0px] w-full" />
                                }
                                {
                                    username !== "admin" &&
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
                                <TEAnimation
                                    animation="[jiggle_0.5s]"
                                    start="onHover"
                                    reset
                                >
                                    <button className="text-xl text-center font-bold text-red-700" onClick={doUnRegister}>삭제</button>
                                </TEAnimation>
                            </div>
                        </Box>
                    </Modal>
                    <Modal
                        open={quitOpen}
                        onClose={closeQuit}
                        className="font-KOTRAHOPE"
                    >
                        <Box sx={style} className="rounded-lg w-auto">
                            <div className="flex flex-col justify-center items-center gap-4 px-2.5 py-1">
                                <TEAnimation
                                    animation="[browse-in_0.5s]"
                                    start="onLoad"
                                >
                                    <p className="text-2xl text-center font-bold text-slate-700">회원정보를 삭제하였습니다.</p>
                                </TEAnimation>
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
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
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