import React, { useEffect, useState } from "react";
import PhraseCardsControls from "components/PhraseCardsControls";
import { useGetPhrasesQuery } from "generated/graphql";
import Spinner from "./Spinner";

interface PhraseCard {
    text: string;
    translation: string;
}

interface PhraseCardsProps {
    card?: PhraseCard[];
}

const mockData = [
    {
        text: "Death is just the beginning",
        translation: "Esta frase no es tan buena",
    },
    {
        text: "no es tan buena cómo la última",
        translation: " is not as good as the last",
    },
    {
        text: "Esta frase no es tan buena",
        translation: "Esta frase no es tan buena",
    },
    {
        text: "no es tan buena cómo la última",
        translation: " is not as good as the last one",
    },
];

const PhraseCards: React.FC<PhraseCardsProps> = () => {
    const [hideTranslation, setHidetranslation] = useState(true);
    const [animationChangeCard, setAnimationChangeCard] = useState(false);
    const [cardIndex, setCardIndex] = useState(0);
    const [noMorePhrases, setNoMorePhrases] = useState(false);

    const { data, error, loading } = useGetPhrasesQuery({});

    // useEffect(() => {
    //     if (cardIndex >= data.getPhrases.length) {
    //         setNoMorePhrases(true);
    //     }
    // }, [cardIndex]);

    if (!data || error) return null;
    if (loading) return <Spinner />;

    if (cardIndex >= data.getPhrases.length && !noMorePhrases)
        setNoMorePhrases(true);

    return (
        <div className="card-wrapper">
            {cardIndex + 2 <= data.getPhrases.length ? (
                <div className="third-card"></div>
            ) : null}
            {cardIndex + 1 <= data.getPhrases.length ? (
                <div className="second-card"></div>
            ) : null}
            <div
                className={`card ${
                    animationChangeCard ? "animation-change-card" : ""
                }`}
                onAnimationEnd={() => {
                    setCardIndex(cardIndex + 1);
                    setAnimationChangeCard(false);
                }}
            >
                <div className="card-phrase">
                    <h2>
                        {data.getPhrases[cardIndex]?.phrase ||
                            "No more phrases"}
                    </h2>
                    {!hideTranslation ? <p>Not implemented</p> : null}
                </div>

                <hr className="separator" />
                <PhraseCardsControls
                    setHidetranslation={setHidetranslation}
                    setAnimationChangeCard={setAnimationChangeCard}
                    noMorePhrases={noMorePhrases}
                />
            </div>
        </div>
    );
};

export default PhraseCards;
