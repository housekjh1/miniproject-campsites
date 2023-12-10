import { Box, Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { TEAnimation } from "tw-elements-react";

const Join = () => {
  const id = useRef();
  const pass = useRef();

  useEffect(() => {
    id.current.focus();
    const isAuthenticated = localStorage.getItem('jwt');
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [])

  const [user, setUser] = useState({
    username: '',
    password: '',
    passwordConfirm: ''
  });

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [open5, setOpen5] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const join = async () => {
    if (user.username.trim() === '' || user.password.trim() === '' || user.passwordConfirm.trim() === '') {
      setOpen1(true);
      return;
    }

    const formData = new URLSearchParams();
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('passwordConfirm', user.passwordConfirm);

    await fetch(process.env.REACT_APP_SERVER_URL + 'join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })
      .then(resp => {
        if (resp.ok) {
          return resp.text();
        } else {
          throw new Error(`HTTP error! Status: ${resp.status}`);
        }
      })
      .then(data => {
        if (data === "ok") {
          setOpen2(true);
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else if (data === "passwordMatchFailure") {
          setOpen3(true);
          pass.current.focus();
        } else if (data === "usernameDuplication") {
          setOpen4(true);
          id.current.focus();
        } else {
          setOpen5(true);
        }
      })
      .catch(e => console.log(e));
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
  };

  const closeModal = () => {
    setOpen1(false);
    setOpen3(false);
    setOpen4(false);
    setOpen5(false);
  }

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      join();
    }
  };

  const handleModal = (e) => {
    if (e.key === 'Enter') {
      closeModal();
    }
  }

  return (
    <div className="font-KOTRAHOPE">
      <div className="flex justify-center items-start">
        <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)] h-auto md:w-[25rem] flex justify-center items-center">
          <div className="border-dashed rounded border-2 border-slate-500 p-10 my-5 md:w-[20rem] flex justify-center items-center">
            <div className="flex flex-col gap-4 font-bold">
              <p className="text-4xl font-bold text-slate-500 mb-5">Join</p>
              <input ref={id} className="border-slate-300 rounded md:w-[15rem] text-slate-700" type="text" name="username" placeholder="아이디를 입력하세요." onChange={handleChange} onKeyPress={handleOnKeyPress} />
              <input ref={pass} className="border-slate-300 rounded md:w-[15rem] text-slate-700" type="password" name="password" placeholder="비밀번호를 입력하세요." onChange={handleChange} onKeyPress={handleOnKeyPress} />
              <input className="border-slate-300 rounded md:w-[15rem] text-slate-700" type="password" name="passwordConfirm" placeholder="비밀번호 확인을 입력하세요." onChange={handleChange} onKeyPress={handleOnKeyPress} />
              <div className="flex flex-col md:flex-row justify-between items-center">
                <button className="basis-2/5 p-2 px-1 text-lg w-[5rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded mt-5" onClick={join}>Join</button>
                <p className="basis-2/5 text-slate-500 hover:text-blue-500 text-lg mt-[1.25rem] font-bold"><Link to='/login'>로그인 하기</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open1} onClose={closeModal} className="font-KOTRAHOPE" onKeyPress={handleModal}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">아이디 또는 비밀번호를 확인해 주세요.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
      <Modal open={open2} className="font-KOTRAHOPE">
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[browse-in_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">{user.username}님 환영합니다.<br />로그인해 주세요.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
      <Modal open={open3} onClose={closeModal} className="font-KOTRAHOPE" onKeyPress={handleModal}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">비밀번호가 일치하지 않습니다.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
      <Modal open={open4} onClose={closeModal} className="font-KOTRAHOPE" onKeyPress={handleModal}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">이미 등록된 사용자입니다.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
      <Modal open={open5} onClose={closeModal} className="font-KOTRAHOPE" onKeyPress={handleModal}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">알 수 없는 오류가 발생하였습니다.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
    </div>
  )
}

export default Join