'use client'

import styles from './styles.module.css';
import {Button} from "@/app/components/Button";
import {DeleteIcon, EyesIcon} from "@/static/icons";
import {useContext, useState} from "react";
import {Band} from "@/app/types/bands";
import {deleteBandsByGenre, getAllGenres, getBandWithMinGenre} from "@/app/queries/bands";
import toast from 'react-hot-toast';
import {BandsContext} from "@/app/context/bands";
import {GenresContext} from "@/app/context/genres";

export const SpecialActions = () => {
    const { canFetch, setCanFetch } = useContext(BandsContext);
    const { genres } = useContext(GenresContext);

    const [genresFetched, setGenresFetched] = useState<string[]>();
    const [minBand, setMinBand] = useState<Band>();
    const [genreToDelete, setGenreToDelete] = useState<string>(genres[0] ?? 'ROCK');

    function onGetAllGenresSubmit() {
        getAllGenres()
            .then((data) => {
                setGenresFetched(data);
            })
            .catch((err) => {
                toast.error(`${err}`);
            })
    }

    function onGetBandWithMinimalGenre() {
        getBandWithMinGenre()
            .then((data) => {
                setMinBand(data);
            })
            .catch((err) => {
                toast.error(`${err}`);
            })
    }

    function onDeleteBandsByGenre() {
        deleteBandsByGenre(genreToDelete)
            .then(() => {
                setCanFetch(canFetch + 1);
                toast.success("Successfully deleted");
            })
            .catch((err) => {
                toast.error(`${err}`);
            })
    }

return (
        <div className={styles.container}>
            <h2 className={styles.title}>Special actions</h2>
            <div className={styles.content}>
                <div className={styles.genres}>
                    <label>
                        All available genres
                        <pre className={styles.json}><code>{genresFetched ? JSON.stringify(genresFetched, null, 2) : 'Click below to get available genres'}</code></pre>
                    </label>
                    <Button style='accent-green' size='s' onClick={onGetAllGenresSubmit}>
                        <EyesIcon className={`${styles.icon} ${styles.green}`}/>
                        Get genres
                    </Button>
                </div>
                <div className={styles.band}>
                    <label>
                        Get band with minimal genre
                        <pre className={styles.json}><code>{minBand ? JSON.stringify(minBand, null, 2) : 'Click below to get band with minimal genre'}</code></pre>
                    </label>
                    <Button style='accent' size='s' onClick={onGetBandWithMinimalGenre}>
                        <EyesIcon className={`${styles.icon} ${styles.blue}`}/>
                        Get band
                    </Button>
                </div>
                <div className={styles.genres}>
                    <label className={styles.select}>
                        Delete all bands with selected genre
                        <select className='select' onChange={(e) => setGenreToDelete(e.target.value)} value={genreToDelete}>
                            {genres.map((genre) => {
                                return (
                                    <option value={genre} key={genre}>{genre}</option>
                                )
                            })}
                        </select>
                    </label>
                    <Button style='danger' size='s' onClick={onDeleteBandsByGenre}>
                        <DeleteIcon className={`${styles.icon} ${styles.danger}`}/>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}