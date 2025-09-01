"use client"; // for Next.js App Router

import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../public/images/animetion/TrueFood Doing.json"; // adjust the path

const LottieAnimation = () => {
    return (
        <div style={{ width: 400, height: 400 }}>
            <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
            />
        </div>
    );
};

export default LottieAnimation;
