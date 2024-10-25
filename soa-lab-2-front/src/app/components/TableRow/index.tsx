'use client'

import styles from './styles.module.css';
import {Band} from "@/app/types/bands";
import {format} from 'date-fns';
import {TableCell} from "@/app/components/TableCell";
import {Button} from "@/app/components/Button";
import {DeleteIcon, EditIcon, PlusIcon, ShowIcon} from "@/static/icons";
import {AddSingleModal} from "@/app/components/AddSingleModal";
import {useState} from "react";
import {ShowSinglesModal} from "@/app/components/ShowSinglesModal";
import {AddMemberModal} from "@/app/components/AddMemberModal";
import {DeleteBandModal} from "@/app/components/DeleteBandModal";
import {UpdateBandModal} from "@/app/components/UpdateBandModal";

type TableRowProps = {
    band: Band;
}

export const TableRow = ({ band }: TableRowProps) => {
    const [isAddSingleModalVisible, setAddSingleModalVisible] = useState<boolean>(false);
    const [isShowSinglesModalVisible, setShowSinglesModalVisible] = useState<boolean>(false);
    const [isAddMemberModalVisible, setAddMemberModalVisible] = useState<boolean>(false);
    const [isDeleteBandModalVisible, setDeleteBandModalVisible] = useState<boolean>(false);
    const [isUpdateBandModalVisible, setUpdateBandModalVisible] = useState<boolean>(false);

    return (
        <>
                <div className='table-grid'>
                    <TableCell>
                        #{band.id}
                    </TableCell>
                    <TableCell className={styles.title} overflow cellLength={band.name.length}>
                        {band.name}
                    </TableCell>
                    <TableCell overflow cellLength={band.description.length}>
                        {band.description}
                    </TableCell>
                    <TableCell>
                        {format(band.creationDate, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                        {band.coordinates.x.toFixed(2)}
                    </TableCell>
                    <TableCell>
                        {band.coordinates.y.toFixed(2)}
                    </TableCell>
                    <TableCell>
                        {band.numberOfParticipants}
                    </TableCell>
                    <TableCell>
                        {band.genre}
                    </TableCell>
                    <TableCell overflow cellLength={(band.frontMan ? band.frontMan.name : '–')?.length}>
                        {band.frontMan ? band.frontMan.name : '–'}
                    </TableCell>
                    <TableCell>
                        {band.singles?.length ?
                            (
                                <Button style='accent' size='s' onClick={() => setShowSinglesModalVisible(true)}>
                                    <ShowIcon className={`${styles.icon} ${styles.blue}`}/>
                                    Show singles
                                </Button>
                            ) : (
                                <Button style='accent-green' size='s' onClick={() => setAddSingleModalVisible(true)}>
                                    <PlusIcon className={`${styles.icon} ${styles.green}`}/>
                                    Add single
                                </Button>
                            )
                        }
                    </TableCell>
                    <TableCell>
                        <Button style='accent-green' size='s' onClick={() => setAddMemberModalVisible(true)}>
                            <PlusIcon className={`${styles.icon} ${styles.green}`}/>
                            Add member
                        </Button>
                        <EditIcon className={`${styles.icon} ${styles.action}`} onClick={() => setUpdateBandModalVisible(true)}/>
                        <DeleteIcon className={`${styles.icon} ${styles.action} ${styles.danger}`} onClick={() => setDeleteBandModalVisible(true)}/>
                    </TableCell>
                </div>
                <div className='divider'></div>
            {isAddSingleModalVisible &&
                <AddSingleModal bandId={band.id} bandName={band.name} isVisible={isAddSingleModalVisible} onClose={() => setAddSingleModalVisible(false)}/>
            }
            {isShowSinglesModalVisible &&
                <ShowSinglesModal band={band} isVisible={isShowSinglesModalVisible} onClose={() => setShowSinglesModalVisible(false)}/>
            }
            {isAddMemberModalVisible &&
                <AddMemberModal bandId={band.id} bandName={band.name} isVisible={isAddMemberModalVisible} onClose={() => setAddMemberModalVisible(false)} />
            }
            {isDeleteBandModalVisible &&
                <DeleteBandModal bandId={band.id} bandName={band.name} isVisible={isDeleteBandModalVisible} onClose={() => setDeleteBandModalVisible(false)}/>
            }
            {isUpdateBandModalVisible &&
                <UpdateBandModal band={band} isVisible={isUpdateBandModalVisible} onClose={() => setUpdateBandModalVisible(false)}/>
            }
        </>
    )
}