import { Box, Modal, Typography } from '@mui/material';
import { useEffect, useState } from 'react'
import { TEAnimation } from 'tw-elements-react';

const KakaoMapError = () => {
    const [open, setOpen] = useState(true);
    useEffect(() => {
        const mapScript = document.createElement('script');
        mapScript.async = true;
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false`;
        document.head.appendChild(mapScript);

        const onLoadKakaoMap = () => {
            window.kakao.maps.load(() => {
                const mapContainer = document.getElementById('map');
                const mapOption = {
                    center: new window.kakao.maps.LatLng(36.300000, 127.800000), // 지도의 중심좌표
                    level: 12, // 지도의 확대 레벨
                };
                let map = new window.kakao.maps.Map(mapContainer, mapOption);

                let mapTypeControl = new window.kakao.maps.MapTypeControl();
                map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);
            });
        };
        mapScript.addEventListener('load', onLoadKakaoMap);

        const timer = setTimeout(() => {
            setOpen(false);
        }, 1000);

        return () => clearTimeout(timer);

    }, []);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <div id="map" className="mt-5 h-[32.25rem] sm:h-[39.125rem] md:h-[39.125rem] rounded shadow-[0px_0px_10px_0px_rgba(0,0,0,0.3)]"></div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className="font-KOTRAHOPE"
            >
                <Box sx={style} className="rounded-lg w-auto">
                    <TEAnimation
                        animation="[shake_0.5s]"
                        start="onLoad"
                    >
                        <div className="flex flex-col justify-center items-center gap-4">
                            <p className="text-2xl text-center font-bold text-slate-700">검색결과가 없습니다.</p>
                        </div>
                    </TEAnimation>
                </Box>
            </Modal>

        </div>
    )
}

export default KakaoMapError