import React from "react";

interface SpinnerProps {}

const Spinner: React.FC<SpinnerProps> = () => {
    return <div className="spinner">Loading...</div>;
};

export default Spinner;
