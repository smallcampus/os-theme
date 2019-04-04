import React from 'react'
import {useDropzone} from 'react-dropzone'
import {Button} from "@material-ui/core";

interface Props {
    onDrop: (acceptedFiles: Array<File>) => void,
}

export const DragDropZone: React.FunctionComponent<Props> = (props) => {
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: props.onDrop});

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()}
                   accept="image/*"
            />
            {
                isDragActive ?
                    <Button
                        fullWidth={true}

                        size={"large"}
                        color={"primary"}

                        variant={"outlined"}
                    >放在這裡 ...</Button> :
                    <Button
                        fullWidth={true}

                        size={"large"}
                        color={"primary"}
                        variant={"outlined"}
                    > 上傳圖片</Button>
            }
        </div>
    )
};