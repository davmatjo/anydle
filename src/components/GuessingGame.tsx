﻿import type {Artist, Song, SongResponse} from "~/types";
import {useEffect, useState} from "react";
import {Spinner} from "@nextui-org/spinner";
import {SongController} from "~/components/SongController";
import GuessInput from "~/components/GuessInput";

interface GuessignGameProps {
    artist: Artist
}

export function GuessingGame({ artist }: GuessignGameProps) {
    const [songList, setSongList] = useState<Song[]>([]);
    const [isFetchingSongs, setIsFetchingSongs] = useState<boolean>(false);
    const [guessNumber, setGuessNumber] = useState(0);
    const [guessList, setGuessList] = useState<Array<Song | null>>([null, null, null, null, null]);
    
    useEffect(() => {
        async function fetchSongs() {
            setIsFetchingSongs(true);
            const res = await fetch(`/api/getSongs?artistID=${artist.id}`);
            const songs = (await res.json()) as SongResponse;
            setSongList(songs.data);
            setIsFetchingSongs(false);
        }
        
        void fetchSongs();
    }, [artist.id])
    
    return <div className={"w-full flex flex-grow flex-col justify-center items-center my-4 text-large text-default-500"}>
        {
            isFetchingSongs ?
                <div className={"flex"}>
                    <Spinner size="sm"/>
                    <p className={"ml-2 "}>Fetching songs...</p>
                </div>
                :
                <p>Found {songList.length} songs!</p>
        }
        {
            songList.length > 0 ?
                <div className={"flex flex-col w-full h-full"}>
                    <div className={"text-default-200"}>
                    {
                        guessList.map((guess, index) => {
                            return <div key={index} className={"flex pl-4 items-center w-full rounded-xl bg-content2 h-12 my-4"}>
                                {
                                    guess === null ?
                                        <p>{index+1}.</p>
                                            :
                                        <p></p>
                                }
                            </div>
                        })
                    }
                    </div>
                    <div className={"mt-auto"}>
                        <SongController songSrc={songList[0]!.preview} guessNumber={guessNumber}/>
                        <GuessInput guessNumber={guessNumber} setGuessNumber={setGuessNumber}/>
                    </div>
                </div>
            : null
        }
    </div>
}