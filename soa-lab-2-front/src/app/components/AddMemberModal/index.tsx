'use client'

import {Button} from "@/app/components/Button";
import {Modal} from "@/app/components/Modal";
import {useContext, useState} from "react";
import {addParticipant} from "@/app/queries/grammy";
import toast from "react-hot-toast";
import {BandsContext} from "@/app/context/bands";

type AppMemberModalProps = {
    bandId: number;
    bandName: string;
    isVisible: boolean;
    onClose: () => void
}

export const AddMemberModal = ({ bandId, bandName, isVisible, onClose }: AppMemberModalProps) => {
    const [name, setName] = useState<string | undefined>();
    const [birthday, setBirthday] = useState<string | undefined>();
    const [passport, setPassport] = useState<string>();
    const [x, setX] = useState<number>();
    const [y, setY] = useState<number>();
    const [z, setZ] = useState<number>();
    const [locationName, setLocationName] = useState<string | undefined>();

    const { canFetch, setCanFetch } = useContext(BandsContext);

    function onSubmit() {
        if (passport === undefined || x === undefined || y === undefined || z === undefined){
            toast.error("Please enter all the required values: passport ID, coordinates x, y, z");
            return;
        }

        addParticipant(bandId, {
            name: name?.trim().length ? name?.trim() : undefined,
            birthday,
            passportID: passport.trim(),
            location: {
                x,
                y,
                z,
                name: locationName?.trim()
            }
        }).then(() => {
            toast.success("Successfully created new member!");
            setCanFetch(canFetch + 1);
            onClose();
        }).catch((err) => {
            toast.error(`${err}`);
        })
    }

    return (
        <Modal isVisible={isVisible} onClose={onClose}>
            <form className='modal-container' onSubmit={(e) => e.preventDefault()}>
                <h2>Add new member to {bandName}</h2>
                <label className='input-container'>
                    Name
                    <input id='name' minLength={1} value={name ?? ''} className='input' placeholder='e.g. Daniel Moon'
                           onChange={(e) => setName(e.target.value)}/>
                </label>
                <label className='input-container'>
                    Birthday
                    <input type='date' id='birthday' value={birthday ?? ''} className='input'
                           onChange={(e) => setBirthday(e.target.value)}/>
                </label>
                <label className='input-container'>
                    Passport ID*
                    <input id='passport-id' value={passport ?? ''} className='input'
                           placeholder='e.g. RU623532526' required
                           onChange={(e) => setPassport(e.target.value)}/>
                </label>
                <h3>Location*</h3>
                <label className='input-container'>
                    Location title
                    <input id='location-name' minLength={1} value={locationName ?? ''} className='input'
                           placeholder='e.g. Toronto'
                           onChange={(e) => setLocationName(e.target.value)}/>
                </label>
                <label className='input-container'>
                    Coordinate X*
                    <input type='number' id='x' value={x ?? ''} className='input'
                           placeholder='e.g. 34' required
                           onChange={(e) => setX(Number(e.target.value))}/>
                </label>
                <label className='input-container'>
                    Coordinate Y*
                    <input type='number' id='y' value={y ?? ''} className='input'
                           placeholder='e.g. 743' required
                           onChange={(e) => setY(Number(e.target.value))}/>
                </label>
                <label className='input-container'>
                    Coordinate Z*
                    <input type='number' step={1} pattern='[0-9]*[^.,]' id='z' value={z ?? ''} className='input'
                           placeholder='e.g. 0' required
                           onChange={(e) => setZ(Number(e.target.value))}/>
                </label>
                <div className='buttons'>
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