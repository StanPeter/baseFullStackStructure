import React, { useState } from "react";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";

interface PhraseCardsControlsProps {
    setHidetranslation: Function;
    setAnimationChangeCard: Function;
    noMorePhrases: Boolean;
}

type IconName = "thumbsDown" | "thumbsUp";
type IconAction = "show" | "hide";

const PhraseCardsControls: React.FC<PhraseCardsControlsProps> = ({
    setHidetranslation,
    setAnimationChangeCard,
    noMorePhrases,
}) => {
    const [hideContinue, setHideContinue] = useState(true);
    const [hideThumpsDown, setHideThumpsDown] = useState(true);
    const [hideThumpsUp, setHideThumpsUp] = useState(true);
    const [animationContinue, setAnimationContinue] = useState(false);

    const showHideIcon = (
        _e: React.MouseEvent<HTMLElement>,
        iconName: IconName,
        action: IconAction
    ) => {
        switch (action) {
            case "hide":
                if (iconName === "thumbsUp") setHideThumpsUp(true);
                else setHideThumpsDown(true);
                break;
            case "show":
                if (iconName === "thumbsUp") setHideThumpsUp(false);
                else setHideThumpsDown(false);
                break;
        }
    };

    const onClickHandler = (
        _e: React.MouseEvent<HTMLElement>,
        iconName: IconName
    ) => {
        if (iconName === "thumbsUp") setAnimationChangeCard(true);
        else if (iconName === "thumbsDown") {
            setHideContinue(false);
            setHidetranslation(false);
        }
    };

    const onContinueClickHandler = (_e: React.MouseEvent<HTMLElement>) => {
        setHideContinue(true);
        setAnimationContinue(false);
        setHideThumpsDown(true);
        setHidetranslation(true);
        setAnimationChangeCard(true);
    };

    const cardControlContinueClasses = (): string => {
        const out = ["card-control-continue"];

        if (animationContinue || noMorePhrases) out.push("max-width");
        if (noMorePhrases) out.push("disabled");

        return out.join(" ");
    };

    return (
        <div className="card-controls">
            {hideContinue && !noMorePhrases ? (
                <i
                    className="card-control-thumbsDown"
                    onMouseLeave={(e) => showHideIcon(e, "thumbsDown", "hide")}
                    onMouseEnter={(e) => showHideIcon(e, "thumbsDown", "show")}
                    onClick={(e) => onClickHandler(e, "thumbsDown")}
                >
                    {hideThumpsDown ? <FiThumbsDown /> : <p>Failure?</p>}
                </i>
            ) : null}
            {hideContinue && !noMorePhrases ? (
                <i
                    className="card-control-thumbsUp"
                    onMouseLeave={(e) => showHideIcon(e, "thumbsUp", "hide")}
                    onMouseEnter={(e) => showHideIcon(e, "thumbsUp", "show")}
                    onClick={(e) => onClickHandler(e, "thumbsUp")}
                >
                    {hideThumpsUp ? <FiThumbsUp /> : <p>Got it!</p>}
                </i>
            ) : null}
            {!hideContinue || noMorePhrases ? (
                <i
                    className={cardControlContinueClasses()}
                    onMouseOver={() => setAnimationContinue(true)}
                    onClick={!noMorePhrases ? onContinueClickHandler : undefined}
                >
                    <p>
                        {!noMorePhrases ? "Continue" : "All phrases learned!"}
                    </p>
                </i>
            ) : null}
        </div>
    );
};

export default PhraseCardsControls;
