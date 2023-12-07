import { useEffect, useRef, useState } from "react";
import campImg from '../static/imgs/camping-48_48.png';
import { AiOutlineComment } from "react-icons/ai";
import { GiForestCamp } from "react-icons/gi";
import { FaVanShuttle } from "react-icons/fa6";
import { GiBarracksTent } from "react-icons/gi";
import { FaCaravan } from "react-icons/fa6";
import { FaRestroom } from "react-icons/fa";
import { FaShower } from "react-icons/fa6";
import { GiTap } from "react-icons/gi";
import { FaFireExtinguisher } from "react-icons/fa6";
import { FaBucket } from "react-icons/fa6";
import { FaBitbucket } from "react-icons/fa6";
import { MdOutlineSensors } from "react-icons/md";
import { RiHome5Fill } from "react-icons/ri";
import { Box, Modal } from "@mui/material";
import { TEAnimation } from "tw-elements-react";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const KakaoMapCamp = ({ area, camp }) => {
    const [data, setData] = useState();
    const [comment, setComment] = useState();
    const [commentTag, setCommentTag] = useState();
    const [campinfo, setCampinfo] = useState();
    const [campinfoTag, setCampinfoTag] = useState();
    const inputComment = useRef('');
    const [inputValue, setInputValue] = useState('');
    const [inputResult, setInputResult] = useState();
    const [editCommentTag, setEditCommentTag] = useState();
    const [editResult, setEditResult] = useState();
    const [removeSeq, setRemoveSeq] = useState();
    const [removeResult, setRemoveResult] = useState();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/search/${area}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem("jwt")
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.json();
                setData(datas);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (!data) return;

        const mapScript = document.createElement('script');
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(mapScript);

        let tmp = data.filter(item => item.campName.trim() === camp.trim())[0];
        setCampinfo(tmp);
        let campLat = tmp.lat;
        let campLng = tmp.lng;

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');

                const mapOption = {
                    center: new window.kakao.maps.LatLng(campLat, campLng),
                    level: 2
                };

                let map = new window.kakao.maps.Map(mapContainer, mapOption);

                let mapTypeControl = new window.kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

                const positions = data.map(item => ({
                    content: `<div>${item.campName}</div>`,
                    latlng: new window.kakao.maps.LatLng(item.lat, item.lng),
                    camp: item.campName
                }));

                for (let i = 0; i < positions.length; i++) {
                    if (positions[i].camp.trim() === camp.trim()) {
                        let imageSrc = campImg;
                        let imageSize = new window.kakao.maps.Size(48, 48);
                        let imageOption = { offset: new window.kakao.maps.Point(24, 48) };

                        let markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

                        let marker = new window.kakao.maps.Marker({
                            map: map,
                            position: positions[i].latlng,
                            image: markerImage
                        });

                        let content = document.createElement('div');
                        content.innerHTML = positions[i].content;
                        content.style.cssText = 'background-color: rgb(255 255 255); border-style: dashed; border-width: 2px; border-color: rgb(245 158 11); border-radius: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; color: rgb(71 85 105); font-weight: 700;';

                        let customOverlay = new window.kakao.maps.CustomOverlay({
                            map: null,
                            position: positions[i].latlng,
                            content: content,
                            yAnchor: 2.375
                        });

                        new window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, customOverlay));
                        new window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(customOverlay));

                        // 마커에 클릭이벤트를 등록합니다
                        // new window.kakao.maps.event.addListener(marker, 'click', makeClickListener());

                        // function makeClickListener() {
                        //     return function () {
                        //         window.location.href = `/campsite/${area}/${positions[i].camp}`;
                        //     };
                        // };
                    } else {
                        let marker = new window.kakao.maps.Marker({
                            map: map,
                            position: positions[i].latlng
                        });

                        let content = document.createElement('div');
                        content.innerHTML = positions[i].content;
                        content.style.cssText = 'background-color: rgb(255 255 255); border-style: dashed; border-width: 2px; border-color: rgb(245 158 11); border-radius: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; color: rgb(71 85 105); font-weight: 700;';

                        let customOverlay = new window.kakao.maps.CustomOverlay({
                            map: null,
                            position: positions[i].latlng,
                            content: content,
                            yAnchor: 2.25
                        });

                        new window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, customOverlay));
                        new window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(customOverlay));

                        // 마커에 클릭이벤트를 등록합니다
                        new window.kakao.maps.event.addListener(marker, 'click', makeClickListener());

                        function makeClickListener() {
                            return function () {
                                window.location.href = `/campsite/${area}/${positions[i].camp}`;
                            };
                        };
                    }
                };

                function makeOverListener(map, customOverlay) {
                    return function () {
                        customOverlay.setMap(map);
                    };
                };

                function makeOutListener(customOverlay) {
                    return function () {
                        customOverlay.setMap(null);
                    };
                };
            });
        };

        mapScript.addEventListener('load', onLoadKakaoMap);

        return () => {
            document.head.removeChild(mapScript);
        };

    }, [data]);

    useEffect(() => {
        setCampinfoTag(
            <div className="flex flex-col justify-between h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem]">
                <div>
                    <div className="flex flex-col gap-5">
                        <div className="px-2 mt-5 text-5xl font-bold text-slate-500">
                            {campinfo?.campName}
                        </div>
                        <div className="text-xl font-bold text-slate-500 mx-5">
                            {`~ ${campinfo?.campType} ~`}<br />
                            {`주소 : ${campinfo?.address}`}
                        </div>
                        <div className="flex flex-col justify-center items-center gap-5 text-slate-500 font-bold mx-5">
                            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><GiForestCamp /></div>
                                        <div className="text-xl">일반야영장</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numNormCamp}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaVanShuttle /></div>
                                        <div className="text-xl">자동차야영장</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numCarCamp}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><GiBarracksTent /></div>
                                        <div className="text-xl">글램핑</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numGlamping}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaCaravan /></div>
                                        <div className="text-xl">카라반</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numCaravan}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaRestroom /></div>
                                        <div className="text-xl">화장실</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numRestroom}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaShower /></div>
                                        <div className="text-xl">샤워실</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numShowerRoom}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><GiTap /></div>
                                        <div className="text-xl">개수대</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numSink}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaFireExtinguisher /></div>
                                        <div className="text-xl">소화기</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numFireExtinguisher}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaBucket /></div>
                                        <div className="text-xl">방화수</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numFireExtinguisherWater}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-2xl"><FaBitbucket /></div>
                                        <div className="text-xl">방화사</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numFireSand}개
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-3xl"><MdOutlineSensors /></div>
                                        <div className="text-xl">화재감지기</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.numFireDetector}개
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-5">
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-3xl"><RiHome5Fill /></div>
                                        <div className="text-xl">기타부대시설 1</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.otherFacilities1 ? campinfo?.otherFacilities1 : '-'}
                                    </div>
                                </div>
                                <div className="px-4 py-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row gap-1.5 justify-center items-center">
                                        <div className="text-3xl"><RiHome5Fill /></div>
                                        <div className="text-xl">기타부대시설 2</div><br />
                                    </div>
                                    <div className="text-center">
                                        {campinfo?.otherFacilities2 ? campinfo?.otherFacilities2 : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row ml-5 mt-10 mb-5 gap-2 text-3xl text-slate-500">
                        <AiOutlineComment onClick={handleComment} className="transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-150" />
                    </div>
                </div>
            </div >
        );
    }, [campinfo]);

    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

    const handleComment = () => {
        let tmp = data.filter(item => item.campName.trim() === camp.trim())[0];
        const formData = new URLSearchParams();
        formData.append('campsiteName', tmp.campName);
        async function fetchComment() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': localStorage.getItem("jwt")
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.json();
                setComment(datas);
            } catch (error) {
                console.error(error);
            }
        }
        fetchComment();
        setOpen(true);
    }

    const CommentItem = ({ item, onEdit, onRemove }) => {
        return (
            <div className="px-4 py-2 mx-2 rounded shadow-[0px_0px_10px_-2px_rgba(0,0,0,0.3)] sm:w-[20rem]">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div>
                        <div className="flex flex-row justify-start items-center">
                            <div className="text-2xl font-bold text-slate-700">{item.writer}</div>
                            {item.edited && <p className="text-lg font-bold text-slate-700">&nbsp;(수정됨)</p>}
                        </div>
                        <div className="text-lg font-bold text-slate-600">
                            {item.content.split('\n').map((line, index) => (
                                <div key={index}>
                                    {line}
                                    {index !== item.content.split('\n').length - 1 && <br />}
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-bold text-slate-500">{item.createDate}</div>
                    </div>
                    {item.writer === localStorage.getItem("name") && (
                        <div className="flex flex-row gap-2">
                            <div
                                className="text-slate-700 transition ease-in-out hover:-translate-y-0 hover:scale-125 duration-150"
                                onClick={() => onEdit(item.seq)}
                            >
                                <FaEdit />
                            </div>
                            <div
                                className="text-slate-700 transition ease-in-out hover:-translate-y-0 hover:scale-125 duration-150"
                                onClick={() => onRemove(item.seq)}
                            >
                                <FaTrashCan />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    useEffect(() => {
        if (comment && comment.length > 0) {
            setCommentTag(
                comment.map(item => {
                    return (
                        <CommentItem key={item.seq} item={item} onEdit={handleEdit} onRemove={handleRemove} />
                    )
                })
            )
        } else {
            setCommentTag(
                <div className="text-2xl text-center font-bold text-slate-700">
                    <p>작성된 댓글이 없습니다.<br />
                        첫 댓글을 작성해 보세요.
                    </p>
                </div>
            )
        }
    }, [comment])

    const editRef = useRef();

    const handleEdit = (seq) => {
        let tmp = comment.filter(item => item.seq === seq)[0];
        const handleEditButtonClick = () => {
            handleEditButton(tmp);
        };
        setEditCommentTag(
            <div className="flex flex-col gap-4 px-5 py-2">
                <p className="text-4xl text-center font-bold text-slate-700">Edit</p>
                <div className="border-dashed border-2 border-slate-300 p-[0px] w-full" />
                <div className="flex flex-col gap-2">
                    <div className="text-xl font-bold text-slate-700">{localStorage.getItem("name")}</div>
                    <textarea ref={editRef} rows="4" className="border-2 border-slate-400 rounded-md text-slate-600 font-bold resize-none px-2 py-1" placeholder="댓글을 입력해 주세요." defaultValue={tmp.content} />
                    <div className="text-sm text-slate-500 font-bold">{tmp.createDate}</div>
                </div>
                <div className="border-dashed border-2 border-slate-300 p-[0px] w-full" />
                <div className="flex justify-center items-center">
                    <button className="p-1 px-1 w-[3rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded" onClick={handleEditButtonClick}>수정</button>
                </div>
            </div>
        );
        setOpenEdit(true);
    }

    const handleEditButton = (tmp) => {
        let value = editRef.current.value;
        if (value.trim() === '') {
            setOpenError(true);
            editRef.current.focus();
            return;
        }
        editFunc(tmp, value);
        closeEditModal();
    }

    const editFunc = (tmp, value) => {
        const formData = new URLSearchParams();
        formData.append('seq', tmp.seq);
        formData.append('content', value);
        async function fetchCommentEdit() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': localStorage.getItem("jwt")
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.text();
                setEditResult(datas);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCommentEdit();
    }

    useEffect(() => {
        if (editResult === "ok") {
            let tmp = data.filter(item => item.campName.trim() === camp.trim())[0];
            const formData = new URLSearchParams();
            formData.append('campsiteName', tmp.campName);
            async function fetchComment() {
                try {
                    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': localStorage.getItem("jwt")
                        },
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const datas = await response.json();
                    setComment(datas);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchComment();
            setEditResult();
        }
    }, [editResult])

    const handleRemove = (seq) => {
        setRemoveSeq(seq);
        setOpenRemove(true);
    }

    const handleRemoveButton = () => {
        removeFunc();
        closeRemoveModal();
    }

    const removeFunc = () => {
        const formData = new URLSearchParams();
        formData.append('seq', removeSeq);
        async function fetchCommentRemove() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment/remove`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': localStorage.getItem("jwt")
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.text();
                setRemoveResult(datas);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCommentRemove();
    }

    useEffect(() => {
        if (removeResult === "ok") {
            let tmp = data.filter(item => item.campName.trim() === camp.trim())[0];
            const formData = new URLSearchParams();
            formData.append('campsiteName', tmp.campName);
            async function fetchComment() {
                try {
                    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': localStorage.getItem("jwt")
                        },
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const datas = await response.json();
                    setComment(datas);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchComment();
            setRemoveSeq();
            setRemoveResult();
        }
    }, [removeResult])

    const handleInput = () => {
        if (inputValue.trim() === '') {
            setInputValue('');
            inputComment.current.focus();
            setOpenError(true);
            return;
        }
        let tmp = data.filter(item => item.campName.trim() === camp.trim())[0];
        const formData = new URLSearchParams();
        formData.append('campsiteName', tmp.campName);
        formData.append('writer', localStorage.getItem("name"));
        formData.append('content', inputValue);
        async function fetchCommentInput() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment/input`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': localStorage.getItem("jwt")
                    },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const datas = await response.text();
                setInputResult(datas);
            } catch (error) {
                console.error(error);
            }
        }
        fetchCommentInput();
    }

    useEffect(() => {
        if (inputResult === "ok") {
            setInputValue('');
            let tmp = data.filter(item => item.campName.trim() === camp.trim())[0];
            const formData = new URLSearchParams();
            formData.append('campsiteName', tmp.campName);
            async function fetchComment() {
                try {
                    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/comment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Authorization': localStorage.getItem("jwt")
                        },
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const datas = await response.json();
                    setComment(datas);
                } catch (error) {
                    console.error(error);
                }
            }
            fetchComment();
            setInputResult();
            inputComment.current.value = '';
        }
    }, [inputResult])

    const closeModal = () => {
        setOpen(false);
    }

    const closeEditModal = () => {
        setOpenEdit(false);
    }

    const closeRemoveModal = () => {
        setOpenRemove(false);
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-5">
                <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] w-full sm:basis-1/2"></div>
                <div className="mt-5 rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] w-full sm:basis-1/2 overflow-auto">
                    {campinfoTag}
                </div>
            </div>
            <Modal open={open} onClose={closeModal} className="font-KOTRAHOPE">
                <Box sx={style} className="rounded-lg w-auto">
                    <div className="flex flex-col justify-center items-center h-[35rem]">
                        <div className="text-5xl text-slate-700 text-center font-bold mb-4">Comment</div>
                        <div className="border-dashed border-2 border-slate-300 p-[0px] w-full" />
                        <div className="sm:w-[25rem] sm:h-[35rem] overflow-auto">
                            <div className="flex flex-col gap-5 my-5">
                                <div className="flex flex-col justify-center items-center gap-5">
                                    {commentTag}
                                </div>
                            </div>
                        </div>
                        <div className="border-dashed border-2 border-slate-300 p-[0px] w-full" />
                        <div className="mt-4">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                                <textarea ref={inputComment} rows="2" className="border-2 border-slate-400 rounded-md text-slate-700 font-bold resize-none px-2 py-1" onChange={handleInputChange} placeholder="댓글을 입력해 주세요." />
                                <button className="p-1 px-1 w-[3rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded" onClick={handleInput}>입력</button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openError}
                onClose={() => setOpenError(false)}
                className="font-KOTRAHOPE"
            >
                <Box sx={style} className="rounded-lg w-auto">
                    <TEAnimation
                        animation="[shake_0.5s]"
                        start="onLoad"
                    >
                        <div>
                            <p className="text-2xl text-center font-bold text-slate-700 px-2.5 py-2">댓글을 입력해 주세요.</p>
                        </div>
                    </TEAnimation>
                </Box>
            </Modal>
            <Modal
                open={openEdit}
                onClose={closeEditModal}
                className="font-KOTRAHOPE"
            >
                <Box sx={style} className="rounded-lg w-auto">
                    <div>
                        {editCommentTag}
                    </div>
                </Box>
            </Modal>
            <Modal
                open={openRemove}
                onClose={closeRemoveModal}
                className="font-KOTRAHOPE"
            >
                <Box sx={style} className="rounded-lg w-auto">
                    <div className="flex flex-col justify-center items-center gap-4 p-2.5">
                        <p className="text-2xl text-center font-bold text-slate-700">댓글을 삭제하시겠습니까?</p>
                        <button className="p-1 px-1 w-[3rem] bg-yellow-500 hover:bg-yellow-700 font-bold text-white rounded" onClick={handleRemoveButton}>삭제</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default KakaoMapCamp;