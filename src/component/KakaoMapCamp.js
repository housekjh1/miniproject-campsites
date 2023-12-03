import { useEffect, useState } from "react";
import campImg from '../static/imgs/camping-48_48.png';

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
            <div className="flex flex-col gap-5">
                <div className="px-2 mt-5 text-5xl font-bold text-slate-500">
                    {campinfo?.campName}
                </div>
                <div className="text-xl font-bold text-slate-500">
                    {`~ ${campinfo?.campType} ~`}<br />
                    {`주소 : ${campinfo?.address}`}
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <div>
                        <table className="mt-2 table-auto mx-5 text-slate-500">
                            <tbody>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2">일반야영장</th>
                                    <th className="border px-4 py-2">자동차야영장</th>
                                    <th className="border px-4 py-2">글램핑</th>
                                    <th className="border px-4 py-2">카라반</th>
                                    <th className="border px-4 py-2">화장실</th>
                                    <th className="border px-4 py-2">샤워실</th>

                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">{campinfo?.numNormCamp}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numCarCamp}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numGlamping}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numCaravan}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numRestroom}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numShowerRoom}개</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2">개수대</th>
                                    <th className="border px-4 py-2">소화기</th>
                                    <th className="border px-4 py-2">방화수</th>
                                    <th className="border px-4 py-2">방화사</th>
                                    <th className="border px-4 py-2">화재감지기</th>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">{campinfo?.numSink}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numFireExtinguisher}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numFireExtinguisherWater}개</td>
                                    <td className="border px-4 py-2">{campinfo?.numFireman}명</td>
                                    <td className="border px-4 py-2">{campinfo?.numFireDetector}개</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table className="table-auto mx-5 text-slate-500">
                            <tbody>
                                <tr className="bg-gray-50">
                                    <th className="border px-4 py-2">기타부대시설 1</th>
                                    <th className="border px-4 py-2">기타부대시설 2</th>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">{campinfo?.otherFacilities1 ? campinfo?.otherFacilities1 : '-'}</td>
                                    <td className="border px-4 py-2">{campinfo?.otherFacilities2 ? campinfo?.otherFacilities2 : '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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