import { useEffect, useState } from "react";

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
                    content: `<div><div>${item.campName}</div><div>&nbsp;</div></div>`,
                    latlng: new window.kakao.maps.LatLng(item.lat, item.lng),
                    camp: item.campName
                }));

                for (let i = 0; i < positions.length; i++) {
                    let marker = new window.kakao.maps.Marker({
                        map: map,
                        position: positions[i].latlng
                    });

                    let infowindow = new window.kakao.maps.InfoWindow({
                        content: positions[i].content
                    });

                    let infowindowClick = new window.kakao.maps.InfoWindow({
                        content: `<div><div>${positions[i].camp}</div><a href="/campsite/${area}/${positions[i].camp}">자세히 알아보기</a><div>&nbsp;</div></div>`,
                        removable: true
                    });

                    new window.kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
                    new window.kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));

                    // 마커에 클릭이벤트를 등록합니다
                    new window.kakao.maps.event.addListener(marker, 'click', makeClickListener(map, marker, infowindowClick));
                }

                function makeOverListener(map, marker, infowindow) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }

                function makeOutListener(infowindow) {
                    return function () {
                        infowindow.close();
                    };
                }

                function makeClickListener(map, marker, infowindowClick) {
                    return function () {
                        // 클릭 시 인포윈도우 열 때 내용을 동적으로 설정
                        infowindowClick.open(map, marker);
                    };
                }
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
                <div className="mt-5 text-5xl font-bold text-slate-500">
                    {campinfo?.campName}
                </div>
                <div className="text-xl font-bold text-slate-500">
                    {`~ ${campinfo?.campType} ~`}<br />
                    {`주소 : ${campinfo?.address}`}
                </div>
                <div className="flex flex-col justify-center items-center">
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
                                <th className="border px-4 py-2">개수대</th>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">{campinfo?.numSink}개</td>
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