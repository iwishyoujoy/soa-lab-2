import {Button} from "@/app/components/Button";
import {Modal} from "@/app/components/Modal";
import {useContext, useState} from "react";
import {Genre, GENRES} from "@/app/types/genre";
import styles from './styles.module.css';
import {Single} from "@/app/types/single";
import {BAND_MOCK} from "@/app/mocks/bands";
import {createBand} from "@/app/queries/bands";
import toast from 'react-hot-toast';
import {PersonToBandDTO} from "@/app/types/person";
import {BandsContext} from "@/app/context/bands";

type AddBandModalProps = {
    isVisible: boolean;
    onClose: () => void;
}

export const AddBandModal = ({ isVisible, onClose }: AddBandModalProps) => {
    const [name, setName] = useState<string>(BAND_MOCK.name);
    const [description, setDescription] = useState<string>(BAND_MOCK.description);
    const [x, setX] = useState<number>(BAND_MOCK.coordinates.x);
    const [y, setY] = useState<number>(BAND_MOCK.coordinates.y);
    const [creationDate, setCreationDate] = useState<Date>(new Date(BAND_MOCK.creationDate));
    const [numberOfParticipants, setNumberOfParticipants] = useState<number>(BAND_MOCK.numberOfParticipants);
    const [genre, setGenre] = useState<Genre>(BAND_MOCK.genre);
    const [textSingles, setTextSingles] = useState<string | undefined>();

    const [frontManName, setFrontManName] = useState<string | undefined>(BAND_MOCK.frontMan?.name);
    const [frontManBirthday, setFrontManBirthday] = useState<string | undefined>(BAND_MOCK.frontMan?.birthday);
    const [frontManPassportID, setFrontManPassportID] = useState<string | undefined>(BAND_MOCK.frontMan?.passportID);
    const [frontManX, setFrontManX] = useState<number | undefined>(BAND_MOCK.frontMan?.location.x);
    const [frontManY, setFrontManY] = useState<number | undefined>(BAND_MOCK.frontMan?.location.y);
    const [frontManZ, setFrontManZ] = useState<number | undefined>(BAND_MOCK.frontMan?.location.z);
    const [frontManLocationName, setFrontManLocationName] = useState<string | undefined>(BAND_MOCK.frontMan?.location.name);

    const { canFetch, setCanFetch } = useContext(BandsContext);

    const onApplyPresetClick = () => {
        setName(BAND_MOCK.name);
        setDescription(BAND_MOCK.description);
        setX(BAND_MOCK.coordinates.x);
        setY(BAND_MOCK.coordinates.y);
        setCreationDate(new Date(BAND_MOCK.creationDate));
        setNumberOfParticipants(BAND_MOCK.numberOfParticipants);
        setGenre(BAND_MOCK.genre);
        setTextSingles(BAND_MOCK.singles ? convertSinglesToString(BAND_MOCK.singles) : '');
        setFrontManName(BAND_MOCK.frontMan?.name);
        setFrontManBirthday(BAND_MOCK.frontMan?.birthday);
        setFrontManPassportID(BAND_MOCK.frontMan?.passportID);
        setFrontManX(BAND_MOCK.frontMan?.location.x);
        setFrontManY(BAND_MOCK.frontMan?.location.y);
        setFrontManZ(BAND_MOCK.frontMan?.location.z);
        setFrontManLocationName(BAND_MOCK.frontMan?.location.name);
    }

    function convertStringToSingles(text: string) {
        let singles = text.split(',');
        singles = singles.map((single) => single.trim());
        const result: Single[] = singles.map((single) => ({name: single}));
        return result;
    }

    function convertSinglesToString(singles: Single[]) {
        const names = singles.map((single) => single.name);
        return names.join(', ');
    }

    function onSubmit() {
        if (!name || !x || !y || !creationDate || !numberOfParticipants || !description || !genre) {
            toast.error("Please enter all the required values");
            return;
        }

        createBand({
            name,
            coordinates: {
                x,
                y,
            },
            creationDate: creationDate?.toISOString(),
            numberOfParticipants,
            description,
            genre,
            frontMan: getFrontMan(),
            singles: getSingles()
        }).then((data) =>{
            setCanFetch(canFetch + 1);
        })
    }

    const getFrontMan = (): PersonToBandDTO |  undefined => {
        if (frontManPassportID !== undefined && frontManX !== undefined && frontManY !== undefined && frontManZ !== undefined) {
            return {
                name: frontManName,
                birthday: frontManBirthday,
                passportID: frontManPassportID,
                location: {
                    name: frontManLocationName,
                    x: frontManX,
                    y: frontManY,
                    z: frontManZ
                }
            }
        }
        else {
            return;
        }
    }

    const getSingles = (): Omit<Single, 'id'>[] | undefined => {
        if (textSingles !== undefined) {
            return (convertStringToSingles(textSingles));
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
                            <input id='name' value={name ?? " "} minLength={1} className='input' required
                                   onChange={(e) => setName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Description*
                            <input id='description' value={description ?? " "} className='input' required
                                   onChange={(e) => setDescription(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Creation date*
                            <input type='datetime-local' id='name' value={creationDate ? creationDate.toString() : ' '} className='input' required
                                   onChange={(e) => setCreationDate(new Date(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Number of members*
                            <input type='number' id='number-of-members' value={numberOfParticipants ?? " "} className='input' required
                                   onChange={(e) => setNumberOfParticipants(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Genre*
                            <select className='select' onChange={(e) => setGenre(e.target.value as Genre)} value={genre} required>
                                {GENRES.map((genre) => {
                                    return (
                                        <option value={genre} key={genre}>{genre}</option>
                                    )
                                })}
                            </select>
                        </label>
                        <h3>Coordinates*</h3>
                        <label className='input-container'>
                            Coordinate X*
                            <input type='number' min="1" step={1} id='coordinate-x' value={x ?? " "} className='input' required
                                   onChange={(e) => setX(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Y*
                            <input type='number' id='coordinate-y' value={y ?? " "} className='input' required
                                   onChange={(e) => setY(Number(e.target.value))}/>
                        </label>

                        <h3>Singles</h3>
                        <span className={styles.caption}>To add singles, please write their titles separated with comma, no brackets.</span>
                        <textarea id='singles' value={textSingles ?? " "} className='textarea'
                                  onChange={(e) => setTextSingles(e.target.value)}/>
                    </div>
                    <div className={styles.right}>
                        <h3>Front Man</h3>
                        <label className='input-container'>
                            Name
                            <input id='name' minLength={1} value={frontManName ?? " "} className='input'
                                   onChange={(e) => setFrontManName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Birthday
                            <input type='date' id='birthday' value={frontManBirthday ?? " "} className='input'
                                   onChange={(e) => setFrontManBirthday(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Passport ID*
                            <input id='passport-id' value={frontManPassportID ?? " "} className='input'
                                   onChange={(e) => setFrontManPassportID(e.target.value)}/>
                        </label>
                        <h4>Front Man's location</h4>
                        <label className='input-container'>
                            Location title
                            <input id='location-name' value={frontManLocationName ?? " "} className='input'
                                   onChange={(e) => setFrontManLocationName(e.target.value)}/>
                        </label>
                        <label className='input-container'>
                            Coordinate X*
                            <input type='number' id='x' value={frontManX ?? " "} className='input'
                                   onChange={(e) => setFrontManX(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Y*
                            <input type='number' id='y' value={frontManY ?? " "} className='input'
                                   onChange={(e) => setFrontManY(Number(e.target.value))}/>
                        </label>
                        <label className='input-container'>
                            Coordinate Z*
                            <input type='number' step={1} pattern='[0-9]*[^.,]' id='z' value={frontManZ ?? " "} className='input'
                                   onChange={(e) => setFrontManZ(Number(e.target.value))}/>
                        </label>
                    </div>
                </div>

                <div className={styles.container}>
                    <Button style='accent' size='s' onClick={onApplyPresetClick}>Apply preset</Button>
                    <div className={`buttons ${styles.buttons}`}>
                        <Button style='cancel' size='m' onClick={onClose}>
                            Cancel
                        </Button>
                        <Button style='primary' size='m' submit onClick={onSubmit}>
                            Create
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    )
}