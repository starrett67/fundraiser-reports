import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const { shell } = require('electron').remote

const useStyles = makeStyles((themes) => ({
    root: {
      minWidth: 300,
      marginLeft: "40%",
      marginRight: "40%"
    },
}));

const ProcessFiles = ({ outputPath, ordersErrors, profitErrors, onProcess }) => {
    const classes = useStyles();
    const [ processed, setProcessed ] = useState(false)

    const hasErrors = (obj) => {
        return obj && obj.length > 0
    }

    const canProcess = () => {
        return (!!outputPath && outputPath !== '/') && 
            !hasErrors(ordersErrors) && !hasErrors(profitErrors) && !processed
    }

    const process = () => {
        onProcess(() => setProcessed(true))
    }

    const openFolder = () => {
        shell.openItem(outputPath[0])
    }

    return (
        <div className={classes.root}>
            {canProcess() && (
                <Button onClick={process} primary variant="contained" color="primary">
                    Process Reports
                </Button>
            )}
            {processed && (
                <Button onClick={openFolder} primary variant="contained" color="primary">
                Open Reports Folder
            </Button>
            )}
        </div>
    );
}

export default ProcessFiles
