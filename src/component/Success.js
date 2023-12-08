import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import KakaoMapDetail from "./KakaoMapDetail";
import { Box, Modal } from "@mui/material";
import { TEAnimation } from "tw-elements-react";

const Success = ({ data }) => {
  const area = useParams().area;
  const search = useRef();
  const [openBlank, setOpenBlank] = useState(false);
  const [openSC, setOpenSC] = useState(false);

  useEffect(() => {
    search.current.focus();
  }, [])

  const handleClick = async (e) => {
    e.preventDefault();
    let keyword = search.current.value;
    let filter = keyword.indexOf('/') !== -1 || keyword.indexOf('\\') !== -1 || keyword.indexOf('.') !== -1 || keyword.indexOf('?') !== -1 || keyword.indexOf('#') !== -1;
    if (keyword.trim() === '') {
      setOpenBlank(true);
      return;
    } else if (filter) {
      setOpenSC(true);
      return;
    }
    window.location.href = `/search/${keyword}`;
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

  const closeBlank = () => {
    setOpenBlank(false);
    search.current.value = '';
    search.current.focus();
  }

  const closeSC = () => {
    setOpenSC(false);
    let keyword = search.current.value;
    search.current.value = keyword.replaceAll('/', '').replaceAll('\\', '').replaceAll('.', '').replaceAll('?', '').replaceAll('#', '');
    search.current.focus();
  }

  const handleBlank = (e) => {
    if (e.key === 'Enter') {
      closeBlank();
    }
  }

  const handleSC = (e) => {
    if (e.key === 'Enter') {
      closeSC();
    }
  }

  return (
    <div className="font-KOTRAHOPE">
      <div className="bg-white rounded p-5 mt-10 text-center shadow-[0px_0px_40px_-10px_rgba(0,0,0,0.3)] h-[36.5rem] sm:h-[45.5rem] md:h-[45.5rem]">
        <div>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-3">
            <input className="font-bold border-slate-300 rounded md:w-[15rem] text-slate-700" ref={search} type="text" id="search" name="search" placeholder="장소를 검색하세요." defaultValue={area && area.trim()} />
            <button className="p-1 px-1 w-[3rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded" onClick={handleClick}>검색</button>
          </form>
        </div>
        <div>
          <KakaoMapDetail data={data} area={area} />
        </div>
      </div>
      <Modal open={openBlank} onClose={closeBlank} className="font-KOTRAHOPE" onKeyPress={handleBlank}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">장소를 입력하세요.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
      <Modal open={openSC} onClose={closeSC} className="font-KOTRAHOPE" onKeyPress={handleSC}>
        <Box sx={style} className="rounded-lg w-auto">
          <TEAnimation
            animation="[shake_0.5s]"
            start="onLoad"
          >
            <div>
              <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-1">특수문자를 입력하지 말아주세요.</p>
            </div>
          </TEAnimation>
        </Box>
      </Modal>
    </div>
  );
}

export default Success
