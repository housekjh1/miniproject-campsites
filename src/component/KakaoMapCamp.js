import { useEffect, useState } from "react";
import campImg from '../static/imgs/camping-48_48.png';
import { AiOutlineComment } from "react-icons/ai";
import { PiHeartStraight } from "react-icons/pi";
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

const KakaoMapCamp = ({ area, camp }) => {
    const [data, sedivata] = useState();
    const [campinfo, setCampinfo] = useState();
    const [campinfoTag, setCampinfoTag] = useState();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}api/detail/${area}`, {
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
                sedivata(datas);
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

        console.log(data);
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
                        content.style.cssText = 'background-color: rgb(255 255 255); border-style: dashed; border-width: 2px; border-color: rgb(245 158 11); border-radius: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; color: rgb(100 116 139); font-weight: 700;';

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
                        content.style.cssText = 'background-color: rgb(255 255 255); border-style: dashed; border-width: 2px; border-color: rgb(245 158 11); border-radius: 0.25rem; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.25rem; padding-bottom: 0.25rem; color: rgb(100 116 139); font-weight: 700;';

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
        console.log(campinfo);
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
                        <PiHeartStraight />
                        <AiOutlineComment />
                    </div>
                </div>
            </div >
        );
    }, [campinfo]);

    return (
        <div className="flex flex-col sm:flex-row gap-5">
            <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] w-full sm:basis-1/2"></div>
            <div className="mt-5 rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)] w-full sm:basis-1/2 overflow-auto">
                {campinfoTag}
            </div>
        </div>
    );
};

export default KakaoMapCamp;