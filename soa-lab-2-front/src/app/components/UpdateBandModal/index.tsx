'use client'

import {Button} from "@/app/components/Button";
import {Modal} from "@/app/components/Modal";
import {ChangeEvent, useContext, useState} from "react";
import {Band} from "@/app/types/bands";
import styles from './styles.module.css';
import {updateBandById} from "@/app/queries/bands";
import toast from 'react-hot-toast';
import {BandsContext} from "@/app/context/bands";
import {getFrontMan} from "@/app/utils/band";
import {GenresContext} from "@/app/context/genres";

type UpdateBandModalProps = {
    band: Band;
    isVisible: boolean;
    onClose: () => void;
}

export const UpdateBandModal = ({ band, isVisible, onClose }: UpdateBandModalProps) => {
    const { canFetch, setCanFetch } = useContext(BandsContext);
    const { genres } = useContext(GenresContext);

    const [name, setName] = useState<string | undefined>(band?.name);
    const [description, setDescription] = useState<string | undefined>(band?.description);
    const [x, setX] = useState<number | undefined>(band?.coordinates.x);
    const [y, setY] = useState<number | undefined>(band?.coordinates.y);
    const [numberOfParticipants, setNumberOfParticipants] = useState<number | undefined>(band?.numberOfParticipants);
    const [genre, setGenre] = useState<string | undefined>(band?.genre);

    const [frontManName, setFrontManName] = useState<string | undefined>(band?.frontMan?.name);
    const [frontManBirthday, setFrontManBirthday] = useState<string | undefined>(band?.frontMan?.birthday);
    const [frontManPassportID, setFrontManPassportID] = useState<string | undefined>(band?.frontMan?.passportID);
    const [frontManX, setFrontManX] = useState<number | undefined>(band?.frontMan?.location.x);
    const [frontManY, setFrontManY] = useState<number | undefined>(band?.frontMan?.location.y);
    const [frontManZ, setFrontManZ] = useState<number | undefined>(band?.frontMan?.location.z);
    const [frontManLocationName, setFrontManLocationName] = useState<string | undefined>(band?.frontMan?.location.name);

    function onSubmit() {
        let frontMan;

        if (!name || x === undefined || y === undefined || numberOfParticipants === undefined || !description || !genre) {
            toast.error("Please enter all the required values: Name, X, Y, creation Date, number of members, description, genre");
            return;
        }

        try {
            frontMan = getFrontMan({
                name: frontManName?.trim(),
                birthday: frontManBirthday,
                passportID: frontManPassportID?.trim(),
                location: {
                    name: frontManLocationName?.trim(),
                    x: frontManX,
                    y: frontManY,
                    z: frontManZ
                },
            });
        } catch(err) {
            toast.error(`${err}`);
            return;
        }

        updateBandById(band.id,{
            name: name.trim(),
            coordinates: {
                x,
                y,
            },
            numberOfParticipants,
            description: description.trim(),
            genre,
            frontMan,
        }).then(() =>{
            toast.success("Successfully updated band");
            setCanFetch(canFetch + 1);
            onClose();
        }).catch((err) => {
            toast.error(`${err}`)
        })
    }

    const onBirthdayChange = (e: ChangeEvent<HTMLInputElement>) => {
        const now = new Date();
        const birthday = new Date(e.target.value);
        if (birthday > now){
            toast.error("Birthday should be less than today");
            return;
        }
        setFrontManBirthday(e.target.value);
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <form className='modal-container' onSubmit={(e) => e.preventDefault()}>
                <h2>{band? `Update info about ${band.name}` : 'Create new band'}</h2>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <label className='input-container'>
                            Name*
                            <input id='name' value={name ?? ''} minLength={1} className='input'
                                   onChange={(e) => setName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Description*
                            <input id='description' value={description ?? ''} className='input'
                                   onChange={(e) => setDescription(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Number of members*
                            <input type='number' id='number-of-members' value={numberOfParticipants ?? ''}
                                   className='input'
                                   onChange={(e) => setNumberOfParticipants(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Genre*
                            <select className='select' onChange={(e) => setGenre(e.target.value)}
                                    value={genre}>
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
                            <input type='number' min="1" step={1} id='coordinate-x' value={x ?? ''} className='input'
                                   onChange={(e) => setX(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Y*
                            <input type='number' id='coordinate-y' value={y ?? ''} className='input'
                                   onChange={(e) => setY(Number(e.target.value))}/>
                        </label>
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
                                   onChange={(e) => onBirthdayChange(e)}/>
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

                <div className={`buttons `}>
                    <Button style='cancel' size='m' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button style='primary' size='m' submit onClick={onSubmit}>
                        Update
                    </Button>
                </div>
            </form>
        </Modal>
    )
}