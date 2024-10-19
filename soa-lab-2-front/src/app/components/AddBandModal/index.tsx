'use client'

import {Button} from "@/app/components/Button";
import {Modal} from "@/app/components/Modal";
import {useContext, useState} from "react";
import styles from './styles.module.css';
import {Single} from "@/app/types/single";
import {createBand} from "@/app/queries/bands";
import toast from 'react-hot-toast';
import {BandsContext} from "@/app/context/bands";
import {convertStringToSingles} from "@/app/utils/singles";
import {getFrontMan} from "@/app/utils/band";
import {GenresContext} from "@/app/context/genres";

type AddBandModalProps = {
    isVisible: boolean;
    onClose: () => void;
}

export const AddBandModal = ({ isVisible, onClose }: AddBandModalProps) => {
    const { canFetch, setCanFetch } = useContext(BandsContext);
    const { genres } = useContext(GenresContext);

    const [name, setName] = useState<string | undefined>();
    const [description, setDescription] = useState<string | undefined>();
    const [x, setX] = useState<number | undefined>();
    const [y, setY] = useState<number | undefined>();
    const [numberOfParticipants, setNumberOfParticipants] = useState<number | undefined>();
    const [genre, setGenre] = useState<string>(genres[0] ?? '');
    const [textSingles, setTextSingles] = useState<string | undefined>();

    const [frontManName, setFrontManName] = useState<string | undefined>();
    const [frontManBirthday, setFrontManBirthday] = useState<string | undefined>();
    const [frontManPassportID, setFrontManPassportID] = useState<string | undefined>();
    const [frontManX, setFrontManX] = useState<number | undefined>();
    const [frontManY, setFrontManY] = useState<number | undefined>();
    const [frontManZ, setFrontManZ] = useState<number | undefined>();
    const [frontManLocationName, setFrontManLocationName] = useState<string | undefined>();

    function onSubmit() {
        let frontMan;
        let singles;

        if (!name || x == undefined || y === undefined || numberOfParticipants === undefined || !description || !genre) {
            toast.error("Please enter all the required values: Name, X, Y, creation Date, number of members, description, genre");
            return;
        }

        try {
            frontMan = getFrontMan({
                name: frontManName?.trim(),
                birthday: frontManBirthday,
                passportID: frontManPassportID?.trim(),
                location: {
                    name: frontManLocationName,
                    x: frontManX,
                    y: frontManY,
                    z: frontManZ
                },
            });
        } catch(err) {
            toast.error(`${err}`);
            return;
        }

        try {
            singles = getSingles();
        } catch (err) {
            toast.error(`${err}`);
            return;
        }

        createBand({
            name: name.trim(),
            coordinates: {
                x,
                y,
            },
            numberOfParticipants,
            description: description.trim(),
            genre,
            frontMan,
            singles
        }).then(() =>{
            toast.success("Successfully created band");
            setCanFetch(canFetch + 1);
            onClose();
        }).catch((err) => {
            toast.error(`${err}`);
        })
    }

    const getSingles = (): Omit<Single, 'id'>[] | undefined => {
        if (textSingles !== undefined) {
            let result;

            try {
                result = convertStringToSingles(textSingles);
            } catch (err) {
                throw err;
            }

            return result;
        }
        return;
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <form className='modal-container' onSubmit={(e) => e.preventDefault()}>
                <h2>Create new band</h2>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <label className='input-container'>
                            Name*
                            <input id='name' value={name ?? ''} minLength={1} className='input' required
                                   onChange={(e) => setName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Description*
                            <input id='description' value={description ?? ''} className='input' required
                                   onChange={(e) => setDescription(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Number of members*
                            <input type='number' id='number-of-members' value={numberOfParticipants ?? ''} className='input' required
                                   onChange={(e) => setNumberOfParticipants(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Genre*
                            <select className='select' onChange={(e) => setGenre(e.target.value)} value={genre} required>
                                {genres.map((genre) => {
                                    return (
                                        <option value={genre} key={genre}>{genre}</option>
                                    )
                                })}
                            </select>
                        </label>
                        <h3>Coordinates*</h3>
                        <label className='input-container'>
                            Coordinate X*
                            <input type='number' min="1" step={1} id='coordinate-x' value={x ?? ''} className='input' required
                                   onChange={(e) => setX(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Y*
                            <input type='number' id='coordinate-y' value={y ?? ''} className='input' required
                                   onChange={(e) => setY(Number(e.target.value))}/>
                        </label>

                        <h3>Singles</h3>
                        <span className={styles.caption}>To add singles, please write their titles separated with comma, in double quotes.</span>
                        <textarea id='singles' value={textSingles ?? ''} className='textarea'
                                  onChange={(e) => setTextSingles(e.target.value)}/>
                    </div>
                    <div className={styles.right}>
                        <h3>Front Man</h3>
                        <span className={styles.captionFrontMan}>To add Front man, please enter all the required values of leave it untouched.</span>
                        <label className='input-container'>
                            Name
                            <input id='name' minLength={1} value={frontManName ?? ''} className='input'
                                   onChange={(e) => setFrontManName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Birthday
                            <input type='date' id='birthday' value={frontManBirthday ?? ''} className='input'
                                   onChange={(e) => setFrontManBirthday(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Passport ID*
                            <input id='passport-id' value={frontManPassportID ?? ''} className='input'
                                   onChange={(e) => setFrontManPassportID(e.target.value)}/>
                        </label>
                        <h4>{"Front Man\'s location*"}</h4>
                        <label className='input-container'>
                            Location title
                            <input id='location-name' value={frontManLocationName ?? ''} className='input'
                                   onChange={(e) => setFrontManLocationName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Coordinate X*
                            <input type='number' id='x' value={frontManX ?? ''} className='input'
                                   onChange={(e) => setFrontManX(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Y*
                            <input type='number' id='y' value={frontManY ?? ''} className='input'
                                   onChange={(e) => setFrontManY(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Z*
                            <input type='number' step={1} pattern='[0-9]*[^.,]' id='z' value={frontManZ ?? ''}
                                   className='input'
                                   onChange={(e) => setFrontManZ(Number(e.target.value))}/>
                        </label>
                    </div>
                </div>

                <div className={`buttons`}>
                    <Button style='cancel' size='m' onClick={onClose}>
                    Cancel
                    </Button>
                    <Button style='primary' size='m' submit onClick={onSubmit}>
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    )
}